// Screenshot a page with a pre-set session cookie, via Chrome DevTools Protocol.
// Usage: node --env-file=.env.local scripts/cdp-shot.cjs <url> <outPng>
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { sign } = require("../api/_lib/auth");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL_TO = process.argv[2];
const OUT = process.argv[3];
const PORT = 9333;

const getJSON = async (u) => (await fetch(u)).json();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const udd = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-"));
  const chrome = spawn(
    CHROME,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars",
     `--remote-debugging-port=${PORT}`, `--user-data-dir=${udd}`,
     "--window-size=1440,2600", "about:blank"],
    { stdio: "ignore" }
  );

  let target;
  for (let i = 0; i < 40; i++) {
    try {
      const list = await getJSON(`http://localhost:${PORT}/json`);
      target = list.find((t) => t.type === "page");
      if (target) break;
    } catch (e) {}
    await sleep(250);
  }
  if (!target) { console.error("no devtools target"); chrome.kill(); process.exit(1); }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((resolve) => { const _id = ++id; pending.set(_id, resolve); ws.send(JSON.stringify({ id: _id, method, params })); });
  await new Promise((res) => ws.addEventListener("open", res));
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  });

  await send("Network.enable");
  const token = sign({ u: process.env.ADMIN_USERNAME || "admin", exp: Date.now() + 3600 * 1000 });
  await send("Network.setCookie", { name: "ava_session", value: token, url: new URL(URL_TO).origin, httpOnly: true, path: "/" });
  await send("Page.enable");
  await send("Page.navigate", { url: URL_TO });
  await sleep(4500);
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  fs.writeFileSync(OUT, Buffer.from(shot.data, "base64"));
  ws.close();
  chrome.kill();
  console.log("saved", OUT);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
