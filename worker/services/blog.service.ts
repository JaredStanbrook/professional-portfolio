// worker/services/blog.service.ts
//
// Posts are Markdown files in R2 with a small front matter block:
//
//   ---
//   title: "Hello"
//   readTime: 3
//   subject: "Web"
//   ---
//   Body…
//
// The `blog_metadata` row mirrors the front matter so list pages never open
// an object. R2 and D1 cannot share a transaction, so writes go R2 first:
// a failure after that leaves an object with a stale row, never a row that
// points at nothing.

import { desc, eq } from "drizzle-orm";
import { marked } from "marked";

import type { AppEnv } from "@server/types";
import { users } from "@server/schema/auth.schema";
import {
  blogMetadata,
  slugToFilename,
  type BlogForm,
  type BlogListItem,
  type BlogMetadata,
} from "@server/schema/blog.schema";

type Db = AppEnv["Variables"]["db"];

const FRONT_MATTER = /^---\r?\n([\s\S]+?)\r?\n---\r?\n?/;

const readField = (block: string, key: string) => {
  const raw = block.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"))?.[1];
  if (raw === undefined) return undefined;
  // Written as JSON strings by `toMdx`; older posts used bare or 'quoted'.
  if (raw.startsWith('"')) {
    try {
      return String(JSON.parse(raw));
    } catch {
      /* fall through to the lenient form */
    }
  }
  return raw.replace(/^["']|["']$/g, "");
};

export function parsePost(source: string) {
  const block = source.match(FRONT_MATTER)?.[1] ?? "";
  return {
    title: readField(block, "title") || "Untitled",
    subject: readField(block, "subject") || "General",
    readTime: Number.parseInt(readField(block, "readTime") ?? "", 10) || 1,
    body: source.replace(FRONT_MATTER, "").trim(),
  };
}

export const toMdx = (form: Pick<BlogForm, "title" | "subject" | "readTime" | "body">) =>
  [
    "---",
    `title: ${JSON.stringify(form.title)}`,
    `readTime: ${form.readTime}`,
    `subject: ${JSON.stringify(form.subject)}`,
    "---",
    form.body,
    "",
  ].join("\n");

/**
 * Markdown to HTML. Raw HTML in a post is passed through, as it always was —
 * posts are written only by allowlisted accounts holding `blogs.create`. If
 * the site ever opens authoring to strangers, sanitise here first.
 */
export const renderMarkdown = (body: string) => marked.parse(body, { async: false, gfm: true });

const withAuthor = <T extends { authorName: string | null }>(row: T) => ({
  ...row,
  authorName: row.authorName || "Anonymous",
});

export async function listPosts(db: Db): Promise<BlogListItem[]> {
  const rows = await db
    .select({
      filename: blogMetadata.filename,
      title: blogMetadata.title,
      readTime: blogMetadata.readTime,
      subject: blogMetadata.subject,
      userId: blogMetadata.userId,
      createdAt: blogMetadata.createdAt,
      updatedAt: blogMetadata.updatedAt,
      authorName: users.displayName,
    })
    .from(blogMetadata)
    .leftJoin(users, eq(blogMetadata.userId, users.id))
    .orderBy(desc(blogMetadata.createdAt));
  return rows.map(withAuthor);
}

export async function getPostMeta(db: Db, slug: string): Promise<BlogMetadata | undefined> {
  const [row] = await db
    .select()
    .from(blogMetadata)
    .where(eq(blogMetadata.filename, slugToFilename(slug)))
    .limit(1);
  return row;
}

/** The post with its body, or null when either half is missing. */
export async function getPost(db: Db, bucket: R2Bucket, slug: string) {
  const [meta, object] = await Promise.all([
    db
      .select({
        filename: blogMetadata.filename,
        title: blogMetadata.title,
        readTime: blogMetadata.readTime,
        subject: blogMetadata.subject,
        userId: blogMetadata.userId,
        createdAt: blogMetadata.createdAt,
        updatedAt: blogMetadata.updatedAt,
        authorName: users.displayName,
      })
      .from(blogMetadata)
      .leftJoin(users, eq(blogMetadata.userId, users.id))
      .where(eq(blogMetadata.filename, slugToFilename(slug)))
      .limit(1)
      .then((r) => r[0]),
    bucket.get(slugToFilename(slug)),
  ]);
  if (!meta || !object) return null;

  const parsed = parsePost(await object.text());
  return { meta: withAuthor(meta), body: parsed.body };
}

/** Create or update. `ownerId` is the existing owner on an update. */
export async function savePost(
  db: Db,
  bucket: R2Bucket,
  form: BlogForm,
  ownerId: string,
): Promise<void> {
  const filename = slugToFilename(form.slug);
  await bucket.put(filename, toMdx(form), {
    httpMetadata: { contentType: "text/markdown; charset=utf-8" },
  });

  const now = new Date().toISOString();
  await db
    .insert(blogMetadata)
    .values({
      filename,
      title: form.title,
      readTime: form.readTime,
      subject: form.subject,
      userId: ownerId,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: blogMetadata.filename,
      set: { title: form.title, readTime: form.readTime, subject: form.subject, updatedAt: now },
    });
}

/** False when there was no such post. */
export async function deletePost(db: Db, bucket: R2Bucket, slug: string): Promise<boolean> {
  const filename = slugToFilename(slug);
  const removed = await db
    .delete(blogMetadata)
    .where(eq(blogMetadata.filename, filename))
    .returning({ filename: blogMetadata.filename });
  if (removed.length === 0) return false;
  await bucket.delete(filename);
  return true;
}
