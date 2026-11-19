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
    "Service desk officer in Perth. I fix people's tech, I'm a bit obsessed with security, and I build little tools that make the job easier.",
  about: [
    "I'm on the service desk at Bunnings, and I've just wrapped up a Bachelor of IT at Murdoch University, majoring in Cyber Security & Forensics.",
    "Most of what I build starts as something that annoyed me. The team's tools were scattered everywhere, so I made a launcher. The sharehouse wanted to know who was home, so a Raspberry Pi got a job. Windows kept forgetting my window layout, so I fixed that too.",
    "When I'm not at a screen I'm usually in the shed doing woodwork, which is honestly the same deal: measure twice, accept the first go won't be perfect, and leave it easy for the next person to work on. I care about things being secure, easy to support and properly written down, mostly because I'm the one who gets the call when they aren't.",
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
    kind: "Desktop app and API, still in the works",
    body: "My big side project. You turn the things you do over and over into shortcuts that run on your own computer, then share them with your team. The desktop app is Rust and Tauri and works offline. The API is Go on PostgreSQL, with row-level security keeping each organisation's data separate, OAuth2 sign-in, and tests covering every route. The code's private for now while I get it right.",
    stack: ["Rust", "Tauri", "React", "Go", "PostgreSQL", "Redis", "OAuth2", "Docker"],
  },
  {
    title: "Service desk launcher",
    kind: "Built for my team at work",
    body: "A tray app with a quick-search box, so the team's go-to tools, links and workflows are one shortcut away instead of buried in bookmarks. Everything lives in plain files, usage stays on the machine, and the admin-only stuff sits behind its own locked panels.",
    stack: ["C#", ".NET", "WinUI 3", "xUnit"],
  },
  {
    title: "Port Scanner Delta Reporter",
    kind: "Network security, uni capstone",
    href: "https://github.com/TeamFixIT/portscan-delta-reporter",
    body: "Runs scheduled port scans across a bunch of hosts and only tells you what changed since last time, so you're not wading through the same results every week. Comes with CSV exports and a dashboard. I coordinated the six of us who built it for Murdoch's IT staff.",
    stack: ["Python", "Flask", "SQLAlchemy", "Nmap"],
    image: "https://stanbrook.me/portscan-delta-reporter-preview.png",
  },
  {
    title: "Sheoak Tree Smart Monitor",
    kind: "A Raspberry Pi in the sharehouse",
    href: "https://github.com/JaredStanbrook/sheoak-tree",
    body: "Started as a way to see what the sensors around our sharehouse were up to and grew from there. Sensor and relay state streams live to a dashboard, and it works out who's home from the local network (ARP, mDNS and SNMP) rather than tracking anyone's phone location. There's a mock hardware mode, so I can demo it without lugging the Pi around.",
    stack: ["Python", "Flask", "SQLAlchemy", "Server-sent events", "scikit-learn", "Raspberry Pi"],
    image: "https://stanbrook.me/sensor-monitor-preview.png",
  },
  {
    title: "Window Layout",
    kind: "Windows workspace tool",
    href: "https://github.com/JaredStanbrook/win-remember-me",
    body: "Windows restarts and your carefully arranged windows are gone. This saves the layout (positions, snapped windows, which apps were open, even your Edge tabs) and puts it all back. It also packs into an offline installer for machines that can't get online.",
    stack: ["Python", "pywin32", "PySide6", "Windows"],
  },
  {
    title: "Frugal",
    kind: "The starter behind this site",
    href: "https://github.com/JaredStanbrook/frug-template",
    body: "The groundwork I reuse every time I build a website: sign-in with passkeys, authenticator codes or passwords, lockout after too many tries, roles and permissions, an audit log, and database changes that deploy themselves on every push. It runs this site and four others.",
    stack: ["TypeScript", "Hono", "Cloudflare Workers", "D1", "HTMX", "Tailwind CSS"],
    image: "/images/projects/frugal.webp",
  },
  {
    title: "Elevation Restoration",
    kind: "Website for a local business",
    href: "https://elevation.stanbrook.me",
    body: "Headlight restoration around Perth. Customers book online, and the calendar works out what's free from the bookings already made, so there's no separate list to keep in sync. Plus before-and-after sliders, reviews, and an admin area for the owner.",
    stack: ["TypeScript", "Hono", "Cloudflare Workers", "D1"],
    image: "/images/projects/elevation-restoration.webp",
  },
  {
    title: "Blender Timelapse",
    kind: "Blender extension",
    href: "https://github.com/JaredStanbrook/blender-timelapse",
    body: "I wanted timelapses of my modelling without babysitting a screen recorder. This grabs a frame from a fixed camera every few seconds while you keep working, then turns it into a video. It's backed by 219 automated checks, because Blender add-ons break in weird ways.",
    stack: ["Python", "Blender API"],
    image: "/images/projects/blender-timelapse.webp",
  },
  {
    title: "Tenant System",
    kind: "Full-stack web app",
    href: "https://github.com/JaredStanbrook/tenant-system",
    body: "Bills and expenses for a rental without the group-chat arguments. Tenants see what they owe and confirm payments, and landlords manage properties and who lives where.",
    stack: ["TypeScript", "Hono", "HTMX", "Drizzle ORM", "Cloudflare Workers"],
    image: "https://stanbrook.me/tenant-system-preview.png",
  },
  {
    title: "Greenova",
    kind: "Built during my Enveng internship",
    href: "https://github.com/enveng-group/dev_greenova",
    body: "A Django app for environmental compliance: keeping track of obligations, documents and who's responsible for what. Built alongside the dev team, with everything running in Docker dev containers so we all had the same setup.",
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
    body: "Full-time IT support for team members. Logging and sorting out incidents and requests, figuring out what's actually wrong, and when it's not one I can fix, handing it to the right team with notes they can actually use. I also built the launcher above so the team's tools are one search away.",
    skills: ["IT support", "Incident management", "Troubleshooting", "Active Directory"],
  },
  {
    period: "Jul–Dec 2025",
    title: "Project Activity Coordinator",
    org: "TeamFixIT, Murdoch University",
    href: "https://teamfixit.github.io",
    body: "Ran a six-person uni team building a network security monitoring tool for Murdoch's IT staff. Planning, divvying up the work, keeping us on track against what the client actually wanted, running design reviews, and getting it all in on time.",
    skills: ["Project management", "Team leadership", "Systems design", "Client coordination"],
  },
  {
    period: "Feb–May 2025",
    title: "Web Developer (internship)",
    org: "Enveng Group",
    body: "Built features for a Django compliance app: backend logic, user roles and document workflows. Small team, moved quickly, and everything ran in Docker dev containers.",
    skills: ["Django", "Docker", "Backend development", "Teamwork"],
  },
  {
    period: "Aug–Nov 2024",
    title: "IT Service Desk (internship)",
    org: "Murdoch University",
    href: "/it-help-desk",
    body: "Tier 1 support on the library help desk: printers, software installs, getting every kind of laptop and phone onto the network, and account problems. Taught me most problems are simpler than they look, and the rest just need patience.",
    skills: ["Customer service", "Communication", "Troubleshooting"],
  },
  {
    period: "2021–2025",
    title: "Disability support, warehousing and drilling",
    body: "Ran my own small business as a disability support worker, drove forklifts and worked the production line at Jasol, and did a stint on a drill rig at Sahara. Not IT, but it's where I learned to turn up, sort problems out on the spot, and look after people.",
    skills: ["Reliability", "Communication", "Problem-solving"],
  },
];

export const isExternal = (href?: string) => !!href && /^https?:/.test(href);
