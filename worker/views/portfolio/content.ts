// worker/views/portfolio/content.ts
//
// Everything the portfolio says about Jared, as data. Editing a role, a
// project or a link means editing this file and nothing else.

export const person = {
  name: "Jared Stanbrook",
  role: "IT specialist",
  location: "Perth, Western Australia",
  email: "jared.stanbrook@proton.me",
  resume: "https://stanbrook.me/jared_stanbrook_cyber_resume.pdf",
  /** The line under the name on the home page. */
  summary:
    "IT specialist in Perth. I look after networks, think hard about security, and build for the web.",
  about: [
    "For as long as I can remember I've been immersed in computing, driven by curiosity about how it all works underneath.",
    "It started with Python, then spread through high school into game development, web development and data analysis.",
    "A university degree pulled my focus towards networking and security. These days those meet in web development, which is where I keep digging deeper.",
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
  href?: string;
  body: string;
  stack: string[];
  image?: string;
}

export const projects: Project[] = [
  {
    title: "Port Scanner Delta Reporter",
    kind: "Network security, team project",
    href: "https://github.com/TeamFixIT/portscan-delta-reporter",
    body: "Automated port scans that report what changed since the last run. Scheduled scanning, change detection, CSV exports and a dashboard for tracking exposure across many hosts.",
    stack: ["Python", "Flask", "SQLAlchemy", "Nmap"],
    image: "https://stanbrook.me/portscan-delta-reporter-preview.png",
  },
  {
    title: "Tenant System",
    kind: "Full-stack web app",
    href: "https://github.com/JaredStanbrook/TenantSystem",
    body: "Property management for tenants and landlords: bills and expenses, properties, tenants and sign-in, built to take the friction out of renting for both sides.",
    stack: ["TypeScript", "React", "TanStack Router", "Tailwind CSS", "Hono", "Bun", "Drizzle ORM"],
    image: "https://stanbrook.me/tenant-system-preview.png",
  },
  {
    title: "Motion Sensor Monitor",
    kind: "Raspberry Pi dashboard",
    href: "https://github.com/JaredStanbrook/SmartAlertSystem",
    body: "A live dashboard for motion and door sensors around the house, with activity charts, frequency analysis and a downloadable log, updated in real time over Socket.IO.",
    stack: ["JavaScript", "Socket.IO", "Chart.js", "Express.js", "Raspberry Pi"],
    image: "https://stanbrook.me/sensor-monitor-preview.png",
  },
  {
    title: "Greenova",
    kind: "Built at Envenge Group",
    body: "A Django application for environmental management and compliance: obligations, documentation and who is responsible for what, with an accessible, modular interface.",
    stack: ["Python", "Django", "Docker", "PicoCSS"],
    image: "https://stanbrook.me/greenova-preview.png",
  },
  {
    title: "IT Service Desk Portal",
    kind: "Built for a student help desk",
    href: "/it-help-desk",
    body: "Digitised the desk's client records and feedback forms so the student-run team could spend less time on paper and more on the person in front of them.",
    stack: ["TypeScript", "React", "Hono", "SQLite", "Tailwind CSS"],
    image: "https://stanbrook.me/it-service-desk-preview.png",
  },
  {
    title: "MOBS",
    kind: "Invoicing for my own business",
    href: "https://github.com/JaredStanbrook/MyOwnBusinessSystem",
    body: "My Own Business System: invoices for my work as an independent disability support worker, without the spreadsheet juggling.",
    stack: ["Node.js", "Express.js", "MongoDB", "Pug"],
    image: "https://stanbrook.me/mobs-preview.png",
  },
  {
    title: "This site",
    kind: "Portfolio and blog",
    href: "https://github.com/JaredStanbrook/professional-portfolio",
    body: "Server-rendered on Cloudflare Workers, with a Markdown blog kept in R2 and D1 and an editor to write it from anywhere.",
    stack: ["TypeScript", "Hono", "HTMX", "Tailwind CSS", "Cloudflare Workers"],
    image: "https://stanbrook.me/portfolio-preview.png",
  },
];

export interface Role {
  period: string;
  title: string;
  org: string;
  href?: string;
  body: string;
  skills: string[];
}

export const experience: Role[] = [
  {
    period: "Jul–Dec 2025",
    title: "Project Activity Coordinator",
    org: "TeamFixIT",
    href: "https://teamfixit.github.io",
    body: "Led a six-person, startup-style team designing a network security monitoring system for Murdoch University. Planned the work, delegated it, tracked milestones against the client's goals, ran design reviews and delivered the design document on a tight deadline.",
    skills: ["Project management", "Team leadership", "Systems design", "Client coordination"],
  },
  {
    period: "Feb–Jun 2025",
    title: "Web Developer",
    org: "Envenge Group",
    body: "Built a Django application for tracking environmental compliance and project obligations: backend logic, user roles and documentation workflows, in a fast-moving team working from Docker dev containers.",
    skills: ["Django", "Docker", "Backend development", "Teamwork"],
  },
  {
    period: "Aug–Nov 2024",
    title: "Student IT Service Desk",
    org: "Murdoch University",
    href: "/it-help-desk",
    body: "Workplace learning on the library's help desk: printing, software installs, connectivity across every kind of device, and account support for students.",
    skills: ["Customer service", "Communication", "Troubleshooting"],
  },
  {
    period: "Jan 2023–Aug 2024",
    title: "Disability Support Worker",
    org: "Independent",
    body: "Supported NDIS clients towards their rehabilitation goals. A humbling change of pace from warehousing, and where I learned to run a small business of my own.",
    skills: ["Communication", "Compassion", "Problem-solving"],
  },
  {
    period: "Apr–Jun 2022",
    title: "Geological Field Technician and Driller",
    org: "Sahara",
    body: "Three months on a drill rig: sharing the work to hit KPIs, precise data entry for geological sampling, and an Excel workbook built to keep the sample data accurate.",
    skills: ["Safety", "Adaptability", "Data accuracy"],
  },
  {
    period: "2021–Dec 2023",
    title: "Forklift Driver, Inbound and Outbound, Production Line",
    org: "Jasol",
    body: "Started out relieving the warehouse team in busy periods and moved into chemical pumping on the production line and distribution, where an eye for systems helped improve how the line ran.",
    skills: ["Logistics", "Reliability", "Process improvement"],
  },
];

export const isExternal = (href?: string) => !!href && /^https?:/.test(href);
