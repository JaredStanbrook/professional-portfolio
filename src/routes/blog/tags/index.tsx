import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAllBlogsQueryOptions } from "@/api/blogApi";

export const Route = createFileRoute("/blog/tags")({
  component: BlogTags,
});

function BlogTags() {
  const { data: blogs = [], isLoading } = useQuery(getAllBlogsQueryOptions);

  const tags = useMemo(() => {
    const tagMap = new Map<string, number>();
    blogs
      .filter((blog) => !blog.draft)
      .forEach((blog) => {
        const list = blog.tags?.length ? blog.tags : blog.subject ? [blog.subject] : [];
        list.forEach((tag) => tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1));
      });
    return Array.from(tagMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [blogs]);

  return (
    <div className="min-h-screen space-y-8">
      <header className="space-y-3 border-b border-border pb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Tags</p>
        <h1 className="text-3xl font-semibold md:text-4xl">Browse by topic</h1>
        <p className="text-muted-foreground">Explore posts grouped by tags and themes.</p>
      </header>

      {isLoading && <p className="text-muted-foreground">Loading tags...</p>}

      {!isLoading && tags.length === 0 && (
        <p className="text-muted-foreground">No tags available yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tags.map(([tag, count]) => (
          <Link
            key={tag}
            to="/blog/tags/$tag"
            params={{ tag }}
            className="rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40">
            <div className="text-sm font-semibold text-foreground">{tag}</div>
            <div className="text-xs text-muted-foreground">{count} posts</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
