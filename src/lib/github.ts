import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export async function FetchReadme(): Promise<string> {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner: "happyhackingspace",
      repo: "awesome-hackathon",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    // Use download_url to get raw markdown
    if (response.data.download_url) {
      const markdownResponse = await fetch(response.data.download_url);
      const markdownText = await markdownResponse.text();
      return markdownText;
    }

    // Fallback: decode base64 content
    if (response.data.content && response.data.encoding === "base64") {
      return atob(response.data.content.replace(/\n/g, ""));
    }

    throw new Error("Unable to fetch README content");
  } catch (error) {
    console.error("Error fetching README:", error);
    throw error;
  }
}