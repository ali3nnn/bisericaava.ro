import React, { useEffect, useRef, useState } from "react";

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

  const listRef = useRef(null);
  const inputRef = useRef(null);

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

  const sendMessage = async () => {
    const text = input.trim();
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

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot">
      {open && (
        <div
          className="chatbot__panel"
          role="dialog"
          aria-label="Asistent virtual Biserica AVA"
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

          <div className="chatbot__input">
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Scrieți un mesaj…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
            />
            <button
              type="button"
              className="chatbot__send"
              aria-label="Trimite mesajul"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
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
