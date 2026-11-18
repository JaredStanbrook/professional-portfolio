// worker/views/resume/Resume.tsx
//
// The résumé as one A4 page, a copy of the Word original down to the point.
// It is a document, not a site page: its own <html>, no nav, no theme. Paper
// is white and ink is black in either mode, because this is what prints and
// what becomes public/resume.pdf. Content lives in ./resume.ts.
//
// Every measurement is in points, read off the original PDF: Arial 10pt on
// 13.8pt lines, 11pt bold headings over a 1.44pt rule, a 20pt bold name, and
// a text column from 37pt to 561.6pt on a 595pt-wide page. Liberation Sans is
// Arial's metric twin, so where Arial is missing the lines still break in
// the same places.

import { raw } from "hono/html";
import type { FC } from "hono/jsx";

import { resume, type EducationEntry, type ResumeEntry } from "./resume";

const css = `
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { background: #e6e6e6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Arial, "Liberation Sans", Helvetica, sans-serif; color: #000; }

.sheet {
  width: 595.28pt; height: 841.89pt; margin: 24px auto; background: #fff;
  padding: 38.4pt 33.7pt 0 37pt;
  font-size: 10pt; line-height: 13.8pt;
  box-shadow: 0 2px 24px rgb(0 0 0 / 0.18);
  overflow: hidden;
}
a { color: #00f; text-decoration: underline; }

.top { display: flex; justify-content: space-between; align-items: flex-start; }
.name { font-size: 20pt; font-weight: 700; line-height: 22.3pt; }
.reach { text-align: right; line-height: 11.5pt; padding-right: 6.9pt; margin-top: -0.9pt; }
.reach .sep { color: #000; }
.reach .sep-faint { color: #c8c8ff; }

h2 {
  font-size: 11pt; font-weight: 700; line-height: 12.3pt;
  margin: 7pt -0.1pt 0 -1.5pt; padding: 0 0 0 1.5pt;
}
/* The rule is a block, not a border: Chromium snaps border widths to whole
   device pixels, which would thin Word's 1.44pt rule. */
h2::after {
  content: ""; display: block; height: 1.44pt; margin: 1.7pt 0 0 -1.5pt; background: #000;
}
.top + h2 { margin-top: 6.1pt; }
.top + h2 + p { margin-top: 4pt; }
h2 + * { margin-top: 4.9pt; }

.row { display: flex; justify-content: space-between; gap: 12pt; }
.row b { font-weight: 700; }
.entry + .entry { margin-top: 5.9pt; }
.entry ul { margin-top: 4.8pt; }
li { list-style: none; position: relative; padding-left: 18pt; line-height: 14.4pt; }
/* Word draws this bullet in Symbol, a larger dot than Arial's. */
li::before { content: "•"; position: absolute; left: 0; font-size: 14pt; line-height: 13.6pt; }
li.dash::before { content: "-"; font-size: 10pt; line-height: 13.8pt; }
.edu li { line-height: 13.8pt; }
.meta-italic { font-style: italic; }

.actions { max-width: 595.28pt; margin: 16px auto 0; padding: 0 12px; display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; }
.actions a {
  display: inline-flex; align-items: center; height: 44px; padding: 0 18px; border-radius: 999px;
  background: #1d6650; color: #fff; text-decoration: none; font-weight: 600;
}
.actions a.quiet { background: #fff; color: #1d6650; }
@media print {
  html { background: #fff; }
  .sheet { margin: 0; box-shadow: none; }
  .actions { display: none; }
}
`;

const Entry: FC<{ entry: ResumeEntry; italicMeta?: boolean }> = ({ entry, italicMeta }) => (
  <div class="entry">
    <div class="row">
      <b>{entry.title}</b>
      <span class={italicMeta ? "meta-italic" : ""}>{entry.meta}</span>
    </div>
    <ul>
      {entry.bullets.map((b) => (
        <li>{b}</li>
      ))}
    </ul>
  </div>
);

const Education: FC<{ entry: EducationEntry }> = ({ entry: e }) => (
  <>
    <div>
      <b>{e.title}</b>
      {e.note && (
        <>
          {" "}
          <i>{e.note}</i>
        </>
      )}
      {e.suffix}
    </div>
    {e.lines?.map((l) => (
      <div>{l}</div>
    ))}
    {e.labelled?.map((l) => (
      <div>
        <b>{l.label}:</b> {l.value}
      </div>
    ))}
    {e.dashed && (
      <ul>
        {e.dashed.map((d) => (
          <li class="dash">{d}</li>
        ))}
      </ul>
    )}
  </>
);

/**
 * On a screen narrower than A4, shrink the page to fit rather than scroll
 * sideways. `zoom` (not a transform) so the layout box shrinks too. Print
 * and the PDF are untouched: they never run this.
 */
const fitScript = `<script>
(function () {
  function fit() {
    var avail = document.documentElement.clientWidth - 24;
    var z = Math.min(1, avail / (595.28 * 96 / 72));
    document.querySelectorAll(".sheet").forEach(function (el) { el.style.zoom = z; });
  }
  fit();
  addEventListener("resize", fit);
  addEventListener("beforeprint", function () {
    document.querySelectorAll(".sheet").forEach(function (el) { el.style.zoom = ""; });
  });
  addEventListener("afterprint", fit);
})();
</script>`;

/** The sheet alone. Also what the PDF script prints. */
export const ResumeSheet: FC = () => (
  <main class="sheet">
    <header class="top">
      <h1 class="name">{resume.name}</h1>
      <div class="reach">
        <div>{resume.location}</div>
        <div>
          {resume.contact.map((c, i) => (
            <>
              {i > 0 && (
                <span class={i === resume.contact.length - 1 ? "sep-faint" : "sep"}> | </span>
              )}
              {c.href ? <a href={c.href}>{c.text}</a> : c.text}
            </>
          ))}
        </div>
      </div>
    </header>

    <h2>Profile</h2>
    <p>{resume.profile}</p>

    <h2>Skills</h2>
    <p>{resume.skills.join("\u00a0| ")}</p>

    <h2>Experience</h2>
    <div>
      {resume.experience.map((e) => (
        <Entry entry={e} />
      ))}
    </div>

    <h2>Certificates</h2>
    <div>
      {resume.certificates.map((c) => (
        <div>
          <b>{c.name}:</b> {c.detail}
        </div>
      ))}
    </div>

    <h2>Education</h2>
    <div class="edu">
      {resume.education.map((e) => (
        <Education entry={e} />
      ))}
    </div>

    <h2>Projects</h2>
    <div>
      {resume.projects.map((p) => (
        <Entry entry={p} italicMeta />
      ))}
    </div>

    <h2>References</h2>
    <p>{resume.references}</p>
  </main>
);

/** The whole document. `withActions` adds the on-screen download buttons. */
export const ResumeDocument: FC<{ withActions?: boolean; canonical?: string }> = ({
  withActions = true,
  canonical,
}) => (
  <html lang="en-AU">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{`${resume.name} – Résumé`}</title>
      <meta name="description" content={resume.profile} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content="noindex" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <style>{raw(css)}</style>
    </head>
    <body>
      {withActions && (
        <nav class="actions" aria-label="Résumé">
          <a href="/resume.pdf" download="Jared-Stanbrook-Resume.pdf">
            Download PDF
          </a>
          <a href="/" class="quiet">
            Back to the portfolio
          </a>
        </nav>
      )}
      <ResumeSheet />
      {withActions && raw(fitScript)}
    </body>
  </html>
);
