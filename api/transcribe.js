// Speech-to-text for the chatbot. Receives JSON { dataBase64, type, language }
// holding a short audio recording and returns { text } using OpenAI transcription.
const { OpenAI, toFile } = require("openai");

const STT_MODEL = process.env.OPENAI_STT_MODEL || "gpt-4o-mini-transcribe";
// Default transcription language (ISO-639-1). The client normally sends one;
// this is the fallback. Change the client's VOICE_LANG to switch languages.
const DEFAULT_STT_LANGUAGE = process.env.OPENAI_STT_LANGUAGE || "ro";
const MAX_BYTES = 4 * 1024 * 1024; // keep under the serverless request body limit

let _openai;
function getOpenAI() {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

function extFromType(type) {
  const t = String(type || "").toLowerCase();
  if (t.includes("webm")) return "webm";
  if (t.includes("ogg")) return "ogg";
  if (t.includes("mp4") || t.includes("m4a")) return "mp4";
  if (t.includes("mpeg") || t.includes("mp3")) return "mp3";
  if (t.includes("wav")) return "wav";
  return "webm";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) {
      res.status(400).json({ error: "JSON invalid" });
      return;
    }
  }
  body = body || {};

  let { dataBase64, type, language } = body;
  if (!dataBase64) {
    res.status(400).json({ error: "Lipsește înregistrarea audio" });
    return;
  }

  // Accept a 2-letter ISO-639-1 code from the client; otherwise use the default.
  const lang = /^[a-z]{2}$/i.test(language || "")
    ? String(language).toLowerCase()
    : DEFAULT_STT_LANGUAGE;

  // Strip data-URL prefix if present (and recover the mime type from it).
  if (dataBase64.startsWith("data:")) {
    const comma = dataBase64.indexOf(",");
    if (comma !== -1) {
      if (!type) {
        const m = /^data:([^;]+)/.exec(dataBase64);
        if (m) type = m[1];
      }
      dataBase64 = dataBase64.slice(comma + 1);
    }
  }

  const approxBytes = Math.floor((dataBase64.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    res.status(413).json({ error: "Înregistrare prea mare. Încearcă un mesaj mai scurt." });
    return;
  }

  try {
    const buffer = Buffer.from(dataBase64, "base64");
    const file = await toFile(buffer, `audio.${extFromType(type)}`, {
      type: type || "audio/webm",
    });
    const openai = getOpenAI();
    const result = await openai.audio.transcriptions.create({
      model: STT_MODEL,
      file,
      language: lang,
    });
    const text = (result && result.text ? String(result.text) : "").trim();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
