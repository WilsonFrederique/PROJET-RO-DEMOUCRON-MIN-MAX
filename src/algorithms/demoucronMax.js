// demoucronMax.js
export function demoucronMax(vertices, edges) {
  const n = vertices.length;
  const idx = new Map(vertices.map((v, i) => [v, i]));

  let dist = Array.from({ length: n }, () => Array(n).fill(-Infinity));
  let next = Array.from({ length: n }, () => Array(n).fill(null));
  let matrices = [];

  edges.forEach(e => {
    const i = idx.get(e.from);
    const j = idx.get(e.to);
    const w = Number(e.weight);
    if (i !== undefined && j !== undefined && w > dist[i][j]) {
      dist[i][j] = w;
      next[i][j] = j;
    }
  });

  matrices.push(dist.map(row => [...row]));

  for (let k = 0; k < n; k++) {
    const newDist = dist.map(row => [...row]);
    const newNext = next.map(row => [...row]);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== -Infinity && dist[k][j] !== -Infinity) {
          const candidate = dist[i][k] + dist[k][j];
          if (candidate > newDist[i][j]) {
            newDist[i][j] = candidate;
            newNext[i][j] = next[i][k];
          }
        }
      }
    }

    dist = newDist;
    next = newNext;
    matrices.push(dist.map(row => [...row]));
  }

  return { matrices, next, dist };
}

export function reconstructPath(next, vertices, from, to) {
  const idx = new Map(vertices.map((v, i) => [v, i]));
  const i = idx.get(from);
  const j = idx.get(to);

  if (i === undefined || j === undefined) return [];
  if (next[i][j] === null) return [];

  const path = [from];
  let current = i;
  const visited = new Set([i]);

  while (current !== j) {
    current = next[current][j];
    if (current === null) return [];
    if (visited.has(current)) return [];
    visited.add(current);
    path.push(vertices[current]);
  }

  return path;
}