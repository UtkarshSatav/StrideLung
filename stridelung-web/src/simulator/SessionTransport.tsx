"use client";
// SessionTransport — intermediate toolbar matching the reference image.
// Uses unified StrideLung website button styles (.sim-btn).
import { useState } from "react";
import { useSim } from "./SimulatorContext";

export function SessionTransport() {
  const { state, actions } = useSim();
  const { running, paused } = state;
  const [showInfo, setShowInfo] = useState(false);

  const handleToggleFreeze = () => {
    if (!running) {
      actions.start();
    } else if (paused) {
      actions.resume();
    } else {
      actions.pause();
    }
  };

  const handleSpontEffort = () => {
    // Simulates an acute hemodynamic or respiratory perturbation (transient flow change)
    const currentR = state.inputs.circuitResistance;
    actions.setInput("circuitResistance", currentR === 1.0 ? 1.6 : 1.0);
  };

  return (
    <div className="sim-action-toolbar">
      {/* Left: Freeze / Resume waveforms button */}
      <button
        type="button"
        className={`sim-btn small ${paused ? "active" : ""}`}
        onClick={handleToggleFreeze}
        title="Pause or resume waveform monitoring"
      >
        {paused ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 2l7 4-7 4V2z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="2" width="3" height="8" rx="0.5" />
            <rect x="7" y="2" width="3" height="8" rx="0.5" />
          </svg>
        )}
        <span>{paused ? "Resume waveforms" : "Freeze waveforms"}</span>
      </button>

      {/* Center: info button */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          className="sim-btn-icon"
          onClick={() => setShowInfo(!showInfo)}
          aria-label="Simulation Info"
          title="Information on StrideLung ECMO simulator"
        >
          <span style={{ fontFamily: "var(--font-sans), sans-serif", fontWeight: 700, fontSize: 13 }}>i</span>
        </button>

        {showInfo && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "280px",
              padding: "12px 14px",
              background: "var(--anatomy-card)",
              color: "var(--anatomy-strong)",
              borderRadius: "10px",
              fontSize: "11.5px",
              lineHeight: 1.5,
              zIndex: 50,
              boxShadow: "var(--anatomy-lift)",
              border: "1px solid var(--sl-ring)",
            }}
          >
            <strong style={{ display: "block", marginBottom: "4px" }}>
              StrideLung ECMO Simulator
            </strong>
            Software simulation only — not connected to medical hardware.
            Deterministic mathematical relationships for educational demonstration.
            Waveforms and parameter trends reflect real-time circuit physics.
          </div>
        )}
      </div>

      {/* Right: Spont Effort / Perturbation Action button */}
      <button
        type="button"
        className="sim-btn small"
        onClick={handleSpontEffort}
        title="Trigger simulated patient resistance variation"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 2l7 4-7 4V2z" />
        </svg>
        <span>Spont Effort</span>
      </button>
    </div>
  );
}
