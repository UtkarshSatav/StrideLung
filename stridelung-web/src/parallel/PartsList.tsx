"use client";

import { useParallel } from "./ParallelProvider";
import { GROUPS, PARTS, type PartGroup } from "./model";

export function PartsList() {
  const { state, actions } = useParallel();
  return (
    <div className="pl-parts-container">
      <div className="pl-parts-header">
        <div>
          <h3 className="pl-parts-title">Parallel Architecture Component Manifest</h3>
          <p className="pl-parts-subtitle">Hover to highlight flow paths in 3D · Click to pin technical notes</p>
        </div>
        <span className="pl-parts-badge">20 Circuit Parts</span>
      </div>

      <div className="pl-parts-groups">
        {(Object.keys(GROUPS) as PartGroup[]).map((g) => (
          <div key={g} className="pl-parts-group">
            <h4 className="pl-group-heading">{GROUPS[g]}</h4>
            <div className="pl-parts-grid" role="list" aria-label={GROUPS[g]}>
              {PARTS.filter((p) => p.group === g).map((p) => {
                const isSelected = state.selectedPartId === p.id;
                const isHovered = state.hoveredPartId === p.id;
                const isOn = isSelected || isHovered;

                return (
                  <span role="listitem" key={p.id}>
                    <button
                      type="button"
                      className={`pl-part-card ${isOn ? "active" : ""} ${!p.selectable ? "disabled" : ""}`}
                      disabled={!p.selectable}
                      title={p.selectable ? p.caption : "Not selectable: isolation/switching approach not designed"}
                      aria-pressed={isSelected}
                      data-on={isOn ? "" : undefined}
                      onClick={() => actions.pick(isSelected ? null : p.id)}
                      onPointerEnter={() => actions.hover(p.id)}
                      onPointerLeave={() => actions.hover(null)}
                      onFocus={() => actions.hover(p.id)}
                      onBlur={() => actions.hover(null)}
                    >
                      <span className="pl-part-card-name">{p.name}</span>
                      {!p.selectable ? (
                        <span className="pl-part-status-badge locked">Fixed</span>
                      ) : (
                        isSelected && <span className="pl-part-status-badge active">Inspecting</span>
                      )}
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
