"use client";
// The interactive card: corners (title, hint, live readout), the focusable stage holding the server-rendered
// SVG, and the engine that animates it. The SVG arrives as children and is never re-rendered by React.
import { useEffect, useRef, type ReactNode } from "react";
import { createEngine, type EngineScene } from "./engine";
import { useTrolley } from "./TrolleyProvider";
import { BY_ID } from "./register";

export function TrolleyStage({ scene, label, children }: { scene: EngineScene; label: string; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const { attach, onState } = useTrolley();
  useEffect(() => {
    if (!stage.current) return;
    const engine = createEngine(stage.current, scene, { onState });
    attach(engine);
    // deep link: /?part=C05 opens the case and selects a component
    const part = new URLSearchParams(window.location.search).get("part");
    if (part && BY_ID[part]) {
      engine.setView("open");
      engine.pick(part);
    }
    return () => {
      attach(null);
      engine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <figure className="iso-figure sl">
      <div className="iso-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">StrideLung 01 · v0.1</span>
          <span className="iso-plate-corner" data-corner="title">Concept packaging — not a clinical device</span>
          <span className="iso-plate-corner" data-corner="hint"><span className="hint-fine">Hover a part · arrows step · space opens</span><span className="hint-touch">Tap a part · controls below</span></span>
          <span className="iso-plate-corner" data-corner="readout" data-readout>assembled · 460 × 330 × 790 mm</span>
        </div>
        <div ref={stage} className="iso-stage sl-stage" tabIndex={0} role="group" aria-label={label}>
          {children}
          <span className="sl-sr" role="status" aria-live="polite" data-live />
        </div>
      </div>
    </figure>
  );
}
