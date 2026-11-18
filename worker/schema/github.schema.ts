// worker/schema/github.schema.ts
//
// Cached GitHub API responses. The stats endpoints are rate limited and are
// computed lazily on GitHub's side (they answer 202 while they build), so a
// page render reads from here and only goes to GitHub once an entry expires.
// Shape kept as the live table already has it.

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const githubCache = sqliteTable("github_repo_cache", {
  id: text("id").primaryKey(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  /** The response body, stringified JSON. */
  data: text("data").notNull(),
  /** Unix seconds. */
  expiresAt: integer("expires_at").notNull(),
});
