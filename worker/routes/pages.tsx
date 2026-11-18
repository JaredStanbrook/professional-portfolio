// worker/routes/pages.tsx
//
// The public pages that are not the blog: /it-help-desk and the grade
// calculator. /about now lives on the home page.

import { Hono } from "hono";

import type { AppEnv } from "@server/types";
import type { Assessment } from "@server/lib/grades";
import { repoStat } from "@server/services/github.service";
import { GithubStats, HelpDeskPage } from "@views/pages/HelpDesk";
import { DEFAULT_ROWS, GradeCalculatorPage } from "@views/pages/GradeCalculator";

export const pagesRoute = new Hono<AppEnv>();

// The about page became the home page. Old links and search results land on
// it rather than on a 404.
pagesRoute.get("/about", (c) => c.redirect("/", 301));

pagesRoute.get("/it-help-desk", (c) =>
  c.render(<HelpDeskPage />, {
    title: "Student IT Service Desk",
    description:
      "What a semester on Murdoch University's student IT service desk looked like: certifications, the support log in numbers and the help desk app.",
  }),
);

/** Loaded after the page by HTMX, so a slow GitHub never holds up the render. */
pagesRoute.get("/it-help-desk/github", async (c) => {
  const data = (await repoStat(
    c.var.db,
    c.env.GITHUB_API_TOKEN,
    "JaredStanbrook",
    "it-service-desk",
    "stats/commit_activity",
  )) as { week: number; total: number }[] | null;

  const weeks = data
    ?.filter((w) => w.total > 0)
    .map((w) => ({
      label: new Date(w.week * 1000).toLocaleDateString(c.var.app.locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
      value: w.total,
    }));

  return c.html(<GithubStats weeks={weeks ?? null} />);
});

// ==========================================
// GRADE CALCULATOR
// ==========================================

const MAX_ROWS = 30;
const meta = {
  title: "Grade calculator",
  description:
    "Free grade calculator: enter your marks and weights to see your average so far and the mark you need on the remaining assessments to hit your target.",
};

pagesRoute.get("/grade-calculator", (c) =>
  c.render(<GradeCalculatorPage rows={DEFAULT_ROWS} expected="80" />, meta),
);

/**
 * Every change posts the whole form back. HTMX picks out the part it needs;
 * without JavaScript the browser shows the recalculated page.
 */
pagesRoute.post("/grade-calculator", async (c) => {
  const form = await c.req.parseBody({ all: true });
  const list = (k: string) => {
    const v = form[k];
    return (Array.isArray(v) ? v : v === undefined ? [] : [v]).map(String);
  };

  const marks = list("mark");
  let rows: Assessment[] = list("weight").map((weight, i) => ({ mark: marks[i] ?? "", weight }));

  // Not "remove": a control named that shadows the form element's own
  // remove() method, and HTMX's outerHTML swap then fails half-way.
  const remove = Number.parseInt(String(form.drop ?? ""), 10);
  if (Number.isInteger(remove) && rows.length > 1) rows = rows.filter((_, i) => i !== remove);
  if (form.add) rows.push({ mark: "", weight: "" });
  rows = rows.slice(0, MAX_ROWS);
  if (rows.length === 0) rows = [{ mark: "", weight: "" }];

  const expected = String(form.expected ?? "").slice(0, 8);
  return c.render(<GradeCalculatorPage rows={rows} expected={expected} />, {
    ...meta,
    noindex: true,
  });
});
