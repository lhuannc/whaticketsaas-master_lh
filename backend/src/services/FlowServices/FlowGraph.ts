// Helpers puros de navegação de grafo de flow — SEM imports externos (testável isolado).

export interface FlowNode {
  id: string;
  type: "start" | "message" | "menu" | "funnel" | "queue" | "ai" | "end";
  data: {
    text?: string;
    options?: Array<{ key: string; label: string; target: string }>;
    queueId?: number;
    funnelStage?: string;
    aiPrompt?: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
}

export const findNode = (nodes: FlowNode[], id: string): FlowNode | undefined =>
  nodes.find(n => n.id === id);

export const findNextNode = (
  nodes: FlowNode[],
  edges: FlowEdge[],
  currentId: string,
  handle?: string
): FlowNode | undefined => {
  const edge = edges.find(e => e.source === currentId && (!handle || e.sourceHandle === handle));
  if (!edge) return undefined;
  return findNode(nodes, edge.target);
};

// Resolve próximo node a partir de uma escolha de menu (key → option.target)
export const resolveMenuTarget = (
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  choiceKey: string
): FlowNode | undefined => {
  const options = node.data.options || [];
  const chosen = options.find(o => o.key === choiceKey.trim());
  if (chosen?.target) return findNode(nodes, chosen.target);
  return findNextNode(nodes, edges, node.id);
};
