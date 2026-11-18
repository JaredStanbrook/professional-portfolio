// worker/views/resume/resume.ts
//
// The résumé, as data. This is the file to change when the résumé changes:
// the page at /resume renders it, and `npm run resume` prints that page to
// public/resume.pdf, the file the site links to.
//
// Keep it to one A4 page. `npm run resume` stops with an error if it runs
// onto a second, rather than quietly shipping a two-page PDF.

export interface ContactItem {
  text: string;
  href?: string;
}

/** A role or a project: bold title left, where and when right, then bullets. */
export interface ResumeEntry {
  title: string;
  /** Right-hand side, e.g. "Envenge Group | Feb – Jun 2025". */
  meta: string;
  bullets: string[];
}

export interface EducationEntry {
  /** Bold, e.g. "Bachelor of Information Technology". */
  title: string;
  /** Italic, after the title, e.g. "(Ongoing)". */
  note?: string;
  /** Plain, after the title, e.g. " – Class of 2019". */
  suffix?: string;
  /** Plain lines under the title. */
  lines?: string[];
  /** A bold label and its value, e.g. Major: Cyber Security & Forensics. */
  labelled?: { label: string; value: string }[];
  /** Indented lines starting with a dash. */
  dashed?: string[];
}

export const resume = {
  name: "Jared Stanbrook",
  location: "Perth, Western Australia",
  contact: [
    { text: "jared.stanbrook@proton.me", href: "mailto:jared.stanbrook@proton.me" },
    { text: "(+61) 418 407 644" },
    { text: "GitHub", href: "https://github.com/JaredStanbrook" },
    { text: "Portfolio", href: "https://jared.stanbrook.me/" },
  ] satisfies ContactItem[],

  profile:
    "Service desk professional and Cyber Security & Forensics graduate, currently a Service Desk Officer at Bunnings. Hands-on experience across Tier 1 support, troubleshooting, web development and network security projects, with a focus on secure, well-documented systems. Proven success in team-based and client-facing roles.",

  skills: [
    "IT Support",
    "Troubleshooting",
    "Networking",
    "Python",
    "TypeScript",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "Django",
    "C++",
    "C#",
    "Docker",
    "Linux",
    "Bash",
    "MongoDB",
    "MySQL",
    "SQLite",
    "HTML",
    "CSS",
    "Git",
    "Bun.js",
    "Full-Stack",
  ],

  experience: [
    {
      title: "Service Desk Officer",
      meta: "Bunnings | Jan 2026 – Present",
      // Drafted, not from Jared: LinkedIn lists no duties for this role yet.
      // Replace with his own when he sends them.
      bullets: [
        "Provide first-line IT support to team members, logging, prioritising and resolving incidents and requests.",
        "Troubleshoot hardware, software, account access and connectivity issues, escalating with clear notes.",
        "Follow service desk processes to meet response targets and keep support documentation accurate.",
      ],
    },
    {
      title: "Project Activity Coordinator – Port Scan Delta Reporter",
      meta: "Capstone Project, Murdoch University | Jul – Dec 2025",
      bullets: [
        "Led a 6-member team to deliver a staff-facing network security tool.",
        "Managed full lifecycle: planning, architecture, documentation, and deadline delivery.",
      ],
    },
    {
      title: "Web Developer (Internship)",
      meta: "Enveng Group | Feb – May 2025",
      bullets: [
        "Developed a modular, accessible Django app for tracking obligations and compliance.",
        "Used Docker and VS Code dev container for consistent development.",
        "Implemented features for documentation, user roles, and workflow management.",
      ],
    },
    {
      title: "Help Desk Technician (Internship)",
      meta: "Murdoch University IT Service Desk | Aug – Nov 2024",
      bullets: [
        "Tier 1 support to students across hardware/software, networking, and system access.",
        "Developed strong customer service and communication skills.",
        "Troubleshot and resolved a range of technical problems under pressure.",
      ],
    },
  ] satisfies ResumeEntry[],

  certificates: [
    { name: "Microsoft SC-900", detail: "Security, Compliance, and Identity Fundamentals" },
  ],

  education: [
    {
      title: "Bachelor of Information Technology",
      lines: ["Murdoch University | 2021 – 2025"],
      labelled: [{ label: "Major", value: "Cyber Security & Forensics" }],
      dashed: ["Member: Murdoch IT Society | Programming Club"],
    },
    { title: "Mazenod College", suffix: " – Class of 2019" },
  ] satisfies EducationEntry[],

  projects: [
    {
      title: "Greenova",
      meta: "Enveng Group | Feb 2025 – May 2025",
      bullets: [
        "Developed features supporting access control, document management, and team collaboration.",
        "Used Docker containers and CI tools to ensure reproducible, secure deployments.",
      ],
    },
    {
      title: "Student Web Portal",
      meta: "Murdoch University | 2024",
      bullets: [
        "Implemented TypeScript-based static site integrated with Cloudflare D1 for secure data logging.",
        "Enhanced IT team workflow and secure handling of customer interaction records.",
      ],
    },
  ] satisfies ResumeEntry[],

  references: "+ Available upon request",
};
