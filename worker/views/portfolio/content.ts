// worker/views/portfolio/content.ts
//
// Everything the portfolio says about Jared, as data. Editing a role, a
// project or a link means editing this file and nothing else.

export const person = {
  name: "Jared Stanbrook",
  role: "Service Desk Officer",
  location: "Perth, Western Australia",
  email: "jared.stanbrook@proton.me",
  /** Built from worker/views/resume/data.ts by `npm run resume`. */
  resume: "/resume.pdf",
  /** The line under the name on the home page. */
  summary:
    "I like building automation and AI tools that give people their time back. Day to day I'm on a service desk, helping people get unstuck.",
  about: [
    "I care most about helping people and making things I'm proud of. Right now that's a service desk job at Bunnings, a finished Bachelor of IT at Murdoch University (Cyber Security & Forensics), and a pile of side projects about automation and AI.",
    "Most of what I build starts with a job someone keeps doing by hand: a launcher so the team's tools are one search away, a monitor that learns the patterns in a sharehouse's sensors, shortcuts you can build yourself or ask an AI to help build, then check and run on your own machine. I like automation that keeps a person in charge.",
    "I'm looking for a team I can believe in: a company or project with strong values that wants to see people succeed, where I can learn from the people around me and help the next person along too. Out of habit I build things to be secure by default, documented and easy to support, because on the service desk I'm the one who gets the call when they aren't.",
  ],
};

export const socials = [
  {
    name: "GitHub",
    href: "https://github.com/JaredStanbrook",
    viewBox: "0 0 16 16",
    path: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jaredstanbrook/",
    viewBox: "0 0 24 24",
    path: "M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@JaredStanbrook",
    viewBox: "0 0 310 310",
    path: "M297.917,64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359,0-61.369,5.776-72.517,19.938 C0,79.663,0,100.008,0,128.166v53.669c0,54.551,12.896,82.248,83.386,82.248h143.226c34.216,0,53.176-4.788,65.442-16.527 C304.633,235.518,310,215.863,310,181.835v-53.669C310,98.471,309.159,78.006,297.917,64.645z M199.021,162.41l-65.038,33.991 c-1.454,0.76-3.044,1.137-4.632,1.137c-1.798,0-3.592-0.484-5.181-1.446c-2.992-1.813-4.819-5.056-4.819-8.554v-67.764 c0-3.492,1.822-6.732,4.808-8.546c2.987-1.814,6.702-1.938,9.801-0.328l65.038,33.772c3.309,1.718,5.387,5.134,5.392,8.861 C204.394,157.263,202.325,160.684,199.021,162.41z",
  },
];

export interface Project {
  title: string;
  /** What it is, in a few words, shown beside the title. */
  kind: string;
  /** Where the title links: the live site, or the repository if public. */
  href?: string;
  body: string;
  stack: string[];
  image?: string;
}

