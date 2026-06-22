// demoucronMin.js
export function demoucronMin(vertices, edges) {
  const n = vertices.length;
  const idx = new Map(vertices.map((v, i) => [v, i]));

  let dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  let next = Array.from({ length: n }, () => Array(n).fill(null));
  let matrices = [];


 edges.forEach(e => {
    const i = idx.get(e.from);
    const j = idx.get(e.to);
    const w = Number(e.weight);

    if (i !== undefined && j !== undefined && w < dist[i][j]) {
        dist[i][j] = w;
        next[i][j] = i;
    }
});

  matrices.push(dist.map(row => [...row]));

  for (let k = 0; k < n; k++) {
    const newDist = dist.map(row => [...row]);
    const newNext = next.map(row => [...row]);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const candidate = dist[i][k] + dist[k][j];
         if (candidate < newDist[i][j]) {
              newDist[i][j] = candidate;
              newNext[i][j] = k;
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

function buildPath(pred, vertices, src, dst) {

    const k = pred[src][dst];

    if (k === null)
        return [];

    if (k === src)
        return [vertices[src], vertices[dst]];

    const left = buildPath(pred, vertices, src, k);
    const right = buildPath(pred, vertices, k, dst);

    return [...left.slice(0, -1), ...right];
}

export function reconstructPath(pred, vertices, from, to) {

    const idx = new Map(vertices.map((v, i) => [v, i]));

    const src = idx.get(from);
    const dst = idx.get(to);

    if (src === undefined || dst === undefined)
        return [];

    if (pred[src][dst] === null)
        return [];

    return buildPath(pred, vertices, src, dst);
}