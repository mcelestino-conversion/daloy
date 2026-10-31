"use client";

import { Background, BackgroundVariant, Controls, MarkerType, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { useMemo } from "react";

import type { Execution, Workflow } from "@/lib/daloy/types";
import { WorkflowNode, type CanvasNodeData } from "./workflow-node";

const nodeTypes = { workflow: WorkflowNode };

export function WorkflowCanvas({ workflow, selectedNodeId, onSelect, onInsert, execution, activeStep }: { workflow: Workflow; selectedNodeId: string | null; onSelect: (nodeId: string) => void; onInsert: (index: number) => void; execution: Execution | null; activeStep: number }) {
  const nodes = useMemo<Node[]>(() => workflow.nodes.map((node, index) => ({
    id: node.id,
    type: "workflow",
    position: { x: 120, y: 40 + index * 196 },
    data: {
      ...node,
      stepNumber: index + 1,
      onInsert,
      execution: activeStep === index ? "running" : activeStep > index ? execution?.steps[index]?.status : undefined,
    } satisfies CanvasNodeData,
    selected: selectedNodeId === node.id,
  })), [workflow.nodes, onInsert, activeStep, execution, selectedNodeId]);

  const edges = useMemo<Edge[]>(() => workflow.edges.map((edge) => ({
    ...edge,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#6f695f" },
    style: { stroke: activeStep > workflow.nodes.findIndex((node) => node.id === edge.source) ? "#d6c2a4" : "#6f695f", strokeWidth: 1.5 },
  })), [workflow.edges, workflow.nodes, activeStep]);

  return (
    <div className="hidden h-full min-h-0 bg-canvas lg:block" aria-label="Workflow canvas">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} nodesDraggable={false} nodesConnectable={false} onNodeClick={(_, node) => onSelect(node.id)} fitView fitViewOptions={{ padding: 0.24 }} minZoom={0.45} maxZoom={1.4}>
        <Background variant={BackgroundVariant.Dots} color="#5D574E" gap={20} size={1.25} />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
    </div>
  );
}
