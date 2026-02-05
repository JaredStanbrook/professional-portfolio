import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogsQueryOptions } from "@/api/blogApi";

export const Route = createFileRoute("/blog/tags/$tag")({
  component: BlogTagView,
});

function BlogTagView() {
  const { tag } = Route.useParams();
  const { data: blogs = [], isLoading } = useQuery(getAllBlogsQueryOptions);

  const filtered = blogs.filter((blog) => {
    if (blog.draft) return false;
    const tags = blog.tags?.length ? blog.tags : blog.subject ? [blog.subject] : [];
    return tags.includes(tag);
  });

  return (
    <div className="min-h-screen space-y-8">
      <header className="space-y-3 border-b border-border pb-6">
        <Link to="/blog/tags" className="text-sm text-muted-foreground hover:text-primary">
          ← All tags
        </Link>
        <h1 className="text-3xl font-semibold md:text-4xl">{tag}</h1>
        <p className="text-muted-foreground">{filtered.length} posts</p>
      </header>

      {isLoading && <p className="text-muted-foreground">Loading posts...</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="text-muted-foreground">No posts published for this tag yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((blog) => (
          <Link
            key={blog.filename}
            to="/blog/$slug"
            params={{ slug: blog.slug }}
            className="rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40">
            <div className="text-xs text-muted-foreground">{blog.readTime} min read</div>
            <h2 className="mt-2 text-lg font-semibold text-foreground">{blog.title}</h2>
            {blog.summary && <p className="mt-2 text-sm text-muted-foreground">{blog.summary}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
