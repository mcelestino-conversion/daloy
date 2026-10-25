"use client";

import { ArrowDown, ArrowUp, Trash2, X } from "lucide-react";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { appCatalog } from "@/lib/daloy/catalog";
import { deriveNodeSummary, validateNodeConfig } from "@/lib/daloy/node-config";
import type { WorkflowNodeData } from "@/lib/daloy/types";

const fieldClass = "h-10 w-full rounded-lg border border-border bg-canvas px-3 text-sm text-ivory placeholder:text-taupe focus:border-sandstone focus:outline-none";

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-ivory">{label}</span><input className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function ConfigPanel({ node, onChange, onClose, onRemove, onMove, canMoveUp, canMoveDown }: { node: WorkflowNodeData | null; onChange: (node: WorkflowNodeData) => void; onClose: () => void; onRemove: () => void; onMove: (direction: -1 | 1) => void; canMoveUp: boolean; canMoveDown: boolean }) {
  if (!node) return <aside data-ui className="hidden w-[360px] shrink-0 border-l border-border bg-sidebar p-6 lg:block"><p className="text-sm text-taupe">Select a step to configure it.</p></aside>;
  const currentNode = node;
  const errors = validateNodeConfig(currentNode);

  function updateConfig(key: string, value: string) {
    const draft: WorkflowNodeData = { ...currentNode, config: { ...currentNode.config, [key]: value } };
    onChange({ ...draft, summary: deriveNodeSummary(draft), configured: validateNodeConfig(draft).length === 0 });
  }

  function changeApp(appId: WorkflowNodeData["appId"]) {
    const app = appCatalog.find((item) => item.id === appId);
    if (!app) return;
    const event = currentNode.type === "trigger" ? app.availableTriggers[0] : app.availableActions[0];
    if (!event) return;
    const config: Record<string, string> = appId === "gmail" ? { mailbox: "Inbox" } : appId === "webhooks" ? { path: "/new-event" } : {};
    const draft: WorkflowNodeData = { ...currentNode, appId, event, name: event, config };
    onChange({ ...draft, summary: deriveNodeSummary(draft), configured: validateNodeConfig(draft).length === 0 });
  }

  const appOptions = appCatalog.filter((app) => node.type === "trigger" ? app.availableTriggers.length : app.availableActions.length);
  return (
    <aside data-ui className="fixed inset-0 z-50 overflow-y-auto bg-sidebar lg:static lg:z-auto lg:block lg:w-[360px] lg:shrink-0 lg:border-l lg:border-border" aria-label="Step configuration">
      <div data-ui className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-sidebar px-5">
        <div><p className="text-xs capitalize text-taupe">{node.type} step</p><h2 className="mt-0.5 text-sm font-semibold text-ivory">Configure step</h2></div>
        <button onClick={onClose} className="grid size-10 cursor-pointer place-items-center rounded-lg text-taupe hover:bg-surface hover:text-ivory focus-visible:outline-2 focus-visible:outline-sandstone" aria-label="Close configuration"><X className="size-4" aria-hidden="true" /></button>
      </div>
      <div className="space-y-5 p-5 pb-24">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"><span className="grid size-9 place-items-center rounded-lg bg-elevated text-sandstone"><AppIcon appId={node.appId} /></span><div><p className="text-sm font-medium text-ivory">{node.name}</p><p className="mt-0.5 text-xs text-taupe">{node.event}</p></div></div>
        {node.type !== "condition" ? <label className="block"><span className="mb-2 block text-sm font-medium text-ivory">App</span><select className={fieldClass} value={node.appId} onChange={(event) => changeApp(event.target.value as WorkflowNodeData["appId"])}>{appOptions.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}</select></label> : null}
        <Field label="Step name" value={node.name} onChange={(name) => onChange({ ...node, name })} />
        {node.type === "condition" ? <><label className="block"><span className="mb-2 block text-sm font-medium text-ivory">Field</span><select className={fieldClass} value={node.config.field || "subject"} onChange={(event) => updateConfig("field", event.target.value)}><option value="subject">Subject</option><option value="from">Sender</option><option value="source">Source</option><option value="title">Title</option></select></label><label className="block"><span className="mb-2 block text-sm font-medium text-ivory">Operator</span><select className={fieldClass} value={node.config.operator || "contains"} onChange={(event) => updateConfig("operator", event.target.value)}><option value="contains">Contains</option><option value="equals">Equals</option><option value="not_contains">Does not contain</option></select></label><Field label="Comparison value" value={node.config.value || ""} onChange={(value) => updateConfig("value", value)} /></> : null}
        {node.type === "trigger" && node.appId === "gmail" ? <Field label="Mailbox" value={node.config.mailbox || ""} onChange={(value) => updateConfig("mailbox", value)} placeholder="Inbox" /> : null}
        {node.type === "trigger" && node.appId === "webhooks" ? <Field label="Demo path" value={node.config.path || ""} onChange={(value) => updateConfig("path", value)} placeholder="/new-event" /> : null}
        {node.appId === "google-sheets" && node.type === "action" ? <><Field label="Spreadsheet" value={node.config.spreadsheet || ""} onChange={(value) => updateConfig("spreadsheet", value)} /><Field label="Sheet tab" value={node.config.sheet || ""} onChange={(value) => updateConfig("sheet", value)} /><Field label="Fields" value={node.config.fields || ""} onChange={(value) => updateConfig("fields", value)} placeholder="from,subject,date" /></> : null}
        {node.appId === "slack" && node.type === "action" ? <><Field label="Channel" value={node.config.channel || ""} onChange={(value) => updateConfig("channel", value)} /><Field label="Message" value={node.config.message || ""} onChange={(value) => updateConfig("message", value)} /></> : null}
        {node.appId === "gmail" && node.type === "action" ? <><Field label="Recipient" value={node.config.to || ""} onChange={(value) => updateConfig("to", value)} /><Field label="Subject" value={node.config.subject || ""} onChange={(value) => updateConfig("subject", value)} /></> : null}
        {node.appId === "google-drive" && node.type === "action" ? <><Field label="Folder" value={node.config.folder || ""} onChange={(value) => updateConfig("folder", value)} /><Field label="Filename" value={node.config.filename || ""} onChange={(value) => updateConfig("filename", value)} /></> : null}
        {node.appId === "http-api" && node.type === "action" ? <><label className="block"><span className="mb-2 block text-sm font-medium text-ivory">Method</span><select className={fieldClass} value={node.config.method || "POST"} onChange={(event) => updateConfig("method", event.target.value)}><option>POST</option><option>PUT</option><option>PATCH</option></select></label><Field label="URL" value={node.config.url || ""} onChange={(value) => updateConfig("url", value)} /></> : null}
        {errors.length ? <div role="status" className="rounded-lg border border-[#6b4b48] bg-[#2b211f] p-3 text-sm text-[#f0c9c4]">{errors[0]}</div> : <div className="rounded-lg border border-[#5a5246] bg-[#302b24] p-3 text-sm text-sandstone">This step is ready to simulate.</div>}
        <div data-ui className="flex gap-2 border-t border-border pt-5"><Button size="icon" onClick={() => onMove(-1)} disabled={!canMoveUp} aria-label="Move step up"><ArrowUp className="size-4" /></Button><Button size="icon" onClick={() => onMove(1)} disabled={!canMoveDown} aria-label="Move step down"><ArrowDown className="size-4" /></Button><Button variant="danger" className="ml-auto" onClick={onRemove} disabled={node.type === "trigger"}><Trash2 className="size-4" aria-hidden="true" />Remove</Button></div>
      </div>
    </aside>
  );
}
