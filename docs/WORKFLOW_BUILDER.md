# Workflow Builder

## MVP model

Daloy supports one sequential path. A workflow contains ordered nodes and derived edges. The first node is a trigger; later nodes may be conditions or actions. Conditions can continue or stop a simulation but do not branch.

```ts
type WorkflowNodeData = {
  id: string;
  type: "trigger" | "condition" | "action";
  appId: AppId;
  name: string;
  event: string;
  summary: string;
  configured: boolean;
  order: number;
  config: Record<string, string>;
};
```

Edges are rebuilt after every insertion, removal, or move. For `n` nodes, the builder creates `n - 1` edges connecting each node to its successor. This keeps visual state and execution order aligned.

## Canvas and configuration

React Flow owns desktop panning, zooming, fit-to-view, node selection, handles, and edges. Nodes are intentionally not freely draggable in this MVP because order is authoritative and edited through move controls.

The right panel derives fields from node type and app. Edits update `config`, regenerate the human-readable summary, and recalculate `configured`. The trigger cannot be removed or moved below another step.

Supported insertion choices include a condition, Google Sheets row, Slack message, Gmail message, Drive file, and HTTP request. New steps receive independent IDs.

## Simulation

Simulation reads the current workflow object, not a hardcoded success result. Triggers produce deterministic sample payloads. Conditions evaluate their configured field, operator, and value. A failed condition marks later steps skipped. Actions create mock output from current configuration.

Each execution records status, timing, inputs, outputs, and a message. `externalCallsMade: false` appears in action output, and the UI consistently labels runs as simulated.

## Current limitations

- No branching, loops, parallel paths, drag reordering, schedules, or live webhooks.
- No production validation across app schemas.
- No credentials or external API execution.
- No background execution or retry engine.
