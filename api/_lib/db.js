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

// Ensure the conversations table exists (runs once per process). This makes
// chat logging work even if scripts/db-setup.mjs hasn't been re-run.
let _conversationsReady;
function ensureConversationsTable() {
  if (!_conversationsReady) {
    const sql = getSql();
    _conversationsReady = sql`
      create table if not exists conversations (
        id          text primary key,
        messages    jsonb not null,
        created_at  timestamptz not null default now(),
        updated_at  timestamptz not null default now()
      )
    `;
  }
  return _conversationsReady;
}

// Upsert a whole conversation by id. The client sends the full transcript each
// turn, so last-write-wins keeps the complete conversation without duplicates.
async function saveConversation(id, messages) {
  await ensureConversationsTable();
  const sql = getSql();
  await sql`
    insert into conversations (id, messages, updated_at)
    values (${id}, ${JSON.stringify(messages)}::jsonb, now())
    on conflict (id) do update
      set messages = excluded.messages, updated_at = now()
  `;
}

module.exports = { getSql, getContent, setContent, saveConversation };
