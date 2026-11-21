"use client";
// The register entry for whatever is hovered or selected; with nothing selected, the trolley's summary.
import Link from "next/link";
import { useTrolley } from "./TrolleyProvider";
import { BY_ID, MASS, RESOURCES, SUBSYSTEMS } from "./register";
import { Chip } from "./Chip";

export function InfoPanel({ c23 }: { c23: { drain: number; ret: number } }) {
  const { state } = useTrolley();
  const id = state.selected || state.hovered;
  if (!id) {
    return (
      <section className="sl-info" aria-live="off">
        <div className="sl-info-head">
          <span className="sl-id">27</span>
          <span className="sl-name">components in the register · {state.status}</span>
        </div>
        <dl className="sl-dl">
          <dt>Stowed rolling envelope</dt><dd>460 × 330 × 790 mm incl. wheels <Chip status="P" /></dd>
          <dt>Handle deployed</dt><dd>top at z 1050 mm <Chip status="P" /></dd>
          <dt>Stabilisers deployed</dt><dd>620 × 480 mm support envelope, inlaid on the plinth <Chip status="P" /></dd>
          <dt>Mass accounting</dt><dd>{MASS.sum.toFixed(2)} kg rows + {MASS.contingency.toFixed(3)} kg (20%) = <b>{MASS.total.toFixed(2)} kg</b>; {MASS.margin.toFixed(3)} kg under the 28 kg planning ceiling <Chip status="P" /></dd>
          <dt>Reference check</dt><dd>One existing portable console is listed at 255 × 315 × 427 mm, about 12 kg <Chip status="R" /> [S1]; that does not show the proposed drive and electronics would fit.</dd>
        </dl>
        <p className="sl-calc">Patient monitoring, staffing and any ventilator stay outside the trolley. The native heart still does the systemic pumping (VV configuration).</p>
        {state.blocked && (
          <p className="sl-calc"><b>Blocked-line illustration.</b> The synthetic flow trace falls and the drainage-pressure trace drops below its normal band. Several different causes can produce similar-looking observations — a kinked drainage line, a cannula position problem or low circulating volume, for example. The figure does not calculate, diagnose or claim any patient outcome.</p>
        )}
      </section>
    );
  }
  const r = BY_ID[id];
  const b = RESOURCES.battery;
  const g = RESOURCES.gas;
  return (
    <section className="sl-info" aria-live="off">
      <div className="sl-info-head">
        <span className="sl-id">{r.id}</span>
        <span className="sl-name">{r.name}</span>
        <span className="sl-sys">{SUBSYSTEMS[r.sys]}</span>
        <Link className="sl-more" href={`/components/${r.slug}`}>Component page →</Link>
      </div>
      <p className="sl-role">{r.role}</p>
      <dl className="sl-dl">
        <dt>Shape</dt><dd>{r.shape}</dd>
        <dt>CAD envelope (W × D × H, mm)</dt><dd>{r.envelope} <Chip status="P" /></dd>
        <dt>Mass allocation</dt><dd>{r.mass.toFixed(2)} kg{r.massNote ? ` (${r.massNote})` : ""} <Chip status="P" /></dd>
        <dt>Position (x, y, z mm)</dt><dd>{r.position} <Chip status="P" /></dd>
        <dt>Material</dt><dd>{r.material} <Chip status={r.matStatus} /></dd>
      </dl>
      {(id === "C17" || id === "C18") && (
        <p className="sl-calc">Illustrative arithmetic: {b.wh} Wh × {b.factor} ÷ {b.loads[0]} W = <b>{((b.wh * b.factor) / b.loads[0]).toFixed(2)} h</b>; at {b.loads[1]} W ≈ <b>{((b.wh * b.factor) / b.loads[1]).toFixed(2)} h</b>. Not a runtime specification — the system is limited by its most limiting resource, not by the battery alone.</p>
      )}
      {(id === "C11" || id === "C13" || id === "C14") && (
        <p className="sl-calc">Illustrative arithmetic: {g.usableL} L assumed usable ÷ synthetic {g.lpm} L/min = <b>{g.usableL / g.lpm} min</b>. Not a prescribed sweep or a duration claim for any cylinder. {state.gasExternal ? "Showing the external hospital blended-gas connection; the onboard cylinder is not in use." : "Showing the onboard cylinder; an external blended supply is the alternative, never both."}</p>
      )}
      {id === "C23" && <p className="sl-calc">Modelled path lengths: drainage {c23.drain} mm, return {c23.ret} mm (allocation 1.5 m per line). Clinical cannula selection and placement are not modelled.</p>}
      {id === "C25" && <p className="sl-calc">0.60 kg thermal-fluid equivalent (the reservoir window) + 0.45 kg circuit allowance (the blood lines). Water-equivalent planning mass only.</p>}
      {(id === "C09" || id === "C10") && <p className="sl-calc">Pressure sites: drainage/pre-pump (on the riser), pre-oxygenator (pump outlet leg), post-oxygenator (return line). Symbolic housings; no invasive port construction is shown.</p>}
      {state.view === "exploded" && !r.meta && <p className="sl-calc">Exploded view: {r.id} keeps its ID and returns to its home position ({r.position}) when the view closes.</p>}
    </section>
  );
}
