"use client";
import { useTrolley } from "./TrolleyProvider";
import type { FlowId, LayerId, View } from "./engine";
import { SUBSYSTEMS } from "./register";

const VIEWS: [View, string][] = [["assembled", "Assembled"], ["open", "Open case"], ["exploded", "Exploded"], ["parked", "Parked"], ["transport", "Transport"]];
const FLOWS: [FlowId, string][] = [["blood", "Blood"], ["gas", "Gas"], ["water", "Thermal water"], ["electrical", "Electrical / data"]];

export function Controls() {
  const { state, actions } = useTrolley();
  return (
    <div className="sl-controls" aria-label="Figure controls">
      <div className="sl-row" role="group" aria-label="View">
        <span className="sl-label">View</span>
        {VIEWS.map(([id, label]) => (
          <button key={id} type="button" className="sl-btn" aria-pressed={state.view === id} onClick={() => actions.setView(id)}>{label}</button>
        ))}
        <button type="button" className="sl-btn" onClick={() => actions.reset()}>Reset</button>
      </div>
      <div className="sl-row" role="group" aria-label="Flow overlays">
        <span className="sl-label">Flow</span>
        {FLOWS.map(([id, label]) => (
          <button key={id} type="button" className="sl-btn" aria-pressed={state.flows.includes(id)} onClick={() => actions.toggleFlow(id)}>
            <i className="sl-swatch" data-sw={id} aria-hidden="true" />
            {label}
          </button>
        ))}
        <button type="button" className="sl-btn" aria-pressed={state.gasExternal} onClick={() => actions.setGasExternal(!state.gasExternal)}>
          {state.gasExternal ? "Gas: external blended supply" : "Gas: onboard cylinder"}
        </button>
        <button type="button" className="sl-btn" aria-pressed={state.blocked} onClick={() => actions.setBlocked(!state.blocked)}>Blocked-line illustration</button>
      </div>
      <div className="sl-row" role="group" aria-label="Layer">
        <span className="sl-label">Layer</span>
        {(["all", ...Object.keys(SUBSYSTEMS)] as LayerId[]).map((id) => (
          <button key={id} type="button" className="sl-btn" aria-pressed={state.layer === id} onClick={() => actions.setLayer(id)}>
            {id === "all" ? "All layers" : SUBSYSTEMS[id as keyof typeof SUBSYSTEMS]}
          </button>
        ))}
      </div>
    </div>
  );
}
