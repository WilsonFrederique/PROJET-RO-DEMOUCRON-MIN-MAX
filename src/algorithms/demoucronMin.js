export function demoucronMin(vertices, edges) {
  const n = vertices.length;
  
  // Initialize distance matrix
  let W = Array(n).fill().map(() => Array(n).fill(Infinity));
  
  // Set diagonal to 0
  for (let i = 0; i < n; i++) {
    W[i][i] = 0;
  }
  
  // Fill edges
  edges.forEach(e => {
    const i = vertices.indexOf(e.from);
    const j = vertices.indexOf(e.to);
    if (i !== -1 && j !== -1) {
      W[i][j] = Number(e.weight);
    }
  });
  
  let matrices = [];
  matrices.push(W.map(row => [...row])); // Deep copy
  
  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    let newMatrix = W.map(row => [...row]); // Deep copy
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (W[i][k] !== Infinity && W[k][j] !== Infinity) {
          const candidate = W[i][k] + W[k][j];
          if (candidate < newMatrix[i][j]) {
            newMatrix[i][j] = candidate;
          }
        }
      }
    }
    
    W = newMatrix;
    matrices.push(W.map(row => [...row])); // Store deep copy
  }
  
  return matrices;
}