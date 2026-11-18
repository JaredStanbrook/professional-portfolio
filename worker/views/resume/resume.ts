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
    "Cybersecurity-focused IT specialist with 6 years of hands-on experience in cybersecurity, web development, and systems troubleshooting. Passionate about applying secure coding principles, automation, and compliance-driven systems to real-world challenges. Proven success in team-based environments and client-facing roles.",

  skills: [
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
    "English",
    "Full-Stack",
  ],

  experience: [
    {
      title: "Floor Staff",
      meta: "The Guildford Hotel | Aug 2025 – Present",
      bullets: [
        "Serve food and drinks, clear tables, and take orders in a busy pub.",
        "Ring up sales on POS and handle cash/card payments.",
        "Keep the service area clean and restock during shifts.",
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
      title: "Web Developer",
      meta: "Envenge Group | Feb – Jun 2025",
      bullets: [
        "Developed a modular, accessible Django app for tracking obligations and compliance.",
        "Used Docker and VS Code dev container for consistent development.",
        "Implemented features for documentation, user roles, and workflow management.",
      ],
    },
    {
      title: "Help Desk Technician",
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
      note: "(Ongoing)",
      lines: ["Murdoch University | 2021 – Present"],
      labelled: [{ label: "Major", value: "Cyber Security & Forensics" }],
      dashed: ["Member: Murdoch IT Society | Programming Club"],
    },
    { title: "Mazenod College", suffix: " – Class of 2019" },
  ] satisfies EducationEntry[],

  projects: [
    {
      title: "Greenova",
      meta: "Envenge Group | Feb 2025 – Jun 2025",
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
