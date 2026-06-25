// One-time DB setup + seed for the Neon-backed CMS.
// Run with:  node --env-file=.env.local scripts/db-setup.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/db-setup.mjs");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const seed = JSON.parse(
  readFileSync(join(__dirname, "..", "src", "data", "data.json"), "utf8")
);

async function main() {
  console.log("Creating tables…");

  await sql`
    create table if not exists site_content (
      id          int primary key default 1,
      doc         jsonb not null,
      updated_at  timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists images (
      key          text primary key,
      content_type text not null,
      data         text not null,           -- base64-encoded bytes
      updated_at   timestamptz not null default now()
    )
  `;

  console.log("Seeding content (only if empty)…");
  await sql`
    insert into site_content (id, doc)
    values (1, ${JSON.stringify(seed)}::jsonb)
    on conflict (id) do nothing
  `;

  const rows = await sql`select id, jsonb_typeof(doc) as t, updated_at from site_content where id = 1`;
  const imgs = await sql`select count(*)::int as n from images`;
  console.log("✓ site_content row:", rows[0]);
  console.log("✓ images stored:", imgs[0].n);
  console.log("Done.");
}

main().catch((e) => {
  console.error("DB setup failed:", e);
  process.exit(1);
});
