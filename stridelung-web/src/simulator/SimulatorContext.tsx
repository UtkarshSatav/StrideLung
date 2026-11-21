"use client";
// SimulatorContext — React context wrapper around the SimulatorEngine singleton.
// All simulator UI reads state from this context; no component polls independently.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  getSimulatorEngine,
  type SimState,
  type SimInputs,
  type PowerSource,
} from "./simulatorEngine";
import {
  type SimViewMode,
  type PhaseObservations,
  getPhaseObservations,
} from "./data/alwardtAdapter";

type SimActions = {
  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  reset(): void;
  setInput<K extends keyof SimInputs>(key: K, value: SimInputs[K]): void;
  setInputs(partial: Partial<SimInputs>): void;
  setSpeed(speed: number): void;
  setPowerSource(source: PowerSource): void;
  acknowledgeAlarm(id: string): void;
  clearAcknowledgedAlarms(): void;
  setActivePhase(phase: SimViewMode): void;
};

type SimCtx = {
  state: SimState;
  actions: SimActions;
  activePhase: SimViewMode;
  clinicalObservations: PhaseObservations | null;
};
const SimContext = createContext<SimCtx | null>(null);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const engine = useRef(getSimulatorEngine());
  const [state, setState] = useState<SimState>(engine.current.getState());
  const [activePhase, setActivePhaseState] = useState<SimViewMode>("live");

  useEffect(() => {
    const unsub = engine.current.subscribe(setState);
    if (!engine.current.getState().running) {
      engine.current.start();
    }
    return unsub;
  }, []);

  const clinicalObservations = activePhase !== "live" ? getPhaseObservations(activePhase) : null;

  const setActivePhase = useCallback((phase: SimViewMode) => {
    setActivePhaseState(phase);
    engine.current.setClinicalPhase(phase);
  }, []);

  const actions: SimActions = {
    start:    useCallback(() => engine.current.start(),    []),
    pause:    useCallback(() => engine.current.pause(),    []),
    resume:   useCallback(() => engine.current.resume(),   []),
    stop:     useCallback(() => engine.current.stop(),     []),
    reset:    useCallback(() => engine.current.reset(),    []),
    setInput: useCallback(<K extends keyof SimInputs>(k: K, v: SimInputs[K]) => engine.current.setInput(k, v), []),
    setInputs: useCallback((p: Partial<SimInputs>) => engine.current.setInputs(p), []),
    setSpeed: useCallback((s: number) => engine.current.setSpeed(s), []),
    setPowerSource: useCallback((s: PowerSource) => engine.current.setPowerSource(s), []),
    acknowledgeAlarm: useCallback((id: string) => engine.current.acknowledgeAlarm(id), []),
    clearAcknowledgedAlarms: useCallback(() => engine.current.clearAcknowledgedAlarms(), []),
    setActivePhase,
  };

  return (
    <SimContext.Provider value={{ state, actions, activePhase, clinicalObservations }}>
      {children}
    </SimContext.Provider>
  );
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSim must be used inside <SimulatorProvider>");
  return ctx;
}

