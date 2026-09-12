/**
 * Shared shape for the node-and-edge diagrams `components/ui/FlowDiagram.tsx`
 * renders. Lives outside any one route because more than one route draws with
 * it: Route 1's energy chain and AppNexa system trace, Route 2's Green Software
 * Patterns lifecycle. A route supplies a graph; the component knows nothing
 * about what the graph means.
 */

export type FlowNodeTone = "solid" | "outline" | "aside";

export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: FlowNodeTone;
};

export type FlowEdge = {
  id: string;
  d: string;
  /** >1 draws the same path as parallel lanes (Route 1's triple-send). */
  lanes?: number;
  laneGap?: number;
  /** Pulsing dotted overlay marking an active data path. */
  flow?: boolean;
};

export type FlowPin = {
  id: string;
  x: number;
  y: number;
  /** Shown inside the pin. A number for Route 1's hotspots, a letter for Route 2's options. */
  n: number | string;
  label: string;
};

export type FlowGraph = {
  id: string;
  title: string;
  caption: string;
  viewBox: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
};
