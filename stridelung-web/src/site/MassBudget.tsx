"use client";
import { useState } from "react";
import { REGISTER, MASS, SUBSYSTEMS, type SubsystemId } from "@/trolley/register";

const ORDER: SubsystemId[] = ["gas", "blood", "chassis", "thermal", "electrical"];

export function MassBudget() {
  const [tip, setTip] = useState<{ x: number; text: string } | null>(null);
  const [filterSys, setFilterSys] = useState<SubsystemId | "all">("all");

  const totals = ORDER.map((sys) => ({
    sys,
    kg: REGISTER.filter((r) => r.sys === sys).reduce((a, r) => a + r.mass, 0),
  }));

  const ceiling = MASS.ceiling;
  const segs = [
    ...totals.map((t) => ({ key: t.sys, label: SUBSYSTEMS[t.sys], kg: t.kg })),
    { key: "contingency", label: "20% Contingency", kg: MASS.contingency },
  ];

  let acc = 0;
  const filteredList = REGISTER.filter((r) => filterSys === "all" || r.sys === filterSys).sort(
    (a, b) => b.mass - a.mass
  );
  const maxMass = Math.max(...REGISTER.map((r) => r.mass));

  return (
    <div className="mass-console">
      {/* Top Telemetry Header */}
      <div className="mass-hud-grid">
        <div className="hud-metric-card primary">
          <span className="hud-label eyebrow">Loaded Design Target</span>
          <div className="hud-value-row">
            <span className="hud-num mono">{ceiling}</span>
            <span className="hud-unit mono">kg</span>
          </div>
          <p className="hud-sub">
            Current modeled allocation is {MASS.total.toFixed(2)} kg including contingency
          </p>
        </div>

        <div className="hud-metric-card">
          <span className="hud-label eyebrow">Ceiling Headroom</span>
          <div className="hud-value-row">
            <span className="hud-num mono positive">+{MASS.margin.toFixed(2)}</span>
            <span className="hud-unit mono">kg</span>
          </div>
          <p className="hud-sub">
            Difference between the modeled allocation and the design target
          </p>
        </div>

        <div className="hud-metric-card">
          <span className="hud-label eyebrow">Base Row Sum</span>
          <div className="hud-value-row">
            <span className="hud-num mono">{MASS.sum.toFixed(2)}</span>
            <span className="hud-unit mono">kg</span>
          </div>
          <p className="hud-sub">
            Unfactored allocation across all five mechanical layers
          </p>
        </div>

        <div className="hud-metric-card">
          <span className="hud-label eyebrow">Contingency Allowance</span>
          <div className="hud-value-row">
            <span className="hud-num mono">+{MASS.contingency.toFixed(2)}</span>
            <span className="hud-unit mono">kg</span>
          </div>
          <p className="hud-sub">
            20% planning allowance for design growth
          </p>
        </div>
      </div>

      {/* Precision Segmented Distribution Rail */}
      <div className="mass-track-card">
        <div className="track-head">
          <span className="track-title">Subsystem Allocation Rail</span>
          <span className="track-capacity mono">Design target · {ceiling} kg</span>
        </div>

        <div className="track-rail-container" onPointerLeave={() => setTip(null)}>
          <div className="track-rail" role="img" aria-label="Mass breakdown bar">
            {segs.map((s) => {
              const left = (acc / ceiling) * 100;
              const width = (s.kg / ceiling) * 100;
              acc += s.kg;
              return (
                <div
                  key={s.key}
                  className="rail-segment"
                  data-seg={s.key}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  onPointerEnter={() =>
                    setTip({
                      x: left + width / 2,
                      text: `${s.label} · ${s.kg.toFixed(2)} kg (${((s.kg / MASS.total) * 100).toFixed(1)}%)`,
                    })
                  }
                />
              );
            })}
            <div
              className="rail-segment headroom-segment"
              style={{ left: `${(acc / ceiling) * 100}%`, width: `${(MASS.margin / ceiling) * 100}%` }}
              onPointerEnter={() =>
                setTip({
                  x: 95,
                  text: `Headroom · ${MASS.margin.toFixed(2)} kg available`,
                })
              }
            />
          </div>

          {tip && (
            <div className="track-tooltip mono" style={{ left: `${Math.min(84, Math.max(16, tip.x))}%` }}>
              {tip.text}
            </div>
          )}

          <div className="rail-ticks mono" aria-hidden="true">
            {[0, 7, 14, 21, 28].map((v) => (
              <span key={v} style={{ left: `${(v / 28) * 100}%` }}>{v} kg</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mass-legend-row">
          {segs.map((s) => (
            <div key={s.key} className="legend-chip">
              <span className="legend-swatch" data-seg={s.key} />
              <span className="legend-text">{s.label}</span>
              <span className="legend-val mono">{s.kg.toFixed(2)} kg</span>
            </div>
          ))}
          <div className="legend-chip headroom">
            <span className="legend-swatch headroom-swatch" />
            <span className="legend-text">Headroom</span>
            <span className="legend-val mono">{MASS.margin.toFixed(2)} kg</span>
          </div>
        </div>
      </div>

      {/* Component Mass Leaderboard */}
      <div className="mass-leaderboard-card">
        <div className="leaderboard-header">
          <div>
            <h3 className="leaderboard-title">Allocated Mass Leaderboard</h3>
            <span className="leaderboard-desc">
              All 27 components ranked by individual mass burden. Filter by layer below:
            </span>
          </div>

          <div className="leaderboard-filters">
            <button
              type="button"
              className={`filter-btn${filterSys === "all" ? " active" : ""}`}
              onClick={() => setFilterSys("all")}
            >
              All (27)
            </button>
            {ORDER.map((sys) => (
              <button
                key={sys}
                type="button"
                className={`filter-btn${filterSys === sys ? " active" : ""}`}
                onClick={() => setFilterSys(sys)}
              >
                {SUBSYSTEMS[sys].split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="leaderboard-grid">
          {filteredList.map((r, i) => {
            const pct = (r.mass / maxMass) * 100;
            return (
              <div key={r.id} className="leaderboard-item">
                <span className="item-rank mono">#{String(i + 1).padStart(2, "0")}</span>
                <span className="item-id mono">{r.id}</span>
                <div className="item-details">
                  <span className="item-name">{r.name.split(/[,;(]/)[0]}</span>
                  <div className="item-bar-wrap">
                    <div className="item-bar" data-seg={r.sys} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="item-mass-box mono">
                  <span className="item-mass-val">{r.mass.toFixed(2)}</span>
                  <span className="item-mass-unit">kg</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
