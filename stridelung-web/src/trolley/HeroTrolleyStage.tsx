"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createEngine, type Engine, type EngineScene } from "./engine";

export function HeroTrolleyStage({ scene, children }: { scene: EngineScene; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!stage.current) return;
    const activeEngine = createEngine(stage.current, scene, { onState: () => {} });
    engine.current = activeEngine;
    return () => {
      activeEngine.destroy();
      engine.current = null;
    };
  }, [scene]);

  function toggleAnimation() {
    engine.current?.setAutoTour(!playing);
    setPlaying(!playing);
  }

  return (
    <div className="hero-model sl">
      <div className="hero-model-stage sl-stage" ref={stage} aria-hidden="true">{children}</div>
      <div className="hero-model-caption"><span>StrideLung 01 · Trolley concept</span>
        <button type="button" onClick={toggleAnimation}>{playing ? "Stop animation" : "Play animation"}</button>
      </div>
    </div>
  );
}
