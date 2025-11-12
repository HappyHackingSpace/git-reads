import "./DocumentMarkdown.css";
import remarkEmoji from "remark-emoji";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { createHeadingComponent } from "@/utils/createHeadingComponent";
import { useRepository } from "@/hooks/useRepository";

export function DocumentMarkdown({ markdown }: { markdown: string }) {
  const { repositoryInfo } = useRepository();

  const processedMarkdown = markdown.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    (_match: string, alt: string, src: string) => {
      const altText = (alt || "").trim();
      const relSrc = (src || "").trim();
      if (!relSrc) return `![${altText}](${relSrc})`;
      const branch = repositoryInfo.branch || "main";
      const cleanSrc = relSrc.replace(/^\/+/, "");
      const fullUrl = `https://raw.githubusercontent.com/${repositoryInfo.owner}/${repositoryInfo.repo}/${branch}/${cleanSrc}`;

      return `![${altText}](${fullUrl})`;
    }
  );

  return (
    <div className="document-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkEmoji, remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src, alt, ...props }) => {
            if (src && !src.startsWith("http") && !src.startsWith("//")) {
              const branch = repositoryInfo.branch || "main";
              const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
              const githubRawUrl = `https://raw.githubusercontent.com/${repositoryInfo.owner}/${repositoryInfo.repo}/${branch}/${cleanSrc}`;
              return <img src={githubRawUrl} alt={alt} {...props} />;
            }
            return <img src={src} alt={alt} {...props} />;
          },
          a: ({ href, children, ...props }) => {
            if (
              href &&
              !href.startsWith("http") &&
              !href.startsWith("#") &&
              !href.startsWith("//")
            ) {
              const branch = repositoryInfo.branch || "main";
              const cleanHref = href.startsWith("/") ? href.slice(1) : href;
              const githubUrl = `https://github.com/${repositoryInfo.owner}/${repositoryInfo.repo}/blob/${branch}/${cleanHref}`;
              return (
                <a href={githubUrl} rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              );
            }
            return (
              <a href={href} {...props}>
                {children}
              </a>
            );
          },
          h1: createHeadingComponent("h1"),
          h2: createHeadingComponent("h2"),
          h3: createHeadingComponent("h3"),
          h4: createHeadingComponent("h4"),
          h5: createHeadingComponent("h5"),
          h6: createHeadingComponent("h6"),
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
}
