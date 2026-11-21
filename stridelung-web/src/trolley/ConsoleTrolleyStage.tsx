"use client";
// The landing page's trolley model, mounted in the hospital command panel. The dashboard supplies the selected
// unit's live state through ConsoleModelContext; this stage turns it into engine calls. The case stays open,
// there is no auto-tour, and the stage is not keyboard-focusable so it never competes with the dashboard.
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { createEngine, type Engine, type EngineScene, type FlowId, type Telemetry } from "./engine";

export type ConsoleModelState = {
  flows: FlowId[];
  blocked: boolean;
  gasExternal: boolean;
  mark: string | null;
  alarm: boolean;
  stale: boolean;
  telemetry: Telemetry | null;
};

export const ConsoleModelContext = createContext<ConsoleModelState | null>(null);

export function ConsoleTrolleyStage({ scene, children }: { scene: EngineScene; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);
  const applied = useRef<Record<string, string>>({});
  const model = useContext(ConsoleModelContext);

  useEffect(() => {
    if (!stage.current) return;
    const e = createEngine(stage.current, scene, { onState: () => {}, autoTour: false });
    e.setView("open");
    engine.current = e;
    applied.current = {};
    return () => {
      e.destroy();
      engine.current = null;
    };
  }, [scene]);

  useEffect(() => {
    const e = engine.current;
    if (!e || !model) return;
    // only call the engine when a value actually changed; telemetry streams every sample
    const once = (key: string, value: unknown, run: () => void) => {
      const text = JSON.stringify(value);
      if (applied.current[key] === text) return;
      applied.current[key] = text;
      run();
    };
    once("gas", model.gasExternal, () => e.setGasExternal(model.gasExternal));
    once("blocked", model.blocked, () => e.setBlocked(model.blocked));
    once("flows", [model.flows, model.blocked, model.gasExternal], () => e.setFlows(model.flows));
    once("mark", model.mark, () => e.mark(model.mark));
    once("alarm", model.alarm, () => e.setAlarm(model.alarm));
    once("stale", model.stale, () => e.setStale(model.stale));
    if (!model.stale) e.setTelemetry(model.telemetry);
  });

  return (
    <div className="console-model sl">
      <div ref={stage} className="console-model-stage sl-stage" role="img" aria-label="StrideLung trolley model showing the selected unit's simulated state">
        {children}
      </div>
    </div>
  );
}
