// worker/views/pages/About.tsx
//
// The CV page: a sticky intro column with jump links and socials, and the
// about / experience / projects sections beside it. Content is data at the
// top of the file so an edit never means touching markup.

import type { FC } from "hono/jsx";

interface Entry {
  title: string;
  href?: string;
  period?: string;
  body: string;
  tags: string[];
  image?: string;
}

const experience: Entry[] = [
  {
    period: "Jul — Dec 2025",
    title: "Project Activity Coordinator – TeamFixIT",
    href: "https://teamfixit.github.io",
    body: "Led a six-member startup-style team in the design and development of a network security monitoring solution for Murdoch University. Oversaw project planning, task delegation, and milestone tracking while ensuring alignment with client objectives. Coordinated architecture and design reviews, integrated contributions across technical and documentation roles, and delivered a comprehensive design document under strict deadlines.",
    tags: ["Project Management", "Team Leadership", "Systems Design", "Client Coordination"],
  },
  {
    period: "Feb — Jun 2025",
    title: "Web Developer – Envenge Group",
    body: "Built a Django-based web application for monitoring environmental compliance and project obligations. Contributed to backend logic, user role management, and documentation workflows in a rapid development team setting. Used Docker and VS Code dev containers for a consistent development environment.",
    tags: ["Django", "Docker", "Backend Development", "Team Collaboration"],
  },
  {
    period: "Aug — Nov 2024",
    title: "Student IT Service Desk – Murdoch University",
    href: "/it-help-desk",
    body: "As a part of my studies, I completed workplace learning, providing IT support for students, spending shifts in the Murdoch library assisting students with various technical issues, including printing to the library printers, installing software, connectivity issues with various devices, and account support.",
    tags: ["Customer Service", "Communication", "Troubleshooting"],
  },
  {
    period: "Jan 2023 — Aug 2024",
    title: "Independent | Disability Support Worker",
    body: "I’ve been working as a disability support worker for over a year. It’s been a humbling change of pace to my usual occupation within warehousing; communicating and engaging with clients who access the NDIS and supporting them in reaching their rehabilitation goals have been a rewarding experience, cultivating my development of essential business skills.",
    tags: ["Communication", "Compassion", "Problem-solving"],
  },
  {
    period: "Apr — Jun 2022",
    title: "Geological Field Technician | Driller — Sahara",
    body: "During my 3-month contract at Sahara, our team efficiently delegated tasks to meet KPIs while collectively managing the drill rig. My responsibilities included precise data entry for geological sampling, operating the drill rig, and setting up an Excel spreadsheet to record data. I utilized advanced Excel formulas to ensure data accuracy and integrity.",
    tags: ["Safety", "Adaptability", "Analytical"],
  },
  {
    period: "2021 — Dec 2023",
    title: "Forklift Driver | Inbound & Outbound Officer | Production Line — Jasol",
    body: "During my two-year tenure at Jasol, I started by supporting order fulfillment and relieving pressure on warehouse officers during busy periods. Gradually, I transitioned to a more hands-on role in chemical pumping on the production line and took on additional responsibilities in product distribution. Although my technical skills weren't directly utilized, I leveraged my system understanding to innovate production line systems.",
    tags: ["Communication", "Compassion", "Problem-solving"],
  },
];

