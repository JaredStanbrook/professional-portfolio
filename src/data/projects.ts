export type ProjectStatus = "Active" | "Shipped" | "Paused" | "Archived";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  techStack: string[];
  tags: string[];
  status: ProjectStatus;
  featured: boolean;
  polishedScore: number;
  startedAt: string;
  updatedAt?: string;
  screenshots?: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  learnings: string[];
};

export const projects: Project[] = [
  {
    slug: "portscan-delta-reporter",
    title: "Port Scanner Delta Reporter",
    summary:
      "A network security monitoring system that automates port scans, detects drift, and surfaces change reports for security review.",
    problem:
      "Network teams needed a reliable way to detect open-port changes across hosts without combing through raw scan output.",
    solution:
      "Built a scheduled scanning pipeline that compares deltas, generates CSV reports, and presents a dashboard of risks and changes.",
    techStack: ["Python", "Flask", "SQLAlchemy", "Nmap", "CSV Exports"],
    tags: ["Security", "Monitoring", "Reporting"],
    status: "Shipped",
    featured: true,
    polishedScore: 5,
    startedAt: "2024-07-01",
    updatedAt: "2024-12-20",
    screenshots: ["https://stanbrook.me/portscan-delta-reporter-preview.png"],
    links: {
      github: "https://github.com/TeamFixIT/portscan-delta-reporter",
    },
    learnings: [
      "Designed data pipelines that surface security drift quickly.",
      "Balanced automation with human-readable reporting for stakeholders.",
    ],
  },
  {
    slug: "motion-sensor-monitor",
    title: "Motion Sensor Monitor",
    summary:
      "A real-time smart home dashboard for motion and door sensors with activity analytics and exportable logs.",
    problem:
      "Smart home sensor data was scattered across devices, making it hard to identify patterns and anomalies.",
    solution:
      "Delivered a real-time dashboard with live status, activity frequency charts, and downloadable logs for audits.",
    techStack: ["JavaScript", "Socket.IO", "Express.js", "Chart.js", "Raspberry Pi"],
    tags: ["IoT", "Real-time", "Dashboard"],
    status: "Shipped",
    featured: true,
    polishedScore: 4,
    startedAt: "2023-11-01",
    updatedAt: "2024-03-15",
    screenshots: ["https://stanbrook.me/sensor-monitor-preview.png"],
    links: {
      github: "https://github.com/JaredStanbrook/SmartAlertSystem",
    },
    learnings: [
      "Optimized streaming updates for low-latency IoT data.",
      "Translated raw sensor events into human-friendly insights.",
    ],
  },
  {
    slug: "tenant-system",
    title: "Tenant System",
    summary:
      "A full-stack property management platform for tenants and landlords with billing, messaging, and role-based access.",
    problem:
      "Property teams needed a single portal for tenants, bills, and maintenance tracking without juggling spreadsheets.",
    solution:
      "Created a role-aware platform with billing automation, tenant profiles, and responsive dashboards.",
    techStack: ["TypeScript", "React", "TanStack Router", "Hono", "Drizzle ORM"],
    tags: ["Full-stack", "SaaS", "Productivity"],
    status: "Active",
    featured: true,
    polishedScore: 5,
    startedAt: "2024-01-15",
    updatedAt: "2025-02-10",
    screenshots: ["https://stanbrook.me/tenant-system-preview.png"],
    links: {
      github: "https://github.com/JaredStanbrook/TenantSystem",
    },
    learnings: [
      "Shaped product flows around user roles and permissions.",
      "Built scalable CRUD flows with strong type safety.",
    ],
  },
  {
    slug: "greenova",
    title: "Greenova – Envenge Group",
    summary:
      "A Django-based web app to streamline environmental compliance workflows and obligation tracking.",
    problem:
      "Compliance teams needed a consistent way to manage obligations, documentation, and team ownership.",
    solution:
      "Delivered modular workflows, accessible UI, and reproducible dev environments for rapid iteration.",
    techStack: ["Django", "Docker", "PicoCSS", "PostgreSQL"],
    tags: ["Compliance", "Workflow", "Accessibility"],
    status: "Shipped",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-02-01",
    updatedAt: "2025-06-01",
    screenshots: ["https://stanbrook.me/greenova-preview.png"],
    links: {
      caseStudy: "https://envengegroup.com",
    },
    learnings: [
      "Designed accessible forms for compliance-heavy workflows.",
      "Improved team velocity with containerized tooling.",
    ],
  },
  {
    slug: "it-service-desk-portal",
    title: "IT Service Desk Portal",
    summary:
      "A student support portal to digitize client intake and feedback for a university help desk.",
    problem:
      "Support desk operations relied on paper forms and disconnected records, slowing service response.",
    solution:
      "Built a digitized workflow for client intake, service tracking, and feedback collection.",
    techStack: ["TypeScript", "React", "Hono", "SQLite", "Tailwind CSS"],
    tags: ["Support", "Operations", "Forms"],
    status: "Paused",
    featured: false,
    polishedScore: 3,
    startedAt: "2024-04-10",
    updatedAt: "2024-08-22",
    screenshots: ["https://stanbrook.me/it-service-desk-preview.png"],
    links: {},
    learnings: [
      "Mapped service workflows into simple, repeatable digital steps.",
      "Delivered responsive UI for on-site staff and student users.",
    ],
  },
  {
    slug: "mobs-invoice-system",
    title: "MOBS | Invoice System",
    summary:
      "An invoicing system built for disability support work to streamline billing and client records.",
    problem:
      "Manual invoicing introduced errors and wasted time when submitting client bills.",
    solution:
      "Delivered a lightweight invoicing workflow with templated outputs and client history.",
    techStack: ["MongoDB", "Express.js", "Node.js", "Pug"],
    tags: ["Finance", "Automation", "Small Business"],
    status: "Archived",
    featured: false,
    polishedScore: 2,
    startedAt: "2022-05-01",
    updatedAt: "2022-12-01",
    screenshots: ["https://stanbrook.me/mobs-preview.png"],
    links: {
      github: "https://github.com/JaredStanbrook/MyOwnBusinessSystem",
    },
    learnings: [
      "Shipped a product tuned to a specific personal workflow.",
      "Improved data modeling for recurring billing.",
    ],
  },
  {
    slug: "professional-portfolio",
    title: "Professional Portfolio",
    summary:
      "A full-stack portfolio platform showcasing projects, blog posts, and cybersecurity-focused experience.",
    problem:
      "Needed a portfolio that felt professional, fast, and maintainable while highlighting security work.",
    solution:
      "Built a modular Hono + React platform with structured content, blog tooling, and Cloudflare deployment.",
    techStack: ["TypeScript", "React", "Hono", "Bun", "Cloudflare Workers"],
    tags: ["Portfolio", "Full-stack", "Cloudflare"],
    status: "Active",
    featured: true,
    polishedScore: 5,
    startedAt: "2023-08-01",
    updatedAt: "2025-01-25",
    screenshots: ["https://stanbrook.me/portfolio-preview.png"],
    links: {
      live: "https://jared.stanbrook.me",
    },
    learnings: [
      "Balanced performance with design polish on a fast-moving stack.",
      "Strengthened deployment automation with Cloudflare Workers.",
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
