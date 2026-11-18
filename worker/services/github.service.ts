// worker/services/github.service.ts
//
// Read-through cache in front of GitHub's repo statistics. Only the fixed
// set of stats below can be fetched: the old app proxied any path under
// /api/github/*, which let anyone spend this site's token on any repo.

import { and, eq, gt } from "drizzle-orm";

import type { AppEnv } from "@server/types";
import { githubCache } from "@server/schema/github.schema";

type Db = AppEnv["Variables"]["db"];

export type RepoStat = "stats/commit_activity" | "stats/code_frequency";

const TTL_SECONDS = 60 * 60;

/**
 * The stat as JSON, or null when GitHub has nothing yet. GitHub answers 202
 * while it computes stats for the first time; that is not cached, so the next
 * visit asks again.
 */
export async function repoStat(
  db: Db,
  token: string | undefined,
  owner: string,
  repo: string,
  stat: RepoStat,
): Promise<unknown | null> {
  const id = `github:${owner}/${repo}/${stat}`;
  const now = Math.floor(Date.now() / 1000);

  const [cached] = await db
    .select({ data: githubCache.data })
    .from(githubCache)
    .where(and(eq(githubCache.id, id), gt(githubCache.expiresAt, now)))
    .limit(1);
  if (cached) return JSON.parse(cached.data);

  let res: Response;
  try {
    res = await fetch(`https://api.github.com/repos/${owner}/${repo}/${stat}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-site",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.error("GitHub fetch failed", err);
    return null;
  }
  if (res.status !== 200) return null;

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const row = { data: JSON.stringify(data), expiresAt: now + TTL_SECONDS };
  await db
    .insert(githubCache)
    .values({ id, owner, repo, ...row })
    .onConflictDoUpdate({ target: githubCache.id, set: row });
  return data;
}
