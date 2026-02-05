import { queryOptions } from "@tanstack/react-query";

export async function getGitHubData(
  owner: string,
  repo: string,
  ext: string
): Promise<unknown[]> {
  const res = await fetch(`/api/github/${owner}/${repo}/${ext}`);

  if (!res.ok) {
    throw new Error(`GitHub API fetch failed with status ${res.status}`);
  }

  const json = (await res.json()) as { data?: unknown };
  // Ensure the returned data is always an array
  return Array.isArray(json.data) ? (json.data as unknown[]) : [];
}

export const getGitHubCommitDataQueryOptions = (owner: string, repo: string) =>
  queryOptions({
    queryKey: ["github-commit-activity", owner, repo],
    queryFn: () => getGitHubData(owner, repo, "stats/commit_activity"),
    staleTime: 1000 * 60 * 5,
  });

export const getGitHubCodeFrequencyQueryOptions = (owner: string, repo: string) =>
  queryOptions({
    queryKey: ["github-code-frequency", owner, repo],
    queryFn: () => getGitHubData(owner, repo, "stats/code_frequency"),
    staleTime: 1000 * 60 * 5,
  });
export const getGitHubPunchCardQueryOptions = (owner: string, repo: string) =>
  queryOptions({
    queryKey: ["github-punch-card", owner, repo],
    queryFn: () => getGitHubData(owner, repo, "stats/punch_card"),
    staleTime: 1000 * 60 * 5,
  });
