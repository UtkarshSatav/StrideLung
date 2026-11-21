// StrideLung ECMO Simulator Engine
// Pure TypeScript, framework-free. Separated from UI.
// All models are simplified, deterministic, and educational — not clinically validated.
// SOFTWARE SIMULATION ONLY — NOT CONNECTED TO MEDICAL HARDWARE.

export type ECMOMode = "VV" | "VA";
export type PumpState = "running" | "stopped" | "standby";
export type DriveState = "active" | "inactive";
export type GasSupplyState = "online" | "offline" | "external";
export type OxygenatorStatus = "normal" | "degraded" | "failed";
export type ThermalState = "heating" | "cooling" | "maintaining" | "off";
export type PowerSource = "mains" | "battery";
export type AlarmSeverity = "info" | "warning" | "critical";

export interface SimInputs {
  pumpRPM: number;           // 0–5000 RPM
  circuitResistance: number; // 0.5–3.0 arbitrary units
  sweepGasFlow: number;      // 0–10 L/min
  fdO2: number;              // 0.21–1.0 fraction
  oxygenatorResistance: number; // 1.0–5.0 arbitrary units (represents fouling/clotting)
  thermalTarget: number;     // 32–40 °C (target water circuit temp)
  nativeCardiacOutput: number; // 0–5 L/min
  haemoglobin: number;       // 6–16 g/dL
  oxygenDemand: number;      // 50–400 mL/min (illustrative)
  recirculationFraction: number; // 0–0.5
  nativeLungContrib: number; // 0–1.0 fraction
  ecmoMode: ECMOMode;
  pumpState: PumpState;
  thermalState: ThermalState;
  gasSupplyState: GasSupplyState;
}

export interface SimOutputs {
  // Blood circuit
  bloodFlow: number;         // L/min
  drainagePressure: number;  // mmHg (pre-pump, usually negative)
  preOxyPressure: number;    // mmHg
  postOxyPressure: number;   // mmHg
  deltaP: number;            // mmHg (preOxy - postOxy)
  pumpRPMActual: number;     // rpm (with noise)

  // Gas circuit
  sweepFlowActual: number;   // L/min
  fdO2Actual: number;
  co2RemovalIndex: number;   // 0–1 illustrative indicator
  o2TransferIndex: number;   // 0–1 illustrative indicator

  // Thermal
  waterTemp: number;         // °C
  bloodTempEstimate: number; // °C (simulated, lags waterTemp)

  // Power
  batteryPct: number;        // 0–100
  estimatedRuntime: number;  // minutes
  powerSource: PowerSource;

  // Oxygenator
  oxygenatorStatus: OxygenatorStatus;
  membranePerformance: number; // 0–1

  // Systemic (illustrative educational model)
  systolicO2Delivery: number; // mL/min illustrative
  recircFraction: number;

  // Clock
  sessionSeconds: number;
}

export interface AlarmEvent {
  id: string;
  timestamp: number; // seconds since session start
  severity: AlarmSeverity;
  subsystem: string;
  name: string;
  description: string;
  acknowledged: boolean;
}

export type WaveformBuffer = { t: number; v: number }[];

export interface WaveformState {
  flow: WaveformBuffer;
  drainageP: WaveformBuffer;
  preOxyP: WaveformBuffer;
  postOxyP: WaveformBuffer;
  deltaP: WaveformBuffer;
}

export interface SimState {
  inputs: SimInputs;
  outputs: SimOutputs;
  alarms: AlarmEvent[];
  waveforms: WaveformState;
  running: boolean;
  paused: boolean;
  speed: number; // 1 = normal, 2 = fast, 0.5 = slow
}

// ─── Default initial inputs ───────────────────────────────────────────────────
export const DEFAULT_INPUTS: SimInputs = {
  pumpRPM: 3000,
  circuitResistance: 1.0,
  sweepGasFlow: 5.0,
  fdO2: 1.0,
  oxygenatorResistance: 1.0,
  thermalTarget: 37.0,
  nativeCardiacOutput: 2.0,
  haemoglobin: 10.0,
  oxygenDemand: 200,
  recirculationFraction: 0.1,
  nativeLungContrib: 0.2,
  ecmoMode: "VV",
  pumpState: "running",
  thermalState: "maintaining",
  gasSupplyState: "online",
};

