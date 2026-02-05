import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

const FRONTMATTER_REGEX = /^---\n([\s\S]+?)\n---/;
const LINK_REGEX = /\[[^\]]+\]\(([^)]+)\)/g;

async function main() {
  try {
    const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
    const mdxFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map((entry) => entry.name);

    if (mdxFiles.length === 0) {
      console.warn("No MDX files found in content/blog. Skipping blog metadata validation.");
      return;
    }

    const errors: string[] = [];

    for (const filename of mdxFiles) {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = await readFile(filePath, "utf-8");
      const match = raw.match(FRONTMATTER_REGEX);

      if (!match) {
        errors.push(`${filename}: Missing frontmatter block.`);
        continue;
      }

      const frontmatter = parseFrontmatter(match[1]);

      validateRequired(frontmatter, filename, errors);
      validateDates(frontmatter, filename, errors);
      validateLinks(raw, filename, errors);
    }

    if (errors.length > 0) {
      console.error("Blog metadata validation failed:\n" + errors.map((err) => `- ${err}`).join("\n"));
      process.exit(1);
    }

    console.log("Blog metadata validation passed.");
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      console.warn("content/blog directory not found. Skipping blog metadata validation.");
      return;
    }
    console.error("Blog metadata validation failed with an unexpected error:", error);
    process.exit(1);
  }
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function parseFrontmatter(block: string) {
  const data: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    data[key.trim()] = rest.join(":").trim();
  }
  return data;
}

function validateRequired(frontmatter: Record<string, string>, filename: string, errors: string[]) {
  const required = ["title", "slug", "publishedAt", "updatedAt", "summary", "tags", "readTime"];
  for (const field of required) {
    if (!frontmatter[field]) {
      errors.push(`${filename}: Missing required field '${field}'.`);
    }
  }
}

function validateDates(frontmatter: Record<string, string>, filename: string, errors: string[]) {
  ["publishedAt", "updatedAt"].forEach((field) => {
    const value = frontmatter[field];
    if (!value) return;
    const date = new Date(value.replace(/"/g, ""));
    if (Number.isNaN(date.getTime())) {
      errors.push(`${filename}: Invalid date value for '${field}'.`);
    }
  });
}

function validateLinks(content: string, filename: string, errors: string[]) {
  const matches = content.matchAll(LINK_REGEX);
  for (const match of matches) {
    const url = match[1];
    if (!url || url === "#") {
      errors.push(`${filename}: Found empty or placeholder link.`);
      continue;
    }
    if (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("mailto:")) {
      errors.push(`${filename}: Link '${url}' should be absolute, root-relative, or mailto.`);
    }
  }
}

void main();
