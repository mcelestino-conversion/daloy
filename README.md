# Daloy

Daloy is a UI-first workflow automation MVP: a database-backed environment for discovering templates, composing sequential flows, and inspecting deterministic simulations. “Daloy” means flow in Filipino.

## Run locally

```bash
npm ci
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`. Set `DATABASE_URL` in `.env.local` before running the migration. Workflows, connection settings, and simulation history persist in Neon Postgres.

### Backend service configuration

For local development, copy `.env.example` to `.env.local` (only if
`.env.local` does not already exist) and fill in the Neon, QStash, and Upstash
Redis credentials. Restart `npm run dev` after changing credentials.

`.env.local` is ignored by Git. Keep these variables server-only; never prefix
them with `NEXT_PUBLIC_`. Use plain URLs, without Markdown link formatting.

The app uses the `daloy.workspaces`, `daloy.workflows`, `daloy.connections`, and
`daloy.executions` tables. Each entity has its own row; its nested workflow or
execution data uses Postgres JSONB. JSON files and browser storage are not the
active persistence layer. Schema setup is additive and idempotent.

An HTTP-only workspace cookie identifies this browser's workspace. There is no
account login or cross-device workspace recovery yet; clearing that cookie creates
a new workspace. Keep the cookie to retain access to your database workspace.
Existing `daloy.workspace.v1` browser data is imported only when creating the
workspace, and retained unchanged as a backup. Invalid legacy data blocks import
rather than silently replacing it; existing database workspaces ignore the old backup. Empty workspaces stay empty on reload.

Database writes are validated, scoped to the cookie's workspace, and serialized
with a transaction and row lock. Save failures are shown in the app. Connections
and executions are still simulations; QStash job delivery and OAuth are not enabled.

To roll back the app migration, restore the previous application version. Its
browser backup remains available, but changes made after switching to Postgres
will remain only in the database. Do not drop the `daloy` schema to roll back code.

## Validate

```bash
npm test
npm run typecheck
npm run test:db
npm run build
```

`npm run test:db` uses `.env.local`, creates isolated random test workspaces, and
removes them afterwards. The default unit suite skips this network integration test.

## Included experience

- Dashboard, Templates, My Flows, Workflow Builder, Connections, and Activity
- Six immutable templates plus create-from-scratch
- React Flow canvas with sequential trigger, condition, and action nodes
- Editable configuration, add/remove/reorder, save, duplicate, activate, and delete
- Deterministic mock execution with step input/output inspection
- Responsive desktop, tablet, and mobile layouts
- Development-only demo-data reset in the sidebar

Provider connections and workflow executions remain simulated: the MVP does not perform OAuth, provider API calls, background execution, webhooks, or production scheduling. See [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) for scope and next steps.

## CI/CD

GitHub Actions tests pull requests and deploys successful `staging`/`main` pushes
to Vercel Preview/Production. See [CI/CD setup](docs/CI_CD.md) for the required
GitHub environment settings, Vercel configuration, and separate Neon branches.
