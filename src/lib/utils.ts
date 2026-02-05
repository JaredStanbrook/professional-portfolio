import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeBlogSlug(value: string) {
  return value.trim().replace(/\.mdx$/i, "");
}

export function blogFilenameFromSlug(value: string) {
  return `${normalizeBlogSlug(value)}.mdx`;
}
export async function getErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string; message?: string };
    if (typeof data.error === "string" && data.error.length > 0) {
      return data.error;
    }
    if (typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
    return "An unexpected error occurred";
  } catch {
    return `Request failed with status ${res.status}`;
  }
}
