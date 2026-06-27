// AI chat agent for Biserica AVA. Loads the site content from Neon and injects
// it into the system prompt so the assistant only answers about this website.
const { OpenAI } = require("openai");
const { getContent } = require("./_lib/db");

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_HISTORY = 10; // last messages kept as context for the assistant
const MAX_MSG_CHARS = 2000; // per-message cap to keep prompts bounded
const CONTENT_TTL_MS = 60 * 1000; // cache the flattened content briefly

let _openai;
function getOpenAI() {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

// ---- Content -> plain text -------------------------------------------------

const SKIP_KEYS = new Set([
  "largeImage", "smallImage", "image", "text-disabled", "message-hidden",
]);

function stripHtml(s) {
  return String(s)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h[1-6]|section|blockquote|ul|ol|div|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function humanize(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function walk(node, lines) {
  if (node == null || node === "") return;
  if (typeof node === "string") {
    const t = stripHtml(node);
    if (t) lines.push(t);
    return;
  }
  if (typeof node === "number" || typeof node === "boolean") {
    lines.push(String(node));
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item) => walk(item, lines));
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (SKIP_KEYS.has(key) || value == null || value === "") continue;
    if (typeof value === "object") {
      const child = [];
      walk(value, child);
      if (child.length) lines.push(`\n## ${humanize(key)}`, ...child);
    } else {
      const t = typeof value === "string" ? stripHtml(value) : String(value);
      if (t) lines.push(`${humanize(key)}: ${t}`);
    }
  }
}

function contentToText(doc) {
  if (!doc || typeof doc !== "object") return "";
  const lines = [];
  walk(doc, lines);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

let _contentCache = { text: "", at: 0 };
async function getContentText() {
  const now = Date.now();
  if (_contentCache.text && now - _contentCache.at < CONTENT_TTL_MS) {
    return _contentCache.text;
  }
  const doc = await getContent();
  const text = contentToText(doc);
  _contentCache = { text, at: now };
  return text;
}

// ---- Prompt ----------------------------------------------------------------

function buildSystemPrompt(contentText) {
  return [
    "Ești asistentul virtual al Bisericii Creștine Baptiste AVA.",
    "Răspunzi DOAR pe baza informațiilor despre această biserică și acest site, furnizate mai jos.",
    "",
    "Reguli:",
    "- Răspunde ÎNTOTDEAUNA în aceeași limbă în care a scris utilizatorul (de exemplu română, engleză, franceză, germană, spaniolă, italiană etc.), pe un ton cald, politicos și respectuos. Dacă limba mesajului nu este clară, folosește limba română.",
    "- Folosește NUMAI informațiile din secțiunea „CONȚINUTUL SITE-ULUI”. Nu inventa programe, nume, date, adrese sau detalii care nu apar acolo.",
    "- Dacă întrebarea nu are legătură cu Biserica AVA sau cu informațiile de pe site (de exemplu politică, sport, teme generale, alte organizații), refuză politicos și invită utilizatorul să pună o întrebare despre biserică.",
    "- Dacă informația cerută nu se găsește în conținut, spune sincer că nu o ai și recomandă contactarea bisericii folosind datele de contact de mai jos.",
    "- Nu oferi sfaturi medicale, juridice sau financiare și nu purta dezbateri teologice care depășesc conținutul site-ului.",
    "- Păstrează răspunsurile scurte, clare și utile.",
    "",
    "CONȚINUTUL SITE-ULUI:",
    contentText || "(Conținutul site-ului nu este disponibil momentan.)",
  ].join("\n");
}

function sanitizeHistory(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content.slice(0, MAX_MSG_CHARS),
    }))
    .slice(-MAX_HISTORY);
}

// ---- Handler ---------------------------------------------------------------

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

  const history = sanitizeHistory(body && body.messages);
  if (!history.length || history[history.length - 1].role !== "user") {
    res.status(400).json({ error: "Mesaj invalid" });
    return;
  }

  try {
    const contentText = await getContentText();
    const content = buildSystemPrompt(contentText)
    console.log(content)
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        { role: "system", content },
        ...history,
      ],
    });

    const reply =
      (completion.choices &&
        completion.choices[0] &&
        completion.choices[0].message &&
        completion.choices[0].message.content) ||
      "Îmi pare rău, nu am putut genera un răspuns. Te rog încearcă din nou.";

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ reply: reply.trim() });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};

// Exposed for tests/tooling (the default export stays the request handler).
module.exports.contentToText = contentToText;
module.exports.buildSystemPrompt = buildSystemPrompt;
