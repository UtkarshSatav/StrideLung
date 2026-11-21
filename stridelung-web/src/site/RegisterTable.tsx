"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { REGISTER, MASS, SUBSYSTEMS, type SubsystemId } from "@/trolley/register";
import { useTrolley } from "@/trolley/TrolleyProvider";
import { Chip } from "@/trolley/Chip";

type Key = "id" | "name" | "mass" | "sys";

export function RegisterTable() {
  const { actions } = useTrolley();
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: "id", dir: 1 });
  const [sys, setSys] = useState<SubsystemId | "all">("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return REGISTER.filter(
      (r) => (sys === "all" || r.sys === sys) && (!term || `${r.id} ${r.name} ${r.material} ${r.role}`.toLowerCase().includes(term))
    ).sort((a, b) => {
      const va = a[sort.key], vb = b[sort.key];
      return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb))) * sort.dir;
    });
  }, [sort, sys, q]);

  const th = (key: Key, label: string) => (
    <th scope="col" aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        className="th-sort-btn"
        onClick={() => setSort({ key, dir: sort.key === key ? ((-sort.dir) as 1 | -1) : 1 })}
      >
        <span>{label}</span>
        <span className="sort-indicator" aria-hidden="true">
          {sort.key === key ? (sort.dir === 1 ? " ▲" : " ▼") : " ⇅"}
        </span>
      </button>
    </th>
  );

  const totalMass = rows.reduce((a, r) => a + r.mass, 0);

  return (
    <div className="register-database">
      {/* Command Filter Bar */}
      <div className="database-controls">
        <div className="search-box">
          <svg className="search-glyph" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className="search-input"
            type="search"
            placeholder="Search 27 components by name, material, or function..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Filter database"
          />
          {q && (
            <button type="button" className="clear-search-btn" onClick={() => setQ("")}>
              ✕
            </button>
          )}
        </div>

        <div className="category-tabs" role="tablist" aria-label="Filter by layer">
          {(["all", ...Object.keys(SUBSYSTEMS)] as (SubsystemId | "all")[]).map((id) => {
            const count = id === "all" ? REGISTER.length : REGISTER.filter((r) => r.sys === id).length;
            const isSelected = sys === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`category-tab${isSelected ? " active" : ""}`}
                onClick={() => setSys(id)}
              >
                {id !== "all" && <i className="sys-dot" data-sys={id} aria-hidden="true" />}
                <span>{id === "all" ? "All Components" : SUBSYSTEMS[id]}</span>
                <span className="count-pill mono">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Database Table */}
      <div className="database-table-wrapper">
        <table className="db-table">
          <thead>
            <tr>
              {th("id", "ID")}
              {th("name", "Component & Function")}
              <th scope="col">CAD Envelope (mm)</th>
              {th("mass", "Mass (kg)")}
              <th scope="col">Material Specification</th>
              {th("sys", "Pathway")}
              <th scope="col" className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="db-row">
                <td className="cell-id">
                  <span className="id-badge mono">{r.id}</span>
                </td>
                <td className="cell-main">
                  <Link href={`/components/${r.slug}`} className="component-link">
                    {r.name}
                  </Link>
                  <p className="component-role-snippet">{r.role}</p>
                </td>
                <td className="cell-envelope mono small">
                  <span>{r.envelope}</span>
                  <Chip status="P" />
                </td>
                <td className="cell-mass mono">
                  <span className="mass-number">{r.mass.toFixed(2)}</span>
                  {r.massNote && <span className="mass-sub">({r.massNote})</span>}
                </td>
                <td className="cell-material small">
                  <span>{r.material.split(";")[0]}</span>
                  <Chip status={r.matStatus} />
                </td>
                <td className="cell-pathway">
                  <span className="pathway-badge" data-sys={r.sys}>
                    <i className="sys-dot" data-sys={r.sys} aria-hidden="true" />
                    <span>{SUBSYSTEMS[r.sys].split(" ")[0]}</span>
                  </span>
                </td>
                <td className="cell-actions text-right">
                  <button
                    type="button"
                    className="inspect-model-btn"
                    onClick={() => actions.focus((a) => { a.setView("open"); a.pick(r.id); })}
                  >
                    View in 3D ↗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="db-summary-row">
              <td colSpan={2} className="summary-left">
                Showing <b>{rows.length}</b> of 27 registered parts
              </td>
              <td className="text-right mono small">Filtered Total:</td>
              <td className="cell-mass mono bold">{totalMass.toFixed(2)} kg</td>
              <td colSpan={3} className="summary-right small muted">
                Full register: {MASS.sum.toFixed(2)} kg · With contingency: {MASS.total.toFixed(2)} kg · Design target: {MASS.ceiling} kg
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
