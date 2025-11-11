  export function formatTitle(title: string): string {
  let cleaned = title.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  cleaned = cleaned.replace(/<[^>]+>/g, "");

  cleaned = cleaned.replace(/:[a-z_]+:/g, "");

  cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, "");

  cleaned = cleaned.replace(/\s+/g, " ").trim();

  const normalized = cleaned.replace(/[-_.]/g, " ").replace(/\s+/g, " ").trim();

  return normalized.replace(/\b\w/g, (match) => match.toUpperCase());
}