// ─── Simulation math ─────────────────────────────────────────────────────────
// All equations are simplified and purely illustrative for educational demonstration.

/** Blood flow from pump RPM and resistance.
 *  Simplified linear model: flow = k * rpm / (circuitResistance * oxygenatorResistance)
 *  k chosen so 3000 RPM at R=1 gives ~4 L/min nominal.
 */
function calcBloodFlow(inputs: SimInputs): number {
  if (inputs.pumpState !== "running") return 0;
  const k = 0.00133; // L/min per RPM at unit resistance
  const raw = k * inputs.pumpRPM / (inputs.circuitResistance * Math.sqrt(inputs.oxygenatorResistance));
  return Math.max(0, Math.min(8, raw));
}

/** Circuit pressures — illustrative model */
function calcPressures(inputs: SimInputs, flow: number): { drainage: number; preOxy: number; postOxy: number } {
  if (flow === 0) return { drainage: 0, preOxy: 0, postOxy: 0 };
  // Drainage is typically negative (suction side)
  const drainage = -(30 + 25 * flow * inputs.circuitResistance);
  // Pre-oxy pressure: pump head pressure - resistance drop from drainage to pump
  const preOxy = 150 + 60 * flow * inputs.oxygenatorResistance;
  // Post-oxy is lower
  const postOxy = preOxy - (20 + 15 * flow * inputs.oxygenatorResistance);
  return { drainage, preOxy, postOxy };
}

/** CO₂ removal index (0–1): primarily sweep-flow driven */
function calcCO2Removal(inputs: SimInputs, flow: number): number {
  if (inputs.gasSupplyState === "offline") return 0;
  if (flow === 0) return 0;
  const sweepEff = Math.min(1, inputs.sweepGasFlow / (3 + 2 * flow)); // diminishing returns
  const oxyEff = 1 / inputs.oxygenatorResistance;
  return Math.min(1, sweepEff * oxyEff);
}

/** O₂ transfer index (0–1): depends on flow, FdO₂ and oxygenator health */
function calcO2Transfer(inputs: SimInputs, flow: number): number {
  if (inputs.gasSupplyState === "offline") return 0;
  if (flow === 0) return 0;
  const oxyEff = 1 / inputs.oxygenatorResistance;
  return Math.min(1, inputs.fdO2 * oxyEff * Math.min(1, flow / 2));
}

/** Membrane performance: degrades as oxygenatorResistance increases */
function calcMembranePerformance(inputs: SimInputs): number {
  return Math.max(0, Math.min(1, 1 - (inputs.oxygenatorResistance - 1) / 4));
}

/** Oxygenator status from resistance */
function calcOxygenatorStatus(inputs: SimInputs): OxygenatorStatus {
  if (inputs.oxygenatorResistance >= 4) return "failed";
  if (inputs.oxygenatorResistance >= 2.5) return "degraded";
  return "normal";
}

/** Illustrative systemic O2 delivery (mL/min) */
function calcO2Delivery(inputs: SimInputs, flow: number, o2Transfer: number): number {
  // O2 delivery = (ECMO contribution + native lung contribution) × Hb × SaO2 × 1.34 (simplified)
  const ecmoContrib = flow * o2Transfer * 0.9; // illustrative
  const nativeContrib = inputs.nativeCardiacOutput * inputs.nativeLungContrib;
  const effectiveFlow = (ecmoContrib + nativeContrib) * (1 - inputs.recirculationFraction);
  return Math.round(effectiveFlow * inputs.haemoglobin * 134); // very rough illustrative figure
}

/** Water temp moves toward target */
function stepWaterTemp(currentTemp: number, target: number, thermalState: ThermalState, dt: number): number {
  if (thermalState === "off") return currentTemp;
  const rate = 0.3; // °C/second (illustrative)
  const delta = (target - currentTemp) * rate * dt;
  return currentTemp + delta;
}

/** Blood temp lags water temp */
function stepBloodTemp(bloodTemp: number, waterTemp: number, dt: number): number {
  const lagRate = 0.1;
  return bloodTemp + (waterTemp - bloodTemp) * lagRate * dt;
}

