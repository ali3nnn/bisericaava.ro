// Stateless signed-cookie session (HMAC-SHA256). No external deps.
const crypto = require("crypto");

const COOKIE = "ava_session";

function getSecret() {
  return process.env.SESSION_SECRET || "dev-insecure-secret-change-me";
}

function sign(payloadObj) {
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verify(token) {
  if (!token || token.indexOf(".") === -1) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const obj = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (obj.exp && Date.now() > obj.exp) return null;
    return obj;
  } catch (e) {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  header.split(";").forEach((c) => {
    const i = c.indexOf("=");
    if (i === -1) return;
    const k = c.slice(0, i).trim();
    if (!k) return;
    out[k] = decodeURIComponent(c.slice(i + 1).trim());
  });
  return out;
}

function setSessionCookie(res, token, maxAgeSec) {
  const parts = [
    `${COOKIE}=${token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(res) {
  const parts = [`${COOKIE}=`, "HttpOnly", "Path=/", "SameSite=Lax", "Max-Age=0"];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function getSession(req) {
  const cookies = parseCookies(req);
  return verify(cookies[COOKIE]);
}

// Returns the session or null. On null, writes a 401 response.
function requireAuth(req, res) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return session;
}

module.exports = {
  COOKIE,
  sign,
  verify,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  requireAuth,
};
