import './DocumentContent.css'
import { DocumentMarkdown } from "./DocumentMarkdown";

export function DocumentContent({
  loading,
  error,
  markdown,
}: {
  loading: boolean;
  error: string | null;
  markdown: string;
}) {
  if (loading) {
    return <div className="document-loading">Loading...</div>;
  }
  if (error) {
    return <div className="document-error">Error: {error}</div>;
  }
  if (!markdown) {
    return <div className="document-empty">No content available.</div>;
  }
  return <DocumentMarkdown markdown={markdown} />;
}
