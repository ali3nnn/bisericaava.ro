// Shared Neon DB helpers. Files/dirs prefixed with "_" are not routed by Vercel.
const { neon } = require("@neondatabase/serverless");

let _sql;
function getSql() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

async function getContent() {
  const sql = getSql();
  const rows = await sql`select doc from site_content where id = 1`;
  return rows[0] ? rows[0].doc : null;
}

async function setContent(doc) {
  const sql = getSql();
  await sql`
    insert into site_content (id, doc, updated_at)
    values (1, ${JSON.stringify(doc)}::jsonb, now())
    on conflict (id) do update set doc = excluded.doc, updated_at = now()
  `;
}

module.exports = { getSql, getContent, setContent };
