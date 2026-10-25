# Daloy UI-First MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, fully interactive root-level Daloy frontend MVP with template creation, sequential workflow editing, local persistence, deterministic simulation, demo connections, and activity inspection.

**Architecture:** A Next.js App Router shell renders route-level server components around focused client features. A versioned client workspace provider is the sole UI boundary for localStorage, while pure TypeScript modules own workflow sequence mutations and deterministic simulation. React Flow is isolated to the builder canvas and templates remain immutable seed data.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `@xyflow/react`, Lucide React, browser localStorage, Node test runner through `tsx`.

**Spec:** `docs/superpowers/specs/2026-10-25-daloy-ui-first-mvp-design.md`

## Global Constraints

- Scaffold the main application at repository root; do not modify `/poc`.
- Use only Sandstone `#D6C2A4` as the decorative brand accent and honor all supplied charcoal tokens.
- Use React Flow dots and the exact warm sandstone node radial gradient.
- Keep workflows sequential; conditions may stop but never branch.
- Do not implement external APIs, OAuth, databases, workers, cron, webhooks, AI, billing, teams, or multitenancy.
- All visible controls must perform meaningful local actions and persist where the spec requires.
- Keep templates immutable and clone them before user editing.
- Use mock data honestly and label all connections and executions as simulated.

## Review Focus

- Corrupt or unavailable localStorage must recover to demo state without crashing.
- Cloning or duplicating a workflow must create independent node/configuration objects and unique IDs.
- Insert, remove, and reorder operations must rebuild one valid sequential edge chain.
- A false condition must stop later simulated steps and record a filtered execution, not a success placeholder.
- Mobile and keyboard users must reach navigation, dialogs, node editors, and builder actions without obscured focus or horizontal page overflow.

---

### Task 1: Root application foundation and domain contracts

