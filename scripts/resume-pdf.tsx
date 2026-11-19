// scripts/resume-pdf.tsx — `npm run resume`
//
// Prints the public résumé to public/resume.pdf, the file the site links to.
// Run it after editing worker/views/resume/data.ts or variants.ts and commit
// the PDF: Cloudflare's build has no browser, so the PDF is built here, not
// there. It also checks every variant in variants.ts fits on one page, with a
// stand-in phone number where the admin copies show the real one.
//
// Uses Playwright's Chromium, which is not a dependency of this repo: Claude
// sessions have it installed globally, and elsewhere `npm i -g playwright`
// then `npx playwright install chromium` provides it. It is loaded with
// require so NODE_PATH (where a global install lives) is honoured. Fonts:
// Arial if installed, else Liberation Sans, which has Arial's exact metrics,
// so lines break in the same places.

import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

import { ResumeDocument } from "../worker/views/resume/Resume";
import { withPhone } from "../worker/views/resume/data";
import { variants } from "../worker/views/resume/variants";

/** The slice of Playwright this uses, so typechecking needs no install. */
interface Page {
  setContent(html: string, options: { waitUntil: "load" }): Promise<void>;
  $eval(selector: string, fn: (el: HTMLElement) => number): Promise<number>;
  pdf(options: { preferCSSPageSize: boolean; printBackground: boolean }): Promise<Uint8Array>;
}
interface Browser {
  newPage(): Promise<Page>;
  close(): Promise<void>;
}
const { chromium } = createRequire(import.meta.url)("playwright") as {
  chromium: { launch(options: { executablePath?: string }): Promise<Browser> };
};

const OUT = "public/resume.pdf";

const render = (doc: unknown) => "<!doctype html>" + String(doc);

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
try {
  const page = await browser.newPage();

  // One page or nothing: a résumé that spills onto a second page is a bug
  // to fix in the data, not something to ship.
  for (const v of variants) {
    await page.setContent(
      render(<ResumeDocument resume={withPhone(v.resume, "(+61) 400 000 000")} actions="none" />),
      { waitUntil: "load" },
    );
    const over = await page.$eval(".sheet", (el) => el.scrollHeight - el.clientHeight);
    if (over > 1) {
      throw new Error(
        `The "${v.slug}" résumé is ${Math.ceil(over * 0.75)}pt longer than one A4 page. Shorten it in variants.ts.`,
      );
    }
  }

  await page.setContent(render(<ResumeDocument actions="none" />), { waitUntil: "load" });
  const overflow = await page.$eval(".sheet", (el) => el.scrollHeight - el.clientHeight);
  if (overflow > 1) {
    throw new Error(
      `The résumé is ${Math.ceil(overflow * 0.75)}pt longer than one A4 page. Shorten data.ts.`,
    );
  }

  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  writeFileSync(OUT, pdf);
  console.log(`Wrote ${OUT} (${(pdf.length / 1024).toFixed(1)} KB)`);
} finally {
  await browser.close();
}
