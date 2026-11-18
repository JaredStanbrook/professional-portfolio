// worker/views/portfolio/Home.tsx
//
// The home page is the portfolio. One loud moment — the name, set huge and
// expanded, its letters stretching towards the pointer — and then the quiet
// two-column reading layout the old /about page had: a sticky index on the
// left, the work, experience and writing on the right.

import { raw } from "hono/html";
import type { FC } from "hono/jsx";

import { filenameToSlug, type BlogListItem } from "@server/schema/blog.schema";
import { formatPostDate } from "@views/blog/BlogViews";
import {
  experience,
  isExternal,
  person,
  projects,
  socials,
  type Project,
  type Role,
} from "./content";

const sections = [
  { id: "work", name: "Work" },
  { id: "experience", name: "Experience" },
  { id: "writing", name: "Writing" },
  { id: "contact", name: "Contact" },
];

const newTab = { target: "_blank", rel: "noreferrer noopener" };

/** A small up-right arrow, only on links that leave the site. */
const OutArrow = () => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    class="ml-1 inline-block h-3.5 w-3.5 translate-y-px transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
      clip-rule="evenodd"
    />
  </svg>
);

// ==========================================
// HERO
// ==========================================

/** One span per letter, so each can take its own width. */
const Letters: FC<{ word: string; offset: number }> = ({ word, offset }) => (
  <span class="block whitespace-nowrap" aria-hidden="true">
    {[...word].map((ch, i) => (
      <span class="hero-letter" style={`--k:${offset + i}`}>
        {ch}
      </span>
    ))}
  </span>
);

/**
 * The cursor dot swells as it nears the name, and every letter widens and
 * thickens with the pointer's closeness. Pointer devices only; a touch screen
 * and reduced motion get the name as set. The page-load sweep (letters
 * opening from condensed) is CSS.
 */
const heroScript = raw(`<script>
(function () {
  var name = document.getElementById("hero-name");
  var dot = document.getElementById("hero-cursor");
  if (!name || !dot || name.dataset.ready) return;
  name.dataset.ready = "1";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!matchMedia("(pointer: fine)").matches) return;

  var letters = Array.prototype.slice.call(name.querySelectorAll(".hero-letter"));
  var mouse = { x: -999, y: -999 }, pos = { x: -999, y: -999, s: 1 }, moved = false;
  addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; moved = true; }, { passive: true });

  (function frame() {
    if (!document.body.contains(name)) return;
    var r = name.getBoundingClientRect();
    var dx = Math.max(r.left - mouse.x, 0, mouse.x - r.right);
    var dy = Math.max(r.top - mouse.y, 0, mouse.y - r.bottom);
    var d = Math.sqrt(dx * dx + dy * dy);

    // The dot: pulled towards the name and swollen near it.
    var s = d < 160 ? 1 + (1 - Math.pow(d / 160, 3)) * 7 : 1, tx = mouse.x, ty = mouse.y;
    if (d < 360 && d > 0) {
      var f = 1 - d / 360;
      tx += (Math.max(r.left, Math.min(mouse.x, r.right)) - mouse.x) * f;
      ty += (Math.max(r.top, Math.min(mouse.y, r.bottom)) - mouse.y) * f;
    }
    pos.x += (tx - pos.x) * 0.08; pos.y += (ty - pos.y) * 0.08; pos.s += (s - pos.s) * 0.08;
    var size = 20 * pos.s;
    dot.style.width = dot.style.height = size + "px";
    dot.style.transform = "translate(" + (pos.x - size / 2) + "px," + (pos.y - size / 2) + "px)";
    dot.style.opacity = moved ? "1" : "0";

    // The letters: wider and heavier the closer the pointer is.
    var near = d < 240;
    letters.forEach(function (l) {
      var b = l.getBoundingClientRect();
      var lx = b.left + b.width / 2 - mouse.x, ly = b.top + b.height / 2 - mouse.y;
      var t = near ? Math.max(0, 1 - Math.sqrt(lx * lx + ly * ly) / 320) : 0;
      l.style.setProperty("--w", (100 + t * 25).toFixed(1) + "%");
      l.style.setProperty("--g", Math.round(780 + t * 120));
    });
    requestAnimationFrame(frame);
  })();
})();
</script>`);

