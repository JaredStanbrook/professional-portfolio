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
    target: "Junior automation, platform and DevOps roles.",
    resume: {
      ...resume,
      profile:
        "Service Desk Officer and Cyber Security & Forensics graduate looking for a junior IT automation or DevOps role. I build automation for my own team and run five live sites on a platform I built, where migrations and deploys run on every push. I use AI to draft code and check it with tests before it ships.",
      skills: [
        "Automation",
        "Python",
        "Bash",
        "Docker",
        "Git",
        "Linux",
        "Windows",
        "Networking",
        "Active Directory",
        "Cloudflare Workers",
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "Go",
        "Rust",
        "TypeScript",
        "C#/.NET",
        "Node.js",
        "React",
        "Django",
        "IT Support",
        "Troubleshooting",
        "AI-assisted development",
      ],
    },
  },
];

export const findVariant = (slug: string) => variants.find((v) => v.slug === slug);
