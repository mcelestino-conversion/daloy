# Mock Data

## Ownership

Templates in `lib/daloy/templates.ts` are immutable definitions. Creating from a template deep-copies node configuration into a separate user workflow. User state is exposed through `WorkspaceProvider`, while UI components remain unaware of storage serialization.

The workspace snapshot contains:

- `workflows`: user-created and seeded editable workflows
- `connections`: one simulated state per supported application
- `executions`: newest-first simulation history
- `version`: storage schema version

## Persistence

Daloy stores one JSON-compatible envelope under:

```text
daloy.workspace.v1
```

The parser validates the envelope version and top-level collections. Missing, malformed, or incompatible data falls back to deterministic demo state and surfaces a recovery notice. Writes occur after hydration to avoid replacing browser data with server defaults.

During development, **Reset demo data** in the sidebar restores the seed snapshot. The reset control is excluded from production builds.

## Seed data

The demo workspace begins with two flows, two connected demo apps, and one successful Gmail-to-Google-Sheets execution. Dates and payloads are fixed so tests and previews are repeatable.

Template catalog:

1. Gmail → Google Sheets
2. Google Sheets → Slack
3. Google Calendar → Gmail
4. Gmail → Google Drive
5. Webhook → Google Sheets
6. Tasks → Gmail

## Future replacement points

Replace the provider's load/save effects with a repository or API client while preserving the `Workflow`, `Connection`, and `Execution` contracts. Replace `simulateWorkflow` with an execution service behind the same result shape. Template definitions can later move to a service without changing editor components.
