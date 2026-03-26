import { useState } from "react";
import "./GraphInputModal.css";
import { MdAddToDrive } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";
import { BiCollection } from "react-icons/bi";


function GraphInputModal({ isOpen, onClose, onSave }) {
  const [rows, setRows] = useState([
    { from: "", to: "", weight: "" }
  ]);
  const [examples] = useState([
    { from: "A", to: "B", weight: 5 },
    { from: "B", to: "C", weight: 3 },
    { from: "A", to: "C", weight: 8 },
    { from: "C", to: "D", weight: 2 }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { from: "", to: "", weight: "" }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const updated = rows.filter((_, i) => i !== index);
      setRows(updated);
    }
  };

  const loadExample = () => {
    setRows(examples);
  };

  const handleSave = () => {
    const validRows = rows.filter(row => 
      row.from && row.to && row.weight !== ""
    );
    if (validRows.length === 0) {
      alert("Veuillez ajouter au moins un arc valide");
      return;
    }
    onSave(validRows);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-icon"><MdAddToDrive /></span>
            Créer un nouveau graphe
          </h2>
          <button className="modal-close" onClick={onClose}><MdOutlineClear /></button>
        </div>

        <div className="modal-body">
          <div className="input-section">
            <div className="section-header">
              <h3>Liste des arcs</h3>
              <div className="section-actions">
                <button className="btn-outline" onClick={loadExample}>
                  <BiCollection /> Charger exemple
                </button>
                <button className="btn-outline" onClick={addRow}>
                  <IoAddOutline /> Ajouter un arc
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="input-table">
                <thead>
                  <tr>
                    <th>Sommet départ</th>
                    <th>Sommet arrivée</th>
                    <th>Poids</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="ex: A"
                          value={row.from}
                          onChange={(e) => handleChange(i, "from", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="ex: B"
                          value={row.to}
                          onChange={(e) => handleChange(i, "to", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="ex: 5"
                          value={row.weight}
                          onChange={(e) => handleChange(i, "weight", e.target.value)}
                        />
                      </td>
                      <td className="action-cell">
                        {rows.length > 1 && (
                          <button 
                            className="btn-remove"
                            onClick={() => removeRow(i)}
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-primary-modal" onClick={handleSave}>
            Créer le graphe
          </button>
        </div>
      </div>
    </div>
  );
}

export default GraphInputModal;