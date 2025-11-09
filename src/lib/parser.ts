// Parser to process README content fetched from GitHub API
// This code processes the base64 README from GitHub, decodes it, and parses out headings (title/sections) and their descriptions.

export interface ReadmeSection {
  heading: string;
  description: string;
}

export interface TOCItem {
  level: number;
  text: string;
  id: string;
}

/**
 * Decodes GitHub README base64 response and parses it into sections (heading + description)
 * @param readmeResponseData: { content: string, encoding: string }
 * @returns Array of headings and their corresponding descriptions
 */
export function parseReadmeSections(
  readmeResponseData: { content?: string; encoding?: string }
): ReadmeSection[] {
  if (!readmeResponseData || !readmeResponseData.content) {
    return [];
  }

  let decodedContent = "";
  try {
    if (readmeResponseData.encoding === "base64") {
      decodedContent = atob(readmeResponseData.content.replace(/\n/g, ""));
    } else {
      decodedContent = readmeResponseData.content;
    }
  } catch (error) {
    console.error("Error decoding README content:", error);
    return [];
  }

  // Split by lines
  const lines = decodedContent.split(/\r?\n/);

  const sections: ReadmeSection[] = [];
  let currentHeading = "";
  let currentDescriptionLines: string[] = [];

  for (const line of lines) {
    const headingMatch = /^#{1,6}\s+(.*)/.exec(line);
    if (headingMatch) {
      // Save the previous section if exists
      if (currentHeading || currentDescriptionLines.length > 0) {
        sections.push({
          heading: currentHeading,
          description: currentDescriptionLines.join("\n").trim(),
        });
      }
      // Start a new section
      currentHeading = headingMatch[1].trim();
      currentDescriptionLines = [];
    } else {
      currentDescriptionLines.push(line);
    }
  }
  // Push the final section
  if (currentHeading || currentDescriptionLines.some(line => line.trim() !== "")) {
    sections.push({
      heading: currentHeading,
      description: currentDescriptionLines.join("\n").trim(),
    });
  }

  // Remove empty sections that may come at the very top
  return sections.filter(
    (section) => section.heading !== "" || section.description !== ""
  );
}

/**
 * Parses markdown content to extract Table of Contents (headings)
 * @param markdown: string - Raw markdown content
 * @returns Array of TOC items with level, text, and id
 */
export function parseTOC(markdown: string): TOCItem[] {
  if (!markdown) {
    return [];
  }

  const lines = markdown.split(/\r?\n/);
  const toc: TOCItem[] = [];

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      
      // Generate ID from heading text
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();

      toc.push({ level, text, id });
    }
  }

  return toc;
}

