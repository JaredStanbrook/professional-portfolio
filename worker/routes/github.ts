import { Hono } from "hono";
import { githubCache } from "../schema/githubCache";
import { and, eq, gt } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "../types";

export const githubRoute = new Hono<AppEnv>().get("/*", async (c) => {
  const path = c.req.path.replace(/^\/api\/github\//, "");
  const fullUrl = `https://api.github.com/repos/${path}`;
  const cacheKey = `github:${path}`;

  const cached = await c.var.db
    .select({ data: githubCache.data })
    .from(githubCache)
    .where(
      and(eq(githubCache.id, cacheKey), gt(githubCache.expiresAt, Math.floor(Date.now() / 1000)))
    )
    .limit(1)
    .then((res) => res[0]);

  if (cached) {
    return c.json({ data: JSON.parse(cached.data) });
  }
  console.log(fullUrl);
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Hono-App",
    };
    if (c.env.GITHUB_API_TOKEN) {
      headers.Authorization = `Bearer ${c.env.GITHUB_API_TOKEN}`;
    }

    const res = await fetch(fullUrl, { headers });

    const data = await res.json();

    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 60 * 60;

    await c.var.db
      .insert(githubCache)
      .values({
        id: cacheKey,
        owner: path.split("/")[0] ?? "unknown",
        repo: path.split("/")[1] ?? "unknown",
        data: JSON.stringify(data),
        expiresAt: expiry,
      })
      .onConflictDoUpdate({
        target: githubCache.id,
        set: {
          data: JSON.stringify(data),
          expiresAt: expiry,
        },
      });

    return c.json({ data });
  } catch (err) {
    console.error("GitHub proxy error:", err);
    throw new HTTPException(500, { message: "Failed to fetch GitHub data" });
  }
});
