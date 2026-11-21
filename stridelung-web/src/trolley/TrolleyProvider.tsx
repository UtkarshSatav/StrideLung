"use client";
// Shares the figure's state and actions with the rest of the page: the explorer's controls, the info panel,
// the part list, and any site section (subsystem cards, the register table) can drive the trolley.
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Engine, EngineState, FlowId, LayerId, View } from "./engine";

const INITIAL: EngineState = { view: "assembled", flows: [], layer: "all", selected: null, hovered: null, gasExternal: false, blocked: false, touring: false, status: "assembled · 460 × 330 × 790 mm" };

type Actions = {
  setView(v: View): void;
  toggleFlow(f: FlowId): void;
  setFlows(f: FlowId[]): void;
  setLayer(l: LayerId): void;
  pick(id: string | null): void;
  hover(id: string | null): void;
  setGasExternal(on: boolean): void;
  setBlocked(on: boolean): void;
  reset(): void;
  /** scroll the explorer into view, then run an action against it */
  focus(run?: (a: Actions) => void): void;
};
type Ctx = { state: EngineState; actions: Actions; attach(engine: Engine | null): void; onState(s: EngineState): void };
const TrolleyContext = createContext<Ctx | null>(null);

export function TrolleyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EngineState>(INITIAL);
  const engine = useRef<Engine | null>(null);
  const queue = useRef<((a: Actions) => void)[]>([]);
  const attach = useCallback((e: Engine | null) => {
    engine.current = e;
    if (e) {
      for (const run of queue.current.splice(0)) run(actions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const call = <K extends keyof Engine>(name: K) => (...args: any[]) => {
    const e = engine.current as any;
    if (e) e[name](...args);
    else queue.current.push((a: any) => a[name](...args));
  };
  const actions: Actions = useMemo(() => {
    const a: Actions = {
      setView: call("setView"),
      toggleFlow: call("toggleFlow"),
      setFlows: call("setFlows"),
      setLayer: call("setLayer"),
      pick: call("pick"),
      hover: call("hover"),
      setGasExternal: call("setGasExternal"),
      setBlocked: call("setBlocked"),
      reset: call("reset"),
      focus(run) {
        document.getElementById("explore")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        if (run) run(a);
      },
    };
    return a;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const value = useMemo(() => ({ state, actions, attach, onState: setState }), [state, actions, attach]);
  return <TrolleyContext.Provider value={value}>{children}</TrolleyContext.Provider>;
}

export function useTrolley() {
  const ctx = useContext(TrolleyContext);
  if (!ctx) throw new Error("useTrolley must be used inside <TrolleyProvider>");
  return ctx;
}
