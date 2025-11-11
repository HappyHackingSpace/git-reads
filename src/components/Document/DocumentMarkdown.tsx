
import './DocumentMarkdown.css'
import remarkEmoji from "remark-emoji";
import ReactMarkdown from "react-markdown";
import { createHeadingComponent } from "@/utils/createHeadingComponent";


export function DocumentMarkdown({ markdown }: { markdown: string }) {
    return (
      <div className="document-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkEmoji]}
          components={{
            img: ({ src, alt, ...props }) => {
              if (
                src &&
                !src.startsWith("http") &&
                !src.startsWith("//")
              ) {
                const githubRawUrl = `https://raw.githubusercontent.com/HappyHackingSpace/awesome-hackathon/main/${src}`;
                return <img src={githubRawUrl} alt={alt} {...props} />;
              }
              return <img src={src} alt={alt} {...props} />;
            },
            h1: createHeadingComponent("h1"),
            h2: createHeadingComponent("h2"),
            h3: createHeadingComponent("h3"),
            h4: createHeadingComponent("h4"),
            h5: createHeadingComponent("h5"),
            h6: createHeadingComponent("h6"),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    );
  }