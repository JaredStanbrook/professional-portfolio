import { createFileRoute, Link } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardItem,
  CardImage,
} from "@/components/ui/customcard";
import { featuredProjects } from "@/data/projects";

export const Route = createFileRoute("/about")({
  component: Homepage,
});

function Homepage() {
  return (
    <>
      <div className="lg:flex lg:justify-between lg:gap-4 text-muted-foreground">
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/3 lg:flex-col lg:justify-between lg:py-24">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <a href="/navigation">Jared Stanbrook</a>
            </h1>
            <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground sm:text-xl">
              Information Technology Specialist
            </h2>
            <p className="mt-4 max-w-xs leading-normal">
              Perth, Western Australia
            </p>
            <p className="mt-4 max-w-xs leading-normal">
              <a
                href="mailto:jared.stanbrook@proton.me"
                className="hover:underline"
                aria-label="Send an email to jared.stanbrook@proton.me"
              >
                jared.stanbrook@proton.me
              </a>
            </p>
            <nav
              className="nav hidden lg:block"
              aria-label="In-page jump links"
            >
              <ul className="mt-16 w-max">
                <li>
                  <a
                    className="group flex items-center py-3 active"
                    href="#about"
                  >
                    <span className="nav-indicator mr-4 h-px w-8 bg-muted-foreground transition-all group-hover:w-16 group-hover:bg-foregound group-focus-visible:w-16 group-focus-visible:bg-foregound motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-foreground group-focus-visible:text-foreground">
                      About
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className="group flex items-center py-3"
                    href="#experience"
                  >
                    <span className="nav-indicator mr-4 h-px w-8 bg-muted-foreground transition-all group-hover:w-16 group-hover:bg-foregound group-focus-visible:w-16 group-focus-visible:bg-foregound motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-foreground group-focus-visible:text-foreground">
                      Experience
                    </span>
                  </a>
                </li>
                <li>
                  <a className="group flex items-center py-3" href="#projects">
                    <span className="nav-indicator mr-4 h-px w-8 bg-muted-foreground transition-all group-hover:w-16 group-hover:bg-foregound group-focus-visible:w-16 group-focus-visible:bg-foregound motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-foreground group-focus-visible:text-foreground">
                      Projects
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
            <li className="mr-5 text-xs shrink-0">
              <a
                className="block hover:text-foreground"
                href="https://github.com/JaredStanbrook"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
            </li>
            <li className="mr-5 text-xs shrink-0">
              <a
                className="block hover:text-foreground"
                href="https://www.linkedin.com/in/jaredstanbrook/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn (opens in a new tab)"
                title="LinkedIn"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
              </a>
            </li>
            <li className="mr-5 text-xs shrink-0">
              <a
                className="block hover:text-foreground"
                href="https://youtube.com/@JaredStanbrook"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Youtube (opens in a new tab)"
                title="CodePen"
              >
                <span className="sr-only">Youtube</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 310 310"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M297.917,64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359,0-61.369,5.776-72.517,19.938 C0,79.663,0,100.008,0,128.166v53.669c0,54.551,12.896,82.248,83.386,82.248h143.226c34.216,0,53.176-4.788,65.442-16.527 C304.633,235.518,310,215.863,310,181.835v-53.669C310,98.471,309.159,78.006,297.917,64.645z M199.021,162.41l-65.038,33.991 c-1.454,0.76-3.044,1.137-4.632,1.137c-1.798,0-3.592-0.484-5.181-1.446c-2.992-1.813-4.819-5.056-4.819-8.554v-67.764 c0-3.492,1.822-6.732,4.808-8.546c2.987-1.814,6.702-1.938,9.801-0.328l65.038,33.772c3.309,1.718,5.387,5.134,5.392,8.861 C204.394,157.263,202.325,160.684,199.021,162.41z"></path>
                </svg>
              </a>
            </li>
          </ul>
        </header>
        <main
          id="content"
          className="pt-24 lg:w-2/3 lg:py-24 text-muted-foreground"
        >
          <section
            id="about"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="About me"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                About
              </h2>
            </div>
            <div>
              <p className="mb-4 font-bold">Welcome — glad you’re here.</p>
              <p className="mb-4">
                I’m curious by nature and steady in how I work. I enjoy learning
                new things, taking on challenges, and contributing thoughtfully
                wherever I’m involved.
              </p>
              <p className="mb-4">
                I value clear communication, thoughtful work, and being reliable
                when it matters. I’m easy to collaborate with and enjoy
                contributing beyond my own lane.
              </p>
              <p className="mb-4">
                My background spans security, systems, and web development, but
                what matters most to me is clarity, reliability, and being
                someone people enjoy working with.
              </p>
              <p>
                This space is a snapshot of what I’ve been exploring lately —
                projects, ideas, and reflections as I continue figuring things
                out.
              </p>
            </div>
          </section>
          <section
            id="experience"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="Work experience"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-body/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                Experience
              </h2>
            </div>
            <div>
              <ol className="group/list">
                <li className="mb-12">
                  <Card>
                    <CardHeader>Jul — Dec 2025</CardHeader>
                    <CardContent>
                      <CardTitle href="https://teamfixit.github.io">
                        Project Activity Coordinator – TeamFixIT
                      </CardTitle>
                      <CardDescription>
                        Led a six-member startup-style team in the design and
                        development of a network security monitoring solution
                        for Murdoch University. Oversaw project planning, task
                        delegation, and milestone tracking while ensuring
                        alignment with client objectives. Coordinated
                        architecture and design reviews, integrated
                        contributions across technical and documentation roles,
                        and delivered a comprehensive design document under
                        strict deadlines.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Project Management</CardItem>
                        <CardItem>Team Leadership</CardItem>
                        <CardItem>Systems Design</CardItem>
                        <CardItem>Client Coordination</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>Feb — Jun 2025</CardHeader>
                    <CardContent>
                      <CardTitle href="/">
                        Web Developer – Envenge Group
                      </CardTitle>
                      <CardDescription>
                        Built a Django-based web application for monitoring
                        environmental compliance and project obligations.
                        Contributed to backend logic, user role management, and
                        documentation workflows in a rapid development team
                        setting. Used Docker and VS Code dev containers for a
                        consistent development environment.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Django</CardItem>
                        <CardItem>Docker</CardItem>
                        <CardItem>Backend Development</CardItem>
                        <CardItem>Team Collaboration</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>Aug — Nov 2024</CardHeader>
                    <CardContent>
                      <CardTitle href="/it-help-desk">
                        Student IT Service Desk – Murdoch University
                      </CardTitle>
                      <CardDescription>
                        As a part of my studies, I completed workplace learning,
                        providing IT support for students, spending shifts in
                        the Murdoch library assisting students with various
                        technical issues, including printing to the library
                        printers, installing software, connectivity issues with
                        various devices, and account support.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Customer Service</CardItem>
                        <CardItem>Communication</CardItem>
                        <CardItem>Troubleshooting</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>Jan 2023 — Aug 2024</CardHeader>
                    <CardContent>
                      <CardTitle href="/">
                        Independent | Disability Support Worker
                      </CardTitle>
                      <CardDescription>
                        I’ve been working as a disability support worker for
                        over a year. It’s been a humbling change of pace to my
                        usual occupation within warehousing; communicating and
                        engaging with clients who access the NDIS and supporting
                        them in reaching their rehabilitation goals have been a
                        rewarding experience, cultivating my development of
                        essential business skills.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Communication</CardItem>
                        <CardItem>Compassion</CardItem>
                        <CardItem>Problem-solving</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>Apr — Jun 2022</CardHeader>
                    <CardContent>
                      <CardTitle href="/">
                        Geological Field Technician | Driller — Sahara
                      </CardTitle>
                      <CardDescription>
                        During my 3-month contract at Sahara, our team
                        efficiently delegated tasks to meet KPIs while
                        collectively managing the drill rig. My responsibilities
                        included precise data entry for geological sampling,
                        operating the drill rig, and setting up an Excel
                        spreadsheet to record data. I utilized advanced Excel
                        formulas to ensure data accuracy and integrity.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Safety</CardItem>
                        <CardItem>Adaptability</CardItem>
                        <CardItem>Analytical</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>2021 — Dec 2023 </CardHeader>
                    <CardContent>
                      <CardTitle href="/">
                        Forklift Driver | Inbound & Outbound Officer |
                        Production Line — Jasol
                      </CardTitle>
                      <CardDescription>
                        During my two-year tenure at Jasol, I started by
                        supporting order fulfillment and relieving pressure on
                        warehouse officers during busy periods. Gradually, I
                        transitioned to a more hands-on role in chemical pumping
                        on the production line and took on additional
                        responsibilities in product distribution. Although my
                        technical skills weren't directly utilized, I leveraged
                        my system understanding to innovate production line
                        systems.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Communication</CardItem>
                        <CardItem>Compassion</CardItem>
                        <CardItem>Problem-solving</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
              </ol>
              <div className="mt-12">
                <a
                  className="inline-flex items-baseline leading-tight text-foreground hover:text-primary focus-visible:text-primary font-semibold group/link text-base"
                  href="https://stanbrook.me/jared_stanbrook_cyber_resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="View Full Résumé (opens in a new tab)"
                >
                  <span>
                    View Full&nbsp;
                    <span className="inline-block">
                      Résumé
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </section>
          <section
            id="projects"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="Selected projects"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                Projects
              </h2>
            </div>
            <div>
              <ul className="group/list">
                {featuredProjects.map((project) => (
                  <li className="mb-12" key={project.slug}>
                    <Card>
                      <CardContent>
                        <CardTitle href={`/projects/${project.slug}`}>
                          {project.title}
                        </CardTitle>
                        <CardDescription>{project.summary}</CardDescription>
                        <CardFooter>
                          {project.techStack.map((item) => (
                            <CardItem key={`${project.slug}-${item}`}>
                              {item}
                            </CardItem>
                          ))}
                        </CardFooter>
                      </CardContent>
                      {project.screenshots?.[0] && (
                        <CardImage
                          src={project.screenshots[0]}
                          alt={project.title}
                        />
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
              <div className="mt-12">
                <Link
                  className="inline-flex items-center font-medium leading-tight text-foreground group"
                  aria-label="View Full Project Archive"
                  to="/projects"
                >
                  <span>
                    <span className="border-b border-transparent pb-px transition group-hover:border-primary motion-reduce:transition-none">
                      View Full Project&nbsp;
                    </span>
                    <span className="whitespace-nowrap">
                      <span className="border-b border-transparent pb-px transition group-hover:border-primary motion-reduce:transition-none">
                        Archive
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="ml-1 inline-block h-4 w-4 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </section>
          <footer className="max-w-md pb-16 text-sm text-secondary-foreground sm:pb-0">
            <p>
              Coded in&nbsp;
              <a
                href="https://code.visualstudio.com/"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Visual Studio Code (opens in a new tab)"
              >
                Visual Studio Code
              </a>
              &nbsp; with my bare hands. Built with&nbsp;
              <a
                href="https://react.dev/"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="React.dev (opens in a new tab)"
              >
                React
              </a>
              &nbsp;and&nbsp;
              <a
                href="https://tailwindcss.com/"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Tailwind CSS (opens in a new tab)"
              >
                Tailwind CSS
              </a>
              , deployed with&nbsp;
              <a
                href="https://www.cloudflare.com"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Cloudflare (opens in a new tab)"
              >
                Cloudflare
              </a>
              .
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
