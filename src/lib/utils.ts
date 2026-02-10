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

export type RelativeDateOptions = {
  fallback?: string;
  /** If true, uses shorter, punchier phrases */
  compact?: boolean;
  /** Override "now" for testing */
  now?: Date;
};

/**
 * Comedic relative date formatter.
 * Intentionally not “precise” — it’s vibe-based.
 */
export function formatRelativeDate(
  dateInput: string | Date | null | undefined,
  options: RelativeDateOptions = {},
) {
  const fallback = options.fallback ?? "Unknown";
  if (!dateInput) return fallback;

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return fallback;

  const now = options.now ?? new Date();
  const msPerDay = 1000 * 60 * 60 * 24;

  // Use "start of day" so time-of-day doesn’t flip “today/yesterday” unexpectedly.
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / msPerDay);
  const abs = Math.abs(diffDays);
  const compact = options.compact ?? false;

  const say = (long: string, short: string) => (compact ? short : long);

  // FUTURE
  if (diffDays < 0) {
    if (abs === 0) return say("today (somehow)", "today?");
    if (abs === 1) return say("tomorrow. probably.", "tomorrow");
    if (abs === 2) return say("in a couple days", "2d");
    if (abs <= 6) return say("later this week", "this wk");
    if (abs <= 13) return say("next week energy", "next wk");
    if (abs <= 21) return say("in a few weeks (we’ll see)", "few wks");
    if (abs <= 45) return say("next month-ish", "next mo");
    if (abs <= 90) return say("sometime soon™", "soon™");
    if (abs <= 180) return say("later this year (optimistic)", "later yr");
    if (abs <= 365) return say("sometime this year", "this yr");
    if (abs <= 730) return say("next year. maybe.", "next yr");
    return say("in the far future (please don’t hold me to this)", "far");
  }

  // PRESENT / PAST
  if (diffDays === 0) return say("today", "today");
  if (diffDays === 1) return say("yesterday", "y'day");
  if (diffDays === 2) return say("two days ago (time is fake)", "2d ago");
  if (diffDays <= 4) return say("a few days ago", "few d ago");
  if (diffDays <= 7) return say("last week-ish", "last wk ago");
  if (diffDays <= 10) return say("about a week ago", "wk ago");
  if (diffDays <= 14)
    return say("a fortnight ago (very Australian)", "2 wks ago");
  if (diffDays <= 21) return say("a couple weeks ago", "wks ago");
  if (diffDays <= 30) return say("earlier this month", "this month");
  if (diffDays <= 45)
    return say("a month ago, give or take a week", "1 month ago");
  if (diffDays <= 90) return say("a while back", "awhile ago");
  if (diffDays <= 180) return say("ages ago (but not actually)", "ages ago");
  if (diffDays <= 270) return say("some months ago", "months ago");
  if (diffDays <= 365) return say("last year-adjacent", "yr-ish ago");
  if (diffDays <= 730) return say("last year (time flies, huh)", "last yr");
  if (diffDays <= 1825) return say("a few years ago (vintage)", "yrs ago");
  return say("forever ago (archaeological)", "forever");
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
