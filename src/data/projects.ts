// ✅ Same structure + same projects.
// ✅ Only change: tags normalized to avoid overuse + combine similar tags.

export type ProjectStatus =
  | "Active"
  | "Shipped"
  | "Paused"
  | "Archived"
  | "Completed";

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
      "A network security monitoring system that automates port scans, detects changes in network over time, generating reports for security review.",
    problem:
      "Network teams needed a reliable way to detect open-port changes across hosts without combing through raw scan output.",
    solution:
      "Built a scheduled scanning pipeline that compares deltas, generates CSV reports, and presents a dashboard of risks and changes.",
    techStack: ["Python", "Flask", "SQLAlchemy", "Nmap", "CSV Exports"],
    tags: ["Cybersecurity", "Monitoring", "Reporting"],
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
      "Designed data pipelines that present security changes consistently.",
      "Balanced automation with human-readable reporting for stakeholders.",
    ],
  },
  {
    slug: "motion-sensor-monitor",
    title: "Motion Sensor Monitor",
    summary:
      "A real-time smart home dashboard for motion and door sensors with activity analytics and exportable logs.",
    problem:
      "Pre-existing binary motion sensors existed in the house but were decommissioned.",
    solution:
      "Delivered a real-time dashboard with live status, activity frequency charts, and downloadable logs for audits, harnessing the pre-existing hardware.",
    techStack: [
      "TypeScript",
      "Hardware",
      "Express.js",
      "Chart.js",
      "Raspberry Pi",
    ],
    tags: ["IoT", "Real-time", "Dashboard"],
    status: "Shipped",
    featured: true,
    polishedScore: 5,
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
      "A full-stack property management platform for tenants and landlords with invoicing, and role-based access.",
    problem:
      "Landlord needed a single portal for tenants, bills, and maintenance tracking without juggling spreadsheets.",
    solution:
      "Created a role-aware platform with billing automation, tenant profiles, and responsive dashboards.",
    techStack: ["TypeScript", "HTMX", "SSR/HDA", "Hono", "Drizzle ORM"],
    tags: ["Full-stack", "SaaS", "Productivity"],
    status: "Shipped",
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
    status: "Archived",
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
      "I built this static website when I was a university student, mapping service workflows for an IT help desk unit.",
    problem:
      "Back then, everything relied on clunky paper forms, and I really wanted to build something clean and digital to modernize it.",
    solution:
      "Originally, I created a simple static site, but it grew into a digitized intake and feedback workflow.",
    techStack: ["TypeScript", "React", "Hono", "SQLite", "Tailwind CSS"],
    tags: ["Support Ops", "Process", "Student Project"],
    status: "Archived",
    featured: false,
    polishedScore: 3,
    startedAt: "2024-04-10",
    updatedAt: "2024-08-22",
    screenshots: ["https://stanbrook.me/it-service-desk-preview.png"],
    links: {},
    learnings: [
      "It taught me the basics of translating real-world processes into digital steps.",
      "I’m still proud of the responsive UI—even if it’s simple, it was a big step for me at the time.",
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
      "One of my first explorations into web development, a lot has changed since this beginning.",
    ],
  },
  {
    slug: "professional-portfolio",
    title: "Professional Portfolio",
    summary:
      "Originally a simple static website, this project evolved into a full-stack platform. It now hosts my portfolio, hobby sites, and includes authentication, role-based accounts, and a dynamic blog system.",
    problem:
      "I needed a platform that would represent all my work—from small hobby projects to my professional journey—while allowing easy expansion.",
    solution:
      "Through multiple iterations, I built a polished full-stack platform with robust features like authentication, role-based access, and dynamic content creation.",
    techStack: ["TypeScript", "React", "Hono", "Bun", "Cloudflare Workers"],
    tags: ["Portfolio", "Full-stack", "Platform"],
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
  {
    slug: "timber-crate",
    title: "Timber Crate",
    summary:
      "A timber crate that went from decorative-but-useless to purpose-built vinyl storage after a proper rethink.",
    problem:
      "It was a great gift, but my records only fit one way and loved slipping straight through the gaps like they were making an escape.",
    solution:
      "Pulled the whole thing apart, questioned past decisions (mostly whoever designed it), and rebuilt it so vinyl actually fits and stays put.",
    techStack: ["Timber", "Wood Glue"],
    tags: ["Woodwork", "Storage", "Upcycle"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-08-01",
    updatedAt: "2025-08-04",
    screenshots: ["https://stanbrook.me/Crate.jpeg"],
    links: {},
    learnings: [
      "Blunt chisels are basically decorative objects.",
      "Thin pine and thick nails are not friends.",
    ],
  },
  {
    slug: "cutting-board",
    title: "Cutting Board",
    summary:
      "Roadside timber turned into solid cutting boards for me and a few lucky friends.",
    problem: "I was done pretending plastic cutting boards weren’t awful.",
    solution:
      "Milled, shaped, and finished proper timber boards, then drowned them in food-safe oil like they deserved.",
    techStack: ["Timber", "Food-safe Finishes"],
    tags: ["Woodwork", "Kitchen", "Upcycle"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-06-01",
    updatedAt: "2025-06-04",
    screenshots: ["https://stanbrook.me/CuttingBoard1.jpeg"],
    links: {},
    learnings: [
      "More oil than you think. Then more again.",
      "Hot pizza trays are the natural enemy of timber.",
    ],
  },
  {
    slug: "drift-lamp",
    title: "Drift Lamp",
    summary:
      "A piece of driftwood from a beach walk that was clearly destined to become a lamp.",
    problem: "Big lights are overrated. Lamps everywhere is the goal.",
    solution:
      "Cleaned it up, wired it safely, and let a bit of local driftwood set the mood.",
    techStack: ["Timber", "Electrical Basics"],
    tags: ["Home", "Lighting", "Upcycle"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-06-01",
    updatedAt: "2025-06-10",
    screenshots: ["https://stanbrook.me/DriftLamp.jpeg"],
    links: {},
    learnings: [
      "Braiding single-core wire is harder than it looks.",
      "Auger bits reward patience and straight wrists.",
    ],
  },
  {
    slug: "dry-stack-fireplace",
    title: "Dry Stack Fireplace",
    summary:
      "A winter fireplace born from a trimmed tree and a growing sense of injustice.",
    problem: "No fireplace. In winter. Absolutely unacceptable.",
    solution:
      "Used spare bricks to build a dry stack fireplace and immediately justified it with marshmallows.",
    techStack: ["Brick", "Dry Stack"],
    tags: ["Outdoor", "Build", "Cozy"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-05-01",
    updatedAt: "2025-05-20",
    screenshots: ["https://stanbrook.me/Fireplace.jpeg"],
    links: {},
    learnings: [
      "Chisels are excellent at removing old mortar.",
      "Heavy LEGO is still LEGO.",
    ],
  },
  {
    slug: "sheoak-nursery",
    title: "Sheoak Nursery",
    summary:
      "A garden corner slowly transformed into a proper plant nursery with the right sun and airflow.",
    problem: "Every other spot looked good on paper and failed in real life.",
    solution:
      "Moved things, watched closely, failed a bunch, then finally landed on the perfect spot.",
    techStack: ["Landscaping", "Planning"],
    tags: ["Garden", "Plants", "DIY"],
    status: "Active",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-01-01",
    updatedAt: "2025-11-20",
    screenshots: ["https://stanbrook.me/Garden.jpeg"],
    links: {},
    learnings: [
      "Outdoor projects are never really finished.",
      "Sometimes the plant knows better than you.",
    ],
  },
  {
    slug: "workshop-bench",
    title: "Workshop Bench",
    summary:
      "A no-nonsense workbench built to end the era of working on the floor.",
    problem:
      "Everything available was either flimsy, tiny, or lying about its strength.",
    solution:
      "Overbuilt a bench that stays put, doesn’t wobble, and quietly judges lighter benches.",
    techStack: ["Timber", "Power Tools"],
    tags: ["Workshop", "Woodwork", "Build"],
    status: "Active",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-07-01",
    updatedAt: "2025-07-20",
    screenshots: ["https://stanbrook.me/Workbench.jpeg"],
    links: {},
    learnings: ["Heavy is good.", "Build the bench before buying fancy tools."],
  },
  {
    slug: "buffet-unit",
    title: "Buffet Unit",
    summary:
      "A custom buffet unit built because store-bought furniture never quite gets it right.",
    problem:
      "Nothing off the shelf fit the space or behaved how I wanted it to.",
    solution:
      "Measured carefully, cut confidently, and built exactly what the room was asking for.",
    techStack: ["Timber", "Joinery"],
    tags: ["Furniture", "Woodwork", "Home"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2024-06-01",
    updatedAt: "2024-06-20",
    screenshots: ["https://stanbrook.me/Buffett.jpeg"],
    links: {},
    learnings: [
      "Storage needs expand immediately.",
      "Square matters most at the end.",
    ],
  },
  {
    slug: "butterfly-table",
    title: "Butterfly Table",
    summary:
      "A small table built mostly to answer the question: can I actually do this?",
    problem:
      "I wanted something decorative, not just another rectangle with legs.",
    solution: "Committed early, adjusted constantly, and trusted the process.",
    techStack: ["Timber", "Detail Work"],
    tags: ["Furniture", "Woodwork"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2023-01-01",
    updatedAt: "2023-03-10",
    screenshots: ["https://stanbrook.me/Butterfly.jpeg"],
    links: {},
    learnings: ["Details take forever.", "You see flaws no one else notices."],
  },
  {
    slug: "coffee-table",
    title: "Coffee Table",
    summary:
      "A solid coffee table designed to survive daily life without excuses.",
    problem: "Disposable furniture just wasn’t cutting it.",
    solution:
      "Kept the design simple and focused on strength, balance, and proportion.",
    techStack: ["Timber", "Wood Finishing"],
    tags: ["Furniture", "Woodwork", "Home"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2024-10-01",
    updatedAt: "2024-10-18",
    screenshots: ["https://stanbrook.me/CoffeeTable1.jpeg"],
    links: {},
    learnings: ["Simple designs age better.", "Finish reveals everything."],
  },
  {
    slug: "console-table",
    title: "Console Table",
    summary:
      "A slim console table made as a gift for someone special, designed to sit quietly and perfectly in a little apartment.",
    problem:
      "The space allowed no forgiveness — anything wider would’ve turned into a permanent shin hazard, and store-bought options felt soulless.",
    solution:
      "Carefully repurposed a second-hand wardrobe into a narrow, sturdy table, using a bit of smart thinking and a lot of care. The result came together beautifully and became one of my first truly meaningful pieces.",
    techStack: ["Reclaimed Timber"],
    tags: ["Furniture", "Upcycle", "Gift"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-06-01",
    updatedAt: "2025-06-12",
    screenshots: ["https://stanbrook.me/ConsoleTable.jpeg"],
    links: {},
    learnings: [
      "Tight tolerances leave no room for guessing.",
      "Reclaimed materials reward thoughtful planning.",
      "Making something for someone else changes how you build.",
    ],
  },
  {
    slug: "corner-shelf",
    title: "Corner Shelf",
    summary: "A shelf built to finally make a useless corner earn its keep.",
    problem: "Corners are awkward and usually ignored for a reason.",
    solution: "Turned dead space into storage and called it a win.",
    techStack: ["Timber", "Wall Mounting"],
    tags: ["Storage", "Woodwork", "Home"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-06-01",
    updatedAt: "2025-06-05",
    screenshots: ["https://stanbrook.me/CornerShelf.jpeg"],
    links: {},
    learnings: [
      "Corners are rarely perfect 90 degrees, especially this one.",
      "Fixings matter more than shelves.",
    ],
  },
  {
    slug: "paper-cranes",
    title: "Paper Cranes",
    summary:
      "A deeply personal project made during a short, intense window of time, folding meaning into every crane.",
    problem:
      "This wasn’t about practicing technique or avoiding rectangles — it was about showing up for someone in a way I show care.",
    solution:
      "Over two days, I folded 65 paper cranes by hand, each one a quiet act of care, patience, and intention.",
    techStack: ["Paper", "Hands", "Time"],
    tags: ["Art", "Sentimental", "Gift"],
    status: "Completed",
    featured: false,
    polishedScore: 5,
    startedAt: "2023-02-01",
    updatedAt: "2023-02-03",
    screenshots: ["https://stanbrook.me/Cranes.jpeg"],
    links: {},
    learnings: [
      "Repetition can be meditative.",
      "Making something with intention matters more than perfection.",
      "Sometimes the act of making is the message.",
    ],
  },
  {
    slug: "greenhouse-bones",
    title: "Greenhouse",
    summary: "A raised greenhouse because I’m tall and plants deserve dignity.",
    problem: "Wind, winter, and low ceilings were all working against us.",
    solution:
      "Built a solid timber base and mounted a greenhouse on top like it should’ve been done from the start.",
    techStack: ["Timber", "Outdoor Construction"],
    tags: ["Garden", "Build", "Outdoor"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-07-01",
    updatedAt: "2025-07-10",
    screenshots: ["https://stanbrook.me/GreenhouseBones.jpeg"],
    links: {},
    learnings: [
      "Outdoor builds demand overkill.",
      "Future-proofing pays off fast.",
    ],
  },
  {
    slug: "reindeer",
    title: "Reindeer",
    summary:
      "A wooden reindeer built in the spirit of Christmas, equal parts festive idea and hands-on experiment.",
    problem:
      "I had timber, time, and a seasonal idea that refused to stay theoretical.",
    solution:
      "Let the shape lead the build, trusting the process and adjusting by eye as the reindeer took form. A second version followed in Tasmanian oak once the idea proved itself.",
    techStack: ["Timber", "Bandsaw"],
    tags: ["Seasonal", "Woodwork", "Art"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-03-01",
    updatedAt: "2025-03-05",
    screenshots: ["https://stanbrook.me/Reindeer.jpeg"],
    links: {},
    learnings: [
      "Balance matters more than fine detail.",
      "Sculptural work exposes shortcuts immediately.",
      "Repetition is a great teacher.",
    ],
  },
  {
    slug: "wall-shelf",
    title: "Wall Shelf",
    summary:
      "A simple wall shelf built to do its job properly, and look quietly good doing it.",
    problem:
      "Stuff needed a home, and I wanted something functional without turning the wall into visual noise.",
    solution:
      "Built a clean, sturdy shelf from reused timber, mixing pine with an unknown hardwood to create warmth without that loud, ugly yellow pine look.",
    techStack: ["Reclaimed Timber", "Pine", "Fixings"],
    tags: ["Home", "Storage", "Upcycle"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-04-01",
    updatedAt: "2025-04-02",
    screenshots: ["https://stanbrook.me/Shelf1.jpeg"],
    links: {},
    learnings: [
      "Level matters more than you think.",
      "Studs make the difference between art and regret.",
      "Reused timber carries its own character.",
    ],
  },
  {
    slug: "small-table",
    title: "Small Table",
    summary: "A small table that quietly became indispensable.",
    problem: "I needed something light, movable, and yet fragile.",
    solution:
      "Kept it compact and built to look adorable, crafted from offcuts of the console table.",
    techStack: ["Timber"],
    tags: ["Furniture", "Woodwork", "Upcycle"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-06-01",
    updatedAt: "2025-06-05",
    screenshots: ["https://stanbrook.me/SmallTable.jpeg"],
    links: {},
    learnings: [
      "Small doesn’t mean easy.",
      "Thinking big with leftover timber.",
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
