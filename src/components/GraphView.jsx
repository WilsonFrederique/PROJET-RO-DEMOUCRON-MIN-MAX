import React, { useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background
} from "@xyflow/react";

import dagre from "dagre";

import "@xyflow/react/dist/style.css";

const nodeWidth = 50;
const nodeHeight = 50;

function getLayoutedElements(nodes, edges) {

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR", // Top → Bottom
    nodesep: 70,
    ranksep: 100
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodePosition = dagreGraph.node(node.id);

    node.position = {
      x: nodePosition.x - nodeWidth / 2,
      y: nodePosition.y - nodeHeight / 2
    };
  });

  return { nodes, edges };
}

function GraphView({ edgesData, highlightPath = [], pathColor = "#e91e63" }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!edgesData || edgesData.length === 0) return;

    const vertices = [...new Set(edgesData.flatMap(e => [e.from, e.to]))];

    const newNodes = vertices.map((v) => ({
      id: v,
      data: { label: v },
      position: { x: 0, y: 0 },
      style: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#2196f3",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold"
      }
    }));

    const highlightedEdges = new Set();
    for (let i = 0; i < highlightPath.length - 1; i++) {
      highlightedEdges.add(`${highlightPath[i]}->${highlightPath[i + 1]}`);
    }

    const newEdges = edgesData.map((edge, index) => {
      const isHighlighted = highlightedEdges.has(`${edge.from}->${edge.to}`);
      return {
        id: `e${index}`,
        source: edge.from,
        target: edge.to,
        label: edge.weight?.toString() || "",
        type: "smoothstep",
        markerEnd: { type: "arrowclosed" },
        style: {
          strokeWidth: isHighlighted ? 5 : 2,
          stroke: isHighlighted ? pathColor : "#888",
          opacity: isHighlighted ? 1 : 0.25
        },
        labelStyle: {
          fill: isHighlighted ? pathColor : "#222",
          fontWeight: isHighlighted ? 700 : 400
        }
      };
    });

    const layouted = getLayoutedElements(newNodes, newEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [edgesData, highlightPath, pathColor]);

  return (
    <div style={{ height: 500, border: "1px solid #ccc", marginTop: "20px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.2 }}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
export default GraphView;