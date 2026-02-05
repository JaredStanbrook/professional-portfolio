import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-3xl font-semibold">Project not found</h1>
        <p className="text-muted-foreground max-w-md">
          We couldn’t find that project. Try heading back to the archive to explore available work.
        </p>
        <Button onClick={() => navigate({ to: "/projects" })}>Back to projects</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-10">
      <header className="space-y-6 border-b border-border pb-8">
        <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to projects
        </Link>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {project.status}
            </span>
            {project.featured && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Featured
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Updated {project.updatedAt ?? project.startedAt}
            </span>
          </div>
          <h1 className="text-4xl font-semibold md:text-5xl">{project.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{project.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={`${project.slug}-${tag}`}
              className="rounded-full bg-muted/70 px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {project.screenshots?.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {project.screenshots.map((shot) => (
            <img
              key={shot}
              src={shot}
              alt={`${project.title} screenshot`}
              className="rounded-2xl border border-border"
              loading="lazy"
            />
          ))}
        </section>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Summary</h2>
            <p className="text-muted-foreground">{project.summary}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Problem</h2>
            <p className="text-muted-foreground">{project.problem}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Solution</h2>
            <p className="text-muted-foreground">{project.solution}</p>
          </div>
        </div>

        <aside className="space-y-6 rounded-2xl border border-border bg-card p-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Tech stack
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={`${project.slug}-${tech}`}
                  className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Key learnings
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {project.learnings.map((learning) => (
                <li key={learning}>{learning}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Links
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {project.links.live && (
                <a
                  className="text-primary hover:text-primary/80"
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener">
                  Live site
                </a>
              )}
              {project.links.github && (
                <a
                  className="text-primary hover:text-primary/80"
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer noopener">
                  GitHub repository
                </a>
              )}
              {project.links.caseStudy && (
                <a
                  className="text-primary hover:text-primary/80"
                  href={project.links.caseStudy}
                  target="_blank"
                  rel="noreferrer noopener">
                  Case study
                </a>
              )}
              {!project.links.live && !project.links.github && !project.links.caseStudy && (
                <span className="text-muted-foreground">No public links available.</span>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
