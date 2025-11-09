import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import type { TOCItem } from "../../lib/parser";
import { FetchReadme } from "../../lib/github";
import { parseTOC } from "../../lib/parser";
import "./Document.css";

function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function createHeadingComponent(tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ ...props }: any) => {
    const text = String(props.children);
    const id = generateHeadingId(text);
    const HeadingTag = tag;
    return <HeadingTag id={id} {...props} />;
  };
}

export default function Document() {
  const [markdown, setMarkdown] = useState<string>("");
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndParse() {
      setLoading(true);
      setError(null);
      try {
        const markdownContent = await FetchReadme();
        setMarkdown(markdownContent);
        const tocItems = parseTOC(markdownContent);
        setToc(tocItems);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchAndParse();
  }, []);

  return (
    <div className="document-wrapper">
      <div className="document-container">
      <header className="document-header">
        <h1 className="document-title">
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Awesome Hackathon</a>
        </h1>
      </header>
      <aside className="document-sidebar">
        <nav className="document-toc">
          <h2 className="document-toc-title">Table of Contents</h2>
          <ul className="document-toc-list">
            {toc.map((item, index) => (
              <li
                key={index}
                className={`document-toc-item document-toc-level-${item.level}`}
              >
                <a href={`#${item.id}`} className="document-toc-link">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="document-content">
        {loading ? (
          <div className="document-loading">Loading...</div>
        ) : error ? (
          <div className="document-error">Error: {error}</div>
        ) : !markdown ? (
          <div className="document-empty">No content available.</div>
        ) : (
          <div className="document-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkEmoji]}
              components={{
                img: ({ src, alt, ...props }) => {
                  if (src && !src.startsWith('http') && !src.startsWith('//')) {
                    const githubRawUrl = `https://raw.githubusercontent.com/HappyHackingSpace/awesome-hackathon/main/${src}`;
                    return <img src={githubRawUrl} alt={alt} {...props} />;
                  }
                  return <img src={src} alt={alt} {...props} />;
                },
                h1: createHeadingComponent('h1'),
                h2: createHeadingComponent('h2'),
                h3: createHeadingComponent('h3'),
                h4: createHeadingComponent('h4'),
                h5: createHeadingComponent('h5'),
                h6: createHeadingComponent('h6'),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
