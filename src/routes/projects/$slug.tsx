import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/utils";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const project = projects.find((item) => item.slug === slug);
  const updatedAt = project?.updatedAt ?? project?.startedAt;
  const screenshotCount = project?.screenshots?.length ?? 0;
  const screenshotGridClass =
    screenshotCount <= 1
      ? "grid-cols-1"
      : screenshotCount === 2
        ? "grid-cols-1"
        : screenshotCount <= 4
          ? "grid-cols-2"
          : "grid-cols-3";
  const [floatingPos, setFloatingPos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetPos.current = { x: event.clientX, y: event.clientY };
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      setFloatingPos((prev) => ({
        x: Math.round(prev.x + (targetPos.current.x - prev.x) * 0.12),
        y: Math.round(prev.y + (targetPos.current.y - prev.y) * 0.12),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 lg:py-20">
        <h1 className="text-3xl font-semibold">Project not found</h1>
        <p className="text-muted-foreground max-w-md">
          We couldn’t find that project. Try heading back to the archive to
          explore available work.
        </p>
        <Button onClick={() => navigate({ to: "/projects" })}>
          Back to projects
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center py-8 gap-3">
        <Button variant="outline" onClick={() => navigate({ to: "/projects" })}>
          <span className="text-base">Back</span>
          <span className="text-xs ml-1 text-foreground/75">Back</span>
          <span className="text-tiny ml-1 text-foreground/50">Back</span>
        </Button>
      </div>

      <div className="min-h-screen bg-background">
        <section className="relative bg-linear-to-br from-background via-background to-muted/20">
          {(project.techStack.length > 0 || project.learnings.length > 0) && (
            <div
              className="hidden lg:block fixed pointer-events-none z-30"
              style={{
                left: 0,
                top: 0,
                transform: `translate(${floatingPos.x + 18}px, ${floatingPos.y + 18}px)`,
              }}
            >
              <div className="space-y-6 rounded-2xl border border-border bg-card/95 p-6 shadow-lg backdrop-blur">
                {project.techStack.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Tech stack
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={`${project.slug}-${tech}`}
                          className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.learnings.length > 0 && (
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
                )}
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto px-6 py-16 lg:py-24 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-12">
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  {project.status}
                </span>
                {project.featured && (
                  <span className="text-sm font-medium text-primary">
                    Featured
                  </span>
                )}
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-sm text-muted-foreground">
                  Started{" "}
                  {formatRelativeDate(project.startedAt, { fallback: "N/A" })}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-sm text-muted-foreground">
                  Updated {formatRelativeDate(updatedAt, { fallback: "N/A" })}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-sm text-muted-foreground">
                  Polish {project.polishedScore}/5
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                {project.title}
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl">
                {project.summary}
              </p>
              {(project.summary || project.problem || project.solution) && (
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {[project.summary, project.problem, project.solution]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={`${project.slug}-${tag}`}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
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
                      rel="noreferrer noopener"
                    >
                      Live site
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      className="text-primary hover:text-primary/80"
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      GitHub repository
                    </a>
                  )}
                  {project.links.caseStudy && (
                    <a
                      className="text-primary hover:text-primary/80"
                      href={project.links.caseStudy}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Case study
                    </a>
                  )}
                  {!project.links.live &&
                    !project.links.github &&
                    !project.links.caseStudy && (
                      <span className="text-muted-foreground">
                        No public links available.
                      </span>
                    )}
                </div>
              </div>
            </header>

            <section className="grid gap-8 lg:grid-cols-[1.8fr]">
              <div className="space-y-4">
                {project.screenshots?.length ? (
                  <div className={`grid gap-4 ${screenshotGridClass}`}>
                    {project.screenshots.map((shot) => (
                      <img
                        key={shot}
                        src={shot}
                        alt={`${project.title} screenshot`}
                        className="aspect-square w-full rounded-2xl border border-border object-cover shadow-sm"
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    Screenshots coming soon.
                  </div>
                )}
              </div>

              <aside className="lg:hidden space-y-6 rounded-2xl border border-border bg-card p-6">
                {(project.techStack.length > 0 ||
                  project.learnings.length > 0) && (
                  <div className="space-y-6">
                    {project.techStack.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Tech stack
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={`${project.slug}-${tech}-aside`}
                              className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.learnings.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Key learnings
                        </h3>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                          {project.learnings.map((learning) => (
                            <li key={`${project.slug}-${learning}-aside`}>
                              {learning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </aside>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
