// DB-backed brute-force protection for the admin login. In-memory counters are
// useless on Vercel (each invocation may run in a fresh, ephemeral instance),
// so failed attempts are tracked per IP in Neon. Callers should treat DB errors
// as fail-open so a transient DB outage can't lock the legitimate admin out.
const { getSql } = require("./db");

const LOCK_PER_FAIL_MS = 15 * 1000; // wait grows 15s for each consecutive failure

let _ready;
function ensureTable() {
  if (!_ready) {
    const sql = getSql();
    _ready = sql`
      create table if not exists login_attempts (
        ip            text primary key,
        fails         int not null default 0,
        first_fail_at timestamptz not null default now(),
        last_fail_at  timestamptz not null default now(),
        locked_until  timestamptz
      )
    `;
  }
  return _ready;
}

// Best-effort client IP. On Vercel the real client is in x-forwarded-for; the
// first hop is the closest to the user.
function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  return (
    req.headers["x-real-ip"] ||
    (req.socket && req.socket.remoteAddress) ||
    "unknown"
  );
}

// Returns { locked, retryAfter } — retryAfter is seconds until the lock lifts.
async function checkLock(ip) {
  await ensureTable();
  const sql = getSql();
  const rows = await sql`select locked_until from login_attempts where ip = ${ip}`;
  const lockedUntil = rows[0] && rows[0].locked_until;
  if (lockedUntil) {
    const until = new Date(lockedUntil).getTime();
    if (until > Date.now()) {
      return { locked: true, retryAfter: Math.ceil((until - Date.now()) / 1000) };
    }
  }
  return { locked: false, retryAfter: 0 };
}

// Records a failed attempt and returns the required wait in seconds before the
// next attempt: 15s times the number of failures so far. The count keeps
// climbing until a successful login clears it (see recordSuccess).
async function recordFailure(ip) {
  await ensureTable();
  const sql = getSql();
  const rows = await sql`select fails from login_attempts where ip = ${ip}`;
  const now = Date.now();
  const fails = (rows[0] ? rows[0].fails : 0) + 1;

  const lockedUntil = new Date(now + LOCK_PER_FAIL_MS * fails).toISOString();

  await sql`
    insert into login_attempts (ip, fails, first_fail_at, last_fail_at, locked_until)
    values (${ip}, ${fails}, now(), now(), ${lockedUntil})
    on conflict (ip) do update
      set fails = ${fails}, last_fail_at = now(), locked_until = ${lockedUntil}
  `;

  return Math.ceil((new Date(lockedUntil).getTime() - now) / 1000);
}

// Clears the failure history for an IP after a successful login.
async function recordSuccess(ip) {
  await ensureTable();
  const sql = getSql();
  await sql`delete from login_attempts where ip = ${ip}`;
}

module.exports = { clientIp, checkLock, recordFailure, recordSuccess };
