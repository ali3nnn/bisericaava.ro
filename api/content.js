const { getContent, setContent } = require("./_lib/db");
const { requireAuth } = require("./_lib/auth");

module.exports = async (req, res) => {
  // Public read
  if (req.method === "GET") {
    try {
      const doc = await getContent();
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(doc || {});
    } catch (e) {
      res.status(500).json({ error: String((e && e.message) || e) });
    }
    return;
  }

  // Protected write
  if (req.method === "PUT" || req.method === "POST") {
    if (!requireAuth(req, res)) return;
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) {
        res.status(400).json({ error: "JSON invalid" });
        return;
      }
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      res.status(400).json({ error: "Conținut invalid" });
      return;
    }
    try {
      await setContent(body);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: String((e && e.message) || e) });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
