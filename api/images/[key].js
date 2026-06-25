// Serves an image stored in Neon. GET /api/images/<key>
const { getSql } = require("../_lib/db");

module.exports = async (req, res) => {
  const key = req.query && req.query.key;
  if (!key) {
    res.status(400).send("Missing key");
    return;
  }
  try {
    const sql = getSql();
    const rows = await sql`select content_type, data from images where key = ${key}`;
    if (!rows[0]) {
      res.status(404).send("Not found");
      return;
    }
    const buf = Buffer.from(rows[0].data, "base64");
    res.setHeader("Content-Type", rows[0].content_type || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
    res.status(200).send(buf);
  } catch (e) {
    res.status(500).send("Error");
  }
};
