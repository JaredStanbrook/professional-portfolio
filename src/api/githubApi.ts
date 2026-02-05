import { queryOptions } from "@tanstack/react-query";

export type GitHubCommitWeek = {
  week: number;
  total: number;
};

export type GitHubCodeFrequencyPoint = [number, number, number];

export type GitHubPunchCardPoint = [number, number, number];

async function getGitHubData<T>(
  owner: string,
  repo: string,
  ext: string,
): Promise<T[]> {
  const res = await fetch(`/api/github/${owner}/${repo}/${ext}`);

  if (!res.ok) {
    throw new Error(`GitHub API fetch failed with status ${res.status}`);
  }

  const json: unknown = await res.json();
  if (typeof json !== "object" || json === null || !("data" in json)) {
    return [];
  }

  const data = json.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

export const getGitHubCommitDataQueryOptions = (owner: string, repo: string) =>
  queryOptions({
    queryKey: ["github-commit-activity", owner, repo],
    queryFn: () =>
      getGitHubData<GitHubCommitWeek>(owner, repo, "stats/commit_activity"),
    staleTime: 1000 * 60 * 5,
  });

export const getGitHubCodeFrequencyQueryOptions = (
  owner: string,
  repo: string,
) =>
  queryOptions({
    queryKey: ["github-code-frequency", owner, repo],
    queryFn: () =>
      getGitHubData<GitHubCodeFrequencyPoint>(
        owner,
        repo,
        "stats/code_frequency",
      ),
    staleTime: 1000 * 60 * 5,
  });

export const getGitHubPunchCardQueryOptions = (owner: string, repo: string) =>
  queryOptions({
    queryKey: ["github-punch-card", owner, repo],
    queryFn: () =>
      getGitHubData<GitHubPunchCardPoint>(owner, repo, "stats/punch_card"),
    staleTime: 1000 * 60 * 5,
  });
