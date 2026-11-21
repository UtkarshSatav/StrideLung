"use client";
// Five subsystem cards that drive the explorer: show a layer with its flow, or jump to a component.
import { useTrolley } from "@/trolley/TrolleyProvider";
import { REGISTER, SUBSYSTEMS, type SubsystemId } from "@/trolley/register";
import type { FlowId } from "@/trolley/engine";

const COPY: Record<SubsystemId, { text: string; flow: FlowId | null }> = {
  blood: { text: "Drainage from the patient to the pump head, through the membrane oxygenator, back through the flow and bubble clip and out of the side panel. Supplier-qualified disposables held in a reserved envelope.", flow: "blood" },
  gas: { text: "An onboard oxygen cylinder or an external hospital blended supply — never both — through a supplier-selected control block to the membrane, with a separate exhaust that never vents into the battery bay.", flow: "gas" },
  thermal: { text: "A removable dry thermal module and a paired hose loop to the heat-exchanger base of the cartridge, plus the illustrative fluid allowance. Water, blood and gas never merge.", flow: "water" },
  electrical: { text: "One battery cassette, power conversion and isolation, compute and I/O, the display and alarm, the reusable pump drive, the sensor interface and the harness that joins them.", flow: "electrical" },
  chassis: { text: "The case and its doors, the rail chassis, braked casters, the push handle and lift grips, the stabilisers and the service-kit allowance.", flow: null },
};
const ORDER: SubsystemId[] = ["blood", "gas", "thermal", "electrical", "chassis"];

export function Subsystems() {
  const { state, actions } = useTrolley();
  return (
    <div className="sys-grid">
      {ORDER.map((sys) => {
        const parts = REGISTER.filter((r) => r.sys === sys);
        const mass = parts.reduce((a, r) => a + r.mass, 0);
        const active = state.layer === sys;
        return (
          <article key={sys} className={`sys-card${active ? " active" : ""}`} data-sys={sys}>
            <header>
              <i className="sys-swatch" aria-hidden="true" />
              <h3>{SUBSYSTEMS[sys]}</h3>
              <span className="sys-mass">{mass.toFixed(2)} kg · {parts.length} parts</span>
            </header>
            <p>{COPY[sys].text}</p>
            <ul className="sys-parts">
              {parts.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => actions.focus((a) => { a.setView("open"); a.pick(r.id); })}>
                    <span className="sl-num">{r.id}</span>{r.name.split(/[,;]/)[0]}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn small"
              aria-pressed={active}
              onClick={() =>
                actions.focus((a) => {
                  a.pick(null);
                  a.setView("open");
                  a.setLayer(sys);
                  a.setFlows(COPY[sys].flow ? [COPY[sys].flow as FlowId] : []);
                })
              }
            >
              {active ? "Showing in the model" : "Show this layer in the model"}
            </button>
          </article>
        );
      })}
    </div>
  );
}
