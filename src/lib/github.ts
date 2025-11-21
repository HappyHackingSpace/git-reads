import { type RepositoryInfo } from "@/types";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

export async function FetchReadme(
  repoInfo: RepositoryInfo | null | undefined
): Promise<string> {
  if (!repoInfo || !repoInfo.owner || !repoInfo.repo) {
    throw new Error(
      "Invalid repository info: owner, repo, and branch are required"
    );
  }

  try {
    const branch = repoInfo.branch || "main";
    const rawUrl = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/README.md`;

    const response = await fetch(rawUrl);

    if (!response.ok) {
      const alternatives = ["README", "readme.md", "Readme.md"];
      for (const alt of alternatives) {
        const altUrl = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/${alt}`;
        const altResponse = await fetch(altUrl);
        if (altResponse.ok) {
          return await altResponse.text();
        }
      }
      throw new Error(
        `Unable to fetch README: ${response.status} ${response.statusText}`
      );
    }

    return await response.text();
  } catch (error) {
    console.error("Error fetching README:", error);
    throw error;
  }
}

export async function FetchBranches(
  repoInfo: RepositoryInfo | null | undefined
): Promise<string[]> {
  if (!repoInfo || !repoInfo.owner || !repoInfo.repo) {
    return [repoInfo?.branch || "main"];
  }

  const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/branches`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: getGitHubHeaders(),
    });

    if (!response.ok) {
      if (response.status === 403) {
        const remaining = response.headers.get('X-RateLimit-Remaining');
        if (remaining === '0') {
          console.warn('GitHub API rate limit exceeded');
        }
      }
      return [repoInfo.branch || "main"];
    }

    const data: { name: string }[] = await response.json();
    return Array.isArray(data)
      ? data.map((branch) => branch.name)
      : [repoInfo.branch || "main"];
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [repoInfo.branch || "main"];
  }
}

export async function checkGitHubRateLimit(): Promise<{
  limit: number;
  remaining: number;
  reset: Date;
} | null> {
  try {
    const response = await fetch('https://api.github.com/rate_limit', {
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
    console.error('Error checking rate limit:', error);
    return null;
  }
}