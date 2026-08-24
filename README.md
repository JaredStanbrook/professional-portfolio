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

> **⚠️ Configuration Required:**
> Before running or deploying this project you must create a `wrangler.jsonc` at the project root,
> and **commit it**. Any CI that deploys (Cloudflare Workers Builds, GitHub Actions) only ever sees
> what is in the repository — if this file is untracked, `wrangler deploy` fails with
> *"Missing entry-point to Worker script or to assets directory"*.
>
> - Start from [`wrangler.jsonc.example`](./wrangler.jsonc.example).
> - Binding names must match `worker/types.ts` exactly: `DB`, `KV`, `BLOG`, `RATE_LIMITER`, `ASSETS`.
> - Fill in your D1 `database_id` and KV namespace `id`.
> - See the [Cloudflare Wrangler documentation](https://developers.cloudflare.com/workers/wrangler/configuration/).

**Example:**

```bash
cp wrangler.jsonc.example wrangler.jsonc
# Fill in your D1 / KV ids, then commit it
git add wrangler.jsonc && git commit -m "Adds wrangler configuration"
```

> **This file is not a secret.** Resource ids are inert without an account-scoped API token.
> Actual secrets (`JWT_SECRET`, `GITHUB_API_TOKEN`, `SMTP_PASS`, `SMS_PROVIDER_API_KEY`) go in
> `.dev.vars` locally and in Cloudflare's encrypted secrets in production — never in `vars`.

> **⚠️ `vars` are replaced on every deploy.**
> `wrangler deploy` overwrites the worker's plain-text variables with whatever is in `vars`.
> Anything you set as a *plain-text* variable in the Cloudflare dashboard but omit from
> `wrangler.jsonc` is wiped on the next deploy. Encrypted secrets are preserved.
> Environments do not inherit `vars`, so `env.production.vars` must repeat every key.

1. **Build and deploy to Cloudflare**

   ```bash
   bun run deploy                        # -> dev.jared.stanbrook.me (default env)
   bunx wrangler deploy --env production # -> jared.stanbrook.me
   ```

   The `deploy` script targets the top-level config. The live domain lives under
   `env.production`, so a production release needs the `--env production` flag.
   If you deploy via Cloudflare Workers Builds, set its **deploy command** to
   `npx wrangler deploy --env production` for the same reason.

### Deploying from GitHub Actions

The [`Deploy`](./.github/workflows/deploy.yml) workflow can be run on demand from
**Actions → Deploy → Run workflow**. It builds the project and runs
`wrangler deploy` against the environment you pick:

| Input            | Default      | Notes                                                          |
| ---------------- | ------------ | -------------------------------------------------------------- |
| `environment`    | `production` | `production` deploys `jared.stanbrook.me`; `staging` deploys the top-level config (`dev.jared.stanbrook.me`). |
| `run_migrations` | `false`      | Generates and applies pending D1 migrations before deploying.   |

Pushes to `main` reuse the same workflow automatically (production, with migrations).

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
