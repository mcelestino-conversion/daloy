# Daloy UI-First Workflow Automation MVP

## Intent

Daloy is a frontend-first, template-driven workflow automation product whose name comes from the Filipino word for “flow.” The MVP must make automation approachable to nontechnical users while preserving the visual clarity and direct manipulation expected by experienced users.

The application demonstrates the complete product journey with deterministic mock data: discover a template, create a workflow, configure sequential steps, save it, simulate it, review the execution, and manage demo connections. It does not call external APIs or run real automations.

## Product goals

- Provide six navigable product surfaces: Dashboard, Templates, My Flows, Workflow Builder, Connections, and Activity.
- Make templates the fastest path to a useful flow while retaining create-from-scratch.
- Use a visual, top-to-bottom React Flow canvas with trigger, condition, and action nodes.
- Persist user workflows, connection state, and execution history in versioned browser localStorage.
- Simulate workflows from their saved configuration and expose step inputs, outputs, duration, and status.
- Keep every visible control meaningful, keyboard accessible, and understandable without API vocabulary.
- Establish reusable design, interaction, builder, and mock-data documentation for future backend work.

## Non-goals

- No OAuth, Google APIs, third-party network calls, databases, cron jobs, workers, webhook listeners, billing, teams, production multitenancy, AI agents, MCP, or RAG.
- No parallel branches, loop constructs, or production-grade automation engine.
- No generalized plugin SDK or extensibility framework.
- No modifications to the existing `/poc` reference application.

## Product structure

- `/` — workspace overview and primary creation actions.
- `/templates` — searchable/filterable gallery with details and template cloning.
- `/flows` — persisted workflow management: edit, duplicate, delete, activate, and pause.
- `/flows/new` and `/flows/[id]` — sequential workflow builder.
- `/connections` — supported app catalog with explicitly simulated connection controls.
- `/activity` — persisted simulation history and detailed step output.

## Visual direction

Daloy is an Operate-mode product: the interface favors task clarity, calm density, and precision over decorative spectacle. The chosen direction is a warm adaptation of a true-black flat builder shell. The brief-pinned palette, dotted canvas, and node treatment override generic style guidance where they conflict.

- Background `#141414`, canvas `#1A1917`, sidebar `#1B1A18`.
- Surfaces `#242321` and `#292723`; borders `#393732`.
- Sandstone `#D6C2A4` is the only brand accent.
- Ivory `#F5F0E8` and taupe `#A9A198` carry the text hierarchy.
- Workflow nodes use the required warm sandstone radial gradient and selected sandstone border.
- The builder canvas uses React Flow dots at 20px spacing with a restrained `#5D574E` mark.
- Geist is the primary face; icons come from Lucide.
- Motion is limited to 150–200ms state transitions and deterministic simulation progress, with reduced-motion support.

## Interaction model

Templates are immutable definitions. “Use template” clones one into a user-owned workflow with new identifiers. Builder edits operate on that copy only. The canvas remains a single-path sequence: adding, removing, and reordering nodes rebuilds the chain edges so connections cannot become stale.

Selecting a node opens its editor. Configuration writes through to node data immediately, including the summary displayed on the canvas. Insert controls between steps open a focused step picker. On smaller screens the canvas becomes a readable vertical workflow overview and configuration opens as a full-screen drawer.

Simulation evaluates the actual node sequence. A trigger creates deterministic sample input, a condition compares the configured field/operator/value and may stop the run, and actions transform the prior output into mock result objects. Every result states that no external request occurred.

## State and boundaries

A small application service layer owns JSON-compatible models, seed data, cloning, sequence mutation, validation, persistence serialization, and simulation. React components consume that layer through a client provider rather than reading localStorage directly. This keeps the UI replaceable when a real backend arrives.

Local state uses schema-versioned keys for workflows, connections, executions, and an initialization marker. Invalid or unavailable storage falls back to demo data without blocking the UI. A development-only reset action restores the seeded state.

## Responsive behavior

- Desktop: labelled left navigation, central work area, right configuration panel, collapsible bottom execution panel.
- Tablet: navigation condenses, configuration becomes a drawer, and the canvas retains pan/zoom.
- Mobile: compact top navigation, sequential read/edit list, full-screen step configuration, and touch targets of at least 44px.

## Accessibility and quality

- Visible focus treatment on every interactive element.
- Semantic labels, dialogs, status text, and keyboard-reachable actions.
- Status is always communicated with text/icons, not color alone.
- Controls retain at least 44px targets on touch layouts.
- No hidden horizontal page overflow; tables and technical JSON manage their own overflow.
- Deterministic domain behavior is covered by tests; final delivery requires test, typecheck, build, and multi-viewport visual inspection.