// ─── Waveform noise/oscillation ───────────────────────────────────────────────
function waveNoise(t: number, amplitude: number, freq: number, phase = 0): number {
  return amplitude * Math.sin(2 * Math.PI * freq * t + phase)
       + (amplitude * 0.3) * Math.sin(2 * Math.PI * freq * 2.4 * t + phase * 1.3)
       + (amplitude * 0.1) * (Math.random() - 0.5);
}

// ─── Alarm evaluation ─────────────────────────────────────────────────────────
function evaluateAlarms(inputs: SimInputs, outputs: SimOutputs, sessionSeconds: number, existing: AlarmEvent[]): AlarmEvent[] {
  const alarms = [...existing];
  const push = (severity: AlarmSeverity, subsystem: string, name: string, description: string) => {
    const id = `${subsystem}-${name}`.replace(/\s/g, "-").toLowerCase();
    if (!alarms.some(a => a.id === id && !a.acknowledged)) {
      alarms.push({ id, timestamp: sessionSeconds, severity, subsystem, name, description, acknowledged: false });
    }
  };
  const clear = (id: string) => {
    const idx = alarms.findIndex(a => a.id === id);
    if (idx !== -1) alarms.splice(idx, 1);
  };

  // Flow too low
  if (outputs.bloodFlow < 1.5 && inputs.pumpState === "running") {
    push("warning", "Blood Circuit", "Low Circuit Flow", `Blood flow ${outputs.bloodFlow.toFixed(2)} L/min below 1.5 L/min threshold. Check circuit and patient.`);
  } else {
    clear("blood-circuit-low-circuit-flow");
  }

  // Drainage pressure very negative
  if (outputs.drainagePressure < -180) {
    push("warning", "Blood Circuit", "Excessive Suction", `Drainage pressure ${outputs.drainagePressure.toFixed(0)} mmHg. Risk of line chattering.`);
  } else {
    clear("blood-circuit-excessive-suction");
  }

  // High ΔP
  if (outputs.deltaP > 80 && inputs.pumpState === "running") {
    push("warning", "Oxygenator", "High Oxygenator ΔP", `Pressure drop ${outputs.deltaP.toFixed(0)} mmHg. Check for membrane fouling.`);
  } else {
    clear("oxygenator-high-oxygenator-δp");
  }

  // Gas supply offline
  if (inputs.gasSupplyState === "offline") {
    push("critical", "Gas Circuit", "Gas Supply Interrupted", "Sweep gas is offline. Oxygenator gas exchange suspended.");
  } else {
    clear("gas-circuit-gas-supply-interrupted");
  }

  // Oxygenator degraded/failed
  if (outputs.oxygenatorStatus === "failed") {
    push("critical", "Oxygenator", "Oxygenator Failed", "Membrane resistance critically high. Oxygenator may be severely fouled.");
  } else if (outputs.oxygenatorStatus === "degraded") {
    push("warning", "Oxygenator", "Oxygenator Degraded", "Membrane performance reduced. Consider escalation.");
  } else {
    clear("oxygenator-oxygenator-failed");
    clear("oxygenator-oxygenator-degraded");
  }

  // Temperature deviation
  if (Math.abs(outputs.waterTemp - inputs.thermalTarget) > 3) {
    push("warning", "Thermal", "Temperature Deviation", `Water temp ${outputs.waterTemp.toFixed(1)}°C deviates >3°C from target ${inputs.thermalTarget}°C.`);
  } else {
    clear("thermal-temperature-deviation");
  }

  // Battery low
  if (outputs.batteryPct < 20 && outputs.powerSource === "battery") {
    push("warning", "Power", "Low Battery", `Battery at ${outputs.batteryPct.toFixed(0)}%. Estimated ${outputs.estimatedRuntime.toFixed(0)} min remaining.`);
  } else {
    clear("power-low-battery");
  }

  if (outputs.batteryPct < 10 && outputs.powerSource === "battery") {
    push("critical", "Power", "Critical Battery", `Battery critically low at ${outputs.batteryPct.toFixed(0)}%. Connect mains power immediately.`);
  } else {
    clear("power-critical-battery");
  }

  // Pump stopped while session running
  if (inputs.pumpState === "stopped") {
    push("critical", "Blood Circuit", "Pump Stopped", "Pump is not running. Blood circulation is suspended.");
  } else {
    clear("blood-circuit-pump-stopped");
  }

  return alarms;
}

