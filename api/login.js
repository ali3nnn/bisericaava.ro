const crypto = require("crypto");
const { sign, setSessionCookie } = require("./_lib/auth");

function safeEqual(a, b) {
  const ba = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const U = process.env.ADMIN_USERNAME || "admin";
  const P = process.env.ADMIN_PASSWORD || "";

  const okUser = safeEqual(body.username, U);
  const okPass = P && safeEqual(body.password, P);

  if (okUser && okPass) {
    const maxAge = 60 * 60 * 8; // 8 hours
    const token = sign({ u: U, exp: Date.now() + maxAge * 1000 });
    setSessionCookie(res, token, maxAge);
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ error: "Date de autentificare incorecte" });
  }
};
