// worker/schema/blog.schema.ts
//
// A post is two halves: the Markdown body lives in R2 under `filename`, and
// this row holds what the list pages need without opening every object.
//
// The table predates this codebase and already holds live rows, so its shape
// is kept exactly as the database has it: `filename` (e.g. `my-post.mdx`) is
// the key, and there is no `deletedAt` — deleting a post removes the R2
// object too, so a soft-deleted row would point at nothing.

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

import { users } from "./auth.schema";
import { ownershipColumns } from "./common";

export const blogMetadata = sqliteTable("blog_metadata", {
  filename: text("filename").primaryKey(),
  title: text("title").notNull(),
  readTime: integer("read_time").notNull(),
  subject: text("subject").notNull(),
  ...ownershipColumns,
});

export const blogRelations = relations(blogMetadata, ({ one }) => ({
  author: one(users, { fields: [blogMetadata.userId], references: [users.id] }),
}));

/** URL slug ↔ R2 key. Links carry the slug; the stored key keeps its `.mdx`. */
export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
export const slugToFilename = (slug: string) => `${slug}.mdx`;
export const filenameToSlug = (filename: string) => filename.replace(/\.mdx$/, "");

/** One line of text: front matter is line-based, so a newline would end it. */
const line = (label: string, max: number) =>
  z
    .string()
    .transform((v) => v.replace(/\s+/g, " ").trim())
    .pipe(z.string().min(1, `${label} is required`).max(max));

/** What the editor posts. The server writes the front matter from these. */
export const blogFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and dashes"),
  title: line("Title", 160),
  subject: line("Subject", 40),
  readTime: z.coerce.number().int().min(1, "At least a minute").max(240),
  body: z.string().trim().min(1, "The post is empty").max(200_000),
});

export type BlogMetadata = typeof blogMetadata.$inferSelect;
export type BlogListItem = BlogMetadata & { authorName: string };
export type BlogForm = z.infer<typeof blogFormSchema>;
