"use client";

import { useState, useId } from "react";
import { useTrolley } from "./TrolleyProvider";
import { REGISTER, SUBSYSTEMS, type SubsystemId } from "./register";

const SUBSYSTEM_TABS: { id: SubsystemId | "all"; label: string }[] = [
  { id: "all", label: "All (27)" },
  { id: "chassis", label: "Chassis (6)" },
  { id: "blood", label: "Blood (6)" },
  { id: "gas", label: "Gas (4)" },
  { id: "thermal", label: "Thermal (3)" },
  { id: "electrical", label: "Electrical (8)" },
];

const SYS_COLORS: Record<SubsystemId, string> = {
  blood: "#e34948",
  gas: "#2a78d6",
  thermal: "#1baf7a",
  electrical: "#eda100",
  chassis: "#6250d6",
};

export function PartList() {
  const { state, actions } = useTrolley();
  const [filter, setFilter] = useState<SubsystemId | "all">("all");
  const [search, setSearch] = useState("");
  const searchInputId = useId();

  // If a specific layer is isolated in global controls, align tab
  const activeFilter =
    state.layer !== "all" && state.layer in SUBSYSTEMS ? (state.layer as SubsystemId) : filter;

  const filtered = REGISTER.filter((row) => {
    if (activeFilter !== "all" && row.sys !== activeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        row.id.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q) ||
        SUBSYSTEMS[row.sys].toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sl-nav-container">
      <div className="sl-nav-header">
        <div className="sl-nav-title-group">
          <div className="sl-nav-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <div>
            <h3 className="sl-nav-heading">Component Register Navigator</h3>
            <p className="sl-nav-subheading">Hover any part to isolate in 3D · Click to pin live telemetry</p>
          </div>
        </div>

        <div className="sl-nav-search-wrap">
          <input
            id={searchInputId}
            type="text"
            className="sl-nav-search"
            placeholder="Search 27 registered parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Filter component register"
          />
          {search && (
            <button
              type="button"
              className="sl-nav-search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="sl-nav-filter-tabs" role="tablist" aria-label="Subsystem filter tabs">
        {SUBSYSTEM_TABS.map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`sl-nav-tab ${isSelected ? "active" : ""}`}
              onClick={() => {
                setFilter(tab.id);
                if (tab.id !== "all") {
                  actions.setLayer(tab.id);
                } else {
                  actions.setLayer("all");
                }
              }}
            >
              {tab.id !== "all" && (
                <span
                  className="sl-sys-pip"
                  style={{ backgroundColor: SYS_COLORS[tab.id as SubsystemId] }}
                  aria-hidden="true"
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="sl-parts-grid" role="list" aria-label="Components">
        {filtered.map((row) => {
          const isSelected = state.selected === row.id;
          const isHovered = state.hovered === row.id;
          const isOn = isSelected || isHovered;
          const [primaryName] = row.name.split(";");

          return (
            <button
              key={row.id}
              type="button"
              role="listitem"
              className={`sl-part-card ${isOn ? "active" : ""} ${isSelected ? "pinned" : ""}`}
              aria-pressed={isSelected}
              data-on={isOn ? "" : undefined}
              onClick={() => actions.pick(isSelected ? null : row.id)}
              onPointerEnter={() => actions.hover(row.id)}
              onPointerLeave={() => actions.hover(null)}
              onFocus={() => actions.hover(row.id)}
              onBlur={() => actions.hover(null)}
            >
              <div className="sl-part-card-header">
                <span className="sl-part-card-id">
                  <span
                    className="sl-sys-pip"
                    style={{ backgroundColor: SYS_COLORS[row.sys] }}
                    aria-hidden="true"
                  />
                  {row.id}
                </span>
                <span className="sl-part-card-mass">{row.mass.toFixed(2)} kg</span>
              </div>
              <div className="sl-part-card-name" title={row.name}>
                {primaryName.trim()}
              </div>
              <div className="sl-part-card-footer">
                <span className="sl-part-card-sys">{SUBSYSTEMS[row.sys]}</span>
                {isSelected && <span className="sl-part-card-pinned-tag">Pinned</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
