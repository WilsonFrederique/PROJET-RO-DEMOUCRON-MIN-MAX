import { useState, useEffect } from "react";
import GraphView from "./components/GraphView";
import MatrixDisplay from "./components/MatrixDisplay";
import GraphInputModal from "./components/GraphInputModal";
import { ReactFlowProvider } from "@xyflow/react";
import { LuGitGraph, LuMenu, LuX } from "react-icons/lu";
import { demoucronMin, reconstructPath as reconstructMinPath } from "./algorithms/demoucronMin";
import { demoucronMax, reconstructPath as reconstructMaxPath } from "./algorithms/demoucronMax";
import { VscTable } from "react-icons/vsc";

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

const [bestPath, setBestPath] = useState([]);
const [bestPathValue, setBestPathValue] = useState(null);
const pathColor = algorithm === "min" ? "#e91e63" : "#00bcd4";

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

  const uniqueVertices = [...new Set(edges.flatMap(e => [e.from, e.to]))].sort();
  setVertices(uniqueVertices);

  if (algorithm === "min") {
    const result = demoucronMin(uniqueVertices, edges);
    setMatrices(result.matrices);

  const sources = uniqueVertices.filter(v =>
  !edges.some(e => e.to === v)
);

  const sinks = uniqueVertices.filter(v =>
  !edges.some(e => e.from === v)
);

  let best = Infinity;
let bestPair = null;

sources.forEach(source => {
  sinks.forEach(sink => {

    const i = uniqueVertices.indexOf(source);
    const j = uniqueVertices.indexOf(sink);

    if (
      result.dist[i][j] !== Infinity &&
      result.dist[i][j] < best
    ) {
      best = result.dist[i][j];
      bestPair = [source, sink];
    }

  });
});

    if (bestPair) {
  const path = reconstructMinPath(
    result.next,
    uniqueVertices,
    bestPair[0],
    bestPair[1]
  );

  setBestPath(path);
  setBestPathValue(best);
} else {
      setBestPath([]);
      setBestPathValue(null);
    }

  } else {
    const result = demoucronMax(uniqueVertices, edges);
    setMatrices(result.matrices);

    let best = -Infinity;
    let bestPair = null;

    for (let i = 0; i < uniqueVertices.length; i++) {
      for (let j = 0; j < uniqueVertices.length; j++) {
        if (i !== j && result.dist[i][j] !== -Infinity && result.dist[i][j] > best) {
          best = result.dist[i][j];
          bestPair = [uniqueVertices[i], uniqueVertices[j]];
        }
      }
    }

    if (bestPair) {
      const path = reconstructMaxPath(result.next, uniqueVertices, bestPair[0], bestPair[1]);
      setBestPath(path);
      setBestPathValue(best);
    } else {
      setBestPath([]);
      setBestPathValue(null);
    }
  }

  setPaths(null); // moved out of branches since it's the same in both
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
                <h4>Aucun graphe chargé</h4>
                <p>Cliquez sur "Nouveau Graphe" pour commencer</p>
              </div>
            ) : (
              <ReactFlowProvider>
             <GraphView
  edgesData={edges}
  highlightPath={bestPath}
  pathColor={algorithm === "min" ? "#e91e63" : "#00bcd4"}
/>
              </ReactFlowProvider>
            )}
          </div>
        </div>

        {/* Right Panel - Matrices Display */}
        <div className="matrices-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="panel-icon"><VscTable /></span>
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