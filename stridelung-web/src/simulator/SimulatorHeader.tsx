"use client";
// SimulatorHeader — clean top navigation bar for the simulator console.
import { useState } from "react";
import { useSim } from "./SimulatorContext";
import Link from "next/link";
import { Logo } from "@/site/Logo";

function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function SimulatorHeader() {
  const { state, actions, activePhase } = useSim();
  const { running, paused, outputs, alarms } = state;
  const [confirmReset, setConfirmReset] = useState(false);

  const simStatus = !running ? "stopped" : paused ? "paused" : "running";
  const simLabel = !running ? "STOPPED" : paused ? "PAUSED" : "RUNNING";

  const critCount = alarms.filter((a) => !a.acknowledged && a.severity === "critical").length;
  const warnCount = alarms.filter((a) => !a.acknowledged && a.severity === "warning").length;

  const handleReset = () => {
    if (confirmReset) {
      actions.reset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  return (
    <header className="sim-top-nav">
      <Link href="/" className="sim-brand" title="StrideLung Home">
        <Logo size={22} />
        <div>
          <span className="sim-brand-text">StrideLung</span>
          <span className="sim-brand-sub">ECMO Simulator</span>
        </div>
      </Link>

      <div className="sim-nav-divider" />

      <div className="sim-nav-stats">
        <span className="sim-clock-val">{fmtDuration(outputs.sessionSeconds)}</span>
        <span className="sim-clock-label">Session</span>
      </div>

      <div className="sim-nav-divider" />

      <div className="sim-mode-tag">
        <span className="sim-mode-dot" />
        <span>{state.inputs.ecmoMode} ECMO</span>
      </div>

      <div className="sim-nav-divider" />

      {/* Clinical Phase Selector (Alwardt et al., 2022 Integration) */}
      <div className="sim-phase-selector-bar">
        <span className="sim-phase-title">Clinical Case:</span>
        <div className="sim-phase-pills">
          <button
            type="button"
            className={`sim-phase-pill ${activePhase === "live" ? "active" : ""}`}
            onClick={() => actions.setActivePhase("live")}
            title="Interactive dynamic simulation"
          >
            Live Sim
          </button>
          <button
            type="button"
            className={`sim-phase-pill ${activePhase === "intraoperative" ? "active" : ""}`}
            onClick={() => actions.setActivePhase("intraoperative")}
            title="Alwardt et al. (2022) — Intraoperative range"
          >
            Intraop
          </button>
          <button
            type="button"
            className={`sim-phase-pill ${activePhase === "icu_arrival" ? "active" : ""}`}
            onClick={() => actions.setActivePhase("icu_arrival")}
            title="Alwardt et al. (2022) — ICU Arrival point measurements"
          >
            ICU Arrival
          </button>
          <button
            type="button"
            className={`sim-phase-pill ${activePhase === "postoperative" ? "active" : ""}`}
            onClick={() => actions.setActivePhase("postoperative")}
            title="Alwardt et al. (2022) — Postoperative range"
          >
            Postop
          </button>
        </div>
        <a
          href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9639688/"
          target="_blank"
          rel="noopener noreferrer"
          className="sim-citation-link"
          title="Alwardt et al. (2022) First Use of a Novel ECLS System — PMC9639688"
        >
          Alwardt 2022 ↗
        </a>
      </div>

      <div className="sim-nav-right">
        {/* Status indicator */}
        <div className={`sim-status-pill ${simStatus}`}>
          <i aria-hidden="true" />
          <span>{simLabel}</span>
        </div>

        {/* Alarm badge if active events */}
        {(critCount > 0 || warnCount > 0) && (
          <div className={`sim-alarm-badge ${critCount > 0 ? "has-crit" : "has-warn"}`}>
            <span>{critCount > 0 ? `${critCount} CRIT` : `${warnCount} WARN`}</span>
          </div>
        )}

        {/* Reset button */}
        <button
          type="button"
          className={`sim-btn small ${confirmReset ? "danger" : ""}`}
          onClick={handleReset}
          title="Restore baseline parameters"
        >
          {confirmReset ? "Confirm Reset?" : "Reset Baseline"}
        </button>

        <div className="sim-nav-divider" />

        {/* Back to main product */}
        <Link href="/" className="sim-btn small" title="Return to StrideLung 3D Model">
          Trolley Model
        </Link>
      </div>
    </header>
  );
}
