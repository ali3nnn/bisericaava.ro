const crypto = require("crypto");
const { sign, setSessionCookie } = require("./_lib/auth");
const {
  clientIp,
  checkLock,
  recordFailure,
  recordSuccess,
} = require("./_lib/rate-limit");

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

  const ip = clientIp(req);

  // Brute-force throttle. Fail-open on DB errors so a transient DB outage can't
  // lock the legitimate admin out — protection just pauses during the outage.
  try {
    const { locked, retryAfter } = await checkLock(ip);
    if (locked) {
      res.setHeader("Retry-After", String(retryAfter));
      res.status(429).json({
        error: "Prea multe încercări eșuate. Încearcă din nou mai târziu.",
        retryAfter,
      });
      return;
    }
  } catch (e) {
    console.error("login rate-limit check failed:", (e && e.message) || e);
  }

  const U = process.env.ADMIN_USERNAME || "admin";
  const P = process.env.ADMIN_PASSWORD || "";

  const okUser = safeEqual(body.username, U);
  const okPass = P && safeEqual(body.password, P);

  if (okUser && okPass) {
    try { await recordSuccess(ip); } catch (e) {
      console.error("login recordSuccess failed:", (e && e.message) || e);
    }
    const maxAge = 60 * 60 * 8; // 8 hours
    const token = sign({ u: U, exp: Date.now() + maxAge * 1000 });
    setSessionCookie(res, token, maxAge);
    res.status(200).json({ ok: true });
  } else {
    // Record the failure and arm the wait (15s × consecutive fails). It's
    // returned as retryAfter so the UI can count down; the password is still
    // reported as incorrect, and checkLock enforces the wait on the next attempt.
    let retryAfter = 0;
    try { retryAfter = await recordFailure(ip); } catch (e) {
      console.error("login recordFailure failed:", (e && e.message) || e);
    }
    if (retryAfter > 0) res.setHeader("Retry-After", String(retryAfter));
    res.status(401).json({ error: "Date de autentificare incorecte", retryAfter });
  }
};
