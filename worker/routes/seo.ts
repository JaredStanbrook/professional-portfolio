import { Hono } from "hono";

import type { AppEnv } from "@server/types";
import { robotsTxt, sitemapXml, type SitemapEntry } from "@server/lib/seo";
import { gatesWholeSite } from "@server/services/access-gate.service";
import { blogMetadata, filenameToSlug } from "@server/schema/blog.schema";

export const seoRoute = new Hono<AppEnv>();

/**
 * The pages a crawler should know about.
 *
 * Add a route here when you add a public page. Anything behind `requireUser`
 * does not belong — a crawler cannot reach it, and listing it just produces
 * redirects in Search Console.
 *
 * For content that lives in the database (published posts, public profiles),
 * query it in the handler below and concatenate. Keep the list under ~50,000
 * URLs; past that, sitemaps have to be split and indexed.
 */
const STATIC_ROUTES: SitemapEntry[] = [
  { loc: "/", changefreq: "weekly", priority: 1.0 },
  { loc: "/blog", changefreq: "weekly", priority: 0.8 },
  { loc: "/it-help-desk", changefreq: "yearly", priority: 0.5 },
  { loc: "/grade-calculator", changefreq: "yearly", priority: 0.5 },
];

seoRoute.get("/robots.txt", (c) =>
  // A locked site gets the same "disallow everything, no sitemap" answer as
  // staging: nothing behind the access gate should be crawled or listed.
  c.text(robotsTxt(c.var.app, gatesWholeSite(c.env) ? "locked" : c.env.ENVIRONMENT), 200, {
    // Crawlers re-fetch this often; a day of caching is plenty and keeps the
    // Worker off the critical path for something that rarely changes.
    "Cache-Control": "public, max-age=86400",
  }),
);

seoRoute.get("/sitemap.xml", async (c) => {
  // Listing the pages would hand out their names while the site is locked.
  if (gatesWholeSite(c.env)) return c.notFound();

  const entries: SitemapEntry[] = [...STATIC_ROUTES];

  // Every post is public, so every post is listed.
  const posts = await c.var.db
    .select({ filename: blogMetadata.filename, updatedAt: blogMetadata.updatedAt })
    .from(blogMetadata);
  entries.push(
    ...posts.map((p) => ({ loc: `/blog/${filenameToSlug(p.filename)}`, lastmod: p.updatedAt })),
  );

  return c.body(sitemapXml(entries, c.var.app), 200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  });
});
