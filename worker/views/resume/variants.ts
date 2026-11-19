// worker/views/resume/variants.ts
//
// Résumés tailored to a kind of job, listed at /admin/resumes for sending to
// employers. Each starts from the public résumé in ./data.ts and overrides
// only what changes, so a fix to a shared role lands in every variant:
//
//   { slug: "support", label: "L2 support", target: "…",
//     resume: { ...resume, profile: "…", skills: [...] } }
//
// `npm run resume` checks every variant still fits on one A4 page.

import { resume, type ResumeData } from "./data";

export interface ResumeVariant {
  /** The URL segment: /admin/resumes/<slug>. Also names the saved PDF. */
  slug: string;
  label: string;
  /** The kind of job it is for, shown on the admin list. */
  target: string;
  resume: ResumeData;
}

export const variants: ResumeVariant[] = [
  {
    slug: "automation",
    label: "IT automation / DevOps",
    target: "Junior automation, platform and DevOps roles. Same wording as the public résumé.",
    resume,
  },
];

export const findVariant = (slug: string) => variants.find((v) => v.slug === slug);