const projects: Entry[] = [
  {
    title: "Port Scanner Delta Reporter",
    href: "https://github.com/TeamFixIT/portscan-delta-reporter",
    body: "A network security monitoring system that performs automated port scans and generates delta reports. Features scheduled scanning, change detection, comprehensive reporting with CSV exports, and a responsive dashboard for tracking network vulnerabilities across multiple hosts.",
    tags: ["Python", "Flask", "SQLAlchemy", "Nmap"],
    image: "https://stanbrook.me/portscan-delta-reporter-preview.png",
  },
  {
    title: "Motion Sensor Monitor",
    href: "https://github.com/JaredStanbrook/SmartAlertSystem",
    body: "A real-time smart home dashboard for monitoring motion and door sensors. Features live status, frequency-based activity analysis, and a downloadable activity log. Built with a modern UI, real-time updates via Socket.IO, and interactive charts for data visualization.",
    tags: ["HTML5", "CSS3", "JavaScript", "Socket.IO", "Chart.js", "Express.js", "Raspberry Pi"],
    image: "https://stanbrook.me/sensor-monitor-preview.png",
  },
  {
    title: "Tenant System",
    href: "https://github.com/JaredStanbrook/TenantSystem",
    body: "A full-stack property management platform for tenants and landlords. Features include expense and bill tracking, property and tenant management, authentication, and a modern, responsive UI. Built to streamline rental workflows and enhance communication between all parties.",
    tags: ["TypeScript", "React", "TanStack Router", "Tailwind CSS", "Hono", "Bun", "Drizzle ORM"],
    image: "https://stanbrook.me/tenant-system-preview.png",
  },
  {
    title: "Greenova – Envenge Group",
    body: "Developed Greenova, a Django-based web application for streamlining environmental management and compliance tracking. The platform featured a modular, accessible interface and supported efficient workflows for managing obligations, documentation, and team responsibilities. Used Docker and a VS Code dev container to ensure a consistent and reproducible development environment.",
    tags: ["Django", "Docker", "VS Code Dev Containers", "PicoCSS", "Python", "Github"],
    image: "https://stanbrook.me/greenova-preview.png",
  },
  {
    title: "IT Service Desk Portal | Website",
    href: "/it-help-desk",
    body: "This website was developed to address the unique needs of our student-run support desk, enhancing efficiency by digitising client records and feedback forms to streamline service and improve customer support.",
    tags: ["Typescript", "Tailwind CSS", "React", "Hono", "Bun", "SQLite"],
    image: "https://stanbrook.me/it-service-desk-preview.png",
  },
  {
    title: "MOBS | Invoice System",
    href: "https://github.com/JaredStanbrook/MyOwnBusinessSystem",
    body: "I developed My Own Business System to cater specifically to my needs as an independent disability support worker, streamlining the process of creating invoices.",
    tags: ["Mongo DB", "Express.js", "Pug", "Node.js"],
    image: "https://stanbrook.me/mobs-preview.png",
  },
  {
    title: "Professional Portfolio | Website",
    href: "https://github.com/JaredStanbrook/professional-portfolio",
    body: "This website, built to show my work and my passion for technology. Server-rendered on Cloudflare Workers with Hono, HTMX and Tailwind CSS, with a Markdown blog stored in R2 and D1.",
    tags: ["TypeScript", "Hono", "HTMX", "Tailwind CSS", "Cloudflare Workers", "D1"],
    image: "https://stanbrook.me/portfolio-preview.png",
  },
];

const socials = [
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

const sections = [
  { id: "about", name: "About" },
  { id: "experience", name: "Experience" },
  { id: "projects", name: "Projects" },
];

const external = (href?: string) => !!href && /^https?:/.test(href);

const ArrowUpRight = () => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    class="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
      clip-rule="evenodd"
    />
  </svg>
);

/**
 * One row. On large screens the whole row is the link target (the stretched
 * span) and its siblings dim while it is hovered.
 */
