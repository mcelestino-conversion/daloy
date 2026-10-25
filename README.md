# Daloy

Daloy is a UI-first workflow automation MVP: a polished, local-only environment for discovering templates, composing sequential flows, and inspecting deterministic simulations. “Daloy” means flow in Filipino.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The app needs no credentials, database, or external services. Workspace changes persist in browser `localStorage`.

## Validate

```bash
npm test
npm run typecheck
npm run build
```

## Included experience

- Dashboard, Templates, My Flows, Workflow Builder, Connections, and Activity
- Six immutable templates plus create-from-scratch
- React Flow canvas with sequential trigger, condition, and action nodes
- Editable configuration, add/remove/reorder, save, duplicate, activate, and delete
- Deterministic mock execution with step input/output inspection
- Responsive desktop, tablet, and mobile layouts
- Development-only demo-data reset in the sidebar

The MVP intentionally does not perform OAuth, API calls, background execution, webhooks, or production scheduling. See [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) for scope and next steps.
