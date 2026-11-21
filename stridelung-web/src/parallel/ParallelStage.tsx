"use client";
// The concept figure's card: the persistent concept-only banner, the corners (figure number, title, hint, live
// readout), the focusable stage holding the server-rendered SVG, and the baseline inset shown in the compare scene.
import { useEffect, useRef, type ReactNode } from "react";
import { createParallelEngine, type EngineScene } from "./engine";
import { useParallel } from "./ParallelProvider";
import { BANNER, PART_BY_ID, type Scene, SCENE_BY_ID } from "./model";

export function ParallelStage({ scene, label, inset, children }: { scene: EngineScene; label: string; inset: { W: number; H: number; svg: string }; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const { attach, onState } = useParallel();
  useEffect(() => {
    if (!stage.current) return;
    const engine = createParallelEngine(stage.current, scene, { onState });
    attach(engine);
    // deep links: ?scene=branch-a and/or ?part=split
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scene") as Scene | null;
    const part = q.get("part");
    if (s && SCENE_BY_ID[s]) engine.setScene(s);
    if (part && PART_BY_ID[part]) engine.pick(part);
    return () => {
      attach(null);
      engine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <figure className="iso-figure pl">
      <div className="iso-plate">
        <div className="pl-banner" role="note"><i aria-hidden="true" />{BANNER}</div>
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">Fig 2 · parallel oxygenator</span>
          <span className="iso-plate-corner" data-corner="title">Concept exploration</span>
          <span className="iso-plate-corner" data-corner="hint"><span className="hint-fine">Hover a part · 1–7 scenes · space pauses</span><span className="hint-touch">Tap a part · pick a scene below</span></span>
          <span className="iso-plate-corner" data-corner="readout" data-readout>Closed product · concept only</span>
        </div>
        <div ref={stage} className="iso-stage pl-stage" tabIndex={0} role="group" aria-label={label}>
          {children}
          <div className="pl-inset">
            <svg className="iso-svg" viewBox={`0 0 ${inset.W} ${inset.H}`} role="img" aria-label="Baseline thumbnail: the single-cartridge concept — one cartridge, one inlet, one outlet, both capped. Unvalidated." dangerouslySetInnerHTML={{ __html: inset.svg }} />
            <span className="pl-tag"><b>Baseline</b> · single cartridge · unvalidated</span>
          </div>
          <span className="pl-tag pl-tag-main"><b>Parallel</b> · two cartridges · unvalidated</span>
          <span className="sl-sr" role="status" aria-live="polite" data-live />
        </div>
      </div>
    </figure>
  );
}
