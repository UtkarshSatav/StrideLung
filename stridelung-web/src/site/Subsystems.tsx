"use client";
import { useState } from "react";
import { useTrolley } from "@/trolley/TrolleyProvider";
import { REGISTER, SUBSYSTEMS, type SubsystemId } from "@/trolley/register";
import type { FlowId } from "@/trolley/engine";

const COPY: Record<SubsystemId, { text: string; flow: FlowId | null; tag: string; metric: string }> = {
  blood: {
    text: "Drainage from the patient to the pump head, through the membrane oxygenator, back through the flow and bubble clip and out of the side panel. Supplier-qualified disposables held in a reserved envelope.",
    flow: "blood",
    tag: "Primary extracorporeal loop",
    metric: "1.5 m patient line allocation",
  },
  gas: {
    text: "An onboard oxygen cylinder or an external hospital blended supply — never both — through a supplier-selected control block to the membrane, with a separate exhaust that never vents into the battery bay.",
    flow: "gas",
    tag: "Oxygen sweep & delivery",
    metric: "300 L nominal usable gas",
  },
  thermal: {
    text: "A removable dry thermal module and a paired hose loop to the heat-exchanger base of the cartridge, plus the illustrative fluid allowance. Water, blood and gas never merge.",
    flow: "water",
    tag: "Thermal regulation circuit",
    metric: "Paired quick-connect hoses",
  },
  electrical: {
    text: "One battery cassette, power conversion and isolation, compute and I/O, the display and alarm, the reusable pump drive, the sensor interface and the harness that joins them.",
    flow: "electrical",
    tag: "Power, sensor & compute harness",
    metric: "200 Wh battery scenario",
  },
  chassis: {
    text: "The case and its doors, the rail chassis, braked casters, the push handle and lift grips, the stabilisers and the service-kit allowance.",
    flow: null,
    tag: "Structure & mobility enclosure",
    metric: "460 × 330 × 790 mm envelope",
  },
};

const ORDER: SubsystemId[] = ["blood", "gas", "thermal", "electrical", "chassis"];

export function Subsystems() {
  const { state, actions } = useTrolley();
  const [selectedTab, setSelectedTab] = useState<SubsystemId>(
    state.layer !== "all" ? (state.layer as SubsystemId) : "blood"
  );

  const activeSys = selectedTab;
  const parts = REGISTER.filter((r) => r.sys === activeSys);
  const sysMass = parts.reduce((a, r) => a + r.mass, 0);
  const isLayerActiveInModel = state.layer === activeSys;

  return (
    <div className="subsystems-deck">
      {/* Subsystem Navigation Bar */}
      <div className="subsystems-nav" role="tablist" aria-label="Subsystem layers">
        {ORDER.map((sys) => {
          const sysParts = REGISTER.filter((r) => r.sys === sys);
          const mass = sysParts.reduce((a, r) => a + r.mass, 0);
          const isSelected = activeSys === sys;

          return (
            <button
              key={sys}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`subsystems-nav-tab${isSelected ? " selected" : ""}`}
              data-sys={sys}
              onClick={() => {
                setSelectedTab(sys);
                // Also focus model on layer
                actions.focus((a) => {
                  a.pick(null);
                  a.setView("open");
                  a.setLayer(sys);
                  a.setFlows(COPY[sys].flow ? [COPY[sys].flow as FlowId] : []);
                });
              }}
            >
              <div className="tab-indicator" />
              <div className="tab-info">
                <span className="tab-title">{SUBSYSTEMS[sys]}</span>
                <span className="tab-meta mono">{mass.toFixed(2)} kg · {sysParts.length} parts</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Featured Subsystem Studio Panel */}
      <div className="subsystem-studio" data-sys={activeSys}>
        <div className="studio-header">
          <div className="studio-badge-row">
            <span className="studio-tag mono">{COPY[activeSys].tag}</span>
            <span className="studio-metric mono">{COPY[activeSys].metric}</span>
          </div>

          <div className="studio-title-group">
            <h3 className="studio-title">{SUBSYSTEMS[activeSys]}</h3>
            <div className="studio-mass-badge">
              <span className="mono bold">{sysMass.toFixed(2)} kg</span>
              <span className="mono small">allocated</span>
            </div>
          </div>

          <p className="studio-description">{COPY[activeSys].text}</p>
        </div>

        {/* Action Controls */}
        <div className="studio-actions">
          <button
            type="button"
            className={`btn small${isLayerActiveInModel ? " primary" : ""}`}
            onClick={() =>
              actions.focus((a) => {
                a.pick(null);
                a.setView("open");
                a.setLayer(activeSys);
                a.setFlows(COPY[activeSys].flow ? [COPY[activeSys].flow as FlowId] : []);
              })
            }
          >
            {isLayerActiveInModel ? "✓ Layer isolated in 3D model" : "Isolate this layer in 3D model →"}
          </button>
        </div>

        {/* Component Module Registry for Active Subsystem */}
        <div className="studio-parts-section">
          <span className="studio-section-label eyebrow">
            {parts.length} registered components in this pathway
          </span>
          <div className="studio-parts-grid">
            {parts.map((r) => (
              <div key={r.id} className="studio-part-card">
                <div className="part-card-top">
                  <span className="part-id mono">{r.id}</span>
                  <span className="part-mass mono">{r.mass.toFixed(2)} kg</span>
                </div>
                <h4 className="part-name">{r.name.split(/[,;(]/)[0]}</h4>
                <p className="part-role">{r.role}</p>
                <div className="part-card-footer">
                  <span className="part-env mono">{r.envelope}</span>
                  <button
                    type="button"
                    className="part-inspect-btn"
                    onClick={() => actions.focus((a) => { a.setView("open"); a.pick(r.id); })}
                  >
                    View in model ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
