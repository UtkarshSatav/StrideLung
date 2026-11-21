"use client";
// Shares the concept figure's state and actions with its panels: scene selector, pause, review steps, the part
// list and the selected-part card all drive the one engine. Actions issued before the engine attaches are queued.
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { ParallelEngine, ViewState } from "./engine";
import type { Scene } from "./model";

const INITIAL: ViewState = { scene: "closed", selectedPartId: null, conceptOnly: true, motionPaused: false, hoveredPartId: null, step: -1, touring: false, reduced: false, door: "closed" };

export type ParallelActions = {
  setScene(s: Scene): void;
  pick(id: string | null): void;
  hover(id: string | null): void;
  setPaused(on: boolean): void;
  stepBy(n: number): void;
  setStep(i: number): void;
  startTour(): void;
  stopTour(): void;
};
type Ctx = { state: ViewState; actions: ParallelActions; attach(engine: ParallelEngine | null): void; onState(s: ViewState): void };
const ParallelContext = createContext<Ctx | null>(null);

export function ParallelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewState>(INITIAL);
  const engine = useRef<ParallelEngine | null>(null);
  const queue = useRef<((a: ParallelActions) => void)[]>([]);
  const actions: ParallelActions = useMemo(() => {
    const call = <K extends keyof ParallelActions>(name: K) => (...args: any[]) => {
      const e = engine.current as any;
      if (e) e[name](...args);
      else queue.current.push((a: any) => a[name](...args));
    };
    return { setScene: call("setScene"), pick: call("pick"), hover: call("hover"), setPaused: call("setPaused"), stepBy: call("stepBy"), setStep: call("setStep"), startTour: call("startTour"), stopTour: call("stopTour") };
  }, []);
  const attach = useCallback((e: ParallelEngine | null) => {
    engine.current = e;
    if (e) for (const run of queue.current.splice(0)) run(actions);
  }, [actions]);
  const value = useMemo(() => ({ state, actions, attach, onState: setState }), [state, actions, attach]);
  return <ParallelContext.Provider value={value}>{children}</ParallelContext.Provider>;
}

export function useParallel() {
  const ctx = useContext(ParallelContext);
  if (!ctx) throw new Error("useParallel must be used inside <ParallelProvider>");
  return ctx;
}
