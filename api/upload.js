// Image upload (admin only). Receives JSON { key, type, dataBase64 } and stores
// the image (base64) in Neon. Returns a stable URL: /api/images/<key>.
const { getSql } = require("./_lib/db");
const { requireAuth } = require("./_lib/auth");

const MAX_BYTES = 3.5 * 1024 * 1024;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!requireAuth(req, res)) return;

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) {
      res.status(400).json({ error: "JSON invalid" });
      return;
    }
  }
  body = body || {};

  let { key, type, dataBase64 } = body;
  if (!dataBase64 || !type) {
    res.status(400).json({ error: "Lipsește fișierul" });
    return;
  }
  if (!/^image\//.test(type)) {
    res.status(400).json({ error: "Sunt permise doar imagini" });
    return;
  }

  // Strip data-URL prefix if present
  if (dataBase64.startsWith("data:")) {
    const comma = dataBase64.indexOf(",");
    if (comma !== -1) dataBase64 = dataBase64.slice(comma + 1);
  }

  const approxBytes = Math.floor((dataBase64.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    res.status(413).json({ error: "Imagine prea mare (max 3.5MB)" });
    return;
  }

  key = String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!key) key = `img-${Date.now()}`;

  try {
    const sql = getSql();
    await sql`
      insert into images (key, content_type, data, updated_at)
      values (${key}, ${type}, ${dataBase64}, now())
      on conflict (key) do update
        set content_type = excluded.content_type,
            data = excluded.data,
            updated_at = now()
    `;
    res.status(200).json({ ok: true, key, url: `/api/images/${encodeURIComponent(key)}` });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
