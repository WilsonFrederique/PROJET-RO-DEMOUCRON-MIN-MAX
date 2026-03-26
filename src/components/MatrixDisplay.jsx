import "./MatrixDisplay.css";

function MatrixDisplay({ matrices, algorithm, paths, vertices }) {
  if (!matrices || matrices.length === 0) {
    return (
      <div className="matrix-empty-state">
        <h4>Aucune matrice à afficher</h4>
        <p>Cliquez sur "Calculer" après avoir créé un graphe</p>
      </div>
    );
  }

  return (
    <div className="matrix-display">
      {matrices.map((matrix, index) => (
        <div key={index} className="matrix-card">
          <div className="matrix-header">
            <h4 className="matrix-title">
              {index === 0 ? "État Initial" : `Itération k = ${index - 1}`}
            </h4>
            {index > 0 && (
              <span className="matrix-badge">
                {algorithm === "min" ? "Minimisation" : "Maximisation"}
              </span>
            )}
          </div>
          
          <div className="matrix-wrapper">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="corner-cell"></th>
                  {vertices.map(v => (
                    <th key={v} className="vertex-header">{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    <th className="vertex-header">{vertices[i]}</th>
                    {row.map((value, j) => {
                      let isModified = false;
                      let previous = null;
                      
                      if (index > 0) {
                        previous = matrices[index - 1][i][j];
                        isModified = value !== previous;
                      }
                      
                      let displayValue = value;
                      if (value === Infinity) displayValue = "∞";
                      if (value === -Infinity) displayValue = "-∞";
                      
                      return (
                        <td
                          key={j}
                          className={`matrix-cell ${isModified ? "modified" : ""} ${
                            displayValue === "∞" || displayValue === "-∞" ? "infinity" : ""
                          }`}
                        >
                          {displayValue}
                         </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      
      {paths && (
        <div className="matrix-card">
          <div className="matrix-header">
            <h4 className="matrix-title">Matrice des Prédécesseurs</h4>
            <span className="matrix-badge">Chemins Optimaux</span>
          </div>
          <div className="matrix-wrapper">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="corner-cell"></th>
                  {vertices.map(v => (
                    <th key={v} className="vertex-header">{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paths.map((row, i) => (
                  <tr key={i}>
                    <th className="vertex-header">{vertices[i]}</th>
                    {row.map((value, j) => (
                      <td key={j} className="matrix-cell predecessor">
                        {value !== null ? vertices[value] : "-"}
                       </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatrixDisplay;