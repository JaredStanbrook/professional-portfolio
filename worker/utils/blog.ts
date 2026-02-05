import { blogFrontmatterSchema } from "../schema/blogs.schema";

type Frontmatter = {
  title: string;
  slug?: string;
  summary?: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  publishedAt?: string;
  updatedAt?: string;
  readTime?: number;
  subject?: string;
};

const FRONTMATTER_REGEX = /^---\n([\s\S]+?)\n---/;

export function parseFrontMatter(content: string): Frontmatter {
  const match = content.match(FRONTMATTER_REGEX);
  const raw: Record<string, string> = {};

  if (match) {
    const lines = match[1].split("\n");
    for (const line of lines) {
      const [key, ...rest] = line.split(":");
      if (!key || rest.length === 0) continue;
      raw[key.trim()] = rest.join(":").trim();
    }
  }

  const tags = parseTags(raw.tags);
  const draft = parseBoolean(raw.draft);
  const featured = parseBoolean(raw.featured);
  const readTime = raw.readTime ? Number(raw.readTime) : undefined;

  const frontmatter = blogFrontmatterSchema.parse({
    title: raw.title?.replace(/^["']|["']$/g, "") || "Untitled",
    slug: raw.slug?.replace(/^["']|["']$/g, ""),
    summary: raw.summary?.replace(/^["']|["']$/g, ""),
    tags,
    draft,
    featured,
    publishedAt: raw.publishedAt?.replace(/^["']|["']$/g, ""),
    updatedAt: raw.updatedAt?.replace(/^["']|["']$/g, ""),
    readTime,
    subject: raw.subject?.replace(/^["']|["']$/g, ""),
  });

  return frontmatter;
}

export function stripFrontMatter(content: string) {
  return content.replace(FRONTMATTER_REGEX, "").trim();
}

export function getReadingTime(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getExcerpt(content: string, limit = 160) {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit).trim()}…`;
}

function parseTags(value?: string) {
  if (!value) return [];
  const cleaned = value.replace(/^\[/, "").replace(/]$/, "");
  return cleaned
    .split(/[,\n]/)
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function parseBoolean(value?: string) {
  if (!value) return false;
  return ["true", "yes", "1"].includes(value.toLowerCase());
}
