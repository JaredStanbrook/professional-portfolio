// worker/views/resume/data.ts
//
// The public résumé, as data. The page at /resume renders it, and
// `npm run resume` prints that page to public/resume.pdf, the file the site
// links to. Job-specific versions build on it in ./variants.ts.
//
// The repository is public, so everything here is too. The phone number is
// the RESUME_PHONE secret, added only to the admin copies.
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
  /** Right-hand side, e.g. "Enveng Group | Feb – May 2025". */
  meta: string;
  bullets: string[];
}

export interface EducationEntry {
  /** Bold, e.g. "Bachelor of Information Technology". */
  title: string;
  /** Italic, after the title, e.g. "(Ongoing)". */
  note?: string;
  /** Plain, after the title, e.g. ", Class of 2019". */
  suffix?: string;
  /** Plain lines under the title. */
  lines?: string[];
  /** A bold label and its value, e.g. Major: Cyber Security & Forensics. */
  labelled?: { label: string; value: string }[];
  /** Indented lines starting with a dash. */
  dashed?: string[];
}

export interface ResumeData {
  name: string;
  location: string;
  contact: ContactItem[];
  profile: string;
  skills: string[];
  experience: ResumeEntry[];
  certificates: { name: string; detail: string }[];
  education: EducationEntry[];
  projects: ResumeEntry[];
  references: string;
}

export const resume: ResumeData = {
  name: "Jared Stanbrook",
  location: "Perth, Western Australia",
  contact: [
    { text: "jared.stanbrook@proton.me", href: "mailto:jared.stanbrook@proton.me" },
    { text: "GitHub", href: "https://github.com/JaredStanbrook" },
    { text: "Portfolio", href: "https://jared.stanbrook.me/" },
  ] satisfies ContactItem[],

  profile:
    "Service Desk Officer and Cyber Security & Forensics graduate. I support people day to day, led a six-person team through a university capstone, and build software in my own time, including a launcher my team uses and five live websites. Open to IT support, systems, automation and security roles.",

  skills: [
    "IT Support",
    "Troubleshooting",
    "Active Directory",
    "Windows",
    "Linux",
    "Networking",
    "Automation",
    "Bash",
    "Python",
    "Docker",
    "Git",
    "TypeScript",
    "Go",
    "Rust",
    "C#/.NET",
    "React",
    "Node.js",
    "Django",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "Cloudflare Workers",
    "AI-assisted development",
  ],

  experience: [
    {
      title: "Service Desk Officer",
      meta: "Bunnings | Jan 2026 – Present",
      bullets: [
        "Provide first-line IT support to team members, logging, prioritising and resolving incidents and requests.",
        "Troubleshoot hardware, software, account access and connectivity issues, escalating with clear notes.",
        "Built a desktop launcher (C#, .NET, WinUI) used by 20+ staff, saving each ~6 min a day.",
      ],
    },
    {
      title: "Project Activity Coordinator, Port Scan Delta Reporter",
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
        "Handled 41 support interactions over eight shifts, 68% solo, mostly software access, printing and Wi-Fi.",
        "Built a small app to digitise the desk's client records and feedback forms.",
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
    { title: "Mazenod College", suffix: ", Class of 2019" },
  ] satisfies EducationEntry[],

  projects: [
    {
      title: "Zipr: Shared Desktop Shortcuts",
      meta: "Personal project | 2026",
      bullets: [
        "Offline-first desktop client in Rust and Tauri that runs task shortcuts locally and syncs them for a team.",
        "Go API over multi-tenant PostgreSQL with row-level security, OAuth2 sign-in and contract-tested routes.",
      ],
    },
    {
      title: "Sheoak Tree Smart Monitor",
      meta: "Personal project",
      bullets: [
        "Raspberry Pi sensor dashboard with live streaming updates, built with Flask and SQLAlchemy.",
        "Privacy-first presence detection on the local network using ARP, mDNS and SNMP.",
      ],
    },
    {
      title: "Frugal: Cloudflare Workers Platform",
      meta: "Personal project | 2026",
      bullets: [
        "Reusable web platform with passkey, TOTP and password sign-in, account lockout and role-based access.",
        "Runs five live sites, including a booking system for a local business; migrations and deploys run on every push.",
      ],
    },
  ] satisfies ResumeEntry[],

  references: "+ Available upon request",
};

/** A copy with the phone number after the email, for copies sent directly. */
export const withPhone = (r: ResumeData, phone?: string): ResumeData =>
  phone ? { ...r, contact: [r.contact[0], { text: phone }, ...r.contact.slice(1)] } : r;
