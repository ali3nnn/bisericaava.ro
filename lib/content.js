import { cache } from "react";
import db from "@/api/_lib/db";
import fallback from "@/src/data/data.json";

// Server-side content fetch shared by all routes. Reads the CMS document
// straight from Neon (no HTTP hop) and falls back to the bundled data.json
// when the DB is empty or unavailable (e.g. local dev without DATABASE_URL).
// Wrapped in React `cache()` so multiple server components in one request
// share a single DB read.
export const getSiteContent = cache(async () => {
  try {
    const doc = await db.getContent();
    return doc && Object.keys(doc).length ? doc : fallback;
  } catch {
    return fallback;
  }
});
