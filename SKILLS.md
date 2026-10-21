# Zeuspier skill starter pack

Installed on 2026-10-20 in `.agents/skills/` for this project.

| Directory | Purpose | Original publisher |
| --- | --- | --- |
| react-best-practices | React and Next.js performance | vercel-labs/agent-skills |
| composition-patterns | Maintainable React component APIs | vercel-labs/agent-skills |
| next-cache-components-adoption | Next.js Cache Components adoption, when applicable | vercel/next.js |
| tailwind-css-patterns | Responsive styling and accessibility | giuseppe-trisciuoglio/developer-kit |
| deploy-to-vercel | Vercel deployment workflows | vercel-labs/agent-skills |
| neon | Neon setup and database skill routing | neondatabase/agent-skills |
| neon-postgres | Postgres connections, migrations, branching, and queries | neondatabase/agent-skills |
| typescript-advanced-types | Type-safe interfaces and reusable types | wshobson/agents |
| playwright-best-practices | Browser tests and test debugging | currents-dev/playwright-best-practices-skill |
| impeccable | UI design, critique, accessibility audits, and visual polish | pbakaus/impeccable |
| ui-ux-pro-max | Searchable UI styles, palettes, typography, UX, and stack guidance | nextlevelbuilder/ui-ux-pro-max-skill |
| graphify | Build and query persistent knowledge graphs of project files | Graphify-Labs/graphify |
| design-taste-frontend | Art direction, page and app design, browser inspection | leonxlnx/taste-skill |
| using-superpowers | Workflow entry point and skill selection | obra/superpowers |
| brainstorming | Clarify intent and design before implementation | obra/superpowers |
| writing-plans | Prepare implementation plans | obra/superpowers |
| executing-plans | Execute plans in the current session | obra/superpowers |
| subagent-driven-development | Implement and review tasks with subagents | obra/superpowers |
| dispatching-parallel-agents | Coordinate independent parallel tasks | obra/superpowers |
| test-driven-development | Red-green-refactor testing workflow | obra/superpowers |
| systematic-debugging | Diagnose root causes before fixing bugs | obra/superpowers |
| verification-before-completion | Verify results before claiming completion | obra/superpowers |
| requesting-code-review | Prepare and request code review | obra/superpowers |
| receiving-code-review | Evaluate and address review feedback | obra/superpowers |
| using-git-worktrees | Isolate development work | obra/superpowers |
| finishing-a-development-branch | Complete and integrate branch work | obra/superpowers |
| diagnosing-superpowers | Diagnose workflow problems | obra/superpowers |
| writing-skills | Author and validate skills | obra/superpowers |

Eight skills were installed from the [AutoSkills registry](https://github.com/midudev/autoskills/tree/v0.4.1/packages/autoskills/skills-registry),
pinned to v0.4.1. Every listed file was checked against that release's SHA-256
manifest. The required `neon` parent skill was installed directly from its
publisher at the same upstream commit recorded for `neon-postgres`:
`c843abc48e3c2268db31f5229cb93376de92ce3e`.

Impeccable 4.7.0 was installed from the publisher's Codex skill directory at
commit `dad8dbb3aac21ad1fa236c110315ef4abece23e8`. This is a skill-only
installation, including its references and launcher. Invoke it with
`$impeccable` (for example, `$impeccable polish`). The launcher downloads its
pinned engine on first use when no bundled engine is present. Automatic edit
hooks are not installed.

Superpowers 7.0.0's 15 skills were installed on 2026-10-21 directly from
`obra/superpowers`, pinned to commit
`b739a8af570e10a95898f2bdf6cec97467fa6c12`. Every installed file was compared
against the pinned checkout. This is a project-local skill installation;
the upstream marketplace plugin is not installed. `AGENTS.md` supplies the
development workflow entry point. Invoke skills with their unprefixed names,
such as `$brainstorming` or `$systematic-debugging`.

`skill-sources.json` records sources, upstream revisions, bundle hashes, and
per-file hashes. Hash verification establishes file integrity, not the technical
accuracy of every example. Follow the version checks in `AGENTS.md`.

Taste's `design-taste-frontend` skill was installed on 2026-10-21 from
`leonxlnx/taste-skill`, pinned to commit
`6010f91a9935f1c167dfc500fb1a475681892e6b`. All installed files match the
pinned checkout. This repository currently contains one skill; older companion
skills now live in separate repositories. Its scripts require Node 22+ and an
installed Chrome, Edge, or Chromium; image discovery requires network access.
Invoke with `$design-taste-frontend`.

These are agent instructions and reference files. Application dependencies,
database provisioning, and hosting setup are separate development steps.

UI UX Pro Max was installed on 2026-10-21 from
`nextlevelbuilder/ui-ux-pro-max-skill` at commit
`56ea9cf174ed86786187daa9de0e6247cb0747e4`. All 73 files match the upstream
`.claude/skills/ui-ux-pro-max` directory, including datasets, references, and
search scripts. A local UX search completed successfully with Python 3.9.6.
Invoke `$ui-ux-pro-max`. See `AGENTS.md` for the local script path that replaces
the Claude-specific path in upstream examples.

Graphify's Codex skill and eight references were installed on 2026-10-21 from
revision `b90b9df7949bd04a15b40a1624af85d0a9cfdf04` (package version 0.9.93).
Upstream `graphify/skill-codex.md` is installed as `graphify/SKILL.md`, with
`graphify/skills/codex/references` copied beside it; all nine files match upstream.
Invoke `$graphify`. This installs the skill only. Running graph generation needs
the `graphifyy` Python package and Python 3.10+; the default Python found during
installation was 3.9.6. No runtime, hooks, MCP server, or graph has been installed
or generated by this setup.

## Caveman skills

Installed 2026-10-21 from `JuliusBrussee/caveman`, pinned to commit
`bad48a0e1df55e05e3f52249afa35ecc1909ee76`. All 22 skill directories and
their supporting files were compared against the pinned checkout.

- `cavecrew`
- `caveman`
- `caveman-commit`
- `caveman-compress`
- `caveman-discover`
- `caveman-evidence-review`
- `caveman-explore`
- `caveman-help`
- `caveman-learn`
- `caveman-manage`
- `caveman-optimize`
- `caveman-review`
- `caveman-setup`
- `caveman-stats`
- `investigate-first`
- `lean-build`
- `megacave`
- `migration`
- `safe-refactor`
- `surgical-patch`
- `ultracave`
- `verify-and-stop`

Invoke `$caveman` for concise responses or `$caveman-help` for guidance.
Installing these skills does not activate a response mode. This is a skill-only
installation: cloud, proxy, telemetry hooks, and named agent presets are not
configured. Skills that refer to those services require their separate setup
when requested. Compression uses a configured model provider; do not run it
merely as part of skill installation. No token savings have been measured.
