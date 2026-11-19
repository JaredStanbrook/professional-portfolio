// worker/views/admin/Resumes.tsx — the list at /admin/resumes.

import type { FC } from "hono/jsx";

import type { ResumeVariant } from "@views/resume/variants";

export const ResumeListPage: FC<{ variants: ResumeVariant[]; hasPhone: boolean }> = ({
  variants,
  hasPhone,
}) => (
  <div class="mx-auto max-w-3xl space-y-8 p-4 py-8">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Résumés</h1>
      <p class="text-muted-foreground">
        One per kind of job. Open one, then use Download PDF and choose Save as PDF in the print
        dialog. These copies include your phone number; the public one at{" "}
        <a href="/resume" class="text-primary">
          /resume
        </a>{" "}
        does not.
      </p>
      {!hasPhone && (
        <p class="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
          RESUME_PHONE is not set, so these copies have no phone number. Add it as a Secret in the
          Cloudflare dashboard.
        </p>
      )}
    </div>

    <ul class="space-y-4">
      {variants.map((v) => (
        <li class="flex flex-col gap-4 rounded-lg border bg-card p-5 text-card-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold">{v.label}</h2>
            <p class="text-sm text-muted-foreground">{v.target}</p>
          </div>
          <a
            href={`/admin/resumes/${v.slug}`}
            target="_blank"
            rel="noopener"
            class="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-5 font-medium text-primary-foreground no-underline hover:bg-primary/90"
          >
            Open
          </a>
        </li>
      ))}
    </ul>
  </div>
);
