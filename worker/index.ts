// worker/index.ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { cloudflareRateLimiter } from "@hono-rate-limiter/cloudflare";
import { desc, eq } from "drizzle-orm";
import type { AppEnv } from "./types";

import routes from "./app";
import { dbMiddleware } from "./middleware/db.middleware";
import { blogMetadata } from "./schema/blogs.schema";
import { users } from "./schema/auth.schema";
import { getExcerpt, parseFrontMatter, stripFrontMatter } from "./utils/blog";
import { projects } from "../src/data/projects";

const worker = new Hono<AppEnv>();

worker.use("*", logger());
worker.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
worker.use((c, next) =>
  cloudflareRateLimiter<AppEnv>({
    rateLimitBinding: (c) => c.env.RATE_LIMITER,
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
  })(c, next)
);

worker.route("/", routes);

worker.use("/rss.xml", dbMiddleware);
worker.use("/sitemap.xml", dbMiddleware);

worker.get("/robots.txt", (c) => {
  const origin = new URL(c.req.url).origin;
  return c.text(`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`, 200, {
    "Content-Type": "text/plain; charset=utf-8",
  });
});

worker.get("/rss.xml", async (c) => {
  const db = c.get("db");
  const origin = new URL(c.req.url).origin;

  const results = await db
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
    .orderBy(desc(blogMetadata.createdAt))
    .all();

  const items = await Promise.all(
    results.map(async (row: { filename: string; title: string; createdAt: string }) => {
      const object = await c.env.BLOG.get(row.filename);
      if (!object) return null;
      const raw = await object.text();
      const frontmatter = parseFrontMatter(raw);
      if (frontmatter.draft) return null;

      const content = stripFrontMatter(raw);
      const slug = frontmatter.slug || row.filename.replace(/\.mdx$/, "");
      const link = `${origin}/blog/${slug}`;

      return `\n<item>\n<title><![CDATA[${row.title}]]></title>\n<link>${link}</link>\n<guid>${link}</guid>\n<pubDate>${new Date(
        row.createdAt
      ).toUTCString()}</pubDate>\n<description><![CDATA[${
        frontmatter.summary || getExcerpt(content)
      }]]></description>\n</item>`;
    })
  );

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Jared Stanbrook — Blog</title>\n<link>${origin}/blog</link>\n<description>Security, systems, and full-stack notes.</description>\n${
    items.filter(Boolean).join("\n")
  }\n</channel>\n</rss>`;

  return c.text(rss, 200, { "Content-Type": "application/rss+xml; charset=utf-8" });
});

worker.get("/sitemap.xml", async (c) => {
  const db = c.get("db");
  const origin = new URL(c.req.url).origin;

  const results = await db.select().from(blogMetadata).all();
  const blogUrls = await Promise.all(
    results.map(async (row: { filename: string; title: string; createdAt: string }) => {
      const object = await c.env.BLOG.get(row.filename);
      if (!object) return null;
      const raw = await object.text();
      const frontmatter = parseFrontMatter(raw);
      if (frontmatter.draft) return null;
      const slug = frontmatter.slug || row.filename.replace(/\.mdx$/, "");
      return `${origin}/blog/${slug}`;
    })
  );

  const projectUrls = projects.map((project) => `${origin}/projects/${project.slug}`);

  const staticUrls = [
    origin,
    `${origin}/projects`,
    `${origin}/blog`,
    `${origin}/about`,
    `${origin}/contact`,
  ];

  const urlset = [...staticUrls, ...projectUrls, ...blogUrls.filter(Boolean)]
    .map((url) => `\n  <url>\n    <loc>${url}</loc>\n  </url>`)
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}\n</urlset>`;

  return c.text(sitemap, 200, { "Content-Type": "application/xml; charset=utf-8" });
});

worker.get("/*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

worker.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

worker.notFound((c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default worker;
