# CI/CD

`.github/workflows/ci-cd.yml` uses GitHub Actions for validation and Vercel for
releases. It follows Vercel's [prebuilt deployment workflow](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel).

| Trigger | Checks | Deployment |
| --- | --- | --- |
| Pull request targeting `staging` or `main` | Tests, database integration, TypeScript, Next.js build | None |
| Push to `staging` | Same checks | Vercel Preview using Neon staging |
| Push to `main` | Same checks | Vercel Production using Neon production |
| Manual workflow run | Same checks | None |

CI runs Node 24 and a disposable Postgres 18 service. It never needs Neon or
Vercel credentials and also runs for fork pull requests. GitHub Actions are pinned
to commit SHAs; the Vercel CLI is pinned to 65.9.0. `.nvmrc` selects Node 24 locally.

## Existing Neon environments

Project: `daloy` (`wispy-field-91738641`). Database: `neondb`. App schema: `daloy`.

| Environment | Branch ID | Direct endpoint hostname |
| --- | --- | --- |
| production | `br-sweet-dust-b4xt0fbk` | `ep-fragrant-thunder-b4eirr4f.c-6.us-east-2.aws.neon.tech` |
| staging | `br-little-hill-b4utpim6` | `ep-royal-cloud-b4ywczbn.c-6.us-east-2.aws.neon.tech` |

Staging was created as an isolated copy of production on 2026-10-31, including
its schema and data. Later writes on either branch do not synchronize to the
other. Its compute is fixed at 0.25 CU and uses the account's default suspend
policy; a custom timeout was rejected by the account's plan.

Local `.env.local` was preserved and still selects production. To work locally
against staging, replace only `DATABASE_URL` with the pooled connection string
from Neon's staging branch, then restart the dev server. If you also configure
`DATABASE_URL_UNPOOLED`, it must select the same staging branch/database.

## One-time activation

1. Commit the workflow **and the app's currently uncommitted database implementation**
   to the repository. GitHub currently resolves the old `zeuspier` repository URL
   to `mcelestino-conversion/daloy`. No files have been pushed by this setup.
2. Create/link a Vercel project for the app. Select Next.js and Node.js 24.x.
   Use one project with Preview and Production environments. Obtain its organization
   and project IDs from `.vercel/project.json` after `vercel link`.
3. Configure Vercel's runtime variables using **Neon Connect** for the appropriate
   branch. Use pooled `DATABASE_URL` and optionally direct `DATABASE_URL_UNPOOLED`.
   Both must include `sslmode=require` or `sslmode=verify-full`. Only the standard
   `sslmode` and `channel_binding` URL parameters are accepted by the deployment
   guard; query-string host/database overrides and duplicate parameters are rejected.
   - **Production:** production branch credentials.
   - **Preview, branch override `staging`:** staging branch credentials.
   - Add QStash/Redis variables separately if needed. These are not currently used
     for workflow execution. Do not prefix any credentials with `NEXT_PUBLIC_`.
4. In GitHub Settings → Environments, create `staging` and `production`.
   Restrict staging deployments to the `staging` branch, and production to `main`.
   Configure required reviewers for production if you want a manual release gate.
5. In **each GitHub environment**, add:

   | Kind | Name | Value |
   | --- | --- | --- |
   | Secret | `VERCEL_TOKEN` | Vercel token with access to the project |
   | Variable | `VERCEL_ORG_ID` | Vercel team/account ID |
   | Variable | `VERCEL_PROJECT_ID` | Vercel project ID |
   | Variable | `EXPECTED_DATABASE_HOST` | That environment's direct endpoint hostname from the table above |

   Add this **repository variable**, shared by both environments:

   ```text
   PRODUCTION_DATABASE_HOST=ep-fragrant-thunder-b4eirr4f.c-6.us-east-2.aws.neon.tech
   ```

   Database passwords are maintained in Vercel, not duplicated as GitHub secrets.
   The workflow pulls the selected environment, validates its host, builds, runs
   migrations using those same credentials, then uploads the prebuilt artifact.
6. Require the **Test and build** check in branch rules for `main` and `staging`.
   Push/merge to `staging` first. Once verified, open a PR from `staging` to `main`.
   The deployment URL appears in the Actions run summary and GitHub environment.

`vercel.json` disables Vercel's independent Git-triggered deployments, ensuring
those deployments do not bypass Actions checks. CLI deployments remain enabled.
Do not merge that setting without configuring the GitHub deployment environments;
otherwise validation will run but deployment will fail for missing settings.
See [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).

## Release behavior and rollback

- Missing configuration fails explicitly. Staging cannot use the registered
  production endpoint, even if its expected-host setting was accidentally copied
  from production. Direct and pooled URLs must resolve to the same endpoint/database.
- PRs and manual runs never enter the deployment job or receive deployment secrets.
- Builds must finish before migrations run. The release step checks that its
  commit is still the head of the deployment branch before changing the database.
- Runs on each branch are serialized without cancelling an in-progress migration.
  GitHub may replace pending runs with newer ones. Reruns of obsolete commits fail
  the release-head check rather than deploying old code over a newer commit.
- The current migration creates the initial schema idempotently. It is not a
  general numbered-migration runner: add an ordered migration mechanism before
  introducing future non-idempotent SQL migrations.
- Deployment failure after migration does not roll back the database. Future
  schema changes must remain compatible with the currently deployed app.
- Roll back application code through Vercel's deployment controls, or revert a
  commit and push through CI. Never reset/drop the production database as a code
  rollback. Production data is never automatically copied back from staging.

## Local verification

```bash
nvm use
npm ci
npm test
npm run typecheck
npm run build
```

Database tests are opt-in outside CI and write temporary records. To reproduce CI,
start a disposable local Postgres 18 database and inject its URL:

```bash
export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/daloy_ci'
export TEST_DATABASE_URL="$DATABASE_URL"
unset DATABASE_URL_UNPOOLED
npm run db:migrate
npm test
```

Use a clean checkout without `.env.local` for this reproduction, so local secrets
cannot override optional settings. The database scripts accept injected variables
without requiring an `.env.local` file. Do not point integration tests at production.
