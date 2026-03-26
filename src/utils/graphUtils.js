export function buildGraph(edges) {

  const graph = {};

  edges.forEach(edge => {

    if (!graph[edge.from])
      graph[edge.from] = [];

    graph[edge.from].push({
      node: edge.to,
      weight: Number(edge.weight)
    });

  });

  return graph;
}