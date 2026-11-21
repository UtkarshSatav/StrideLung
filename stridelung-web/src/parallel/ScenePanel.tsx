"use client";
// What the viewer is seeing: the scene's caption, the uncertainty card for a branch focus, the review steps, and
// the selected part. Every state repeats that the figure is concept only and that highlighting is not an
// operating instruction.
import { useParallel } from "./ParallelProvider";
import { GROUPS, PART_BY_ID, SCENE_BY_ID, SEQUENCES } from "./model";

export function ScenePanel() {
  const { state, actions } = useParallel();
  const def = SCENE_BY_ID[state.scene];
  const seq = SEQUENCES[state.scene];
  const part = state.selectedPartId ? PART_BY_ID[state.selectedPartId] : state.hoveredPartId ? PART_BY_ID[state.hoveredPartId] : null;
  return (
    <>
      <section className="pl-box" aria-live="off">
        <span className="pl-kicker">{def.key} · {def.label}</span>
        <p>{def.caption}</p>
        {(state.scene === "branch-a" || state.scene === "branch-b") && (
          <div className="pl-note" role="note">
            <b>Uncertainty.</b> Branch flow distribution is unverified. Highlighting branch {state.scene === "branch-a" ? "A" : "B"} is a visual selection state — not a statement that the other branch is isolated, safe to disconnect, or capable of carrying all required flow.
          </div>
        )}
        {seq && (
          <>
            <ol className="pl-steps" aria-label={`${def.label} steps`}>
              {seq.map((s, i) => (
                <li key={s.title}>
                  <button type="button" aria-current={state.step === i ? "step" : undefined} onClick={() => actions.setStep(i)}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.title}<small>{s.caption}</small></span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="pl-row">
              <button type="button" className="pl-btn" onClick={() => actions.stepBy(-1)}>← Previous</button>
              <button type="button" className="pl-btn" onClick={() => actions.stepBy(1)}>Next →</button>
            </div>
            <p className="pl-note">A presentation highlight, not a flow or switching sequence.</p>
          </>
        )}
        {state.scene === "baseline-compare" && <p className="pl-note">Both concepts are unvalidated. No performance, runtime or support comparison is made: the thumbnail compares topology and packaging only.</p>}
      </section>
      <section className="pl-box" aria-live="off">
        {part ? (
          <>
            <span className="pl-kicker">{GROUPS[part.group]}{state.selectedPartId ? " · selected" : ""}</span>
            <h3>{part.name}</h3>
            <p>{part.caption}</p>
            <p className="muted small">Concept only. A visual part, not a bill-of-materials item.</p>
          </>
        ) : (
          <>
            <span className="pl-kicker">Parts</span>
            <p>Hover or tap any part of the figure — or pick one from the list below — to read what it is and what it is not.</p>
            <p className="muted small">The isolation silhouettes are deliberately not selectable: they have no states.</p>
          </>
        )}
      </section>
    </>
  );
}
