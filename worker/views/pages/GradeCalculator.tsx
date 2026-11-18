// worker/views/pages/GradeCalculator.tsx
//
// Works with or without JavaScript: it is one form that posts to itself.
// `hx-boost="false"` because the page's boost would otherwise submit the form
// a second time alongside the Add / Remove buttons' own requests.
// With HTMX, typing refreshes only the results (so the focused input keeps
// its focus), while Add and Remove re-render the whole calculator.

import type { FC } from "hono/jsx";

import { gradeStats, type Assessment } from "@server/lib/grades";

export const DEFAULT_ROWS: Assessment[] = [
  { mark: "85", weight: "20" },
  { mark: "92", weight: "30" },
  { mark: "", weight: "25" },
  { mark: "", weight: "25" },
];

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring";

const Stat: FC<{ label: string; value: string; target?: boolean }> = ({ label, value, target }) => (
  <div
    class={`rounded-lg border p-4 ${target ? "border-primary/40 bg-primary/10" : "bg-muted/50"}`}
  >
    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    <p class={`mt-1 text-2xl font-bold tabular-nums ${target ? "text-primary" : ""}`}>{value}</p>
  </div>
);

export const GradeResult: FC<{ rows: Assessment[]; expected: string }> = ({ rows, expected }) => {
  const s = gradeStats(rows, expected);
  return (
    <div id="grade-result" class="grid gap-4" aria-live="polite">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Average so far" value={`${s.currentAverage.toFixed(2)}%`} />
        <Stat label="Marked weight" value={`${s.completedWeight.toFixed(1)}%`} />
        <Stat label="Weight to come" value={`${s.remainingWeight.toFixed(1)}%`} />
        <Stat label="Target" value={expected ? `${expected}%` : "—"} target />
      </div>
      <p class="rounded-lg bg-muted p-4 text-sm font-medium">{s.message}</p>
      {s.totalWeight !== 100 && s.totalWeight > 0 && (
        <p class="flex items-center gap-2 text-sm text-muted-foreground">
          <i data-lucide="info" class="h-4 w-4 shrink-0" aria-hidden="true"></i>
          Weights add up to {s.totalWeight}%, not 100%.
        </p>
      )}
    </div>
  );
};

export const GradeCalculator: FC<{ rows: Assessment[]; expected: string }> = ({
  rows,
  expected,
}) => (
  <form
    id="grade-calc"
    method="post"
    action="/grade-calculator"
    class="grid gap-6"
    hx-boost="false"
    hx-post="/grade-calculator"
    hx-trigger="input delay:300ms"
    hx-target="#grade-result"
    hx-select="#grade-result"
    hx-swap="outerHTML"
  >
    <GradeResult rows={rows} expected={expected} />

    <table class="w-full text-left text-sm">
      <caption class="caption-bottom pt-3 text-xs text-muted-foreground">
        Leave a mark blank if it has not been marked yet. Numbers 0 to 100.
      </caption>
      <thead class="text-muted-foreground">
        <tr>
          <th class="pb-2 pr-2 font-medium">Assessment</th>
          <th class="pb-2 pr-2 font-medium">Mark %</th>
          <th class="pb-2 pr-2 font-medium">Weight %</th>
          <th class="pb-2">
            <span class="sr-only">Remove</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr>
            <td class="py-1 pr-2 text-muted-foreground">{i + 1}</td>
            <td class="py-1 pr-2">
              <input
                name="mark"
                type="number"
                min="0"
                max="100"
                step="any"
                inputmode="decimal"
                value={row.mark}
                placeholder="—"
                aria-label={`Mark for assessment ${i + 1}`}
                class={inputClass}
              />
            </td>
            <td class="py-1 pr-2">
              <input
                name="weight"
                type="number"
                min="0"
                max="100"
                step="any"
                inputmode="decimal"
                value={row.weight}
                aria-label={`Weight of assessment ${i + 1}`}
                class={inputClass}
              />
            </td>
            <td class="py-1 text-right">
              <button
                type="submit"
                name="drop"
                value={String(i)}
                hx-post="/grade-calculator"
                hx-target="#grade-calc"
                hx-select="#grade-calc"
                hx-swap="outerHTML"
                disabled={rows.length <= 1}
                class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                title="Remove assessment"
              >
                <i data-lucide="trash-2" class="h-4 w-4" aria-hidden="true"></i>
                <span class="sr-only">Remove assessment {i + 1}</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div class="flex flex-wrap items-end justify-between gap-4">
      <button
        type="submit"
        name="add"
        value="1"
        hx-post="/grade-calculator"
        hx-target="#grade-calc"
        hx-select="#grade-calc"
        hx-swap="outerHTML"
        class="inline-flex h-11 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        <i data-lucide="plus" class="h-4 w-4" aria-hidden="true"></i> Add assessment
      </button>
      <div class="grid gap-2">
        <label for="expected" class="text-sm font-medium">
          Target final mark %
        </label>
        <input
          id="expected"
          name="expected"
          type="number"
          min="0"
          max="100"
          step="any"
          inputmode="decimal"
          value={expected}
          class={`${inputClass} w-40`}
        />
      </div>
    </div>
    <noscript>
      <button
        type="submit"
        class="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
      >
        Calculate
      </button>
    </noscript>
  </form>
);

export const GradeCalculatorPage: FC<{ rows: Assessment[]; expected: string }> = (props) => (
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
    <div class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
      <h1 class="text-3xl font-bold tracking-tight">Grade calculator</h1>
      <p class="mb-8 mt-2 text-sm text-muted-foreground">
        Work out the average you need on what is left to reach your target. Nothing is saved.
      </p>
      <GradeCalculator {...props} />
    </div>
  </div>
);
