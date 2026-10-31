# Zeuspier development

Planned stack: Next.js, React, Tailwind CSS, Vercel, and Neon Postgres.
TypeScript is the suggested language; confirm it when scaffolding the app.
No application has been scaffolded yet.

## Skills

Project skills live in `.agents/skills/`. See `SKILLS.md` for the inventory
and `skill-sources.json` for pinned sources and integrity hashes.
Read the relevant `SKILL.md` and only the references needed for the task.

For development workflows, begin with `.agents/skills/using-superpowers/SKILL.md`
and select applicable Superpowers planning, debugging, testing, review, and
verification skills. Use the installed unprefixed skill names when upstream
instructions refer to `superpowers:<name>`. Follow the actual available tools
and session instructions when adapting upstream platform examples.

- Use React performance and composition guidance for React/Next.js work.
- Use Tailwind guidance for responsive styling and accessibility.
- Use Impeccable for UI design, critique, audits, and visual polish.
- UI UX Pro Max (`ui-ux-pro-max`) provides searchable design and accessibility
  guidance. Its upstream examples use a Claude plugin path; in this project,
  resolve the script from `.agents/skills/ui-ux-pro-max/scripts/search.py` and
  run it with `python3`. Use `PYTHONDONTWRITEBYTECODE=1` to keep the vendored
  skill directory free of Python cache files. Honor the selected design direction
  when consulting its recommendations.
- Taste (`design-taste-frontend`) is also available for art direction and frontend
  design. Honor the user's selected design skill and established visual direction
  when its aesthetic guidance differs from Impeccable.
- Use Neon database guidance for connections, queries, and migrations.
- Use Playwright guidance when implementing or debugging browser tests.
- Use the Vercel deployment skill when deployment is requested.
- The Next.js caching skill is specifically for Cache Components adoption;
  apply it only when that feature is relevant and its version requirements hold.

Check installed package versions and official documentation before applying
version-sensitive examples. In particular, the Tailwind skill mixes older
configuration examples with v4 guidance. Prefer documentation matching the
installed version. Skills are guidance, not authorization to add infrastructure
or expand the requested scope. Select additional services and libraries only
when the product requirements call for them.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
