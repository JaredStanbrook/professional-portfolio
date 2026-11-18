// worker/views/blog/BlogViews.tsx
//
// Home (the post list), a single post, and the editor. Pure functions of
// props; the only browser code is the hero's decorative cursor and
// typewriter, inlined below because they need no state the server has.

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

/** Longer reads get bigger tiles. Whole class names, so Tailwind sees them. */
const tileFor = (readTime: number) => {
  if (readTime >= 15) return "md:col-span-2 md:row-span-2";
  if (readTime >= 4) return "md:row-span-2";
  if (readTime >= 3) return "md:col-span-2";
  return "";
};

interface Locale {
  locale: string;
  timeZone: string;
}

const PostMetaLine: FC<{ post: BlogListItem } & Locale> = ({ post, locale, timeZone }) => {
  const created = formatPostDate(post.createdAt, locale, timeZone);
  const updated = formatPostDate(post.updatedAt, locale, timeZone);
  return (
    <p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      <span class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary">
        {post.subject}
      </span>
      <span aria-hidden="true">•</span>
      <span>{post.readTime} min read</span>
      <span aria-hidden="true">•</span>
      <span>{post.authorName}</span>
      <span aria-hidden="true">•</span>
      <time datetime={post.createdAt}>{created}</time>
      {updated && updated !== created && (
        <>
          <span aria-hidden="true">•</span>
          <span class="italic">Updated {updated}</span>
        </>
      )}
    </p>
  );
};

// ==========================================
// HOME
// ==========================================

/**
 * Desktop: a soft dot follows the pointer and swells as it nears the name,
 * which then reads "Learn more about me." Phones get a typewriter instead,
 * since there is no pointer to follow. Both stand still under reduced motion.
 */
const heroScript = raw(`<script>
(function () {
  var root = document.getElementById("hero");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var tw = document.getElementById("hero-typewriter");
  if (tw && !still) {
    var words = ["Hi, I'm Jared.", "Looking for my portfolio?", "Tap here!"];
    var w = 0, n = 0, back = false, hold = 0;
    var tick = setInterval(function () {
      if (!document.body.contains(tw)) return clearInterval(tick);
      var word = words[w];
      if (!back) { if (n < word.length) n++; else if (++hold > 15) { back = true; hold = 0; } }
      else if (n > 0) n--; else { back = false; w = (w + 1) % words.length; }
      tw.textContent = word.slice(0, n);
    }, 70);
  }

  var dot = document.getElementById("hero-cursor");
  var title = document.getElementById("hero-title");
  var label = document.getElementById("hero-label");
  if (!dot || !title || still || !matchMedia("(pointer: fine)").matches) return;
  var mouse = { x: -100, y: -100 }, pos = { x: -100, y: -100, s: 1 };
  addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  (function frame() {
    if (!document.body.contains(dot)) return;
    var r = title.getBoundingClientRect();
    var dx = Math.max(r.left - mouse.x, 0, mouse.x - r.right);
    var dy = Math.max(r.top - mouse.y, 0, mouse.y - r.bottom);
    var d = Math.sqrt(dx * dx + dy * dy);
    var near = d <= 150, s = 1, tx = mouse.x, ty = mouse.y;
    if (near) s = 1 + (1 - Math.pow(d / 150, 4)) * 35 * 0.3;
    if (d < 400 && d > 0) {
      var f = 1 - d / 400;
      tx += (Math.max(r.left, Math.min(mouse.x, r.right)) - mouse.x) * f;
      ty += (Math.max(r.top, Math.min(mouse.y, r.bottom)) - mouse.y) * f;
    }
    pos.x += (tx - pos.x) * 0.07; pos.y += (ty - pos.y) * 0.07; pos.s += (s - pos.s) * 0.07;
    var size = 20 * pos.s;
    dot.style.width = dot.style.height = size + "px";
    dot.style.transform = "translate(" + (pos.x - size / 2) + "px," + (pos.y - size / 2) + "px)";
    label.textContent = near ? "Learn more about me." : "I'm Jared";
    requestAnimationFrame(frame);
  })();
})();
</script>`);