const Hero: FC = () => {
  const [first, last] = person.name.split(" ");
  return (
    <header class="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pb-28">
      <div
        id="hero-cursor"
        class="pointer-events-none fixed left-0 top-0 z-30 hidden rounded-full bg-signal opacity-0 mix-blend-multiply transition-opacity md:block dark:mix-blend-difference"
        aria-hidden="true"
      ></div>
      <h1
        id="hero-name"
        aria-label={person.name}
        class="hero-name relative z-40 w-fit text-[clamp(3.4rem,14vw,10.5rem)] leading-[0.86] text-foreground"
      >
        <Letters word={first} offset={0} />
        <Letters word={last} offset={first.length} />
      </h1>

      <div class="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <p class="text-xl leading-snug text-foreground sm:text-2xl">{person.summary}</p>
          <ul
            class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem]"
            aria-label="Contact and links"
          >
            <li>
              <a
                href={`mailto:${person.email}`}
                class="inline-flex h-11 items-center rounded-full bg-primary px-5 font-medium text-primary-foreground no-underline hover:bg-primary/90"
              >
                Email me
              </a>
            </li>
            {socials.map((s) => (
              <li>
                <a
                  href={s.href}
                  {...newTab}
                  class="group/link inline-flex h-11 items-center font-medium text-foreground no-underline hover:text-primary"
                >
                  {s.name}
                  <OutArrow />
                </a>
              </li>
            ))}
            <li>
              <a
                href={person.resume}
                {...newTab}
                class="group/link inline-flex h-11 items-center font-medium text-foreground no-underline hover:text-primary"
              >
                Résumé (PDF)
                <OutArrow />
              </a>
            </li>
          </ul>
        </div>
        <div class="space-y-4 text-[1.0625rem] leading-relaxed text-muted-foreground lg:col-span-6 lg:col-start-7">
          {person.about.map((p) => (
            <p>{p}</p>
          ))}
        </div>
      </div>
      {heroScript}
    </header>
  );
};

// ==========================================
// INDEX RAIL
// ==========================================

/** Marks the section in view, so the rail doubles as a "you are here". */
const railScript = raw(`<script>
(function () {
  var links = document.querySelectorAll("[data-rail-link]");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      var a = byId[e.target.id];
      if (a) a.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
})();
</script>`);

