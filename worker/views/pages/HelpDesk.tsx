// worker/views/pages/HelpDesk.tsx
//
// The Murdoch University IT service desk placement: badges, the support log
// in numbers, and the help desk app's commit history from GitHub.
//
// Charts are plain HTML and SVG drawn with theme tokens, so they follow
// light and dark with no chart library on the page. Each bar carries its
// value in a native tooltip and every chart has a table behind a <details>.

import type { FC } from "hono/jsx";

interface Datum {
  label: string;
  value: number;
}

const dailyInteractions: Datum[] = [
  { label: "Aug 23", value: 1 },
  { label: "Aug 30", value: 10 },
  { label: "Sep 13", value: 12 },
  { label: "Sep 20", value: 5 },
  { label: "Oct 4", value: 5 },
  { label: "Oct 15", value: 1 },
  { label: "Oct 25", value: 6 },
  { label: "Nov 1", value: 1 },
];

const issueTypes: Datum[] = [
  { label: "SPSS / software access", value: 17 },
  { label: "Printing", value: 12 },
  { label: "Network / Wi-Fi", value: 5 },
  { label: "Files and documents", value: 4 },
  { label: "Other", value: 3 },
];

const supportModes: Datum[] = [
  { label: "Solo", value: 28 },
  { label: "Collaborative", value: 13 },
];

const badges = [
  {
    src: "https://images.credly.com/images/fc1352af-87fa-4947-ba54-398a0e63322e/security-compliance-and-identity-fundamentals-600x600.png",
    name: "SC-900",
    title: "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    url: "https://www.credly.com/users/jared-stanbrook",
  },
  {
    src: "/images/badge-azure-fundamentals.svg",
    name: "Azure Fundamentals",
    title: "Microsoft Azure Fundamentals: Describe cloud concepts",
    url: "https://learn.microsoft.com/api/achievements/share/en-us/JaredStanbrook-5821/B6LGLXND?sharingId=B519DFD4EAAE8B7D",
  },
  {
    src: "/images/badge-ms-900.svg",
    name: "MS-900",
    title: "MS-900 Microsoft 365 Fundamentals: Describe Microsoft 365 apps and services",
    url: "https://learn.microsoft.com/api/achievements/share/en-us/JaredStanbrook-5821/B6LGLXND?sharingId=B519DFD4EAAE8B7D",
  },
];

const Panel: FC<{ title: string; children: unknown; class?: string }> = (props) => (
  <section
    class={`rounded-lg border bg-card p-6 text-card-foreground shadow-sm ${props.class ?? ""}`}
  >
    <h2 class="mb-4 text-lg font-semibold">{props.title}</h2>
    {props.children}
  </section>
);

const DataTable: FC<{ rows: Datum[]; label: string; unit: string }> = ({ rows, label, unit }) => (
  <details class="mt-4 text-sm">
    <summary class="cursor-pointer text-muted-foreground hover:text-foreground">
      Show as a table
    </summary>
    <table class="mt-2 w-full text-left">
      <thead class="text-muted-foreground">
        <tr>
          <th class="py-1 font-medium">{label}</th>
          <th class="py-1 text-right font-medium">{unit}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr class="border-t">
            <td class="py-1">{r.label}</td>
            <td class="py-1 text-right tabular-nums">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </details>
);

/**
 * Vertical bars on a shared baseline, one series. The value sits above the
 * tallest bar only; the rest are in each bar's tooltip and the table.
 */
