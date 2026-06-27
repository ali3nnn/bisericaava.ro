// Local dev/test server: serves build/ statics AND routes /api/* to the
// Vercel-style handlers (against the real Neon DB). Mimics Vercel locally.
// Run: node --env-file=.env.local scripts/local-server.cjs
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const BUILD = path.join(__dirname, "..", "build");
const PORT = process.env.PORT || 4732;

const handlers = {
  "/api/login": require("../api/login.js"),
  "/api/logout": require("../api/logout.js"),
  "/api/me": require("../api/me.js"),
  "/api/content": require("../api/content.js"),
  "/api/upload": require("../api/upload.js"),
  "/api/chat": require("../api/chat.js"),
  "/api/transcribe": require("../api/transcribe.js"),
};
const imageHandler = require("../api/images/[key].js");

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff",
  ".ttf": "font/ttf", ".map": "application/json", ".txt": "text/plain",
};

function shimRes(res) {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); return res; };
  res.send = (b) => { res.end(b); return res; };
  return res;
}
const readBody = (req) =>
  new Promise((resolve) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => resolve(d)); });

const server = http.createServer(async (req, res) => {
  shimRes(res);
  const u = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = u.pathname;
  req.query = Object.fromEntries(u.searchParams.entries());

  if (pathname.startsWith("/api/")) {
    if (req.method !== "GET" && req.method !== "HEAD") {
      const raw = await readBody(req);
      const ct = req.headers["content-type"] || "";
      req.body = ct.includes("application/json") ? safeJSON(raw) : raw;
    }
    try {
      if (pathname.startsWith("/api/images/")) {
        req.query.key = decodeURIComponent(pathname.replace("/api/images/", ""));
        await imageHandler(req, res);
        return;
      }
      const h = handlers[pathname];
      if (h) { await h(req, res); return; }
      res.status(404).json({ error: "Not found" });
    } catch (e) {
      res.status(500).json({ error: String((e && e.message) || e) });
    }
    return;
  }

  // static + SPA fallback
  const rel = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.join(BUILD, rel);
  if (!filePath.startsWith(BUILD)) { res.status(403).send("Forbidden"); return; }
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      fs.readFile(path.join(BUILD, "index.html"), (e2, b2) => {
        if (e2) { res.status(404).send("Not found"); return; }
        res.setHeader("Content-Type", "text/html"); res.end(b2);
      });
      return;
    }
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    res.end(buf);
  });
});

function safeJSON(s) { try { return JSON.parse(s); } catch (e) { return {}; } }

server.listen(PORT, () => console.log("local server on http://localhost:" + PORT));
