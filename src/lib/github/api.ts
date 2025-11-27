import type { RepositoryInfo } from "@/types";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

const README_ALTERNATIVES = ["README.md", "README", "readme.md", "Readme.md"];

export async function fetchReadme(
  repoInfo: RepositoryInfo | null | undefined
): Promise<string> {
  if (!repoInfo?.owner || !repoInfo?.repo) {
    throw new Error("Invalid repository info: owner and repo are required");
  }

  const branch = repoInfo.branch || "main";
  const baseUrl = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}`;

  for (const filename of README_ALTERNATIVES) {
    try {
      const response = await fetch(`${baseUrl}/${filename}`);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error("README file not found in repository");
}

export async function fetchBranches(
  repoInfo: RepositoryInfo | null | undefined
): Promise<string[]> {
  if (!repoInfo?.owner || !repoInfo?.repo) {
    return [repoInfo?.branch || "main"];
  }

  const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/branches`;

  try {
    const response = await fetch(apiUrl, {
      headers: getGitHubHeaders(),
    });

    if (!response.ok) {
      if (response.status === 403) {
        const remaining = response.headers.get("X-RateLimit-Remaining");
        if (remaining === "0") {
          console.warn("GitHub API rate limit exceeded");
        }
      }
      return [repoInfo.branch || "main"];
    }

    const data: { name: string }[] = await response.json();
    return Array.isArray(data)
      ? data.map((branch) => branch.name)
      : [repoInfo.branch || "main"];
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [repoInfo.branch || "main"];
  }
}

export async function fetchRepoStars(
  owner: string,
  repo: string
): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: getGitHubHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(
        "GitHub API Error:",
        response.status,
        response.statusText,
        errorData.message || ""
      );
      return null;
    }

    const data = await response.json();
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
    return null;
  }
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export async function checkGitHubRateLimit(): Promise<RateLimitInfo | null> {
  try {
    const response = await fetch("https://api.github.com/rate_limit", {
      headers: getGitHubHeaders(),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const core = data.resources.core;

    return {
      limit: core.limit,
      remaining: core.remaining,
      reset: new Date(core.reset * 1000),
    };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return null;
  }
}
