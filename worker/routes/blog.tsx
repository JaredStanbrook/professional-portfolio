// worker/routes/blog.tsx
//
// Public: the home page (the portfolio, with the latest posts), /blog and
// /blog/:slug.
// Signed in: /editor, to write, edit and delete posts.

import { Hono } from "hono";
import type { Context } from "hono";

import type { AppEnv } from "@server/types";
import { requireUser } from "@server/middleware/guard.middleware";
import { AccessControl } from "@server/services/access.service";
import { flashToast } from "@server/lib/htmx-helpers";
import { personSchema, websiteSchema } from "@server/lib/structured-data";
import { SLUG_PATTERN, blogFormSchema, type BlogForm } from "@server/schema/blog.schema";
import {
  deletePost,
  getPost,
  getPostMeta,
  listPosts,
  renderMarkdown,
  savePost,
} from "@server/services/blog.service";
import {
  BlogIndexPage,
  EditorListPage,
  EditorPage,
  PostBody,
  PostPage,
  type EditorErrors,
} from "@views/blog/BlogViews";
import { HomePage } from "@views/portfolio/Home";

const access = new AccessControl();

const localeOf = (c: Context<AppEnv>) => ({
  locale: c.var.app.locale,
  timeZone: c.var.app.timezone,
});

/** A description for search results: the opening of the post, as text. */
const summarise = (markdown: string) => {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
};

// ==========================================
// PUBLIC
// ==========================================

export const blogRoute = new Hono<AppEnv>();

blogRoute.get("/", async (c) => {
  const posts = await listPosts(c.var.db);
  return c.render(<HomePage posts={posts.slice(0, 3)} {...localeOf(c)} />, {
    // "{tagline} · {name}" — the site's own entry in search results.
    title: c.var.app.tagline || undefined,
    description:
      "Jared Stanbrook works on an IT service desk in Perth, Western Australia, and builds software in his own time. Projects, experience and writing.",
    type: "website",
    jsonLd: [websiteSchema(c.var.app), personSchema(c.var.app)],
  });
});

blogRoute.get("/blog", async (c) => {
  const posts = await listPosts(c.var.db);
  return c.render(<BlogIndexPage posts={posts} {...localeOf(c)} />, {
    title: "Writing",
    description:
      "Every post by Jared Stanbrook: hands-on labs, project write-ups and notes on networking, security and web development.",
  });
});

blogRoute.get("/blog/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!SLUG_PATTERN.test(slug)) return c.notFound();

  const post = await getPost(c.var.db, c.env.R2, slug);
  if (!post) return c.notFound();

  const user = c.var.auth.user;
  let canEdit = false;
  if (user) {
    try {
      canEdit = access.authorize(user, "blogs", "update", post.meta.userId);
    } catch {
      canEdit = false;
    }
  }

  return c.render(
    <PostPage
      post={post.meta}
      html={renderMarkdown(post.body)}
      canEdit={canEdit}
      {...localeOf(c)}
    />,
    {
      title: post.meta.title,
      description: summarise(post.body) || `${post.meta.title}, a post on ${post.meta.subject}.`,
      type: "article",
    },
  );
});

// ==========================================
// EDITOR
// ==========================================

export const editorRoute = new Hono<AppEnv>();
editorRoute.use("*", requireUser);

const formValues = async (c: Context<AppEnv>) => {
  const body = await c.req.parseBody();
  const pick = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  return {
    slug: pick("slug"),
    title: pick("title"),
    subject: pick("subject"),
    readTime: pick("readTime"),
    body: pick("body"),
  };
};

const renderEditor = (
  c: Context<AppEnv>,
  values: Partial<BlogForm> | Record<string, string>,
  isNew: boolean,
  errors?: EditorErrors,
) => {
  // A rejected form re-renders with 200 on purpose: HTMX (via hx-boost)
  // does not swap a 4xx, so the author would see nothing and lose nothing
  // visibly — the errors would simply never appear.
  const v = values as Partial<BlogForm>;
  return c.render(
    <EditorPage
      values={{ ...v, readTime: v.readTime ? Number(v.readTime) || undefined : undefined }}
      isNew={isNew}
      previewHtml={renderMarkdown(String(v.body ?? ""))}
      errors={errors}
    />,
    { title: isNew ? "New post" : "Edit post", noindex: true },
  );
};

const issuesOf = (error: { issues: { path: PropertyKey[]; message: string }[] }) => {
  const out: EditorErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form") as keyof EditorErrors;
    out[key] ??= issue.message;
  }
  return out;
};

editorRoute.get("/", async (c) => {
  const posts = await listPosts(c.var.db);
  return c.render(<EditorListPage posts={posts} {...localeOf(c)} />, {
    title: "Posts",
    noindex: true,
  });
});

editorRoute.get("/new", (c) => {
  access.authorize(c.var.auth.user!, "blogs", "create");
  return renderEditor(c, { readTime: 5 } as Partial<BlogForm>, true);
});

/** Live preview for the editor. Same renderer as the published page. */
editorRoute.post("/preview", async (c) => {
  const { body } = await formValues(c);
  return c.html(<PostBody html={renderMarkdown(body.slice(0, 200_000))} />);
});

// Create.
editorRoute.post("/", async (c) => {
  const user = c.var.auth.user!;
  access.authorize(user, "blogs", "create");

  const values = await formValues(c);
  const parsed = blogFormSchema.safeParse(values);
  if (!parsed.success) return renderEditor(c, values, true, issuesOf(parsed.error));

  if (await getPostMeta(c.var.db, parsed.data.slug)) {
    return renderEditor(c, values, true, { slug: "A post already uses this address" });
  }

  await savePost(c.var.db, c.env.R2, parsed.data, user.id);
  flashToast(c, "Post published");
  return c.redirect(`/blog/${parsed.data.slug}`, 303);
});

editorRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!SLUG_PATTERN.test(slug)) return c.notFound();

  const post = await getPost(c.var.db, c.env.R2, slug);
  if (!post) return c.notFound();
  access.authorize(c.var.auth.user!, "blogs", "update", post.meta.userId);

  return renderEditor(
    c,
    {
      slug,
      title: post.meta.title,
      subject: post.meta.subject,
      readTime: post.meta.readTime,
      body: post.body,
    },
    false,
  );
});

// Update. The slug comes from the URL, never the form: it is the R2 key.
editorRoute.post("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const existing = SLUG_PATTERN.test(slug) ? await getPostMeta(c.var.db, slug) : undefined;
  if (!existing) return c.notFound();
  access.authorize(c.var.auth.user!, "blogs", "update", existing.userId);

  const values = { ...(await formValues(c)), slug };
  const parsed = blogFormSchema.safeParse(values);
  if (!parsed.success) return renderEditor(c, values, false, issuesOf(parsed.error));

  await savePost(c.var.db, c.env.R2, parsed.data, existing.userId);
  flashToast(c, "Post saved");
  return c.redirect(`/blog/${slug}`, 303);
});

editorRoute.post("/:slug/delete", async (c) => {
  const slug = c.req.param("slug");
  const existing = SLUG_PATTERN.test(slug) ? await getPostMeta(c.var.db, slug) : undefined;
  if (!existing) return c.notFound();
  access.authorize(c.var.auth.user!, "blogs", "delete", existing.userId);

  const removed = await deletePost(c.var.db, c.env.R2, slug);
  flashToast(c, removed ? "Post deleted" : "That post was already gone", {
    type: removed ? "success" : "warning",
  });
  return c.redirect("/editor", 303);
});
