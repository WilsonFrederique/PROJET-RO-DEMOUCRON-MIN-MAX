import { useState, useEffect } from "react";
import GraphView from "./components/GraphView";
import MatrixDisplay from "./components/MatrixDisplay";
import GraphInputModal from "./components/GraphInputModal";
import { demoucronMin } from "./algorithms/demoucronMin";
import { demoucronMax } from "./algorithms/demoucronMax";
import { ReactFlowProvider } from "@xyflow/react";
import { LuGitGraph, LuMenu, LuX } from "react-icons/lu";
import "@xyflow/react/dist/style.css";
import "./App.css";

function App() {
  const [edges, setEdges] = useState([]);
  const [matrices, setMatrices] = useState([]);
  const [algorithm, setAlgorithm] = useState("min");
  const [paths, setPaths] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vertices, setVertices] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Fixed: proper useState syntax

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // No missing dependency - setIsMobile is stable

  const runAlgorithm = () => {
    if (edges.length === 0) {
      alert("Veuillez ajouter des arcs au graphe");
      return;
    }

    const uniqueVertices = [
      ...new Set(edges.flatMap(e => [e.from, e.to]))
    ].sort();
    setVertices(uniqueVertices);

    let result;
    if (algorithm === "min") {
      result = demoucronMin(uniqueVertices, edges);
      setMatrices(result);
      setPaths(null);
    } else {
      const resultMax = demoucronMax(uniqueVertices, edges);
      setMatrices(resultMax.matrices);
      setPaths(resultMax.D);
    }
  };

  return (
    <div className="app-container">
      {/* Header - Fully Responsive */}
      <header className="app-header">
        <div className="header-content">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <LuGitGraph size={28} />
            </div>
            <h1 className="app-title">
              <span className="title-gradient">Demoucron</span>
              <span className="title-sub">Algorithm Visualizer</span>
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>

          {/* Navigation Actions */}
          <div className={`header-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <button 
              className="btn-primary"
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Nouveau Graphe</span>
            </button>
            
            <div className="algorithm-selector">
              <button 
                className={`algo-btn ${algorithm === "min" ? "active" : ""}`}
                onClick={() => {
                  setAlgorithm("min");
                  setIsMobileMenuOpen(false);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12L7 8L11 12L17 6L21 10"/>
                </svg>
                <span>Minimal</span>
              </button>
              <button 
                className={`algo-btn ${algorithm === "max" ? "active" : ""}`}
                onClick={() => {
                  setAlgorithm("max");
                  setIsMobileMenuOpen(false);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12L7 16L11 12L17 18L21 14"/>
                </svg>
                <span>Maximal</span>
              </button>
            </div>
            
            <button 
              className="btn-calculate"
              onClick={runAlgorithm}
              disabled={edges.length === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <span>Calculer</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <div className="main-content">
        {/* Left Panel - Graph Visualization */}
        <div className="graph-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="panel-icon"><LuGitGraph /></span>
              Visualisation du Graphe
            </h3>
            {edges.length > 0 && (
              <div className="stats-badge">
                {vertices.length} sommets • {edges.length} arcs
              </div>
            )}
          </div>
          <div className="graph-container">
            {edges.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎨</div>
                <h4>Aucun graphe chargé</h4>
                <p>Cliquez sur "Nouveau Graphe" pour commencer</p>
              </div>
            ) : (
              <ReactFlowProvider>
                <GraphView edgesData={edges} />
              </ReactFlowProvider>
            )}
          </div>
        </div>

        {/* Right Panel - Matrices Display */}
        <div className="matrices-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="panel-icon">📐</span>
              Matrices des Distances
            </h3>
            {matrices.length > 0 && (
              <div className="stats-badge">
                {matrices.length - 1} itérations
              </div>
            )}
          </div>
          <div className="matrices-container">
            <MatrixDisplay 
              matrices={matrices} 
              algorithm={algorithm}
              paths={paths}
              vertices={vertices}
            />
          </div>
        </div>
      </div>

      {/* Modal for Graph Input */}
      <GraphInputModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newEdges) => {
          setEdges(newEdges);
          setMatrices([]);
          setPaths(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;