const Rail: FC = () => (
  <nav class="hidden lg:block" aria-label="On this page">
    <ul class="sticky top-24 w-max">
      {sections.map((s) => (
        <li>
          <a
            data-rail-link
            href={`#${s.id}`}
            class="group flex h-11 items-center text-sm font-medium text-muted-foreground no-underline hover:text-foreground aria-[current]:text-foreground"
          >
            <span
              class="mr-4 h-0.5 w-8 rounded-full bg-muted-foreground/50 transition-all group-hover:w-14 group-hover:bg-foreground group-aria-[current]:w-14 group-aria-[current]:bg-signal motion-reduce:transition-none"
              aria-hidden="true"
            ></span>
            {s.name}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

// ==========================================
// SECTIONS
// ==========================================

const SectionHeading: FC<{ id: string; children: unknown }> = ({ id, children }) => (
  <h2 id={`${id}-heading`} class="mb-10 text-3xl text-foreground sm:text-4xl">
    {children}
  </h2>
);

/**
 * A project row. On wide screens the whole row is the link, a soft fill comes
 * up behind it, and the other rows dim — the /about page's list behaviour.
 */
const ProjectRow: FC<{ project: Project }> = ({ project: p }) => (
  <li class="group relative isolate grid gap-5 rounded-2xl transition-opacity sm:grid-cols-8 sm:gap-8 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
    <div
      class="absolute -inset-4 -z-10 hidden rounded-2xl transition-colors motion-reduce:transition-none lg:-inset-6 lg:block lg:group-hover:bg-card"
      aria-hidden="true"
    ></div>
    {p.image && (
      <div class="overflow-hidden rounded-xl bg-muted shadow-sm sm:col-span-3">
        <img
          src={p.image}
          alt=""
          loading="lazy"
          decoding="async"
          width="400"
          height="250"
          class="aspect-[16/10] h-auto w-full object-cover object-top"
          // The previews live on another host. If one is gone, drop its empty
          // frame rather than leave a blank tile in the list.
          onerror="this.parentElement.remove()"
        />
      </div>
    )}
    <div class={p.image ? "sm:col-span-5" : "sm:col-span-8"}>
      <h3 class="text-xl leading-tight">
        {p.href ? (
          <a
            href={p.href}
            {...(isExternal(p.href) ? newTab : {})}
            class="group/link text-foreground no-underline hover:text-primary focus-visible:text-primary"
          >
            <span class="absolute -inset-4 hidden lg:-inset-6 lg:block" aria-hidden="true"></span>
            {p.title}
            {isExternal(p.href) && <OutArrow />}
          </a>
        ) : (
          p.title
        )}
      </h3>
      <p class="mt-1 text-sm text-primary">{p.kind}</p>
      <p class="mt-3 leading-relaxed text-muted-foreground">{p.body}</p>
      <ul class="mt-4 flex flex-wrap gap-2" aria-label="Built with">
        {p.stack.map((t) => (
          <li class="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80">
            {t}
          </li>
        ))}
      </ul>
    </div>
  </li>
);

const RoleRow: FC<{ role: Role }> = ({ role: r }) => (
  <li class="grid gap-2 sm:grid-cols-8 sm:gap-8">
    <p class="pt-1 text-sm tabular-nums text-muted-foreground sm:col-span-2">{r.period}</p>
    <div class="sm:col-span-6">
      <h3 class="text-xl leading-tight">
        {r.title}
        <span class="font-normal text-muted-foreground [font-stretch:100%]"> at </span>
        {r.href ? (
          <a
            href={r.href}
            {...(isExternal(r.href) ? newTab : {})}
            class="group/link text-primary no-underline hover:underline"
          >
            {r.org}
            {isExternal(r.href) && <OutArrow />}
          </a>
        ) : (
          r.org
        )}
      </h3>
      <p class="mt-3 leading-relaxed text-muted-foreground">{r.body}</p>
      <p class="mt-3 text-sm text-foreground/80">{r.skills.join(", ")}</p>
    </div>
  </li>
);

const WritingRow: FC<{ post: BlogListItem; locale: string; timeZone: string }> = ({
  post,
  locale,
  timeZone,
}) => (
  <li>
    <a
      href={`/blog/${filenameToSlug(post.filename)}`}
      class="group grid gap-1 rounded-xl py-4 no-underline sm:grid-cols-8 sm:gap-8"
    >
      <time
        datetime={post.createdAt}
        class="pt-1 text-sm tabular-nums text-muted-foreground sm:col-span-2"
      >
        {formatPostDate(post.createdAt, locale, timeZone)}
      </time>
      <span class="sm:col-span-6">
        <span class="block text-xl font-semibold leading-tight text-foreground [font-stretch:112%] group-hover:text-primary">
          {post.title}
        </span>
        <span class="mt-1 block text-sm text-muted-foreground">
          {post.subject}, {post.readTime} min read
        </span>
      </span>
    </a>
  </li>
);

export const HomePage: FC<{ posts: BlogListItem[]; locale: string; timeZone: string }> = ({
  posts,
  locale,
  timeZone,
}) => (
  <>
    <Hero />

    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:px-8">
      <div class="lg:col-span-3">
        <Rail />
      </div>

      <div class="space-y-32 lg:col-span-9">
        <section id="work" aria-labelledby="work-heading" class="scroll-mt-24">
          <SectionHeading id="work">Selected work</SectionHeading>
          <ul class="group/list space-y-16">
            {projects.map((p) => (
              <ProjectRow project={p} />
            ))}
          </ul>
        </section>

        <section id="experience" aria-labelledby="experience-heading" class="scroll-mt-24">
          <SectionHeading id="experience">Experience</SectionHeading>
          <ol class="space-y-14">
            {experience.map((r) => (
              <RoleRow role={r} />
            ))}
          </ol>
        </section>

        <section id="writing" aria-labelledby="writing-heading" class="scroll-mt-24">
          <SectionHeading id="writing">Writing</SectionHeading>
          {posts.length === 0 ? (
            <p class="text-muted-foreground">Nothing published yet.</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <WritingRow post={post} locale={locale} timeZone={timeZone} />
              ))}
            </ul>
          )}
          <a
            href="/blog"
            class="mt-6 inline-flex h-11 items-center font-medium text-primary no-underline hover:underline"
          >
            All writing
          </a>
        </section>

        <section id="contact" aria-labelledby="contact-heading" class="scroll-mt-24">
          <SectionHeading id="contact">Contact</SectionHeading>
          <p class="max-w-prose text-lg leading-relaxed text-muted-foreground">
            Email is the best way to reach me. I'm in {person.location}.
          </p>
          <a
            href={`mailto:${person.email}`}
            class="contact-link mt-6 inline-block break-all text-[clamp(1.5rem,5vw,3rem)] font-bold leading-tight text-foreground no-underline [font-stretch:118%]"
          >
            {person.email}
          </a>
        </section>
      </div>
    </div>
    {railScript}
  </>
);