export const HomePage: FC<{ posts: BlogListItem[] } & Locale> = ({ posts, locale, timeZone }) => (
  <div id="hero" class="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
    <div
      id="hero-cursor"
      class="pointer-events-none fixed left-0 top-0 z-30 hidden rounded-full bg-primary/70 mix-blend-multiply md:block dark:mix-blend-screen"
      aria-hidden="true"
    ></div>

    <section class="relative z-40 pr-16 pt-8">
      <a
        id="hero-title"
        href="/about"
        class="block w-fit text-2xl font-extrabold tracking-tight text-foreground no-underline md:text-4xl"
      >
        <span id="hero-label" class="hidden md:inline">
          I'm Jared
        </span>
        <span class="md:hidden">
          <span id="hero-typewriter">Hi, I'm Jared.</span>
          <span class="ml-1 animate-pulse border-r-2 border-foreground" aria-hidden="true"></span>
        </span>
      </a>
      <hr class="mt-2 border-t-2 border-foreground/30" />
    </section>

    <section class="grid gap-8 pt-12 md:grid-cols-2">
      <div>
        <h1 class="mb-4 text-3xl font-bold text-foreground md:text-5xl">Welcome</h1>
        <p class="mb-2 text-lg font-semibold uppercase text-foreground md:text-xl">My Blog</p>
        <p class="text-lg text-muted-foreground md:text-xl">
          Sharing my progress, projects, and insights.
        </p>
      </div>
      <p class="self-end text-lg text-muted-foreground md:text-xl">
        Dive into my journey as I explore, experiment, and grow. Here you'll find hands-on labs,
        project breakdowns, and reflections on what I'm learning as a student and aspiring
        professional.
      </p>
    </section>

    <section class="py-8" aria-labelledby="recent-heading">
      <div class="my-4 flex items-center gap-4">
        <h2 id="recent-heading" class="text-xl font-semibold tracking-widest text-foreground">
          Recent
        </h2>
        <hr class="w-full border-t-2 border-foreground/30" />
      </div>

      {posts.length === 0 ? (
        <p class="py-12 text-center text-muted-foreground">No posts yet.</p>
      ) : (
        <ul class="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li class={`flex ${tileFor(post.readTime)}`}>
              <a
                href={`/blog/${filenameToSlug(post.filename)}`}
                class="flex w-full flex-col justify-between rounded-lg border-2 border-border bg-card p-4 text-card-foreground no-underline transition-colors hover:border-primary focus-visible:border-primary focus-visible:outline-none"
              >
                <div>
                  <p class="mb-2 text-xs">
                    <span class="rounded-full bg-foreground px-2 py-1 font-semibold text-background">
                      {post.subject}
                    </span>
                    <span class="ml-1 text-muted-foreground">• {post.readTime} min read</span>
                  </p>
                  <h3 class="mb-2 text-lg font-semibold">{post.title}</h3>
                </div>
                <p class="mt-4 text-sm text-muted-foreground">
                  {post.authorName} • {formatPostDate(post.createdAt, locale, timeZone)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
    {heroScript}
  </div>
);

// ==========================================
// SINGLE POST
// ==========================================

const backLink = (
  <a
    href="/"
    class="inline-flex h-11 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium no-underline hover:bg-accent hover:text-accent-foreground"
  >
    <i data-lucide="arrow-left" class="h-4 w-4" aria-hidden="true"></i> All posts
  </a>
);

export const PostPage: FC<{ post: BlogListItem; html: string; canEdit: boolean } & Locale> = ({
  post,
  html,
  canEdit,
  locale,
  timeZone,
}) => (
  <article class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
    <div class="mb-10 flex flex-wrap gap-3">
      {backLink}
      {canEdit && (
        <a
          href={`/editor/${filenameToSlug(post.filename)}`}
          class="inline-flex h-11 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium no-underline hover:bg-accent hover:text-accent-foreground"
        >
          <i data-lucide="pencil" class="h-4 w-4" aria-hidden="true"></i> Edit
        </a>
      )}
    </div>
    <PostMetaLine post={post} locale={locale} timeZone={timeZone} />
    <h1 class="mb-8 mt-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
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
  <div class="prose prose-lg max-w-none prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-pre:border prose-pre:border-border prose-img:rounded-lg">
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
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-3xl font-bold tracking-tight">Posts</h1>
      <a
        href="/editor/new"
        class="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground no-underline hover:bg-primary/90"
      >
        <i data-lucide="plus" class="h-4 w-4" aria-hidden="true"></i> New post
      </a>
    </div>
    {posts.length === 0 ? (
      <p class="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Nothing written yet.
      </p>
    ) : (
      <ul class="divide-y rounded-lg border bg-card text-card-foreground">
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
                {post.subject} • {formatPostDate(post.createdAt, locale, timeZone)}
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
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-3xl font-bold tracking-tight">{isNew ? "New post" : "Edit post"}</h1>
      <a
        href={isNew ? "/editor" : `/blog/${values.slug}`}
        class="inline-flex h-11 items-center rounded-lg border border-input px-4 text-sm font-medium no-underline hover:bg-accent hover:text-accent-foreground"
      >
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
            class="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isNew ? "Publish" : "Save changes"}
          </button>
        </div>
      </form>

      <section aria-labelledby="preview-heading" class="min-w-0">
        <h2
          id="preview-heading"
          class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Preview
        </h2>
        <div id="preview" class="rounded-lg border bg-card p-6 text-card-foreground">
          <PostBody html={previewHtml} />
        </div>
      </section>
    </div>

    {!isNew && (
      <form
        method="post"
        action={`/editor/${values.slug}/delete`}
        class="mt-12 rounded-lg border border-destructive/30 p-4"
        onsubmit="return confirm('Delete this post for good? This removes the file as well.')"
      >
        <p class="mb-3 text-sm text-muted-foreground">
          Deleting removes the post and its file. It cannot be undone.
        </p>
        <button
          type="submit"
          class="inline-flex h-11 items-center gap-2 rounded-lg border border-destructive/40 px-4 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <i data-lucide="trash-2" class="h-4 w-4" aria-hidden="true"></i> Delete post
        </button>
      </form>
    )}
  </div>
);
