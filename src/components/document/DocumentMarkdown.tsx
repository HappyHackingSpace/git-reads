import remarkEmoji from "remark-emoji";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useRepository } from "@/hooks/useRepository";
import { sanitizePath, isValidGitHubIdentifier } from "@/utils/markdownSecurity";
import { createMarkdownComponents } from "./markdownComponents";

export function DocumentMarkdown({ markdown }: { markdown: string }) {
  const { repositoryInfo } = useRepository();

  if (!repositoryInfo?.owner || !repositoryInfo?.repo) {
    return (
      <div className="text-destructive p-4">
        Invalid repository information
      </div>
    );
  }

  const processedMarkdown = markdown.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    (_match: string, alt: string, src: string) => {
      const altText = (alt || "").trim();
      const relSrc = (src || "").trim();
      if (!relSrc) return `![${altText}]()`;
      const cleanSrc = sanitizePath(relSrc);
      if (!cleanSrc) return `![${altText}]()`;
      const owner = isValidGitHubIdentifier(repositoryInfo.owner)
        ? repositoryInfo.owner
        : null;
      const repo = isValidGitHubIdentifier(repositoryInfo.repo)
        ? repositoryInfo.repo
        : null;
      const branch = isValidGitHubIdentifier(repositoryInfo.branch)
        ? repositoryInfo.branch || "main"
        : "main";
      if (!owner || !repo) return `![${altText}]()`;
      const fullUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanSrc}`;
      return `![${altText}](${fullUrl})`;
    }
  );

  const components = createMarkdownComponents({ repositoryInfo });

  return (
    <div className="document-markdown w-full max-w-4xl mx-auto px-2 sm:px-4 [&>h1:first-child]:mt-0 [&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0 [&>h4:first-child]:mt-0 [&>h5:first-child]:mt-0 [&>h6:first-child]:mt-0">
      <ReactMarkdown
        remarkPlugins={[remarkEmoji, remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
}
