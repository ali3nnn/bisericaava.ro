// End-to-end smoke test of the API handlers against the real Neon DB.
// Run: node --env-file=.env.local scripts/api-smoke.cjs
const login = require("../api/login.js");
const logout = require("../api/logout.js");
const me = require("../api/me.js");
const content = require("../api/content.js");
const upload = require("../api/upload.js");
const imageServe = require("../api/images/[key].js");

function mockReq({ method = "GET", headers = {}, body, query = {} } = {}) {
  return { method, headers, body, query };
}
function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; return this; },
    send(b) { this.body = b; return this; },
  };
}
function cookieFrom(res) {
  const sc = res.headers["set-cookie"];
  if (!sc) return "";
  return sc.split(";")[0]; // "ava_session=..."
}
let failures = 0;
function check(name, cond, extra) {
  console.log(`${cond ? "✓" : "✗"} ${name}${extra ? "  " + extra : ""}`);
  if (!cond) failures++;
}

const PNG_1x1 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

async function main() {
  // 1. me (unauth)
  let res = mockRes();
  await me(mockReq(), res);
  check("me unauth → authenticated:false", res.body && res.body.authenticated === false);

  // 2. login wrong
  res = mockRes();
  await login(mockReq({ method: "POST", body: { username: "admin", password: "nope" } }), res);
  check("login wrong → 401", res.statusCode === 401);

  // 3. login correct
  res = mockRes();
  await login(mockReq({ method: "POST", body: { username: "admin", password: process.env.ADMIN_PASSWORD } }), res);
  const cookie = cookieFrom(res);
  check("login correct → 200 + cookie", res.statusCode === 200 && !!cookie);

  const authHeaders = { cookie };

  // 4. me (auth)
  res = mockRes();
  await me(mockReq({ headers: authHeaders }), res);
  check("me auth → authenticated:true", res.body && res.body.authenticated === true);

  // 5. content GET
  res = mockRes();
  await content(mockReq({ method: "GET" }), res);
  const original = res.body;
  check("content GET → has Header.title", !!(original && original.Header && original.Header.title), `("${original?.Header?.title}")`);

  // 6. content PUT unauth → 401
  res = mockRes();
  await content(mockReq({ method: "PUT", body: { ...original } }), res);
  check("content PUT unauth → 401", res.statusCode === 401);

  // 7. content PUT auth → 200 (toggle a marker then restore)
  const edited = JSON.parse(JSON.stringify(original));
  const marker = "SMOKE_" + Date.now();
  edited.Header.title = marker;
  res = mockRes();
  await content(mockReq({ method: "PUT", headers: authHeaders, body: edited }), res);
  check("content PUT auth → 200", res.statusCode === 200);

  // 8. content GET reflects change
  res = mockRes();
  await content(mockReq({ method: "GET" }), res);
  check("content GET reflects edit", res.body.Header.title === marker);

  // restore original
  res = mockRes();
  await content(mockReq({ method: "PUT", headers: authHeaders, body: original }), res);
  check("content restored", res.statusCode === 200);

  // 9. upload (auth)
  res = mockRes();
  await upload(mockReq({ method: "POST", headers: authHeaders, body: { key: "smoke-test.png", type: "image/png", dataBase64: PNG_1x1 } }), res);
  check("upload → url", res.statusCode === 200 && res.body && res.body.url === "/api/images/smoke-test.png", JSON.stringify(res.body));

  // 10. upload unauth → 401
  res = mockRes();
  await upload(mockReq({ method: "POST", body: { key: "x.png", type: "image/png", dataBase64: PNG_1x1 } }), res);
  check("upload unauth → 401", res.statusCode === 401);

  // 11. serve image
  res = mockRes();
  await imageServe(mockReq({ query: { key: "smoke-test.png" } }), res);
  check("serve image → png buffer", Buffer.isBuffer(res.body) && res.headers["content-type"] === "image/png" && res.body.length > 0, `${Buffer.isBuffer(res.body) ? res.body.length + " bytes" : ""}`);

  // 12. serve missing → 404
  res = mockRes();
  await imageServe(mockReq({ query: { key: "does-not-exist" } }), res);
  check("serve missing → 404", res.statusCode === 404);

  // 13. logout clears cookie
  res = mockRes();
  await logout(mockReq({ method: "POST", headers: authHeaders }), res);
  check("logout → clears cookie", /Max-Age=0/.test(res.headers["set-cookie"] || ""));

  console.log(failures === 0 ? "\nALL PASS ✓" : `\n${failures} FAILURE(S) ✗`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
