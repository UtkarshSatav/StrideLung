"use client";
// Scene selector, pause and tour. Scenes are drawing layers of one model; none is an operating state.
import { useParallel } from "./ParallelProvider";
import { SCENES } from "./model";

export function SceneControls() {
  const { state, actions } = useParallel();
  return (
    <section className="pl-box" aria-label="Scenes">
      <span className="pl-kicker">Scene</span>
      <div className="pl-scenes" role="group" aria-label="Choose a scene">
        {SCENES.map((s) => (
          <button key={s.id} type="button" className="pl-btn" aria-pressed={state.scene === s.id} onClick={() => actions.setScene(s.id)}>
            <kbd aria-hidden="true">{s.key}</kbd>
            {s.label}
          </button>
        ))}
      </div>
      <div className="pl-row">
        <button type="button" className="pl-btn" aria-pressed={state.motionPaused} onClick={() => actions.setPaused(!state.motionPaused)}>
          {state.motionPaused ? "Resume motion" : "Pause motion"}
        </button>
        <button type="button" className="pl-btn" aria-pressed={state.touring} disabled={state.reduced} onClick={() => (state.touring ? actions.stopTour() : actions.startTour())}>
          {state.touring ? "Stop tour" : "Play tour"}
        </button>
        {state.selectedPartId && <button type="button" className="pl-btn" onClick={() => actions.pick(null)}>Clear selection</button>}
      </div>
      {state.reduced && <p className="pl-note">Reduced motion is on: the door jumps, highlights stand still, and review steps advance only when you step them.</p>}
    </section>
  );
}
