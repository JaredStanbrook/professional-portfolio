// worker/routes/admin/resumes.tsx
//
// Job-specific résumés for sending to employers. The list is an ordinary
// admin page; each résumé is its own A4 document, like /resume, with the
// phone number from the RESUME_PHONE secret and a button that prints it to
// PDF. Mounted under the admin router, so requireRole("admin") already ran.

import { Hono } from "hono";

import { htmxResponse } from "@server/lib/htmx-helpers";
import type { AppEnv } from "@server/types";
import { withPhone } from "@views/resume/data";
import { ResumeDocument } from "@views/resume/Resume";
import { findVariant, variants } from "@views/resume/variants";
import { ResumeListPage } from "@views/admin/Resumes";

export const resumesAdminRoute = new Hono<AppEnv>();

resumesAdminRoute.get("/", (c) =>
  htmxResponse(
    c,
    "Résumés",
    <ResumeListPage variants={variants} hasPhone={!!c.env.RESUME_PHONE} />,
  ),
);

resumesAdminRoute.get("/:slug", (c) => {
  const v = findVariant(c.req.param("slug"));
  if (!v) return c.notFound();
  const doc = (
    <ResumeDocument
      resume={withPhone(v.resume, c.env.RESUME_PHONE)}
      actions="admin"
      slug={v.slug}
    />
  );
  return c.html(`<!doctype html>${doc.toString()}`);
});
