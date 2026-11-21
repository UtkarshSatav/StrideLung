import type { Scenario } from "./demo";

export type ConsoleSettings = {
  pumpSpeed: number;
  sweepGas: number;
  oxygenFraction: number;
  waterTemperature: number;
  circuitLoad: number;
  pumpDrive: "running" | "standby";
  powerSource: "mains" | "battery";
};

export const BASELINE_SETTINGS: ConsoleSettings = {
  pumpSpeed: 3000,
  sweepGas: 5,
  oxygenFraction: 100,
  waterTemperature: 37,
  circuitLoad: 1,
  pumpDrive: "running",
  powerSource: "mains",
};

export const SAMPLE_MS = 125;
export const HISTORY_LENGTH = (60 * 1000) / SAMPLE_MS + 1;

// Scripted display values for the demo. They have no calibration to a real circuit or case.
export function demoSample(t: number, settings: ConsoleSettings, signal: Scenario) {
  const speed = settings.pumpDrive === "running" ? settings.pumpSpeed : 0;
  const load = settings.circuitLoad + (signal === "circuit" ? 1 : 0);
  const wave = Math.sin(t * 3.2);
  const drift = Math.sin(t * 0.36);
  const running = speed > 0;
  const pre = running ? 55 + speed * 0.031 + load * 15 + 2 * wave + 4 * drift : 0;
  const drop = running ? (7 + speed * 0.002) * load + wave : 0;
  return {
    t,
    pre,
    post: pre - drop,
    drain: running ? -12 - speed * 0.012 + 3 * wave : 0,
    drop,
    flow: running ? (speed / 820) / load + 0.05 * wave + 0.06 * drift : 0,
    speed,
  };
}

export type ConsoleSample = ReturnType<typeof demoSample>;

export function seedHistory(settings: ConsoleSettings, signal: Scenario): ConsoleSample[] {
  return Array.from({ length: HISTORY_LENGTH }, (_, index) =>
    demoSample((index - HISTORY_LENGTH + 1) * SAMPLE_MS / 1000, settings, signal),
  );
}
