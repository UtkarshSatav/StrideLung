// Virtual StrideLung trolley — framework-free equipment-signal model for the hospital dashboard demo.
// Every reading has a cause (settings, active conditions, time), but the formulas are illustrative only:
// they are not calibrated to any real pump, oxygenator, circuit or patient. No patient physiology is modelled.

export type Settings = {
  pumpSpeed: number;
  pumpDrive: "running" | "standby";
  sweepGas: number;
  oxygenFraction: number;
  waterSetpoint: number;
};

export type Conditions = {
  drainageRestriction: boolean;
  oxygenatorCreep: boolean;
  gasFault: boolean;
  thermalFault: boolean;
  linkLost: boolean;
  serviceDue: boolean;
};

export type TrolleyState = {
  settings: Settings;
  conditions: Conditions;
  gasSource: "external" | "cylinder";
  powerSource: "mains" | "battery";
  mobility: boolean;
  waterTemp: number;
  /** where the water temperature should be if the thermal module is working (follows the setpoint with the same lag) */
  waterExpected: number;
  batteryPct: number;
  cylinderPct: number;
  oxyResistance: number;
  /** simulation clock in seconds (wall time, never demo-scaled) */
  t: number;
  /** per-unit noise phase so units don't wobble in lockstep */
  phase: number;
};

export type Sample = {
  t: number;
  pre: number;
  post: number;
  drain: number;
  drop: number;
  flow: number;
  speed: number;
  sweep: number;
  water: number;
  battery: number;
  cylinder: number;
};

export const BASELINE_SETTINGS: Settings = { pumpSpeed: 3000, pumpDrive: "running", sweepGas: 5, oxygenFraction: 100, waterSetpoint: 37 };

export const NO_CONDITIONS: Conditions = {
  drainageRestriction: false, oxygenatorCreep: false, gasFault: false, thermalFault: false, linkLost: false, serviceDue: false,
};

const ROOM_TEMP = 24;
const WATER_TAU_S = 20;
const OXY_CREEP_PER_S = 0.02;
const OXY_MAX = 3.5;

export function createTrolley(phase: number): TrolleyState {
  return {
    settings: { ...BASELINE_SETTINGS },
    conditions: { ...NO_CONDITIONS },
    gasSource: "external",
    powerSource: "mains",
    mobility: false,
    waterTemp: BASELINE_SETTINGS.waterSetpoint,
    waterExpected: BASELINE_SETTINGS.waterSetpoint,
    batteryPct: 100,
    cylinderPct: 100,
    oxyResistance: 1,
    t: 0,
    phase,
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const pumpSpeedOf = (s: TrolleyState) => (s.settings.pumpDrive === "running" ? s.settings.pumpSpeed : 0);
const sweepOf = (s: TrolleyState) =>
  s.conditions.gasFault || (s.gasSource === "cylinder" && s.cylinderPct <= 0) ? 0 : s.settings.sweepGas;

/** Advance one step. `dt` is wall seconds; `speed` (1 or 10) scales only the slow variables. */
export function stepTrolley(s: TrolleyState, dt: number, speed: number): TrolleyState {
  const slow = dt * speed;
  const pump = pumpSpeedOf(s);
  const target = s.conditions.thermalFault ? ROOM_TEMP : s.settings.waterSetpoint;
  return {
    ...s,
    settings: { ...s.settings },
    conditions: { ...s.conditions },
    t: s.t + dt,
    waterTemp: target + (s.waterTemp - target) * Math.exp(-slow / WATER_TAU_S),
    waterExpected: s.settings.waterSetpoint + (s.waterExpected - s.settings.waterSetpoint) * Math.exp(-slow / WATER_TAU_S),
    oxyResistance: s.conditions.oxygenatorCreep ? Math.min(OXY_MAX, s.oxyResistance + OXY_CREEP_PER_S * slow) : s.oxyResistance,
    batteryPct: s.powerSource === "battery" ? clamp(s.batteryPct - (0.04 + 0.00002 * pump) * slow, 0, 100) : s.batteryPct,
    cylinderPct: s.gasSource === "cylinder" ? clamp(s.cylinderPct - 0.02 * sweepOf(s) * slow, 0, 100) : s.cylinderPct,
  };
}

export function sampleOf(s: TrolleyState): Sample {
  const speed = pumpSpeedOf(s);
  const running = speed > 0;
  const restriction = s.conditions.drainageRestriction ? 1 : 0;
  const wave = Math.sin(s.t * 3.2 + s.phase);
  const drift = Math.sin(s.t * 0.36 + s.phase * 2);
  const flow = running ? speed / 700 / (1 + 1.4 * restriction + 0.15 * (s.oxyResistance - 1)) + 0.05 * wave + 0.06 * drift : 0;
  const drop = running ? flow * s.oxyResistance * 6 + 1.5 * wave : 0;
  const post = running ? 100 + 14 * flow + 2 * drift : 0;
  return {
    t: s.t,
    pre: post + drop,
    post,
    drain: running ? -0.012 * speed * (1 + 1.7 * restriction) + 2 * wave + drift : 0,
    drop,
    flow,
    speed,
    sweep: sweepOf(s),
    water: s.waterTemp,
    battery: s.batteryPct,
    cylinder: s.cylinderPct,
  };
}
