"use client";
// Mass budget: one segmented bar (subsystem totals, contingency and the headroom to the 28 kg ceiling) and the
// 27 row allocations ranked. Subsystem hues follow a validated categorical order; every segment is also labelled
// in the legend and the register table below is the table view.
import { useState } from "react";
import { REGISTER, MASS, SUBSYSTEMS, type SubsystemId } from "@/trolley/register";

const ORDER: SubsystemId[] = ["gas", "blood", "chassis", "thermal", "electrical"];

export function MassBudget() {
  const [tip, setTip] = useState<{ x: number; text: string } | null>(null);
  const totals = ORDER.map((sys) => ({ sys, kg: REGISTER.filter((r) => r.sys === sys).reduce((a, r) => a + r.mass, 0) }));
  const ceiling = MASS.ceiling;
  const segs = [...totals.map((t) => ({ key: t.sys, label: SUBSYSTEMS[t.sys], kg: t.kg })), { key: "contingency", label: "20% contingency", kg: MASS.contingency }];
  let acc = 0;
  const ranked = [...REGISTER].sort((a, b) => b.mass - a.mass);
  const max = ranked[0].mass;
  return (
    <div className="budget">
      <figure className="budget-figure">
        <figcaption className="budget-head">
          <span className="budget-total"><b>{MASS.total.toFixed(2)} kg</b> of a 28 kg planning ceiling</span>
          <span className="muted">{MASS.margin.toFixed(3)} kg headroom · allocations, not measured masses</span>
        </figcaption>
        <div className="seg-wrap" onPointerLeave={() => setTip(null)}>
          <div className="seg-bar" role="img" aria-label={`Mass budget: ${segs.map((s) => `${s.label} ${s.kg.toFixed(2)} kg`).join(", ")}, headroom ${MASS.margin.toFixed(2)} kg of ${ceiling} kg.`}>
            {segs.map((s) => {
              const left = (acc / ceiling) * 100;
              const width = (s.kg / ceiling) * 100;
              acc += s.kg;
              return (
                <span
                  key={s.key}
                  className="seg"
                  data-seg={s.key}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  onPointerEnter={() => setTip({ x: left + width / 2, text: `${s.label} · ${s.kg.toFixed(2)} kg · ${((s.kg / MASS.total) * 100).toFixed(1)}% of the total` })}
                />
              );
            })}
            <span className="seg headroom" style={{ left: `${(acc / ceiling) * 100}%`, width: `${(MASS.margin / ceiling) * 100}%` }} onPointerEnter={() => setTip({ x: 98, text: `Headroom · ${MASS.margin.toFixed(3)} kg under the 28 kg ceiling` })} />
          </div>
          {tip && <div className="tip" style={{ left: `${Math.min(86, Math.max(14, tip.x))}%` }}>{tip.text}</div>}
          <div className="seg-axis" aria-hidden="true">{[0, 7, 14, 21, 28].map((v) => <span key={v} style={{ left: `${(v / 28) * 100}%` }}>{v} kg</span>)}</div>
        </div>
        <ul className="legend">
          {segs.map((s) => (
            <li key={s.key}><i className="seg-key" data-seg={s.key} aria-hidden="true" />{s.label}<b>{s.kg.toFixed(2)} kg</b></li>
          ))}
          <li><i className="seg-key headroom" aria-hidden="true" />Headroom<b>{MASS.margin.toFixed(2)} kg</b></li>
        </ul>
      </figure>
      <figure className="rank">
        <figcaption className="rank-head">Row allocations, heaviest first <span className="muted">(kg, row totals)</span></figcaption>
        <ol className="rank-list">
          {ranked.map((r) => (
            <li key={r.id} title={`${r.id} ${r.name} · ${r.mass.toFixed(2)} kg${r.massNote ? ` (${r.massNote})` : ""}`}>
              <span className="rank-id">{r.id}</span>
              <span className="rank-name">{r.name.split(/[,;(]/)[0]}</span>
              <span className="rank-track"><span className="rank-bar" data-seg={r.sys} style={{ width: `${(r.mass / max) * 100}%` }} /></span>
              <span className="rank-val">{r.mass.toFixed(2)}</span>
            </li>
          ))}
        </ol>
      </figure>
    </div>
  );
}