**Files:**
- Create: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`
- Create: `lib/daloy/types.ts`, `lib/daloy/catalog.ts`, `lib/daloy/templates.ts`
- Test: `test/catalog.test.ts`

**Interfaces:**
- Produces `AppDefinition`, `WorkflowNodeData`, `Workflow`, `Template`, `Connection`, `Execution`, and `ExecutionStep` types.
- Produces immutable `appCatalog` and `workflowTemplates` seed collections.

- [ ] Write catalog tests for seven supported apps, six required immutable templates, valid node ordering, and unique identifiers; run them and confirm they fail because the modules do not exist.
- [ ] Scaffold the exact dependency set and Next.js/Tailwind configuration, then implement the typed catalog and six template definitions.
- [ ] Run focused tests, typecheck, and a production build; confirm the new root shell compiles.

### Task 2: Pure workflow operations, persistence schema, and simulation

**Files:**
- Create: `lib/daloy/workflows.ts`, `lib/daloy/simulation.ts`, `lib/daloy/storage.ts`, `lib/daloy/demo-data.ts`
- Test: `test/workflows.test.ts`, `test/simulation.test.ts`, `test/storage.test.ts`

**Interfaces:**
- Produces `createBlankWorkflow`, `createWorkflowFromTemplate`, `duplicateWorkflow`, `insertNode`, `removeNode`, `moveNode`, and `updateNodeConfig`.
- Produces `simulateWorkflow(workflow, now?) => Execution` and versioned parse/serialize helpers.

- [ ] Write failing tests proving deep clone isolation, unique IDs, valid sequential edges, trigger/action simulation output, false-condition stopping, actual configuration use, and storage fallback on invalid payloads.
- [ ] Implement only the pure operations required by those tests and deterministic mock execution.
- [ ] Run focused tests and the complete suite; refactor only while tests remain green.

### Task 3: Workspace provider, design system, and application shell

**Files:**
- Create: `components/providers/workspace-provider.tsx`, `components/shell/app-shell.tsx`, `components/shell/sidebar.tsx`, `components/ui/*`
- Create: `app/page.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`

**Interfaces:**
- Produces `useWorkspace()` state/actions for workflows, connections, executions, reset, and hydration status.
- Produces shared button, dialog, status, app mark, empty-state, and page-heading primitives.

- [ ] Add failing storage/provider-adjacent tests for seeded initialization and action persistence using pure storage adapters.
- [ ] Implement the versioned provider and responsive shell, then build the dashboard from derived persisted data.
- [ ] Verify keyboard focus, reduced motion, empty/loading states, and the palette/token contract at desktop, tablet, and mobile widths.

### Task 4: Template discovery and creation paths

**Files:**
- Create: `app/templates/page.tsx`, `components/templates/template-gallery.tsx`, `components/templates/template-card.tsx`, `components/templates/template-preview.tsx`
- Create: `app/flows/new/page.tsx`

**Interfaces:**
- Consumes immutable templates and `createWorkflowFromTemplate`.
- Produces search, category filters, details dialog, “Use template,” and “Create from scratch” navigation.

- [ ] Write failing pure filtering tests for case-insensitive search, category intersection, and no-results behavior.
- [ ] Implement template filtering and the preview/create interactions using cloned workflow data.
- [ ] Exercise the discover → preview → create journey and verify template definitions remain unchanged.

### Task 5: Workflow canvas and node configuration

**Files:**
- Create: `app/flows/[id]/page.tsx`, `components/builder/workflow-builder.tsx`, `components/builder/workflow-canvas.tsx`, `components/builder/workflow-node.tsx`, `components/builder/config-panel.tsx`, `components/builder/step-picker.tsx`, `components/builder/execution-panel.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes workflow operations and provider actions.
- Produces React Flow node/edge rendering, selection, configuration, insertion, removal, reordering, save, activation, and simulation controls.

- [ ] Add failing tests for node-summary derivation, configuration validation, and insertion choices.
- [ ] Implement the responsive split workspace, required dotted background, exact node gradient, connected edges, add-step controls, and right configuration panel.
- [ ] Implement save, active/draft status, and deterministic animated simulation with expandable JSON details.
- [ ] Verify all visible builder controls, pan/zoom/fit, selection, mobile overview, and reduced-motion behavior.

### Task 6: Flow management, demo connections, and activity

**Files:**
- Create: `app/flows/page.tsx`, `components/flows/flow-list.tsx`
- Create: `app/connections/page.tsx`, `components/connections/connection-catalog.tsx`
- Create: `app/activity/page.tsx`, `components/activity/activity-list.tsx`, `components/activity/execution-detail.tsx`

**Interfaces:**
- Consumes workspace workflows/connections/executions and their actions.
- Produces edit, duplicate, delete confirmation, enable/pause, simulated connect/disconnect, activity filtering, and execution detail inspection.

- [ ] Add failing pure tests for status toggling, duplicate naming, delete behavior, and connection state transitions.
- [ ] Implement responsive management lists/cards, confirmation dialogs, explicit demo labels, and detailed execution views.
- [ ] Verify changes survive refresh and every row/card action updates the correct persisted object.

### Task 7: Documentation, accessibility polish, and final proof

**Files:**
- Create: `docs/DESIGN_SYSTEM.md`, `docs/UI_GUIDELINES.md`, `docs/WORKFLOW_BUILDER.md`, `docs/MOCK_DATA.md`, `docs/IMPLEMENTATION_PLAN.md`
- Modify: `README.md`

**Interfaces:**
- Documents the exact implemented product, tokens, models, localStorage keys, simulation rules, limitations, and future integration seams.

- [ ] Document the implementation accurately, including the two explicit style exceptions: dotted canvas and warm radial node gradient.
- [ ] Run the full test suite, typecheck, and production build and record exact results.
- [ ] Start the app and inspect Dashboard, Templates, My Flows, Builder, Connections, and Activity at 1440px, 768px, and 390px; fix visible overflow, focus, hierarchy, and contrast issues.
- [ ] Run the applicable design lint/inspection tooling, review the final diff for unrelated changes, and report remaining MVP limitations.

