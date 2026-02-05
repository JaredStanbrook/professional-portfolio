import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";

import { usePutBlogMutation } from "@/api/blogApi";

export const Route = createFileRoute("/_authenticated/editor/")({
  component: NewBlogEditor,
});

function NewBlogEditor() {
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
  const [filename, setFilename] = useState("");

  // blog mutation
  const putBlog = usePutBlogMutation();

  const contentWithoutFrontmatter = useMemo(() => {
    return content.replace(/^---\n[\s\S]+?\n---\n/, "").trim();
  }, [content]);

  const toIsoString = (value: string) =>
    value ? new Date(value).toISOString() : new Date().toISOString();

  const generateMDX = () => {
    const lines = [
      `title: "${title.trim()}"`,
      `readTime: ${readTime}`,
      `subject: "${subject.trim()}"`,
    ];

    if (summary.trim()) {
      lines.push(`summary: "${summary.trim()}"`);
    }

    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => `"${tag}"`);
    if (tagList.length) {
      lines.push(`tags: [${tagList.join(", ")}]`);
    }

    if (draft) {
      lines.push("draft: true");
    }

    if (featured) {
      lines.push("featured: true");
    }

    if (publishedAt) {
      lines.push(`publishedAt: "${toIsoString(publishedAt)}"`);
    }

    if (updatedAt) {
      lines.push(`updatedAt: "${toIsoString(updatedAt)}"`);
    }

    return `---\n${lines.join("\n")}\n---\n\n${content.trim()}`;
  };

  const handleSave = async () => {
    const trimmedFilename = filename.trim();
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();
    const trimmedContent = content.trim();

    if (!trimmedFilename) {
      toast.error("Please enter a filename.");
      return;
    }

    if (!trimmedFilename.endsWith(".mdx")) {
      toast.error("Filename must end with .mdx");
      return;
    }

    if (!trimmedTitle || !trimmedSubject) {
      toast.error("Please fill in the Title and Subject fields.");
      return;
    }

    if (!trimmedContent) {
      toast.error("Content cannot be empty.");
      return;
    }

    const mdxContent = generateMDX();

    try {
      await putBlog.mutateAsync({
        filename: trimmedFilename,
        content: mdxContent,
      });

      toast.success("Blog created successfully!");

      const slug = trimmedFilename.replace(".mdx", "");
      navigate({ to: "/blog/$slug", params: { slug } });
    } catch (error: any) {
      console.error("Error creating blog:", error);
      toast.error(error?.message || "Failed to save blog.");
    }
  };

  const handleCancel = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="container lg:py-20 flex flex-col mx-auto max-w-7xl ">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Blog</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <div className="rounded-lg border shadow-lg p-6 space-y-4 bg-card">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">
              Metadata
            </h2>

            <div>
              <Label htmlFor="filename">Filename *</Label>
              <Input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="my-blog-post.mdx"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Amazing Blog Post"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="readTime">Read Time (minutes) *</Label>
              <Input
                id="readTime"
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(parseInt(e.target.value) || 1)}
                min="1"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Technology, Design, etc."
                className="mt-2"
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
                className="mt-2"
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
                className="mt-2"
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
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="updatedAt">Updated At</Label>
                <Input
                  id="updatedAt"
                  type="datetime-local"
                  value={updatedAt}
                  onChange={(e) => setUpdatedAt(e.target.value)}
                  className="mt-2"
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
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">
              Content (MDX)
            </h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Write your heading here"
              className="w-full h-96 min-h-[300px] px-3 py-2 border rounded-md bg-background font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pb-12">
            <Button
              onClick={handleSave}
              disabled={putBlog.isPending}
              className="w-full"
            >
              {putBlog.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Blog"
              )}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="rounded-lg border shadow-lg p-6 bg-card lg:sticky lg:top-24 lg:max-h-[85vh] lg:overflow-y-auto">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">
            Live Preview
          </h2>

          <div className="mb-4 p-4 rounded border bg-muted/50">
            <h3 className="text-xl font-bold">{title || "Untitled"}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              {readTime} min read • {subject || "No subject"}
            </div>
            {summary && (
              <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {contentWithoutFrontmatter || "*Start typing to see preview...*"}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
