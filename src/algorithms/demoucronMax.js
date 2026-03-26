export function demoucronMax(vertices, edges) {

  const n = vertices.length;

  let W = Array(n).fill().map(() =>
    Array(n).fill(-Infinity)
  );

  for (let i = 0; i < n; i++) {
    W[i][i] = 0;
  }

  edges.forEach(e => {
    const i = vertices.indexOf(e.from);
    const j = vertices.indexOf(e.to);
    W[i][j] = Number(e.weight);
  });

  let matrices = [];
  matrices.push(W.map(row => [...row]));

  let D = Array(n).fill().map(() =>
    Array(n).fill(null)
  );

  for (let k = 0; k < n; k++) {

    let newMatrix = W.map(row => [...row]);

    for (let i = 0; i < n; i++) {

      for (let j = 0; j < n; j++) {

        if (W[i][k] !== -Infinity && W[k][j] !== -Infinity) {

          let candidate = W[i][k] + W[k][j];

          if (candidate > W[i][j]) {

            newMatrix[i][j] = candidate;

            D[i][j] = k;

          }

        }

      }

    }

    W = newMatrix;

    matrices.push(W.map(row => [...row]));

  }

  return {
    matrices,
    D
  };

}