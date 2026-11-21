"use client";
// SimulatorPage — Complete StrideLung ECMO Simulator.
// Replicates the layout, alignment, and visual styling of the reference equipment console.
import { useState } from "react";
import "@/simulator/simulator.css";
import { SimulatorProvider } from "@/simulator/SimulatorContext";
import { SimulatorHeader } from "@/simulator/SimulatorHeader";
import { WaveformMonitor } from "@/simulator/WaveformMonitor";
import { SessionTransport } from "@/simulator/SessionTransport";
import { ControlPanels } from "@/simulator/ControlPanels";
import { ReadingsPanel } from "@/simulator/ReadingsPanel";
import { CircuitDiagram } from "@/simulator/CircuitDiagram";
import { AlarmPanel } from "@/simulator/AlarmPanel";

export default function SimulatorPage() {
  const [showCircuit, setShowCircuit] = useState(true);
  const [showAlarms, setShowAlarms] = useState(true);
  const [showReadings, setShowReadings] = useState(true);
  const [timeWindow, setTimeWindow] = useState(30);

  return (
    <SimulatorProvider>
      <div className="sim-page">
        {/* Top Safety Strip */}
        <div className="sim-safety-strip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          SOFTWARE SIMULATION ONLY · NOT CONNECTED TO MEDICAL HARDWARE · NON-CLINICAL EDUCATIONAL STUDY
        </div>

        {/* Console Header Bar */}
        <SimulatorHeader />

        {/* Main Central Workspace */}
        <main className="sim-console-container">
          {/* 1. Dark Waveform Monitor Enclosure (Screen + Integrated Right-Hand Parameter Column) */}
          <WaveformMonitor timeWindow={timeWindow} />

          {/* 2. Middle Action Toolbar (Freeze waveforms | i | Spont Effort) */}
          <SessionTransport />

          {/* 3. Settings Cards (ECMO Settings, Patient Model Settings, Display Settings) */}
          <ControlPanels
            showCircuit={showCircuit}
            setShowCircuit={setShowCircuit}
            showAlarms={showAlarms}
            setShowAlarms={setShowAlarms}
            showReadings={showReadings}
            setShowReadings={setShowReadings}
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
          />

          {/* 4. Complete Clinical Observations & Telemetry Matrix (Alwardt et al., 2022) */}
          {showReadings && <ReadingsPanel />}

          {/* 5. Interactive ECMO Circuit Architecture Schematic */}
          {showCircuit && <CircuitDiagram />}

          {/* 6. Alarm and System Event Log */}
          {showAlarms && <AlarmPanel />}

          {/* 6. Technical Engineering Disclaimer Footer */}
          <div className="sim-footer-disc">
            <p style={{ margin: 0 }}>
              STRIDELUNG 01 · ARTIFICIAL LUNG SYSTEM SIMULATOR · CONCEPT v0.1
            </p>
            <p style={{ margin: "4px 0 0", color: "var(--anatomy-muted)" }}>
              This interface is an engineering demonstration of packaging, flow dynamics, and sensor telemetry
              for an ambulatory ECMO trolley concept. All calculations are deterministic educational models.
              Not approved or intended for clinical diagnosis, patient management, or medical decision-making.
            </p>
          </div>
        </main>
      </div>
    </SimulatorProvider>
  );
}