// ─── Engine class ─────────────────────────────────────────────────────────────
const WAVEFORM_WINDOW = 60;    // seconds of history
const WAVEFORM_HZ = 10;        // samples per second
const MAX_BUFFER = WAVEFORM_WINDOW * WAVEFORM_HZ;

export type SimListener = (state: SimState) => void;

export class SimulatorEngine {
  private state: SimState;
  private listeners: Set<SimListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastTick = 0;
  private sampleAccum = 0;
  private clinicalPhase: "live" | "intraoperative" | "icu_arrival" | "postoperative" = "live";

  constructor() {
    const inputs = { ...DEFAULT_INPUTS };
    const outputs = this.compute(inputs, 0);
    this.state = {
      inputs,
      outputs,
      alarms: [],
      waveforms: { flow: [], drainageP: [], preOxyP: [], postOxyP: [], deltaP: [] },
      running: true,
      paused: false,
      speed: 1,
    };
  }

  setClinicalPhase(phase: "live" | "intraoperative" | "icu_arrival" | "postoperative") {
    this.clinicalPhase = phase;
    if (!this.state.running) {
      this.start();
    }
    this.notify();
  }

  getClinicalPhase() {
    return this.clinicalPhase;
  }

  private compute(inputs: SimInputs, sessionSec: number, prevOutputs?: SimOutputs): SimOutputs {
    const flow = calcBloodFlow(inputs);
    const pressures = calcPressures(inputs, flow);
    const co2Removal = calcCO2Removal(inputs, flow);
    const o2Transfer = calcO2Transfer(inputs, flow);
    const memPerf = calcMembranePerformance(inputs);
    const oxyStatus = calcOxygenatorStatus(inputs);
    const o2Delivery = calcO2Delivery(inputs, flow, o2Transfer);

    const prevWater = prevOutputs?.waterTemp ?? inputs.thermalTarget;
    const prevBlood = prevOutputs?.bloodTempEstimate ?? 36.5;
    const dt = 0.1;
    const waterTemp = stepWaterTemp(prevWater, inputs.thermalTarget, inputs.thermalState, dt);
    const bloodTemp = stepBloodTemp(prevBlood, waterTemp, dt);

    const prevBattery = prevOutputs?.batteryPct ?? 100;
    const prevSource = prevOutputs?.powerSource ?? "mains";
    // Battery drains if on battery, recharges on mains
    const batteryPct = prevSource === "battery"
      ? Math.max(0, prevBattery - 0.001) // slow drain for demo
      : Math.min(100, prevBattery + 0.002);
    const powerSource: PowerSource = prevSource; // set by user action
    const estimatedRuntime = batteryPct * 1.2; // rough minutes

    return {
      bloodFlow: flow,
      drainagePressure: pressures.drainage,
      preOxyPressure: pressures.preOxy,
      postOxyPressure: pressures.postOxy,
      deltaP: pressures.preOxy - pressures.postOxy,
      pumpRPMActual: inputs.pumpState === "running" ? inputs.pumpRPM : 0,
      sweepFlowActual: inputs.gasSupplyState !== "offline" ? inputs.sweepGasFlow : 0,
      fdO2Actual: inputs.fdO2,
      co2RemovalIndex: co2Removal,
      o2TransferIndex: o2Transfer,
      waterTemp,
      bloodTempEstimate: bloodTemp,
      batteryPct,
      estimatedRuntime,
      powerSource,
      oxygenatorStatus: oxyStatus,
      membranePerformance: memPerf,
      systolicO2Delivery: o2Delivery,
      recircFraction: inputs.recirculationFraction,
      sessionSeconds: sessionSec,
    };
  }

