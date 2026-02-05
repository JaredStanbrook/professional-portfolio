import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/resume-builder")({
  component: Resume,
});

function Resume() {
  return (
    <div className="m-0 p-0 absolute left-0 top-0 w-full">
      <div className="w-full max-w-[210mm] mx-auto bg-white p-4 print:p-0 print:shadow-none">
        {/* Header with Contact Info */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-4">Jared Stanbrook</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
            <a
              href="mailto:jared.stanbrook@outlook.com"
              className="flex items-center hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              jared.stanbrook@outlook.com
            </a>
            <a href="tel:+61418407644" className="flex items-center hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              (+61) 418 407 644
            </a>
            <a
              href="https://github.com/JaredStanbrook"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              github.com/JaredStanbrook
            </a>
            <a
              href="https://jaredstanbrook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              jaredstanbrook.com
            </a>
          </div>
        </header>

        {/* Profile Section */}
        <Section title="Profile">
          <p>
            A passionate problem solver with nine years of experience in information technology. I
            focus on creating solutions that improve efficiency and user experience. I work well
            with diverse teams and enjoy helping others with their technology needs.
          </p>
        </Section>

        {/* Skills Section */}
        <Section title="Skills">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-4">
            <SkillBox
              title="Programming Languages"
              skills={["JavaScript (ES2015+), Typescript", "HTML, CSS, PHP", "C#, C++, Python"]}
            />

            <SkillBox
              title="Libraries & Frameworks"
              skills={["MongoDB, MySQL", "React, NodeJS, Express", "PyGame, Hono, SQLite, Django"]}
            />

            <SkillBox
              title="Tools & Platforms"
              skills={[
                "Linux, Windows, MacOS",
                "Git, GitHub, Azure, Google Cloud",
                "Docker, Webpack, Cloudflare",
              ]}
            />
          </div>

          <div className="mt-4">
            <SkillBox
              title="Methodologies"
              skills={[
                "Software Development Lifecycle (SDLC)",
                "Agile Methodology (Scrum, Kanban)",
                "DevOps Practices",
              ]}
            />
          </div>
        </Section>

        {/* Work Experience */}
        <Section title="Work Experience">
          <JobExperience
            title="Web Developer"
            company="Envenge Group"
            period="Feb 2025 — Jun 2025"
            description="Built a Django web app for environmental management and compliance tracking."
            keyExperiences={[
              "Developed modular, accessible Django app for tracking obligations and compliance.",
              "Used Docker and VS Code dev container for consistent development.",
              "Implemented features for documentation, user roles, and workflow management.",
            ]}
          />

          <JobExperience
            title="Help Desk"
            company="Student IT Service Desk (Murdoch University)"
            period="August 2024 — Nov 2024"
            description="As a part of my studies, I completed workplace learning, providing IT support for students, spending shifts in the Murdoch library assisting students with various technical issues, including printing to the library printers, installing software, connectivity issues with various devices, and account support."
            keyExperiences={[
              "Developed strong customer service and communication skills.",
              "Troubleshot and resolved a range of technical problems under pressure.",
            ]}
          />

          <JobExperience
            title="Disability Support Worker"
            company="Independent"
            period="Jan 2023 — Aug 2024"
            description="Worked as a disability support worker, assisting NDIS clients with rehabilitation goals and building strong client relationships."
            keyExperiences={[
              "Communicated effectively and built positive client relationships.",
              "Supported clients in achieving rehabilitation goals with empathy.",
              "Developed essential business skills through hands-on experience.",
            ]}
          />
        </Section>
        {/* Projects */}
        <Section title="Projects">
          <ProjectExperience
            title="Greenova"
            company="Envenge Group"
            period="Feb 2025 — Jun 2025"
            description="As part of my work at Envenge Group, I developed Greenova, a web application designed to streamline environmental management and compliance tracking for organisations. The platform was built using Django and features a modular, accessible web interface."
            keyExperiences={[
              "Designed and implemented a Django-based web app with a focus on usability and modularity.",
              "Utilised Docker and a VS Code dev container to create a consistent, reproducible development environment.",
              "Developed features for managing environmental obligations, documentation, and team responsibilities, supporting efficient compliance workflows.",
            ]}
          />

          <ProjectExperience
            title="Student Web Portal"
            company="Student IT Service Desk"
            period="Aug 2024 — Nov 2024"
            description="Implemented a static web portal using TypeScript for staff to log customer interactions and collect feedback, integrated with Cloudflare D1 for secure data storage."
            keyExperiences={[
              "Utilised Cloudflare Pages for fast, reliable hosting and integrated with Cloudflare D1 for backend data management.",
              "Improved staff workflow and data tracking by providing an efficient, accessible digital tool.",
            ]}
          />
        </Section>

        {/* Education and References in two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:break-inside-avoid">
          <Section title="Education">
            <div className="mb-4 print:break-inside-avoid">
              <h3 className="font-bold text-lg">CERTIFICATES</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>
                  (SC-900) Microsoft Certified: Security, Compliance, and Identity Fundamentals
                </li>
              </ul>
            </div>

            <div className="mb-4 print:break-inside-avoid">
              <h3 className="font-bold text-lg">UNIVERSITY OF MURDOCH (Current)</h3>
              <p className="text-gray-700">Bachelor of Information Technology, 2021</p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>CYBER SECURITY AND FORENSICS (MAJOR)</li>
                <li>Member, Murdoch IT Society</li>
                <li>Member, Murdoch Programming Club</li>
              </ul>
            </div>

            <div className="print:break-inside-avoid">
              <h3 className="font-bold text-lg">MAZENOD COLLEGE (Graduated)</h3>
              <p className="text-gray-700">Graduated Class of 2019.</p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Member of Computer Club</li>
                <li>Member of Basketball Team</li>
              </ul>
            </div>
          </Section>

          <Section title="References">
            <div className="mb-4 print:break-inside-avoid">
              <h3 className="font-bold">Paul Redman</h3>
              <p className="text-gray-700">Lecturer in Information Technology</p>
              <p className="text-gray-700">Mobile: 0417 984 192</p>
              <p className="text-gray-700">Email: paul.redman@murdoch.edu.au</p>
            </div>

            <div className="mb-4 print:break-inside-avoid">
              <h3 className="font-bold">Stephan Woodtli</h3>
              <p className="text-gray-700">Senior Geologist of Liatam Mining</p>
              <p className="text-gray-700">Email: woodti85@gmail.com</p>
              <p className="text-gray-700">Mobile: 0422 509 401</p>
            </div>

            <div className="mb-4 print:break-inside-avoid">
              <h3 className="font-bold">Megan Cole</h3>
              <p className="text-gray-700">Associate Lecturer, Teaching, and Research</p>
              <p className="text-gray-700">Teams: 20100485@murdoch.edu.au</p>
              <p className="text-gray-700">Email: m.cole@murdoch.edu.au</p>
            </div>

            <p className="text-gray-700 italic">+ Additional references upon request</p>
          </Section>
        </div>

        {/* Page guides for development (hidden in print) */}
        <div className="w-full max-w-[210mm] print:hidden">
          <div className="border-t-2 border-dashed border-gray-400 mt-8 mb-2">
            <p className="text-sm text-gray-500 text-center -mt-3 bg-gray-100 inline-block px-4">
              A4 Page End
            </p>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>Page dimensions: 210mm × 297mm</span>
            <span>Use print preview to check pagination</span>
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => window.print()}
              className="bg-primary hover:bg-primary-focus text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200">
              Print Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section component for consistent styling
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section className="mb-2">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div className="h-1 bg-gray-200 mb-4"></div>
      {children}
    </section>
  );
};
// SkillBox component for skill categories
const SkillBox = ({ title, skills }: { title: string; skills: string[] }) => {
  return (
    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
      <h3 className="font-bold mb-2">{title}</h3>
      <ul className="list-disc pl-5 text-gray-700">
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

// JobExperience component for work history
interface JobExperienceProps {
  title: string;
  company: string;
  period: string;
  description: string;
  keyExperiences?: string[];
}

const JobExperience = ({
  title,
  company,
  period,
  description,
  keyExperiences,
}: JobExperienceProps) => {
  return (
    <div className="mb-6 print:break-inside-avoid">
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2 print:flex-row print:justify-between print:items-baseline print:gap-4">
        <h4 className="text-base font-semibold print:text-base">
          {title} — {company}
        </h4>
        <span className="text-gray-600 italic print:text-gray-800 print:italic">{period}</span>
      </div>
      <p className="text-gray-700 mb-2">{description}</p>
      {keyExperiences && (
        <>
          <p className="font-medium mt-2">Key Experience:</p>
          <ul className="list-disc pl-5 text-gray-700">
            {keyExperiences.map((experience, index) => (
              <li key={index}>{experience}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

// ProjectExperience component for projects
interface ProjectExperienceProps {
  title: string;
  company: string;
  period: string;
  description: string;
  keyExperiences?: string[];
}

const ProjectExperience = ({
  title,
  company,
  period,
  description,
  keyExperiences,
}: ProjectExperienceProps) => {
  return (
    <div className="mb-6 print:break-inside-avoid">
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
        <h3 className="text-xl font-semibold">
          {title} — {company}
        </h3>
        <span className="text-gray-600 italic">{period}</span>
      </div>
      <p className="text-gray-700 mb-2">{description}</p>
      {keyExperiences && (
        <>
          <p className="font-medium mt-2">Key Experience:</p>
          <ul className="list-disc pl-5 text-gray-700">
            {keyExperiences.map((experience, index) => (
              <li key={index}>{experience}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
