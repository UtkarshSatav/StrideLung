"use client";
// The full register, sortable and filterable; a row opens the explorer on that component.
import { useMemo, useState } from "react";
import Link from "next/link";
import { REGISTER, SUBSYSTEMS, type SubsystemId } from "@/trolley/register";
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
    return REGISTER.filter((r) => (sys === "all" || r.sys === sys) && (!term || `${r.id} ${r.name} ${r.material}`.toLowerCase().includes(term))).sort((a, b) => {
      const va = a[sort.key], vb = b[sort.key];
      return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb))) * sort.dir;
    });
  }, [sort, sys, q]);
  const th = (key: Key, label: string) => (
    <th scope="col" aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => setSort({ key, dir: sort.key === key ? ((-sort.dir) as 1 | -1) : 1 })}>
        {label}<span aria-hidden="true">{sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : ""}</span>
      </button>
    </th>
  );
  const total = rows.reduce((a, r) => a + r.mass, 0);
  return (
    <div className="register">
      <div className="filters" role="group" aria-label="Filter the register">
        <input className="search" type="search" placeholder="Search components or materials" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        {(["all", ...Object.keys(SUBSYSTEMS)] as (SubsystemId | "all")[]).map((id) => (
          <button key={id} type="button" className="sl-btn" aria-pressed={sys === id} onClick={() => setSys(id)}>
            {id !== "all" && <i className="sys-dot" data-sys={id} aria-hidden="true" />}
            {id === "all" ? "All" : SUBSYSTEMS[id]}
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>{th("id", "ID")}{th("name", "Component")}<th scope="col">CAD envelope (mm)</th>{th("mass", "Mass (kg)")}<th scope="col">Material</th>{th("sys", "Layer")}<th scope="col"><span className="sr">Actions</span></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td>
                <td><Link href={`/components/${r.slug}`}>{r.name}</Link><div className="cell-sub">{r.shape}</div></td>
                <td className="mono small">{r.envelope} <Chip status="P" /></td>
                <td className="mono num">{r.mass.toFixed(2)}{r.massNote && <span className="cell-sub">row total</span>}</td>
                <td className="small">{r.material.split(";")[0]} <Chip status={r.matStatus} /></td>
                <td><span className="sys-tag"><i className="sys-dot" data-sys={r.sys} aria-hidden="true" />{SUBSYSTEMS[r.sys]}</span></td>
                <td><button type="button" className="row-action" onClick={() => actions.focus((a) => { a.setView("open"); a.pick(r.id); })}>Show in model</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td /><td>{rows.length} of {REGISTER.length} rows</td><td /><td className="mono num">{total.toFixed(2)}</td><td colSpan={3} className="muted small">+ 20% contingency on the full register = 26.78 kg</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
