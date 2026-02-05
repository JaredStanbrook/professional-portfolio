import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Loader2, AlertCircle } from "lucide-react";

import { getBlogContentQueryOptions, usePutBlogMutation } from "@/api/blogApi";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/editor/$slug")({
  component: EditBlogEditor,
});

function EditBlogEditor() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [draft, setDraft] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState("");
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const currentFilename = `${slug}.mdx`;
  const putBlog = usePutBlogMutation();

  const {
    data: initialBlogData,
    isPending: isLoadingBlog,
    error: loadError,
    isError,
  } = useQuery(getBlogContentQueryOptions(currentFilename));

  // Load existing blog data once
  useEffect(() => {
    if (initialBlogData && !hasLoadedData) {
      setTitle(initialBlogData.metadata.title);
      setReadTime(initialBlogData.metadata.readTime);
      setSubject(initialBlogData.metadata.subject);
      setSummary(initialBlogData.metadata.summary ?? "");
      setTags(initialBlogData.metadata.tags?.join(", ") ?? "");
      setPublishedAt(
        initialBlogData.metadata.publishedAt
          ? initialBlogData.metadata.publishedAt.slice(0, 16)
          : ""
      );
      setUpdatedAt(
        initialBlogData.metadata.updatedAt ? initialBlogData.metadata.updatedAt.slice(0, 16) : ""
      );
      setDraft(initialBlogData.metadata.draft ?? false);
      setFeatured(initialBlogData.metadata.featured ?? false);
      setContent(initialBlogData.content);
      setHasLoadedData(true);
      toast.success(`Loaded: ${initialBlogData.metadata.title}`);
    }
  }, [initialBlogData, hasLoadedData]);

  // Handle load error
  useEffect(() => {
    if (isError && loadError) {
      toast.error("Failed to load blog post.");
      navigate({ to: "/" });
    }
  }, [isError, loadError, navigate]);

  // Parse content without frontmatter for preview
  const contentWithoutFrontmatter = useMemo(() => {
    return content.replace(/^---\n[\s\S]+?\n---\n/, "").trim();
  }, [content]);

  const toIsoString = (value: string) =>
    value ? new Date(value).toISOString() : new Date().toISOString();

  const generateMDX = () => {
    return `---
title: "${title.trim()}"
readTime: ${readTime}
subject: "${subject.trim()}"
summary: "${summary.trim()}"
tags: [${tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => `"${tag}"`)
      .join(", ")}]
draft: ${draft}
featured: ${featured}
publishedAt: "${toIsoString(publishedAt)}"
updatedAt: "${toIsoString(updatedAt)}"
---

${content.trim()}`;
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject is required.");
      return;
    }

    if (!content.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }

    if (readTime < 1) {
      toast.error("Read time must be at least 1 minute.");
      return;
    }

    try {
      const mdxContent = generateMDX();
      await putBlog.mutateAsync({
        filename: currentFilename,
        content: mdxContent,
      });

      toast.success("Blog updated successfully!");
      navigate({ to: "/blog/$slug", params: { slug } });
    } catch (error: any) {
      console.error("Error saving blog:", error);
      toast.error(error?.message || "Failed to save blog.");
    }
  };

  const handleCancel = () => {
    navigate({ to: "/blog/$slug", params: { slug } });
  };

  if (isLoadingBlog) {
    return (
      <div className="container flex-grow flex items-center justify-center min-h-[50vh] max-w-7xl mx-auto p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Loading blog content...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container flex-grow flex items-center justify-center min-h-[50vh] max-w-7xl mx-auto p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Failed to Load Blog</h2>
          <p className="text-muted-foreground">Could not load the blog post. It may not exist.</p>
          <Button onClick={() => navigate({ to: "/" })}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 flex flex-col mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog: {title || slug}</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Metadata Section */}
          <div className="rounded-lg border shadow-lg p-6 space-y-4 bg-card">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Metadata</h2>

            <div>
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                type="text"
                value={currentFilename}
                disabled
                className="cursor-not-allowed bg-muted/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Filename cannot be changed after creation
              </p>
            </div>

            <div>
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Amazing Blog Post"
                required
              />
            </div>

            <div>
              <Label htmlFor="readTime">
                Read Time (minutes) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="readTime"
                value={readTime}
                onChange={(e) => {
                  const val = e.target.value;
                  setReadTime(val === "" ? 0 : parseInt(val));
                }}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Technology, Design, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="summary">Summary</Label>
              <Input
                id="summary"
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Short summary for previews"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="security, cloud, tooling"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="publishedAt">Published At</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="updatedAt">Updated At</Label>
                <Input
                  id="updatedAt"
                  type="datetime-local"
                  value={updatedAt}
                  onChange={(e) => setUpdatedAt(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft}
                  onChange={(e) => setDraft(e.target.checked)}
                />
                Draft
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Featured
              </label>
            </div>
          </div>

          {/* Content Editor */}
          <div className="rounded-lg border shadow-lg p-6 bg-card">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Content (MDX)</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Write your heading here

This is a paragraph with **bold** and *italic* text.

## Subheading

### Lists work too:
- Item 1
- Item 2

```javascript
// Code blocks are supported
console.log('Hello, world!');
```"
              className="w-full h-96 min-h-[300px] px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background font-mono text-sm resize-y"
            />
          </div>

          <div className="flex gap-3 pb-12">
            <Button onClick={handleSave} disabled={putBlog.isPending} className="w-full">
              {putBlog.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="rounded-lg border shadow-lg p-6 bg-card lg:sticky lg:top-24 lg:max-h-[85vh] lg:overflow-y-auto">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">Live Preview</h2>

          <div className="mb-4 p-4 rounded border bg-muted/50">
            <h3 className="text-xl font-bold">{title || "Untitled"}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              {readTime} min read • {subject || "No subject"}
            </div>
            {summary && <p className="mt-2 text-sm text-muted-foreground">{summary}</p>}
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-foreground 
          prose-p:text-muted-foreground
          prose-a:text-primary hover:prose-a:text-primary/80
          prose-strong:text-foreground
          prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-muted prose-pre:border prose-pre:border-border
          prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
          prose-img:rounded-lg prose-img:shadow-lg
          prose-hr:border-border
        ">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {contentWithoutFrontmatter || "*Start typing to see preview...*"}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
