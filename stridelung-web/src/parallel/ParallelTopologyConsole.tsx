"use client";

import { useState } from "react";

type FlowMode = "balanced" | "branch-a" | "branch-b";

export function ParallelTopologyConsole() {
  const [mode, setMode] = useState<FlowMode>("balanced");

  const isA = mode === "balanced" || mode === "branch-a";
  const isB = mode === "balanced" || mode === "branch-b";

  return (
    <div className="topology-console">
      {/* Console Header */}
      <div className="topology-header">
        <div className="topology-status-group">
          <span className="topology-beacon" aria-hidden="true" />
          <span className="topology-kicker">HYDRAULIC CIRCUIT TOPOLOGY</span>
        </div>
        <span className="topology-badge">Concept R&D Model</span>
      </div>

      {/* Schematic Circuit Visualizer */}
      <div className="topology-diagram">
        {/* Shared Inlet */}
        <div className="topology-node inlet">
          <div className="node-content">
            <span className="node-pip inlet-pip" aria-hidden="true" />
            <div className="node-meta">
              <span className="node-label">SHARED INLET (VENOUS)</span>
              <span className="node-val">3.8 L/min · Deoxygenated blood</span>
            </div>
          </div>
          <div className="flow-stem blue">
            <div className="flow-dash blue" />
          </div>
        </div>

        {/* Schematic Split Manifold */}
        <div className="topology-manifold split">
          <div className="manifold-label">SCHEMATIC SPLIT MANIFOLD</div>
          <div className="manifold-bridge">
            <div className={`manifold-arm arm-left ${isA ? "active" : "muted"}`} />
            <div className={`manifold-arm arm-right ${isB ? "active" : "muted"}`} />
          </div>
        </div>

        {/* Dual Parallel Branches */}
        <div className="topology-branches">
          {/* Branch A */}
          <div className={`branch-card branch-a ${isA ? "active" : "muted"}`}>
            <div className="branch-header">
              <span className="branch-id">BRANCH A</span>
              <span className={`branch-pct ${isA ? "active" : "muted"}`}>
                {mode === "balanced" ? "50% Flow" : mode === "branch-a" ? "100% Flow" : "Muted"}
              </span>
            </div>
            <div className="branch-core">
              <div className="core-icon">⬡</div>
              <div>
                <span className="core-name">Cartridge Module A</span>
                <span className="core-spec">PMP Hollow Fibres · Heat Exchanger</span>
              </div>
            </div>
            <div className="branch-flow-row">
              <span className="branch-flow-lbl">Branch Perfusion:</span>
              <strong className="branch-flow-val">
                {mode === "balanced" ? "1.90 L/min" : mode === "branch-a" ? "3.80 L/min" : "0.00 L/min"}
              </strong>
            </div>
          </div>

          {/* Branch B */}
          <div className={`branch-card branch-b ${isB ? "active" : "muted"}`}>
            <div className="branch-header">
              <span className="branch-id">BRANCH B</span>
              <span className={`branch-pct ${isB ? "active" : "muted"}`}>
                {mode === "balanced" ? "50% Flow" : mode === "branch-b" ? "100% Flow" : "Muted"}
              </span>
            </div>
            <div className="branch-core">
              <div className="core-icon">⬡</div>
              <div>
                <span className="core-name">Cartridge Module B</span>
                <span className="core-spec">PMP Hollow Fibres · Heat Exchanger</span>
              </div>
            </div>
            <div className="branch-flow-row">
              <span className="branch-flow-lbl">Branch Perfusion:</span>
              <strong className="branch-flow-val">
                {mode === "balanced" ? "1.90 L/min" : mode === "branch-b" ? "3.80 L/min" : "0.00 L/min"}
              </strong>
            </div>
          </div>
        </div>

        {/* Schematic Merge Manifold */}
        <div className="topology-manifold merge">
          <div className="manifold-bridge bottom">
            <div className={`manifold-arm arm-left-b ${isA ? "active" : "muted"}`} />
            <div className={`manifold-arm arm-right-b ${isB ? "active" : "muted"}`} />
          </div>
          <div className="manifold-label">SCHEMATIC MERGE MANIFOLD</div>
        </div>

        {/* Shared Outlet */}
        <div className="topology-node outlet">
          <div className="flow-stem red">
            <div className="flow-dash red" />
          </div>
          <div className="node-content">
            <span className="node-pip outlet-pip" aria-hidden="true" />
            <div className="node-meta">
              <span className="node-label">SHARED OUTLET (ARTERIAL)</span>
              <span className="node-val">3.8 L/min · SaO2 98% Oxygenated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Controls */}
      <div className="topology-controls" role="group" aria-label="Branch flow simulation mode">
        <button
          type="button"
          className={`topology-btn ${mode === "balanced" ? "active" : ""}`}
          onClick={() => setMode("balanced")}
        >
          <span className="btn-indicator balanced" />
          Balanced Split (50/50)
        </button>
        <button
          type="button"
          className={`topology-btn ${mode === "branch-a" ? "active" : ""}`}
          onClick={() => setMode("branch-a")}
        >
          <span className="btn-indicator branch-a" />
          Isolate Branch A
        </button>
        <button
          type="button"
          className={`topology-btn ${mode === "branch-b" ? "active" : ""}`}
          onClick={() => setMode("branch-b")}
        >
          <span className="btn-indicator branch-b" />
          Isolate Branch B
        </button>
      </div>

      {/* Engineering Trade-off Footer Strip */}
      <div className="topology-footer">
        <div className="topology-metric">
          <span className="metric-label">PRIME VOLUME</span>
          <span className="metric-val">~780 mL <small>(+330 mL vs baseline)</small></span>
        </div>
        <div className="topology-metric">
          <span className="metric-label">EXTRA COUPLERS</span>
          <span className="metric-val">8 junctions <small>(shear unverified)</small></span>
        </div>
        <a href="#figure" className="topology-jump-link">
          Inspect 3D Cutaway ↓
        </a>
      </div>
    </div>
  );
}
