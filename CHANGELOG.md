# Changelog

This site's own changes. Template releases are listed in the template's
changelog; `frugal.json` records which one this site is on.

## 2026-11-18 — Rebuilt on the Frugal template (0.3.0)

The React single-page app is replaced by the template's server-rendered
Worker. Same domain, database, KV namespace and R2 bucket.

- Pages: blog home, posts, about, IT service desk, grade calculator, editor,
  sign-in and profile. Dropped (unlinked): `/home`, `/navigation`, `/tradie`,
  `/resume-builder`.
- Blog posts render on the server; the editor has a live preview.
- The GitHub proxy now fetches only the help desk repo's commit stats, instead
  of any path under `/api/github/*`.
- Auth, sessions, roles and passkeys are the template's. Existing accounts,
  passwords and passkeys keep working; everyone signs in once more.
- Migrations are committed (`drizzle/0000_baseline.sql`) and written to apply
  safely over the existing database.
- Deploys move from GitHub Actions to Cloudflare's Git integration.
