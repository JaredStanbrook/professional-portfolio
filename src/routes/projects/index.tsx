import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { projects, type Project, type ProjectStatus } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/utils";

const SORT_OPTIONS = ["Newest", "Oldest", "Most polished"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const STATUS_LABELS: ProjectStatus[] = [
  "Active",
  "Shipped",
  "Paused",
  "Archived",
  "Completed",
];

export const Route = createFileRoute("/projects/")({
  component: ProjectsArchive,
});

function ProjectsArchive() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "All">(
    "All",
  );
  const [sortBy, setSortBy] = useState<SortOption>("Newest");
  const [visibleCount, setVisibleCount] = useState(6);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((project) =>
      project.tags.forEach((tag) => tagSet.add(tag)),
    );
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredProjects = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return projects
      .filter((project) => {
        if (selectedStatus !== "All" && project.status !== selectedStatus)
          return false;
        if (
          selectedTags.length > 0 &&
          !selectedTags.every((tag) => project.tags.includes(tag))
        ) {
          return false;
        }
        if (!lowerSearch) return true;
        return (
          project.title.toLowerCase().includes(lowerSearch) ||
          project.summary.toLowerCase().includes(lowerSearch) ||
          project.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
        );
      })
      .sort((a, b) => {
        if (sortBy === "Newest") {
          return (
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          );
        }
        if (sortBy === "Oldest") {
          return (
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
          );
        }
        return b.polishedScore - a.polishedScore;
      });
  }, [search, selectedStatus, selectedTags, sortBy]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const toggleTag = (tag: string) => {
    setVisibleCount(6);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setSelectedStatus("All");
    setSortBy("Newest");
    setVisibleCount(6);
  };

  return (
    <div className="min-h-screen text-foreground lg:py-20">
      <header className="flex flex-col gap-6 border-b border-border pb-8">
        <div className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Project Archive
          </p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            Made with my bare hands.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A curated archive of projects forged from a passion for learning and
            crafting. Filter by tags, status, or seach for one you have in mind.
          </p>
        </div>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <label className="text-sm font-medium">Search</label>
            <input
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground"
              placeholder="Search projects, tags, or keywords"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search projects"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selectedTags.includes(tag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                }`}
                onClick={() => toggleTag(tag)}
                aria-pressed={selectedTags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              No projects match these filters. Try clearing filters or
              broadening your search.
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 6)}
              >
                Load more
              </Button>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Status</p>
              <div className="flex flex-wrap gap-2">
                {["All", ...STATUS_LABELS].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      selectedStatus === status
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                    }`}
                    onClick={() => {
                      setVisibleCount(6);
                      setSelectedStatus(status as ProjectStatus | "All");
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Sort by</p>
              <select
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                aria-label="Sort projects"
              >
                {SORT_OPTIONS.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Button variant="ghost" onClick={resetFilters} className="w-full">
                Reset filters
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <p className="text-sm font-medium">Featured focus</p>
            <p className="text-sm text-muted-foreground">
              Projects flagged as featured appear on the homepage and the About
              page.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {project.status}
          </span>
          {project.featured && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Featured
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          <Link to="/projects/$slug" params={{ slug: project.slug }}>
            {project.title}
          </Link>
        </h2>
        <p className="text-sm text-muted-foreground">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={`${project.slug}-${tag}`}
              className="rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Started {formatRelativeDate(project.startedAt)}</span>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="text-primary hover:text-primary/80"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
