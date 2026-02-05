// routes/blog/$slug.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useQuery } from "@tanstack/react-query";
import { getUserQueryOptions } from "@/api/authApi";
import { getBlogContentQueryOptions } from "@/api/blogApi";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogView,
});

function BlogView() {
  const { slug } = Route.useParams();
  const filename = `${slug}.mdx`;
  const navigate = useNavigate();

  const { data: userData } = useQuery(getUserQueryOptions);
  const { data: blog, isPending, error } = useQuery(getBlogContentQueryOptions(filename));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {error?.message || "Blog not found"}
          </h1>
          <Button variant="outline" onClick={() => navigate({ to: "/blog" })}>
            <span className="text-base">Back</span>
            <span className="text-xs ml-1 text-foreground/75">Back</span>
            <span className="text-tiny ml-1 text-foreground/50">Back</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center py-8 gap-3">
        <Button variant="outline" onClick={() => navigate({ to: "/blog" })}>
          <span className="text-base">Back</span>
          <span className="text-xs ml-1 text-foreground/75">Back</span>
          <span className="text-tiny ml-1 text-foreground/50">Back</span>
        </Button>

        {(userData?.id === blog.metadata.authorId ||
          userData?.roles?.includes("admin") ||
          userData?.roles?.includes("editor")) && (
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/editor/$slug", params: { slug } })}>
            Edit
          </Button>
        )}
      </div>

      <div className="min-h-screen bg-background">
        <section className="relative bg-linear-to-br from-background via-background to-muted/20">
          <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                {blog.metadata.subject}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">
                {blog.metadata.readTime} min read
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-sm text-muted-foreground">{blog.metadata.authorName}</span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(blog.metadata.createdAt)}
              </span>

              {blog.metadata.createdAt !== blog.metadata.updatedAt && (
                <>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-sm text-muted-foreground italic">
                    Updated {formatDate(blog.metadata.updatedAt)}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              {blog.metadata.title}
            </h1>

            {blog.metadata.summary && (
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                {blog.metadata.summary}
              </p>
            )}

            {blog.metadata.tags?.length ? (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <article
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-foreground 
                prose-p:text-muted-foreground
                prose-a:text-primary hover:prose-a:text-primary/80
                prose-strong:text-foreground
                prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                prose-img:rounded-lg prose-img:shadow-lg
                prose-hr:border-border">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ className, children, ...props }) {
                    const isBlock = className?.includes("language-");
                    if (!isBlock) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                    const rawCode = String(children).replace(/\n$/, "");
                    return <CodeBlock code={rawCode} className={className} />;
                  },
                }}>
                {blog.content}
              </ReactMarkdown>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}

function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md border border-border bg-background/80 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={className}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