export const ColumnChart: FC<{ rows: Datum[]; name: string; height?: string }> = ({
  rows,
  name,
}) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <figure>
      <div
        class="flex h-48 items-end gap-[2px] border-b border-border"
        role="img"
        aria-label={`${name}: ${rows.map((r) => `${r.label} ${r.value}`).join(", ")}`}
      >
        {rows.map((r) => (
          <div
            class="group relative flex h-full flex-1 flex-col justify-end"
            title={`${r.label}: ${r.value}`}
          >
            {r.value === max && (
              <span class="mb-1 text-center text-xs tabular-nums text-muted-foreground">
                {r.value}
              </span>
            )}
            <div
              class="rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-80"
              style={`height:${(r.value / max) * 85}%`}
            ></div>
          </div>
        ))}
      </div>
      <figcaption class="mt-2 flex gap-[2px] text-[11px] text-muted-foreground">
        {rows.map((r, i) => (
          <span class="flex-1 truncate text-center">
            {rows.length > 12 && i % Math.ceil(rows.length / 6) !== 0 ? "" : r.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
};

/** Horizontal bars, labelled directly, for categories with long names. */
const BarList: FC<{ rows: Datum[] }> = ({ rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul class="grid gap-3">
      {rows.map((r) => (
        <li title={`${r.label}: ${r.value}`}>
          <div class="mb-1 flex justify-between text-sm">
            <span>{r.label}</span>
            <span class="tabular-nums text-muted-foreground">{r.value}</span>
          </div>
          <div class="h-2 rounded-full bg-muted">
            <div
              class="h-2 rounded-full bg-primary"
              style={`width:${(r.value / max) * 100}%`}
            ></div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export const HelpDeskPage: FC = () => {
  const total = dailyInteractions.reduce((n, d) => n + d.value, 0);
  const modeTotal = supportModes.reduce((n, d) => n + d.value, 0);
  const pct = (v: number) => `${((v / modeTotal) * 100).toFixed(0)}%`;

  return (
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <header class="mb-10 max-w-2xl">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary">Aug — Nov 2024</p>
        <h1 class="mt-2 text-4xl font-bold tracking-tight">Student IT Service Desk</h1>
        <p class="mt-4 text-muted-foreground">
          Workplace learning at Murdoch University: shifts in the library helping students with
          printing, software, connectivity and accounts, plus the small app I built to digitise the
          desk's client records and feedback forms.
        </p>
      </header>

      <div class="grid gap-6">
        <Panel title="Badges">
          <ul class="flex flex-wrap gap-6">
            {badges.map((b) => (
              <li class="w-28">
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={b.title}
                  class="block text-center text-sm no-underline hover:text-primary"
                >
                  <img
                    src={b.src}
                    alt={b.title}
                    width="80"
                    height="80"
                    loading="lazy"
                    class="mx-auto h-20 w-20 object-contain"
                  />
                  <span class="mt-2 block">{b.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Support interactions per shift">
          <div class="mb-4">
            <p class="text-4xl font-bold tabular-nums">{total}</p>
            <p class="text-sm text-muted-foreground">students helped over eight shifts</p>
          </div>
          <ColumnChart rows={dailyInteractions} name="Interactions per shift" />
          <DataTable rows={dailyInteractions} label="Shift" unit="Interactions" />
        </Panel>

        <div class="grid gap-6 md:grid-cols-2">
          <Panel title="Types of issue">
            <BarList rows={issueTypes} />
            <DataTable rows={issueTypes} label="Issue" unit="Count" />
          </Panel>

          <Panel title="Solo or collaborative">
            <div
              class="flex h-4 gap-[2px] overflow-hidden rounded-full"
              role="img"
              aria-label={supportModes.map((m) => `${m.label} ${pct(m.value)}`).join(", ")}
            >
              <div
                class="bg-primary"
                style={`width:${pct(supportModes[0].value)}`}
                title={`${supportModes[0].label}: ${supportModes[0].value}`}
              ></div>
              <div
                class="bg-muted-foreground/50"
                style={`width:${pct(supportModes[1].value)}`}
                title={`${supportModes[1].label}: ${supportModes[1].value}`}
              ></div>
            </div>
            <dl class="mt-6 grid grid-cols-2 gap-4">
              {supportModes.map((m, i) => (
                <div>
                  <dt class="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                      class={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/50"}`}
                      aria-hidden="true"
                    ></span>
                    {m.label}
                  </dt>
                  <dd class="text-3xl font-bold tabular-nums">{pct(m.value)}</dd>
                  <dd class="text-sm text-muted-foreground">{m.value} interactions</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <Panel title="The help desk app on GitHub">
          <p class="mb-4 text-sm text-muted-foreground">
            Weekly commits to{" "}
            <a
              href="https://github.com/JaredStanbrook/it-service-desk"
              class="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              it-service-desk
            </a>
            .
          </p>
          <div
            id="github-stats"
            hx-get="/it-help-desk/github"
            hx-trigger="load"
            hx-swap="innerHTML"
          >
            <p class="py-12 text-center text-sm text-muted-foreground">Loading commit history…</p>
          </div>
        </Panel>
      </div>
    </div>
  );
};

/** The lazily loaded GitHub panel body. */
export const GithubStats: FC<{ weeks: Datum[] | null }> = ({ weeks }) =>
  weeks && weeks.length > 0 ? (
    <>
      <ColumnChart rows={weeks} name="Commits per week" />
      <DataTable rows={weeks} label="Week" unit="Commits" />
    </>
  ) : (
    <p class="py-8 text-center text-sm text-muted-foreground">
      GitHub is still counting. Try again in a minute.
    </p>
  );
