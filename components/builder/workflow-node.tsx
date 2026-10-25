"use client";

import { Check, ChevronDown, Plus } from "lucide-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import { AppIcon } from "@/components/ui/app-icon";
import type { ExecutionStep, WorkflowNodeData } from "@/lib/daloy/types";

export type CanvasNodeData = WorkflowNodeData & {
  stepNumber: number;
  onInsert: (index: number) => void;
  execution?: ExecutionStep["status"] | "running";
};

export function WorkflowNode(props: NodeProps) {
  const data = props.data as CanvasNodeData;
  return (
    <div className={`workflow-node w-[304px] ${props.selected ? "selected" : ""} ${data.execution === "running" ? "running" : ""}`}>
      {data.type !== "trigger" ? <Handle type="target" position={Position.Top} className="!size-2.5 !border-2 !border-canvas !bg-sandstone" /> : null}
      <div className="flex items-start gap-3 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-border bg-elevated text-sandstone"><AppIcon appId={data.appId} className="size-[18px]" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3"><p className="text-xs capitalize text-taupe">{data.stepNumber}. {data.type}</p>{data.execution === "success" ? <Check className="size-3.5 text-sandstone" aria-label="Step complete" /> : null}</div>
          <p className="mt-1.5 truncate text-sm font-semibold text-ivory">{data.name}</p>
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-taupe">{data.summary}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#48433c] px-4 py-2.5">
        <span className={`text-xs ${data.configured ? "text-sandstone" : "text-taupe"}`}>{data.configured ? "Configured" : "Not configured"}</span>
        <ChevronDown className="size-3.5 text-taupe" aria-hidden="true" />
      </div>
      <Handle type="source" position={Position.Bottom} className="!size-2.5 !border-2 !border-canvas !bg-sandstone" />
      <button type="button" onClick={(event) => { event.stopPropagation(); data.onInsert(data.order + 1); }} className="nodrag nopan absolute -bottom-[50px] left-1/2 z-10 grid size-8 -translate-x-1/2 cursor-pointer place-items-center rounded-full border border-border bg-elevated text-taupe transition hover:border-sandstone hover:text-sandstone focus-visible:outline-2 focus-visible:outline-sandstone" aria-label={`Add step after ${data.name}`}>
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
