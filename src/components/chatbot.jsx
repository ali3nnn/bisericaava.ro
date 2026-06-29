"use client";

import React, { useEffect, useRef, useState } from "react";

// Language for voice input (BCP-47). Change this one line to switch languages,
// e.g. "en-US" for English, "fr-FR" for French. It drives both the browser
// speech recognizer and the server-side transcription fallback.
const VOICE_LANG = "ro-RO";

// How long to wait for the user to start speaking before auto-stopping (ms).
const VOICE_INITIAL_WAIT_MS = 3000;
// Once speaking has started, how long a pause ends the recording (ms).
const VOICE_SILENCE_STOP_MS = 1500;

const WELCOME = {
  role: "assistant",
  content:
    "Bună ziua! Sunt asistentul virtual al Bisericii AVA. Vă pot răspunde la întrebări despre biserică, departamente, programe și date de contact. Cu ce vă pot ajuta?",
};

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [langHint, setLangHint] = useState("");

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const silenceTimerRef = useRef(null);
  const baseTextRef = useRef("");
  const autoSendRef = useRef(true);
  const sendMessageRef = useRef(null);
  // One id per page load, so each conversation is stored as its own record.
  const conversationIdRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `c-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Grow the textarea with its content, up to a max height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input, open]);

  // On mobile, size the panel to the area above the on-screen keyboard so the
  // input stays visible. Uses the VisualViewport API (keyboard shrinks it).
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    const panel = panelRef.current;
    if (!vv || !panel) return;
    const mq = window.matchMedia("(max-width: 480px)");
    const apply = () => {
      if (mq.matches) {
        panel.style.height = `${vv.height}px`;
        panel.style.top = `${vv.offsetTop}px`;
        panel.style.bottom = "auto";
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
      } else {
        panel.style.height = "";
        panel.style.top = "";
        panel.style.bottom = "";
      }
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    if (mq.addEventListener) mq.addEventListener("change", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      panel.style.height = "";
      panel.style.top = "";
      panel.style.bottom = "";
    };
  }, [open]);

  const sendMessage = async (override) => {
    // `override` lets voice transcription send text directly without waiting
    // for the input state to flush. Button clicks pass an event — ignore it.
    const source = typeof override === "string" ? override : input;
    const text = source.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send only the role/content the API expects (skip the welcome line).
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          messages: next
            .filter((m) => m !== WELCOME)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Eroare de comunicare");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (e) {
      setError("Ne pare rău, a apărut o eroare. Vă rugăm încercați din nou.");
    } finally {
      setLoading(false);
    }
  };

  // Always point at the latest sendMessage so recognizer callbacks aren't stale.
  sendMessageRef.current = sendMessage;

  const onKeyDown = (e) => {
    if (recording || transcribing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ---- Voice transcription -------------------------------------------------

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Release the microphone / recognizer if the component unmounts mid-recording.
  useEffect(
    () => () => {
      stopStream();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        autoSendRef.current = false;
        try { recognitionRef.current.abort(); } catch (e) {}
        recognitionRef.current = null;
      }
    },
    []
  );

  const isIOS = () =>
    typeof navigator !== "undefined" &&
    (/iP(hone|ad|od)/.test(navigator.userAgent) ||
      // iPadOS 13+ reports as a Mac, so also check for touch support.
      (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

  const isIOSSafari = () =>
    isIOS() &&
    /Safari/.test(navigator.userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|GSA/i.test(navigator.userAgent);

  // Browser-native speech-to-text. Preferred when reliable. On iOS the Web
  // Speech API only works in Safari — Chrome/Firefox/etc. expose a broken or
  // missing API, so for those we fall through to server-side transcription.
  const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;
    if (isIOS() && !isIOSSafari()) return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  };

  // Romanian name of a BCP-47 language code, for the "speak in X" hint.
  const languageLabel = (code) => {
    const primary = String(code || "").toLowerCase().split("-")[0];
    const map = {
      ro: "română", en: "engleză", fr: "franceză", de: "germană",
      es: "spaniolă", it: "italiană", hu: "maghiară",
    };
    return map[primary] || "română";
  };

  // The hint popup is only relevant while recording.
  useEffect(() => {
    if (!recording) setLangHint("");
  }, [recording]);

  const pickMimeType = () => {
    if (typeof MediaRecorder === "undefined") return "";
    const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
    return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
  };

  const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => reject(new Error("Citirea înregistrării a eșuat"));
      fr.readAsDataURL(blob);
    });

  const transcribe = async (blob) => {
    setTranscribing(true);
    setError("");
    try {
      const dataBase64 = await blobToDataURL(blob);
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataBase64,
          type: blob.type,
          language: VOICE_LANG.split("-")[0],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Transcriere eșuată");
      const text = (data.text || "").trim();
      if (text) {
        const base = baseTextRef.current ? `${baseTextRef.current} ` : "";
        setInput("");
        sendMessageRef.current(`${base}${text}`.trim());
      } else {
        setError("Nu am putut recunoaște niciun text. Încercați din nou.");
      }
    } catch (e) {
      setError("Transcrierea a eșuat. Vă rugăm încercați din nou.");
    } finally {
      setTranscribing(false);
    }
  };

  // Path 1: browser-native recognition — no server round-trip, transcript shows
  // live in the input, auto-stops after a silence, and is sent automatically.
  const startSpeechRecognition = (SpeechRecognition) => {
    const clearSilence = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
    // Stop after a silence; stopping triggers onend, which auto-sends.
    const armSilence = (ms) => {
      clearSilence();
      silenceTimerRef.current = setTimeout(() => {
        try { recognitionRef.current && recognitionRef.current.stop(); } catch (e) {}
      }, ms);
    };

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = VOICE_LANG;
      setLangHint(`Vorbiți în limba ${languageLabel(VOICE_LANG)}`);
      recognition.continuous = true;
      recognition.interimResults = true;
      transcriptRef.current = "";
      autoSendRef.current = true;

      recognition.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) transcriptRef.current += res[0].transcript;
          else interim += res[0].transcript;
        }
        // Reflect the live transcript (final + interim) in the input field.
        const base = baseTextRef.current ? `${baseTextRef.current} ` : "";
        setInput((base + transcriptRef.current + interim).replace(/\s+/g, " ").trimStart());
        // Speech detected — use the shorter pause-to-stop timeout.
        armSilence(VOICE_SILENCE_STOP_MS);
      };
      recognition.onerror = (e) => {
        if (e.error === "no-speech" || e.error === "aborted") return;
        autoSendRef.current = false;
        setError(
          e.error === "not-allowed"
            ? "Nu am putut accesa microfonul. Verificați permisiunile."
            : "Înregistrarea vocală a eșuat. Vă rugăm încercați din nou."
        );
      };
      recognition.onend = () => {
        clearSilence();
        setRecording(false);
        recognitionRef.current = null;
        const base = baseTextRef.current ? `${baseTextRef.current} ` : "";
        const finalText = (base + transcriptRef.current).replace(/\s+/g, " ").trim();
        if (autoSendRef.current && finalText) {
          setInput("");
          sendMessageRef.current(finalText);
        } else {
          setInput(finalText);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setRecording(true);
      // Wait longer for the user to start speaking.
      armSilence(VOICE_INITIAL_WAIT_MS);
    } catch (e) {
      recognitionRef.current = null;
      clearSilence();
      setError("Nu am putut porni recunoașterea vocală.");
    }
  };

  // Path 2 (fallback): record audio and transcribe it server-side via OpenAI.
  const startMediaRecording = async () => {
    if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") {
      setError("Înregistrarea vocală nu este suportată pe acest dispozitiv.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setLangHint(`Vorbiți în limba ${languageLabel(VOICE_LANG)}`);
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopStream();
        setRecording(false);
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });
        chunksRef.current = [];
        if (blob.size > 0) transcribe(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (e) {
      stopStream();
      setError("Nu am putut accesa microfonul. Verificați permisiunile.");
    }
  };

  const startRecording = async () => {
    if (recording || transcribing || loading) return;
    setError("");
    // Preserve anything already typed; voice text is appended to it.
    baseTextRef.current = input.trim();
    const SpeechRecognition = getSpeechRecognition();
    if (SpeechRecognition) {
      startSpeechRecognition(SpeechRecognition);
      return;
    }
    await startMediaRecording();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      return;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  };

  return (
    <div className={`chatbot${open ? " chatbot--open" : ""}`}>
      {open && (
        <div
          className="chatbot__panel"
          role="dialog"
          aria-label="Asistent virtual Biserica AVA"
          ref={panelRef}
        >
          <div className="chatbot__header">
            <div className="chatbot__title">
              <span className="chatbot__dot" aria-hidden="true" />
              Asistent AI
            </div>
            <button
              type="button"
              className="chatbot__close"
              aria-label="Închide conversația"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chatbot__messages" ref={listRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chatbot__msg chatbot__msg--${
                  m.role === "user" ? "user" : "bot"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chatbot__msg chatbot__msg--bot chatbot__typing">
                <span /> <span /> <span />
              </div>
            )}
            {error && <div className="chatbot__error">{error}</div>}
          </div>

          {recording && langHint && (
            <div className="chatbot__lang-hint" role="status">
              <span className="chatbot__rec-dot" aria-hidden="true" />
              {langHint}
            </div>
          )}

          <div className="chatbot__input">
            <textarea
              ref={inputRef}
              rows={1}
              placeholder={
                recording
                  ? "Vorbiți acum…"
                  : transcribing
                  ? "Se transcrie…"
                  : "Scrieți un mesaj…"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              readOnly={recording}
              disabled={loading || transcribing}
            />
            <button
              type="button"
              className={`chatbot__mic${recording ? " chatbot__mic--recording" : ""}`}
              aria-label={recording ? "Oprește înregistrarea" : "Înregistrează un mesaj vocal"}
              onClick={recording ? stopRecording : startRecording}
              disabled={loading || transcribing}
            >
              {recording ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : transcribing ? (
                <span className="chatbot__spinner" aria-hidden="true" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
                  <path d="M17 11a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="chatbot__send"
              aria-label="Trimite mesajul"
              onClick={sendMessage}
              disabled={loading || recording || transcribing || !input.trim()}
            >
              ➤
            </button>
          </div>

          <p className="chatbot__disclaimer">
            Acest asistent este un agent AI, iar informațiile oferite pot fi
            inexacte. Vă rugăm să le verificați contactând biserica.
          </p>
        </div>
      )}

      <button
        type="button"
        className="chatbot__bubble"
        aria-label={open ? "Închide asistentul" : "Deschide asistentul"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