  private tick = () => {
    if (this.state.paused || !this.state.running) return;
    const now = Date.now();
    const rawDt = this.lastTick ? (now - this.lastTick) / 1000 : 0.05;
    this.lastTick = now;
    const dt = Math.min(rawDt, 0.1) * this.state.speed;

    const newSessionSec = this.state.outputs.sessionSeconds + dt;
    const newOutputs = this.compute(this.state.inputs, newSessionSec, this.state.outputs);
    const t = newSessionSec;

    // Add waveform noise/oscillation driven by live inputs or real clinical dataset
    let baseFlow = newOutputs.bloodFlow;
    let baseDrain = newOutputs.drainagePressure;
    let basePreOxy = newOutputs.preOxyPressure;
    let basePostOxy = newOutputs.postOxyPressure;

    if (this.clinicalPhase === "intraoperative") {
      // Intraoperative range from Alwardt et al. (2022): Flow 3.2–3.9 L/min, Ppre 140–167 mmHg, Ppost 124–149 mmHg, ΔP 16–19 mmHg
      baseFlow = 3.55 + 0.35 * Math.sin(t * 0.15);
      basePreOxy = 153.5 + 13.5 * Math.sin(t * 0.15 + 0.2);
      basePostOxy = 136.5 + 12.5 * Math.sin(t * 0.15 + 0.2);
      baseDrain = -48;
      newOutputs.bloodFlow = baseFlow;
      newOutputs.preOxyPressure = basePreOxy;
      newOutputs.postOxyPressure = basePostOxy;
      newOutputs.deltaP = basePreOxy - basePostOxy;
      newOutputs.pumpRPMActual = 4800 + 200 * Math.sin(t * 0.15);
      newOutputs.sweepFlowActual = 2.5 + 0.5 * Math.sin(t * 0.1);
      newOutputs.fdO2Actual = 0.85 + 0.15 * Math.sin(t * 0.1);
      newOutputs.bloodTempEstimate = 36.6 + 0.5 * Math.sin(t * 0.08);
    } else if (this.clinicalPhase === "icu_arrival") {
      // ICU Arrival point measurements: Flow 3.2 L/min, Ppre 151 mmHg, Ppost 133 mmHg, ΔP 18 mmHg
      baseFlow = 3.2;
      basePreOxy = 151;
      basePostOxy = 133;
      baseDrain = -46;
      newOutputs.bloodFlow = 3.2;
      newOutputs.preOxyPressure = 151;
      newOutputs.postOxyPressure = 133;
      newOutputs.deltaP = 18;
      newOutputs.pumpRPMActual = 4700;
      newOutputs.sweepFlowActual = 3.0;
      newOutputs.fdO2Actual = 1.0;
      newOutputs.bloodTempEstimate = 36.6;
    } else if (this.clinicalPhase === "postoperative") {
      // Postoperative range: Flow 3.1–3.4 L/min, Ppre 140–157 mmHg, Ppost 124–141 mmHg, ΔP 13–19 mmHg
      baseFlow = 3.25 + 0.15 * Math.sin(t * 0.12);
      basePreOxy = 148.5 + 8.5 * Math.sin(t * 0.12 + 0.3);
      basePostOxy = 132.5 + 8.5 * Math.sin(t * 0.12 + 0.3);
      baseDrain = -44;
      newOutputs.bloodFlow = baseFlow;
      newOutputs.preOxyPressure = basePreOxy;
      newOutputs.postOxyPressure = basePostOxy;
      newOutputs.deltaP = basePreOxy - basePostOxy;
      newOutputs.pumpRPMActual = 4700;
      newOutputs.sweepFlowActual = 3.0 + 2.0 * Math.sin(t * 0.1);
      newOutputs.fdO2Actual = 0.60 + 0.39 * Math.sin(t * 0.1);
      newOutputs.bloodTempEstimate = 36.35 + 0.25 * Math.sin(t * 0.08);
    }

    const noiseFlow    = baseFlow    + waveNoise(t, 0.04, 1.1, 0);
    const noiseDrain   = baseDrain   + waveNoise(t, 3.0,  1.1, 0.5);
    const noisePreOxy  = basePreOxy  + waveNoise(t, 2.0,  1.1, 1.0);
    const noisePostOxy = basePostOxy + waveNoise(t, 1.5,  1.1, 1.5);
    const noiseDeltaP  = noisePreOxy - noisePostOxy;

    this.sampleAccum += dt;
    const newWaveforms = this.state.waveforms;
    if (this.sampleAccum >= 1 / WAVEFORM_HZ) {
      this.sampleAccum = 0;
      const push = (buf: WaveformBuffer, v: number) => {
        const next = [...buf, { t, v }];
        return next.length > MAX_BUFFER ? next.slice(next.length - MAX_BUFFER) : next;
      };
      newWaveforms.flow     = push(newWaveforms.flow,     noiseFlow);
      newWaveforms.drainageP = push(newWaveforms.drainageP, noiseDrain);
      newWaveforms.preOxyP  = push(newWaveforms.preOxyP,  noisePreOxy);
      newWaveforms.postOxyP = push(newWaveforms.postOxyP, noisePostOxy);
      newWaveforms.deltaP   = push(newWaveforms.deltaP,   noiseDeltaP);
    }

    const alarms = evaluateAlarms(this.state.inputs, newOutputs, newSessionSec, this.state.alarms);

    this.state = {
      ...this.state,
      outputs: newOutputs,
      waveforms: newWaveforms,
      alarms,
    };
    this.notify();
  };

