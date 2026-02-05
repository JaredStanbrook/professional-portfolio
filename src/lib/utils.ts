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
    const data: unknown = await res.json();
    if (typeof data === "object" && data !== null) {
      const error = "error" in data ? data.error : undefined;
      const message = "message" in data ? data.message : undefined;

      if (typeof error === "string" && error.length > 0) {
        return error;
      }
      if (typeof message === "string" && message.length > 0) {
        return message;
      }
    }
    return "An unexpected error occurred";
  } catch {
    return `Request failed with status ${res.status}`;
  }
}
