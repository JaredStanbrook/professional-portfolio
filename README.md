# Professional Portfolio

[![CI Pipeline](https://github.com/JaredStanbrook/ProfessionalPortfolio/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/JaredStanbrook/ProfessionalPortfolio/actions/workflows/ci-pipeline.yml)

A modern, full-stack portfolio template built with [Hono](https://hono.dev/), [React](https://react.dev/), [Drizzle ORM](https://orm.drizzle.team/), and [Bun](https://bun.sh/).  
Easily deployable to Cloudflare Workers, with a focus on developer experience, scalability, and performance.

---

## 🚀 Features

- **Full-stack:** Hono API routes, React frontend, Drizzle ORM, SQLite (D1)
- **Modern Tooling:** Bun, Vite, TypeScript, Tailwind CSS, Radix UI, Zod 4 validation
- **Authentication:** Lucia Auth
- **Production Ready:** Cloudflare Workers, Wrangler, CI/CD scripts
- **Developer Experience:** Fast local dev, hot reload, unified config, type safety
- **Automated Quality:** Husky for automatic linting of commit messages, code, and running tests on commit/push

---

## 📦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [Node.js](https://nodejs.org/) (for some tooling)
- Cloudflare account (for deployment)

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Generate Drizzle tables & Wrangler types
bun run gen

# 3. Seed local database
bun run migrate:local

# 4. Start local development (client + worker)
bun dev
```

---

## 🛠️ Scripts

| Script                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| `bun dev`                | Start frontend and worker in parallel       |
| `bun run dev:frontend`   | Start Vite dev server                       |
| `bun run dev:worker`     | Start Cloudflare Worker locally             |
| `bun run gen`            | Generate Drizzle ORM types & Wrangler types |
| `bun run migrate:local`  | Apply local DB migrations                   |
| `bun run migrate:remote` | Apply remote DB migrations                  |
| `bun run build:prod`     | Build for production                        |
| `bun run build:staging`  | Build for staging                           |
| `bun run lint`           | Run ESLint                                  |
| `bun run preview`        | Preview production build                    |

---

## 🗂️ Project Structure

```
/
├── src/           # Frontend (React, routes, components)
├── worker/        # API routes, backend logic (Hono)
├── drizzle/       # DB migrations & schema
├── public/        # Static assets
├── package.json   # Unified scripts & dependencies
├── tsconfig.*.json# Unified TypeScript configs
└── wrangler.toml  # Cloudflare Worker config
```

---

## 🧑‍💻 Development Workflow

- **Unified Dev:** Run `bun dev` to start both frontend and worker with hot reload.
- **Database:** Use Drizzle ORM for schema and migrations. Seed with SQL files in `drizzle/`.
- **Type Safety:** All configs and code are TypeScript-first.
- **Linting:** ESLint with recommended configs for JS/TS/React.

---

## 🚢 Deployment

`wrangler.jsonc` is **committed** in this repo. CI only ever sees what is in the
repository, so an untracked config is why a build fails with *"Missing entry-point
to Worker script or to assets directory"* — the dashboard holds bindings and
secrets, but `main` and `assets.directory` live only in this file.

It is not a secret: resource ids are inert without an account-scoped API token.
Real secrets (`JWT_SECRET`, `GITHUB_API_TOKEN`, `SMTP_PASS`, `SMS_PROVIDER_API_KEY`)
belong in `.dev.vars` locally and Cloudflare encrypted secrets in production —
never in `vars`.

Forking? Copy [`wrangler.jsonc.example`](./wrangler.jsonc.example) over it and
replace the ids, the invite list and the domains. Binding names are not
free-form: they must match `worker/types.ts` (`DB`, `KV`, `BLOG`,
`RATE_LIMITER`, `ASSETS`) or the worker reads `undefined` at runtime.

> **⚠️ `vars` are replaced on every deploy.**
> `wrangler deploy` overwrites the worker's plain-text variables with whatever
> is in `vars`. Anything set as a *plain-text* variable in the Cloudflare
> dashboard but omitted here is wiped on the next deploy; encrypted secrets are
> preserved. Environments inherit nothing, so `env.staging` repeats every key.

### Database migrations

`drizzle/` is gitignored, so a fresh checkout has **no migration history**.
`bun run migrate:remote` runs `drizzle-kit generate` first, which in that state
emits a single `0000_*.sql` creating all nine tables — applying it to a database
that already has them fails. Run migrations from a working copy that holds the
real history, and treat CI migrations as off until `drizzle/` is committed
(which is what Drizzle expects; migration files are meant to be version
controlled).

1. **Build and deploy to Cloudflare**

   ```bash
   bun run deploy                     # -> jared.stanbrook.me (production)
   bunx wrangler deploy --env staging # -> dev.jared.stanbrook.me
   ```

   Production is the **top-level** config, so it takes no `--env` flag, and the
   Cloudflare Workers Builds default deploy command (`npx wrangler deploy`) is
   already correct. Named environments deploy a *separate* worker script
   (`professionalportfolio-staging`) with its own secrets — they do not share
   secrets or custom domains with the top-level worker.

### Deploying from GitHub Actions

The [`Deploy`](./.github/workflows/deploy.yml) workflow can be run on demand from
**Actions → Deploy → Run workflow**. It builds the project and runs
`wrangler deploy` against the environment you pick:

| Input            | Default      | Notes                                                          |
| ---------------- | ------------ | -------------------------------------------------------------- |
| `environment`    | `production` | `production` deploys the top-level config (`jared.stanbrook.me`); `staging` deploys `env.staging` (`dev.jared.stanbrook.me`) as a separate worker. |
| `run_migrations` | `false`      | Applies pending D1 migrations first. Leave off — see *Database migrations* above. |

Pushes to `main` reuse the same workflow automatically (production, migrations off).

**Required repository secrets** (Settings → Secrets and variables → Actions):

| Secret                  | Purpose                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | API token with Workers Scripts, D1, KV, and R2 edit permissions.             |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID.                                                  |
| `WRANGLER_CONFIG`       | *Optional fallback.* Only needed if you choose not to commit `wrangler.jsonc`; the workflow writes it from this secret when the file is absent. |

---

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests.  
Follow the [Conventional Commits](https://www.conventionalcommits.org/) style for commit messages.

---

## 📄 License

[MIT](./LICENSE)

---

## 🙏 Acknowledgements

- [Hono](https://hono.dev/)
- [React](https://react.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Bun](https://bun.sh/)
