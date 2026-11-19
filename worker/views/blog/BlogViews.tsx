// worker/views/blog/BlogViews.tsx
//
// The post index (/blog), a single post, and the editor. Pure functions of
// props. The home page, which lists the latest posts, is views/portfolio.

import { raw } from "hono/html";
import type { FC } from "hono/jsx";

import { filenameToSlug, type BlogForm, type BlogListItem } from "@server/schema/blog.schema";

// ==========================================
// HELPERS
// ==========================================

/**
 * D1's `current_timestamp` is `YYYY-MM-DD HH:MM:SS` in UTC with no zone, and
 * `new Date()` reads a zoneless string as *local* time. Mark it UTC first.
 */
const parseStamp = (value: string) =>
  new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value.replace(" ", "T")}Z`);

export const formatPostDate = (value: string, locale: string, timeZone: string) => {
  const date = parseStamp(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone,
  });
};

interface Locale {
  locale: string;
  timeZone: string;
}

const PostMetaLine: FC<{ post: BlogListItem } & Locale> = ({ post, locale, timeZone }) => {
  const created = formatPostDate(post.createdAt, locale, timeZone);
  const updated = formatPostDate(post.updatedAt, locale, timeZone);
  return (
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
      <span class="rounded-full bg-signal px-3 py-1 font-medium text-signal-foreground">
        {post.subject}
      </span>
      <span>{post.readTime} min read</span>
      <span>
        By {post.authorName}, <time datetime={post.createdAt}>{created}</time>
        {updated && updated !== created && <>, updated {updated}</>}
      </span>
    </div>
  );
};

// ==========================================
// INDEX
// ==========================================

const yearOf = (value: string) => value.slice(0, 4);

/** Every post, newest first, grouped by the year it was published. */
export const BlogIndexPage: FC<{ posts: BlogListItem[] } & Locale> = ({
  posts,
  locale,
  timeZone,
}) => {
  const years = [...new Set(posts.map((p) => yearOf(p.createdAt)))];
  return (
    <div class="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 class="max-w-3xl text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95]">Writing</h1>
      <p class="mt-6 max-w-xl text-xl leading-snug text-muted-foreground">
        Labs, project write-ups and notes on what I'm learning in networking, security and the web.
      </p>

      {posts.length === 0 ? (
        <p class="mt-16 text-muted-foreground">Nothing published yet.</p>
      ) : (
        years.map((year) => (
          <section class="mt-16 grid gap-4 lg:grid-cols-12 lg:gap-8" aria-labelledby={`y${year}`}>
            <h2
              id={`y${year}`}
              class="text-2xl tabular-nums text-muted-foreground lg:col-span-3 lg:pt-4"
            >
              {year}
            </h2>
            <ul class="lg:col-span-9">
              {posts
                .filter((p) => yearOf(p.createdAt) === year)
                .map((post) => (
                  <li>
                    <a
                      href={`/blog/${filenameToSlug(post.filename)}`}
                      class="group -mx-4 block rounded-xl px-4 py-4 no-underline hover:bg-card"
                    >
                      <span class="block text-2xl font-semibold leading-tight text-foreground [font-stretch:112%] group-hover:text-primary">
                        {post.title}
                      </span>
                      <span class="mt-2 block text-sm text-muted-foreground">
                        {post.subject}, {post.readTime} min read,{" "}
                        <time datetime={post.createdAt}>
                          {formatPostDate(post.createdAt, locale, timeZone)}
                        </time>
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
};

// ==========================================
// SINGLE POST
// ==========================================

const quietButton =
  "inline-flex h-11 items-center gap-2 rounded-full bg-muted px-5 text-sm font-medium text-foreground no-underline hover:bg-accent";

const backLink = (
  <a href="/blog" class={quietButton}>
    <i data-lucide="arrow-left" class="h-4 w-4" aria-hidden="true"></i> All writing
  </a>
);

export const PostPage: FC<{ post: BlogListItem; html: string; canEdit: boolean } & Locale> = ({
  post,
  html,
  canEdit,
  locale,
  timeZone,
}) => (
  <article class="mx-auto max-w-3xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
    <div class="mb-12 flex flex-wrap gap-3">
      {backLink}
      {canEdit && (
        <a href={`/editor/${filenameToSlug(post.filename)}`} class={quietButton}>
          <i data-lucide="pencil" class="h-4 w-4" aria-hidden="true"></i> Edit
        </a>
      )}
    </div>
    <PostMetaLine post={post} locale={locale} timeZone={timeZone} />
    <h1 class="mb-10 mt-6 text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] text-foreground">
      {post.title}
    </h1>
    <PostBody html={html} />
  </article>
);

/**
 * The rendered Markdown. The same component backs the editor's live preview,
 * so what the author sees is what gets published.
 */
export const PostBody: FC<{ html: string }> = ({ html }) => (
  <div class="prose prose-lg max-w-none prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-pre:rounded-xl prose-img:rounded-xl">
    {raw(html)}
  </div>
);

// ==========================================
// EDITOR
// ==========================================

export const EditorListPage: FC<{ posts: BlogListItem[] } & Locale> = ({
  posts,
  locale,
  timeZone,
}) => (
  <div class="mx-auto max-w-4xl px-4 pb-10 pt-24 sm:px-6">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-4xl">Posts</h1>
      <a
        href="/editor/new"
        class="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground no-underline hover:bg-primary/90"
      >
        <i data-lucide="plus" class="h-4 w-4" aria-hidden="true"></i> New post
      </a>
    </div>
    {posts.length === 0 ? (
      <p class="rounded-2xl bg-card p-8 text-center text-muted-foreground">
        Nothing written yet. Start with a new post.
      </p>
    ) : (
      <ul class="divide-y divide-background rounded-2xl bg-card text-card-foreground">
        {posts.map((post) => (
          <li class="flex flex-wrap items-center justify-between gap-3 p-4">
            <div class="min-w-0">
              <a
                href={`/editor/${filenameToSlug(post.filename)}`}
                class="font-medium text-foreground no-underline hover:text-primary"
              >
                {post.title}
              </a>
              <p class="text-sm text-muted-foreground">
                {post.subject}, {formatPostDate(post.createdAt, locale, timeZone)}
              </p>
            </div>
            <a
              href={`/blog/${filenameToSlug(post.filename)}`}
              class="inline-flex h-11 items-center rounded-lg px-3 text-sm text-muted-foreground no-underline hover:bg-accent hover:text-accent-foreground"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const inputClass =
  "flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60";

const Field: FC<{
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: unknown;
}> = ({ id, label, error, hint, children }) => (
  <div class="grid gap-2">
    <label for={id} class="text-sm font-medium">
      {label}
    </label>
    {children}
    {error ? (
      <p class="text-sm text-destructive">{error}</p>
    ) : (
      hint && <p class="text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);

export type EditorErrors = Partial<Record<keyof BlogForm | "form", string>>;

/**
 * One form for new and existing posts. The slug is the R2 key, so it is fixed
 * once a post exists; renaming would orphan old links.
 */
export const EditorPage: FC<{
  values: Partial<BlogForm>;
  isNew: boolean;
  previewHtml: string;
  errors?: EditorErrors;
}> = ({ values, isNew, previewHtml, errors = {} }) => (
  <div class="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-4xl">{isNew ? "New post" : "Edit post"}</h1>
      <a href={isNew ? "/editor" : `/blog/${values.slug}`} class={quietButton}>
        Cancel
      </a>
    </div>

    {errors.form && (
      <p class="mb-6 rounded-lg bg-destructive/15 px-4 py-3 text-sm font-medium text-destructive">
        {errors.form}
      </p>
    )}

    <div class="grid gap-8 lg:grid-cols-2">
      <form
        id="post-form"
        method="post"
        action={isNew ? "/editor" : `/editor/${values.slug}`}
        class="grid content-start gap-5"
      >
        <Field
          id="slug"
          label="Address"
          error={errors.slug}
          hint={isNew ? "Becomes /blog/<address>. Fixed once published." : "Fixed once published."}
        >
          <input
            id="slug"
            name="slug"
            class={inputClass}
            value={values.slug ?? ""}
            placeholder="my-first-post"
            required
            pattern="[a-z0-9][a-z0-9\-]{0,79}"
            readonly={!isNew}
          />
        </Field>
        <Field id="title" label="Title" error={errors.title}>
          <input id="title" name="title" class={inputClass} value={values.title ?? ""} required />
        </Field>
        <div class="grid gap-5 sm:grid-cols-2">
          <Field id="subject" label="Subject" error={errors.subject}>
            <input
              id="subject"
              name="subject"
              class={inputClass}
              value={values.subject ?? ""}
              placeholder="Networking"
              required
            />
          </Field>
          <Field id="readTime" label="Read time (minutes)" error={errors.readTime}>
            <input
              id="readTime"
              name="readTime"
              type="number"
              min="1"
              max="240"
              class={inputClass}
              value={String(values.readTime ?? 5)}
              required
            />
          </Field>
        </div>
        <Field id="body" label="Content (Markdown)" error={errors.body}>
          <textarea
            id="body"
            name="body"
            rows={22}
            class="w-full rounded-lg border border-input bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            hx-post="/editor/preview"
            hx-trigger="input changed delay:400ms"
            hx-target="#preview"
            hx-swap="innerHTML"
            required
          >
            {values.body ?? ""}
          </textarea>
        </Field>
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            class="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isNew ? "Publish" : "Save changes"}
          </button>
        </div>
      </form>

      <section aria-labelledby="preview-heading" class="min-w-0">
        <h2 id="preview-heading" class="mb-3 text-lg text-muted-foreground">
          Preview
        </h2>
        <div id="preview" class="rounded-2xl bg-card p-6 text-card-foreground sm:p-8">
          <PostBody html={previewHtml} />
        </div>
      </section>
    </div>

    {!isNew && (
      <form
        method="post"
        action={`/editor/${values.slug}/delete`}
        class="mt-12 rounded-2xl bg-destructive/10 p-5"
        onsubmit="return confirm('Delete this post for good? This removes the file as well.')"
      >
        <p class="mb-3 text-sm text-muted-foreground">
          Deleting removes the post and its file. It cannot be undone.
        </p>
        <button
          type="submit"
          class="inline-flex h-11 items-center gap-2 rounded-full bg-background px-5 text-sm font-medium text-destructive hover:bg-destructive/15"
        >
          <i data-lucide="trash-2" class="h-4 w-4" aria-hidden="true"></i> Delete post
        </button>
      </form>
    )}
  </div>
);
