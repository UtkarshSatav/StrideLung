"use client";
// Filters the server-rendered component cards by subsystem and text, without re-rendering them.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SUBSYSTEMS, type SubsystemId } from "@/trolley/register";

export function ComponentFilter({ children }: { children: ReactNode }) {
  const [sys, setSys] = useState<SubsystemId | "all">("all");
  const [q, setQ] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const term = q.trim().toLowerCase();
    let shown = 0;
    grid.current?.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      const ok = (sys === "all" || card.dataset.sys === sys) && (!term || (card.dataset.search ?? "").includes(term));
      card.hidden = !ok;
      if (ok) shown++;
    });
    setCount(shown);
  }, [sys, q]);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter components">
        <input className="search" type="search" placeholder="Search by ID, name or material" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search components" />
        {(["all", ...Object.keys(SUBSYSTEMS)] as (SubsystemId | "all")[]).map((id) => (
          <button key={id} type="button" className="sl-btn" aria-pressed={sys === id} onClick={() => setSys(id)}>
            {id !== "all" && <i className="sys-dot" data-sys={id} aria-hidden="true" />}
            {id === "all" ? "All" : SUBSYSTEMS[id]}
          </button>
        ))}
        <span className="muted small" aria-live="polite">{count === null ? "" : `${count} shown`}</span>
      </div>
      <div ref={grid} className="card-grid">{children}</div>
    </>
  );
}
