import { useState } from "react";

function GraphTable({ setEdges }) {
  const [rows, setRows] = useState([
    { from: "", to: "", weight: "" }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
    
    // Filter out empty rows before sending to parent
    const validRows = updated.filter(row => row.from && row.to && row.weight);
    setEdges(validRows);
  };

  const addRow = () => {
    setRows([...rows, { from: "", to: "", weight: "" }]);
  };

  const removeRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    const validRows = updated.filter(row => row.from && row.to && row.weight);
    setEdges(validRows);
  };

  return (
    <div className="container mt-4">
      <h4>Entrer les arcs du graphe</h4>
      
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Sommet départ</th>
              <th>Sommet arrivée</th>
              <th>Poids</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    className="form-control"
                    placeholder="ex: A"
                    value={row.from}
                    onChange={(e) =>
                      handleChange(i, "from", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    placeholder="ex: B"
                    value={row.to}
                    onChange={(e) =>
                      handleChange(i, "to", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="ex: 5"
                    value={row.weight}
                    onChange={(e) =>
                      handleChange(i, "weight", e.target.value)
                    }
                  />
                </td>
                <td className="text-center">
                  {rows.length > 1 && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeRow(i)}
                    >
                      ✖
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary"
        onClick={addRow}
      >
        + Ajouter un arc
      </button>
      
      <div className="alert alert-info mt-3">
        <strong>Exemple de graphe valide:</strong><br/>
        A → B (5)<br/>
        B → C (3)<br/>
        A → C (8)<br/>
        C → D (2)
      </div>
    </div>
  );
}

export default GraphTable;