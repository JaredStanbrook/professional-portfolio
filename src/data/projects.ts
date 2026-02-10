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
    techStack: [
      "JavaScript",
      "Socket.IO",
      "Express.js",
      "Chart.js",
      "Raspberry Pi",
    ],
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
    techStack: [
      "TypeScript",
      "React",
      "TanStack Router",
      "Hono",
      "Drizzle ORM",
    ],
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
  {
    slug: "timber-crate",
    title: "Timber Crate",
    summary: "A functional timber crate purpose-built for storing my records.",
    problem:
      "I received this crate as a gift, but my vinyl could only fit one way and would fall through the gaps.",
    solution: "Pulled it apart and reassembled it so the vinyl fits properly.",
    techStack: ["Timber", "Wood Glue"],
    tags: ["DIY", "Storage"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-08-01",
    updatedAt: "2025-08-04",
    screenshots: ["https://stanbrook.me/Crate.jpeg"],
    links: {},
    learnings: [
      "Blunt chisels are useless.",
      "Thin pine does not like thick nails.",
    ],
  },
  {
    slug: "cutting-board",
    title: "Cutting Board",
    summary:
      "Found a piece of wood on the side of the road and turned it into a bunch of cutting boards for myself and friends.",
    problem: "I was sick and tired of using plastic cutting boards.",
    solution: "Built and finished solid timber boards using food-safe oils.",
    techStack: ["Timber", "Food-safe Finishes"],
    tags: ["DIY", "Kitchen"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-09-01",
    updatedAt: "2025-09-04",
    screenshots: ["https://stanbrook.me/CuttingBoard1.jpeg"],
    links: {},
    learnings: [
      "Apply many layers of food-safe oil.",
      "Hot pizza trays will burn your cutting board.",
    ],
  },
  {
    slug: "drift-lamp",
    title: "Drift Lamp",
    summary:
      "I was walking along the beach and found a piece of driftwood that would make an awesome lamp.",
    problem: "More lamps mean no big light — it’s a win-win.",
    solution:
      "The driftwood fits the space perfectly, especially because it came from just up the road.",
    techStack: ["Timber", "Electrical Basics"],
    tags: ["DIY", "Lighting", "Design"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-06-01",
    updatedAt: "2025-06-10",
    screenshots: ["https://stanbrook.me/DriftLamp.jpeg"],
    links: {},
    learnings: [
      "Braiding single-core wire is a workout, and worth it.",
      "I’m great at drilling straight holes with an auger bit.",
    ],
  },
  {
    slug: "dry-stack-fireplace",
    title: "Dry Stack Fireplace",
    summary:
      "Trimmed a tree one day, dried it over summer, and then needed a place to burn it in winter.",
    problem: "No fireplace. I mean, come on — no fireplace!",
    solution:
      "Had some spare bricks lying around, so I built a dry stack fireplace.",
    techStack: ["Brick", "Dry Stack"],
    tags: ["DIY", "Marshmallows"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-11-01",
    updatedAt: "2025-11-20",
    screenshots: ["https://stanbrook.me/Fireplace.jpeg"],
    links: {},
    learnings: [
      "Effectively using a chisel to knock off old mortar.",
      "It’s like building with heavy LEGO.",
    ],
  },
  {
    slug: "sheoak-nursery",
    title: "Sheoak Nursery",
    summary:
      "Transformed a corner of the garden into a proper nursery with great morning sun.",
    problem: "Everywhere else I put my plants didn’t get enough sun.",
    solution:
      "Tried and failed a lot in search of the perfect spot — eventually found it.",
    techStack: ["Landscaping", "Planning"],
    tags: ["DIY", "Garden"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-01-01",
    updatedAt: "2025-11-20",
    screenshots: ["https://stanbrook.me/Garden.jpeg"],
    links: {},
    learnings: [
      "Outdoor projects evolve over time.",
      "You’ve got to trust the plant.",
    ],
  },
  {
    slug: "workshop-bench",
    title: "Workshop Bench",
    summary:
      "Built myself a proper bench so I could stop working on the floor like a caveman.",
    problem:
      "Everything I had was either too flimsy, too small, or not built for real work.",
    solution:
      "Overbuilt a solid timber bench that doesn’t move, wobble, or complain.",
    techStack: ["Timber", "Power Tools"],
    tags: ["DIY", "Workshop"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2024-07-01",
    updatedAt: "2024-07-20",
    screenshots: ["https://stanbrook.me/Workbench.jpeg"],
    links: {},
    learnings: ["Heavy is good.", "Build the bench before buying fancy tools."],
  },
  {
    slug: "buffet-unit",
    title: "Buffet Unit",
    summary:
      "A custom buffet unit built because store-bought furniture never quite fits.",
    problem: "Nothing off the shelf matched the space or did what I needed.",
    solution:
      "Measured twice, cut once (mostly), and built exactly what the room wanted.",
    techStack: ["Timber", "Joinery"],
    tags: ["DIY", "Furniture"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2024-02-01",
    updatedAt: "2024-02-20",
    screenshots: ["https://stanbrook.me/Buffett.jpeg"],
    links: {},
    learnings: [
      "Storage needs grow faster than expected.",
      "Square is optional until it isn’t.",
    ],
  },
  {
    slug: "butterfly-table",
    title: "Butterfly Table",
    summary: "A small table built mostly to see if I could pull it off.",
    problem:
      "I wanted to try something decorative instead of purely functional.",
    solution: "Committed to the idea and figured it out as I went.",
    techStack: ["Timber", "Detail Work"],
    tags: ["DIY", "Furniture"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2024-03-01",
    updatedAt: "2024-03-10",
    screenshots: ["https://stanbrook.me/Butterfly.jpeg"],
    links: {},
    learnings: [
      "Details take way longer than expected.",
      "You notice mistakes more than anyone else.",
    ],
  },
  {
    slug: "coffee-table",
    title: "Coffee Table",
    summary: "A solid coffee table built to survive daily life.",
    problem: "I wanted something sturdy that didn’t feel disposable.",
    solution: "Kept it simple and focused on strength and proportions.",
    techStack: ["Timber", "Wood Finishing"],
    tags: ["DIY", "Furniture"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2024-04-01",
    updatedAt: "2024-04-18",
    screenshots: ["https://stanbrook.me/CoffeeTable1.jpeg"],
    links: {},
    learnings: [
      "Simple designs age better.",
      "Finish hides (or highlights) sins.",
    ],
  },
  {
    slug: "console-table",
    title: "Console Table",
    summary: "A narrow console table built for a tight hallway.",
    problem: "Anything wider would have just been in the way.",
    solution: "Designed it slim, strong, and boring in the best way.",
    techStack: ["Timber"],
    tags: ["DIY", "Furniture"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2024-05-01",
    updatedAt: "2024-05-12",
    screenshots: ["https://stanbrook.me/ConsoleTable.jpeg"],
    links: {},
    learnings: [
      "Tight tolerances show mistakes fast.",
      "Hallways are unforgiving.",
    ],
  },
  {
    slug: "corner-shelf",
    title: "Corner Shelf",
    summary: "Built a shelf to finally use a corner that did nothing.",
    problem: "Corners are awkward and usually ignored.",
    solution: "Turned dead space into useful space.",
    techStack: ["Timber", "Wall Mounting"],
    tags: ["DIY", "Storage"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2024-06-01",
    updatedAt: "2024-06-05",
    screenshots: ["https://stanbrook.me/CornerShelf.jpeg"],
    links: {},
    learnings: [
      "Walls are rarely straight.",
      "Fixings matter more than shelves.",
    ],
  },
  {
    slug: "timber-cranes",
    title: "Timber Cranes",
    summary: "Made some timber cranes because… why not.",
    problem: "I wanted to practice shaping without building another rectangle.",
    solution: "Focused on form, balance, and not snapping thin bits.",
    techStack: ["Timber", "Hand Tools"],
    tags: ["DIY", "Art"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2024-07-01",
    updatedAt: "2024-07-03",
    screenshots: ["https://stanbrook.me/Cranes.jpeg"],
    links: {},
    learnings: ["Thin pieces break easily.", "Patience beats force."],
  },
  {
    slug: "greenhouse-bones",
    title: "Greenhouse Bones",
    summary:
      "Walk-in greenhouse, is good but im tall so i gave my greenhouse stilts.",
    problem: "My plants needed shelter from wind and winter.",
    solution:
      "Started with a solid structure and slapped a bunnings greenhouse on top.",
    techStack: ["Timber", "Outdoor Construction"],
    tags: ["DIY", "Garden"],
    status: "Completed",
    featured: false,
    polishedScore: 4,
    startedAt: "2025-02-01",
    updatedAt: "2025-02-10",
    screenshots: ["https://stanbrook.me/GreenhouseBones.jpeg"],
    links: {},
    learnings: [
      "Outdoor builds need overkill.",
      "Future-proofing is underrated.",
    ],
  },
  {
    slug: "reindeer",
    title: "Reindeer",
    summary: "Built a wooden reindeer mostly for fun.",
    problem: "I had timber, time, and an idea.",
    solution: "Let it happen and adjusted as I went.",
    techStack: ["Timber"],
    tags: ["DIY", "Art", "Bandsaw"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-03-01",
    updatedAt: "2025-03-05",
    screenshots: ["https://stanbrook.me/Reindeer.jpeg"],
    links: {},
    learnings: [
      "Balance matters more than looks.",
      "Sculptural builds don’t forgive shortcuts.",
    ],
  },
  {
    slug: "wall-shelf",
    title: "Wall Shelf",
    summary: "A simple wall shelf that does exactly what it’s meant to.",
    problem: "Stuff needed somewhere to live.",
    solution: "Built a shelf. Mounted it properly.",
    techStack: ["Timber", "Fixings"],
    tags: ["DIY", "Storage"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-04-01",
    updatedAt: "2025-04-02",
    screenshots: ["https://stanbrook.me/Shelf1.jpeg"],
    links: {},
    learnings: ["Level matters.", "Studs are your friend."],
  },
  {
    slug: "small-table",
    title: "Small Table",
    summary: "A little table that ended up being more useful than expected.",
    problem: "I needed something lightweight and easy to move.",
    solution: "Kept it compact but strong enough to survive.",
    techStack: ["Timber"],
    tags: ["DIY", "Furniture"],
    status: "Completed",
    featured: false,
    polishedScore: 3,
    startedAt: "2025-06-01",
    updatedAt: "2025-06-05",
    screenshots: ["https://stanbrook.me/SmallTable.jpeg"],
    links: {},
    learnings: ["Small doesn’t mean simple.", "Scale changes everything."],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
