import { Octokit } from "octokit";
import type { RepositoryInfo } from '@/contexts/RepositoryContext';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export async function FetchReadme(repoInfo: RepositoryInfo): Promise<string> {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.data.download_url) {
      const markdownResponse = await fetch(response.data.download_url);
      const markdownText = await markdownResponse.text();
      return markdownText;
    }

    if (response.data.content && response.data.encoding === "base64") {
      return atob(response.data.content.replace(/\n/g, ""));
    }

    throw new Error("Unable to fetch README content");
  } catch (error) {
    console.error("Error fetching README:", error);
    throw error;
  }
}