// Private repositories are described, never linked: no repository URL, no
// internal names, nothing from their docs beyond what the product does.
export const projects: Project[] = [
  {
    title: "Zipr",
    kind: "Automation with AI in the loop, in private development",
    body: "Turns the things you do over and over into shortcuts that run on your own computer, and lets a team share, version and sync them. You can build one yourself or ask an AI assistant to, then check it and test it on the real machine before it runs. A Rust and Tauri desktop client that works offline, and a Go API over multi-tenant PostgreSQL with row-level security, OAuth2 sign-in and a contract-tested REST interface.",
    stack: ["Rust", "Tauri", "React", "Go", "PostgreSQL", "Redis", "OAuth2", "Docker"],
  },
  {
    title: "Service desk launcher",
    kind: "Automation for my team",
    body: "A tray app with a quick-search overlay that puts the team's approved tools, links and workflows one keystroke away, so nobody hunts through bookmarks. Catalogues are plain files, usage is logged locally, and privileged actions sit behind admin-only panels.",
    stack: ["C#", ".NET", "WinUI 3", "xUnit"],
  },
  {
    title: "Port Scanner Delta Reporter",
    kind: "Network security, capstone project",
    href: "https://github.com/TeamFixIT/portscan-delta-reporter",
    body: "Scheduled port scans across many hosts that report only what changed since the last run, with CSV exports and a dashboard for tracking exposure. I coordinated the six-person team that built it for Murdoch University.",
    stack: ["Python", "Flask", "SQLAlchemy", "Nmap"],
    image: "https://stanbrook.me/portscan-delta-reporter-preview.png",
  },
  {
    title: "Sheoak Tree Smart Monitor",
    kind: "Sensors and machine learning on a Raspberry Pi",
    href: "https://github.com/JaredStanbrook/sheoak-tree",
    body: "Live sensor and relay state for a sharehouse, streamed to a dashboard. Presence is worked out on the local network over ARP, mDNS and SNMP rather than GPS, and a pipeline trains models on the event history to spot patterns. A mock hardware mode makes it demoable anywhere.",
    stack: ["Python", "Flask", "SQLAlchemy", "Server-sent events", "scikit-learn", "Raspberry Pi"],
    image: "https://stanbrook.me/sensor-monitor-preview.png",
  },
  {
    title: "Window Layout",
    kind: "Automating the daily setup",
    href: "https://github.com/JaredStanbrook/win-remember-me",
    body: "Saves and restores a Windows workspace: window positions and snapped layouts, relaunching closed apps and reopening Edge tabs. Ships as an offline install bundle for machines without internet access.",
    stack: ["Python", "pywin32", "PySide6", "Windows"],
  },
  {
    title: "Frugal",
    kind: "Starter I build with an AI assistant, runs this site",
    href: "https://github.com/JaredStanbrook/frug-template",
    body: "The platform layer behind this site and four others, set up so an AI assistant can build on it safely: passkey, TOTP and password sign-in with lockout, roles and permissions, an audit log, and database migrations that deploy on every push.",
    stack: ["TypeScript", "Hono", "Cloudflare Workers", "D1", "HTMX", "Tailwind CSS"],
    image: "/images/projects/frugal.webp",
  },
  {
    title: "Elevation Restoration",
    kind: "Website for a local business",
    href: "https://elevation.stanbrook.me",
    body: "A headlight restoration business in Perth: online booking with availability worked out from existing bookings, before-and-after galleries, reviews and an owner's admin area.",
    stack: ["TypeScript", "Hono", "Cloudflare Workers", "D1"],
    image: "/images/projects/elevation-restoration.webp",
  },
  {
    title: "Blender Timelapse",
    kind: "Blender extension",
    href: "https://github.com/JaredStanbrook/blender-timelapse",
    body: "Records a fixed-camera timelapse of a model while you keep working, then exports it to video. Tested against 219 automated checks on Blender 5.2.",
    stack: ["Python", "Blender API"],
    image: "/images/projects/blender-timelapse.webp",
  },
  {
    title: "Tenant System",
    kind: "Full-stack web app",
    href: "https://github.com/JaredStanbrook/tenant-system",
    body: "Property management for tenants and landlords: bills and expenses, payment confirmations, properties and sign-in.",
    stack: ["TypeScript", "Hono", "HTMX", "Drizzle ORM", "Cloudflare Workers"],
    image: "https://stanbrook.me/tenant-system-preview.png",
  },
  {
    title: "Greenova",
    kind: "Built at Enveng Group",
    href: "https://github.com/enveng-group/dev_greenova",
    body: "A Django application for environmental compliance: obligations, documents and who is responsible for what, developed in Docker dev containers.",
    stack: ["Python", "Django", "Docker"],
    image: "https://stanbrook.me/greenova-preview.png",
  },
];

export interface Role {
  period: string;
  title: string;
  /** Who it was for. Left out, the row shows the title alone. */
  org?: string;
  href?: string;
  body: string;
  skills: string[];
}

export const experience: Role[] = [
  {
    period: "Jan 2026–Present",
    title: "Service Desk Officer",
    org: "Bunnings",
    body: "Full-time IT support for team members: logging, prioritising and resolving incidents and requests, and escalating with clear notes. Built an internal launcher that puts the team's tools one search away, because I'd rather automate a repeat job than do it twice.",
    skills: ["IT support", "Incident management", "Troubleshooting", "Active Directory"],
  },
  {
    period: "Jul–Dec 2025",
    title: "Project Activity Coordinator",
    org: "TeamFixIT, Murdoch University",
    href: "https://teamfixit.github.io",
    body: "Led a six-person capstone team building a network security monitoring tool for Murdoch University's IT staff. Planned and delegated the work, tracked milestones against the client's goals, ran design reviews and delivered on deadline.",
    skills: ["Project management", "Team leadership", "Systems design", "Client coordination"],
  },
  {
    period: "Feb–May 2025",
    title: "Web Developer (internship)",
    org: "Enveng Group",
    body: "Built features for a Django compliance application: backend logic, user roles and documentation workflows, in a fast-moving team working from Docker dev containers.",
    skills: ["Django", "Docker", "Backend development", "Teamwork"],
  },
  {
    period: "Aug–Nov 2024",
    title: "IT Service Desk (internship)",
    org: "Murdoch University",
    href: "/it-help-desk",
    body: "Tier 1 support on the library's help desk: printing, software installs, connectivity across every kind of device, and account access for students.",
    skills: ["Customer service", "Communication", "Troubleshooting"],
  },
  {
    period: "2021–2025",
    title: "Disability support, warehousing and drilling",
    body: "Disability support worker running my own small business, forklift and production-line work at Jasol, and a contract on a drill rig at Sahara. Years of turning up, solving problems on the spot and looking after people.",
    skills: ["Reliability", "Communication", "Problem-solving"],
  },
];

export const isExternal = (href?: string) => !!href && /^https?:/.test(href);
