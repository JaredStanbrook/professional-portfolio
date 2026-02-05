import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogsQueryOptions } from "@/api/blogApi";
import { normalizeBlogSlug } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
});

function BlogIndex() {
  const { data: blogs = [], isLoading } = useQuery(getAllBlogsQueryOptions);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((blog) => {
      const tags = blog.tags?.length
        ? blog.tags
        : blog.subject
          ? [blog.subject]
          : [];
      tags.forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const visibleBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogs
      .filter((blog) => !blog.draft)
      .filter((blog) => {
        if (!selectedTag) return true;
        const tags = blog.tags?.length
          ? blog.tags
          : blog.subject
            ? [blog.subject]
            : [];
        return tags.includes(selectedTag);
      })
      .filter((blog) => {
        if (!query) return true;
        return (
          blog.title.toLowerCase().includes(query) ||
          (blog.summary ?? "").toLowerCase().includes(query) ||
          blog.subject.toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [blogs, search, selectedTag]);

  const featured = visibleBlogs.filter((blog) => blog.featured).slice(0, 2);
  const remaining = visibleBlogs.filter((blog) => !blog.featured);

  return (
    <div className="min-h-screen space-y-10 lg:py-20">
      <header className="space-y-4 border-b border-border pb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Blog
        </p>
        <h1 className="text-4xl font-semibold md:text-5xl">
          Writing on security and systems.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Research notes, build logs, and reflections from real-world security
          and infrastructure work.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <input
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Search posts"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search blog posts"
          />

          {isLoading && (
            <p className="text-muted-foreground">Loading posts...</p>
          )}

          {!isLoading && visibleBlogs.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              No posts match your search yet.
            </div>
          )}

          {featured.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Featured
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {featured.map((blog) => (
                  <BlogCard key={blog.filename} blog={blog} featured />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              All posts
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {remaining.map((blog) => (
                <BlogCard key={blog.filename} blog={blog} />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="text-sm font-medium">Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    selectedTag === tag
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  }`}
                  onClick={() =>
                    setSelectedTag((prev) => (prev === tag ? null : tag))
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <Link
            to="/blog/tags"
            className="text-sm text-primary hover:text-primary/80"
          >
            Browse all tags →
          </Link>
        </aside>
      </section>
    </div>
  );
}

function BlogCard({
  blog,
  featured = false,
}: {
  blog: {
    filename: string;
    title: string;
    summary?: string | null;
    subject: string;
    readTime: number;
    createdAt: string;
    slug: string;
  };
  featured?: boolean;
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: normalizeBlogSlug(blog.slug) }}
      className={`block rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 focus-
  visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
    featured ? "md:col-span-1" : ""
  }`}
    >
      <article>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1">
            {blog.subject}
          </span>
          <span>{blog.readTime} min read</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{blog.title}</h3>
        {blog.summary && (
          <p className="mt-2 text-sm text-muted-foreground">{blog.summary}</p>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </article>
    </Link>
  );
}
