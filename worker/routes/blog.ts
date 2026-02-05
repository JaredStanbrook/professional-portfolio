import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, getTableColumns } from "drizzle-orm";
import { AccessControl } from "../services/access.service";
import { blogMetadata } from "../schema/blogs.schema";
import type { AppEnv } from "../types";
import { authMiddleware } from "../middleware/auth.middleware";
import { users } from "../schema/auth.schema";
import { getReadingTime, parseFrontMatter, stripFrontMatter } from "../utils/blog";

const access = new AccessControl();

export const blogRoute = new Hono<AppEnv>()
  .use("*", authMiddleware)
  .get("/", async (c) => {
    const db = c.get("db");

    try {
      const results = await db
        .select({
          ...getTableColumns(blogMetadata),
          authorName: users.displayName,
        })
        .from(blogMetadata)

        .leftJoin(users, eq(blogMetadata.userId, users.id))
        .orderBy(desc(blogMetadata.createdAt))
        .all();

      const blogs = await Promise.all(
        results.map(async (row) => {
          const object = await c.env.BLOG.get(row.filename);
          const frontmatter = object ? parseFrontMatter(await object.text()) : null;

          if (frontmatter?.draft) {
            return null;
          }

          const slug = frontmatter?.slug || row.filename.replace(/\\.mdx$/, "");
          const tags = frontmatter?.tags ?? [];
          const summary = frontmatter?.summary;
          const featured = frontmatter?.featured ?? false;
          const publishedAt = frontmatter?.publishedAt;

          return {
            ...row,
            authorName: row.authorName || "Anonymous",
            slug,
            tags,
            summary,
            featured,
            draft: false,
            publishedAt,
          };
        })
      );

      return c.json({ blogs: blogs.filter(Boolean) });
    } catch (error) {
      console.error("Error fetching blog metadata:", error);
      return c.json({ error: "Failed to fetch blog metadata" }, 500);
    }
  })

  .get("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");
    const db = c.get("db");

    // Optional: Access Control for Reading
    // const user = c.var.auth.user!;
    // access.authorize(user, "blogs", "read");

    try {
      const object = await c.env.BLOG.get(filename);
      if (!object) {
        return c.json({ error: "File not found" }, 404);
      }

      const fileContent = await object.text();

      const metadata = await db
        .select()
        .from(blogMetadata)
        .where(eq(blogMetadata.filename, filename))
        .get();

      const content = stripFrontMatter(fileContent);
      const parsedFrontmatter = parseFrontMatter(fileContent);
      const readTime = parsedFrontmatter.readTime ?? metadata?.readTime ?? getReadingTime(content);
      const user = c.var.auth.user;

      if (parsedFrontmatter.draft) {
        const isOwner = user?.id && metadata?.userId === user.id;
        const isPrivileged =
          user?.roles?.includes("admin") || user?.roles?.includes("editor") || isOwner;
        if (!isPrivileged) {
          return c.json({ error: "Blog not found" }, 404);
        }
      }

      const authorName = metadata?.userId
        ? (await db.select().from(users).where(eq(users.id, metadata.userId)).get())?.displayName ||
          "Anonymous"
        : "Anonymous";

      return c.json({
        content,
        metadata: {
          title: metadata?.title || parsedFrontmatter.title,
          readTime,
          subject: metadata?.subject || parsedFrontmatter.subject || "General",
          createdAt: metadata?.createdAt || new Date().toISOString(),
          updatedAt: metadata?.updatedAt || new Date().toISOString(),
          authorId: metadata?.userId,
          authorName,
          slug: parsedFrontmatter.slug || filename.replace(/\\.mdx$/, ""),
          summary: parsedFrontmatter.summary,
          tags: parsedFrontmatter.tags ?? [],
          draft: parsedFrontmatter.draft ?? false,
          featured: parsedFrontmatter.featured ?? false,
          publishedAt: parsedFrontmatter.publishedAt,
        },
      });
    } catch (err) {
      console.error("Error fetching blog:", err);
      return c.json({ error: "Failed to fetch blog" }, 500);
    }
  })

  // =================================================================
  // PUT /:filename - Create or Update Blog
  // =================================================================
  .put("/:filename{.+\\.mdx}", zValidator("json", z.object({ body: z.string() })), async (c) => {
    const filename = c.req.param("filename");
    const { body } = c.req.valid("json");
    const user = c.var.auth.user!;
    const db = c.get("db");

    try {
      // 1. Check existence to determine Permission Requirement (Create vs Update)
      const existing = await db
        .select()
        .from(blogMetadata)
        .where(eq(blogMetadata.filename, filename))
        .get();

      if (existing) {
        // UPDATE: Requires 'blogs.update' AND Ownership (unless 'blogs.update.any')
        access.authorize(user, "blogs", "update", existing.userId);
      } else {
        // CREATE: Requires 'blogs.create'
        access.authorize(user, "blogs", "create");
      }

      // 2. Parse Metadata from the MDX body
      const meta = parseFrontMatter(body);
      const content = stripFrontMatter(body);
      const readTime = meta.readTime ?? getReadingTime(content);

      // 3. Save file to R2
      await c.env.BLOG.put(filename, body);

      await db
        .insert(blogMetadata)
        .values({
          filename,
          title: meta.title,
          readTime,
          subject: meta.subject ?? "General",
          userId: existing ? existing.userId : user.id,
        })
        .onConflictDoUpdate({
          target: blogMetadata.filename,
          set: {
            title: meta.title,
            readTime,
            subject: meta.subject ?? "General",
            updatedAt: new Date().toISOString(), // Force update timestamp
          },
        });

      return c.json({
        ok: true,
        filename,
        metadata: {
          ...meta,
          readTime,
          subject: meta.subject ?? "General",
        },
      });
    } catch (error: any) {
      // Handle Access Control Errors (403) specifically
      if (error.status === 403) return c.json({ error: error.message }, 403);

      console.error("Error saving blog:", error);
      return c.json({ error: "Failed to save blog" }, 500);
    }
  })

  // =================================================================
  // DELETE /:filename
  // =================================================================
  .delete("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");
    const user = c.var.auth.user!;
    const db = c.get("db");

    try {
      // 1. Fetch Metadata to check Ownership
      const existing = await db
        .select()
        .from(blogMetadata)
        .where(eq(blogMetadata.filename, filename))
        .get();

      if (!existing) {
        return c.json({ error: "Blog not found" }, 404);
      }

      // 2. Access Control
      // Requires 'blogs.delete' AND Ownership (unless 'blogs.delete.any')
      access.authorize(user, "blogs", "delete", existing.userId);

      // 3. Delete from R2
      await c.env.BLOG.delete(filename);

      // 4. Delete from D1
      await db.delete(blogMetadata).where(eq(blogMetadata.filename, filename));

      return c.json({ ok: true, deleted: filename });
    } catch (error: any) {
      if (error.status === 403) return c.json({ error: error.message }, 403);

      console.error("Error deleting blog:", error);
      return c.json({ error: "Failed to delete blog" }, 500);
    }
  });

// --- Helper ---