  private notify() {
    const snap = this.getState();
    for (const l of this.listeners) l(snap);
  }

  getState(): SimState {
    return {
      ...this.state,
      inputs: { ...this.state.inputs },
      outputs: { ...this.state.outputs },
      alarms: this.state.alarms.map(a => ({ ...a })),
      waveforms: {
        flow: [...this.state.waveforms.flow],
        drainageP: [...this.state.waveforms.drainageP],
        preOxyP: [...this.state.waveforms.preOxyP],
        postOxyP: [...this.state.waveforms.postOxyP],
        deltaP: [...this.state.waveforms.deltaP],
      },
    };
  }

  subscribe(listener: SimListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  start() {
    if (this.intervalId) return;
    this.state.running = true;
    this.state.paused = false;
    this.lastTick = Date.now();
    this.intervalId = setInterval(this.tick, 50); // 20 Hz
    this.notify();
  }

  pause() {
    this.state.paused = true;
    this.notify();
  }

  resume() {
    this.state.paused = false;
    this.lastTick = Date.now();
    this.notify();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state.running = false;
    this.state.paused = false;
    this.notify();
  }

  reset() {
    this.stop();
    const inputs = { ...DEFAULT_INPUTS };
    const outputs = this.compute(inputs, 0);
    this.state = {
      inputs,
      outputs,
      alarms: [],
      waveforms: { flow: [], drainageP: [], preOxyP: [], postOxyP: [], deltaP: [] },
      running: false,
      paused: false,
      speed: 1,
    };
    this.notify();
  }

  setInput<K extends keyof SimInputs>(key: K, value: SimInputs[K]) {
    this.state.inputs = { ...this.state.inputs, [key]: value };
    // Recompute outputs immediately for UI responsiveness
    this.state.outputs = this.compute(this.state.inputs, this.state.outputs.sessionSeconds, this.state.outputs);
    this.notify();
  }

  setInputs(partial: Partial<SimInputs>) {
    this.state.inputs = { ...this.state.inputs, ...partial };
    this.state.outputs = this.compute(this.state.inputs, this.state.outputs.sessionSeconds, this.state.outputs);
    this.notify();
  }

  setSpeed(speed: number) {
    this.state.speed = Math.max(0.25, Math.min(4, speed));
    this.notify();
  }

  setPowerSource(source: PowerSource) {
    this.state.outputs = { ...this.state.outputs, powerSource: source };
    this.notify();
  }

  acknowledgeAlarm(id: string) {
    this.state.alarms = this.state.alarms.map(a =>
      a.id === id ? { ...a, acknowledged: true } : a
    );
    this.notify();
  }

  clearAcknowledgedAlarms() {
    this.state.alarms = this.state.alarms.filter(a => !a.acknowledged);
    this.notify();
  }

  setTimeWindow(seconds: number) {
    // No-op hook for UI — window is managed in component
  }
}

// Singleton shared across the simulator route
let _engine: SimulatorEngine | null = null;
export function getSimulatorEngine(): SimulatorEngine {
  if (!_engine) _engine = new SimulatorEngine();
  return _engine;
}

