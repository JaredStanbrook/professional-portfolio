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

type RelativeDateOptions = {
  fallback?: string;
};

export function formatRelativeDate(
  dateInput: string | Date | null | undefined,
  options: RelativeDateOptions = {},
) {
  const fallback = options.fallback ?? "Unknown";
  if (!dateInput) return fallback;

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return fallback;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const futureDays = Math.abs(diffDays);
    if (futureDays <= 2) return "in a couple days";
    if (futureDays <= 7) return "next week";
    if (futureDays <= 30) return "later this month";
    if (futureDays <= 365) return "later this year";
    return "in the future";
  }

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays <= 3) return "a couple days ago";
  if (diffDays <= 10) return "last week";
  if (diffDays <= 90) return "a while back";
  if (diffDays <= 730) return "last year";
  return "forever ago";
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