const EntryCard: FC<{ entry: Entry }> = ({ entry }) => (
  <li class="mb-12">
    <div class="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
      <div class="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-lg transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-primary/10"></div>
      {entry.period && (
        <p class="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:col-span-2">
          {entry.period}
        </p>
      )}
      <div class={`z-10 ${entry.period ? "sm:col-span-6" : "sm:order-2 sm:col-span-5"}`}>
        <h3 class="font-medium leading-snug text-foreground">
          {entry.href ? (
            <a
              href={entry.href}
              class="group/link inline-flex items-baseline text-base font-medium leading-tight text-foreground no-underline hover:text-primary focus-visible:text-primary"
              {...(external(entry.href) ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            >
              <span class="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
              <span>
                {entry.title}
                <ArrowUpRight />
              </span>
            </a>
          ) : (
            entry.title
          )}
        </h3>
        <p class="mt-2 text-sm leading-normal text-muted-foreground">{entry.body}</p>
        <ul class="mt-2 flex flex-wrap" aria-label="Technologies used">
          {entry.tags.map((tag) => (
            <li class="mr-1.5 mt-2">
              <span class="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium leading-5 text-primary">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {entry.image && (
        <img
          src={entry.image}
          alt=""
          loading="lazy"
          decoding="async"
          width="200"
          height="48"
          class="z-10 my-5 h-auto w-full rounded-lg border-2 border-foreground/10 object-contain transition group-hover:border-foreground/30 sm:order-1 sm:col-span-3 sm:my-0"
        />
      )}
    </div>
  </li>
);

const SectionHeading: FC<{ name: string }> = ({ name }) => (
  <div class="sticky top-0 z-20 -mx-4 mb-4 bg-background/75 px-4 py-5 backdrop-blur sm:-mx-6 sm:px-6 lg:sr-only">
    <h2 class="text-sm font-bold uppercase tracking-widest text-foreground">{name}</h2>
  </div>
);

export const AboutPage: FC = () => (
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:flex lg:justify-between lg:gap-4 lg:px-8">
    <header class="pt-12 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/3 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Jared Stanbrook
        </h1>
        <p class="mt-3 text-lg font-medium tracking-tight text-foreground sm:text-xl">
          Information Technology Specialist
        </p>
        <p class="mt-4 max-w-xs text-muted-foreground">Perth, Western Australia</p>
        <p class="mt-4 max-w-xs">
          <a
            href="mailto:jared.stanbrook@proton.me"
            class="text-muted-foreground hover:text-foreground"
          >
            jared.stanbrook@proton.me
          </a>
        </p>
        <nav class="hidden lg:block" aria-label="In-page jump links">
          <ul class="mt-16 w-max">
            {sections.map((s) => (
              <li>
                <a class="group flex items-center py-3 no-underline" href={`#${s.id}`}>
                  <span class="mr-4 h-px w-8 bg-muted-foreground transition-all group-hover:w-16 group-hover:bg-foreground group-focus-visible:w-16 group-focus-visible:bg-foreground motion-reduce:transition-none"></span>
                  <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground">
                    {s.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <ul class="mt-8 flex items-center gap-2" aria-label="Social media">
        {socials.map((s) => (
          <li>
            <a
              class="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${s.name} (opens in a new tab)`}
              title={s.name}
            >
              <svg viewBox={s.viewBox} fill="currentColor" class="h-6 w-6" aria-hidden="true">
                <path d={s.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </header>

    <div class="pt-16 lg:w-1/2 lg:py-24">
      <section id="about" class="mb-16 scroll-mt-16 md:mb-24 lg:mb-36" aria-label="About me">
        <SectionHeading name="About" />
        <div class="space-y-4 text-muted-foreground">
          <p class="font-bold text-foreground">Welcome to my website!</p>
          <p>
            For as long as I can remember, I've been deeply immersed in the world of computing,
            driven by a profound curiosity for its technical intricacies.
          </p>
          <p>
            My journey began with Python coding, sparking a passion that led me to explore various
            programming languages and delve into domains like game development, web development, and
            data analysis throughout high school.
          </p>
          <p>
            Now, with a university degree shaping my focus on networking and security, my interests
            have converged on web development, where I continue to deepen my knowledge and skills.
          </p>
        </div>
      </section>

      <section
        id="experience"
        class="mb-16 scroll-mt-16 md:mb-24 lg:mb-36"
        aria-label="Work experience"
      >
        <SectionHeading name="Experience" />
        <ol class="group/list">
          {experience.map((e) => (
            <EntryCard entry={e} />
          ))}
        </ol>
        <a
          class="group/link inline-flex items-baseline font-semibold leading-tight text-foreground no-underline hover:text-primary focus-visible:text-primary"
          href="https://stanbrook.me/jared_stanbrook_cyber_resume.pdf"
          target="_blank"
          rel="noreferrer noopener"
        >
          View full résumé
          <ArrowUpRight />
        </a>
      </section>

      <section
        id="projects"
        class="mb-16 scroll-mt-16 md:mb-24 lg:mb-36"
        aria-label="Selected projects"
      >
        <SectionHeading name="Projects" />
        <ul class="group/list">
          {projects.map((p) => (
            <EntryCard entry={p} />
          ))}
        </ul>
      </section>
    </div>
  </div>
);
