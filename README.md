# Professional Portfolio

Jared Stanbrook's portfolio at [jared.stanbrook.me](https://jared.stanbrook.me):
selected work, experience and writing on the home page, a Markdown blog, the
IT service desk write-up and a grade calculator.

Built on the [Frugal template](https://github.com/JaredStanbrook/frug-template)
(release recorded in `frugal.json`): one Cloudflare Worker that server-renders
every page with Hono JSX and HTMX, D1 + Drizzle for data, R2 for post bodies,
and Tailwind theme tokens for light and dark.

## Where things live

| Path                                | Holds                                                           |
| ----------------------------------- | --------------------------------------------------------------- |
| `worker/routes/blog.tsx`            | Home (the portfolio), `/blog`, `/blog/:slug`, and the `/editor` |
| `worker/services/blog.service.ts`   | Front matter, Markdown rendering, R2 + D1 reads and writes      |
| `worker/routes/pages.tsx`           | `/it-help-desk`, `/grade-calculator`; `/about` redirects home   |
| `worker/views/portfolio/content.ts` | Everything the portfolio says: projects, roles, links, bio      |
| `worker/services/github.service.ts` | Cached GitHub commit stats for the help desk page               |
| `worker/index.css`                  | The theme: every colour is a token with a light and dark value  |

Posts are `<slug>.mdx` objects in the `blog-r2` bucket, with a `blog_metadata`
row each for the lists. Write them at `/editor` once signed in.

## Develop

```bash
npm install
cp .dev.vars.example .dev.vars   # set JWT_SECRET; RP_ID=localhost, ORIGIN=http://localhost:5173
npm run migrate:local
npm run dev
```

Before pushing: `npm run build && npm test && npm run lint`.

## Deploy

Cloudflare's Git integration builds and deploys every push to `main`
(Build: `npm run build`, Deploy: `npm run deploy`, which applies D1 migrations
first). Secrets, set on the Worker as type **Secret**:

- `JWT_SECRET` — required.
- `GITHUB_API_TOKEN` — optional, read-only; raises GitHub's rate limit for the
  help desk stats.

Full walkthrough: [docs/deploy.md](docs/deploy.md).

## Template upgrades

```bash
npm run template            # releases not applied yet
npm run template -- upgrade # merge them in
```

See [docs/template-versions.md](docs/template-versions.md).
