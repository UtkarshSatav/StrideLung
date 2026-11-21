"use client";

import { memo, useEffect, useState } from "react";
import { WaveformCanvas } from "@/simulator/WaveformCanvas";
import { displayTime, SCENARIOS, type Device, type Scenario } from "./demo";
import {
  BASELINE_SETTINGS, demoSample, SAMPLE_MS, seedHistory,
  type ConsoleSample, type ConsoleSettings,
} from "./consoleModel";

const TRACES = [
  { name: "Circuit pressure", unit: "mmHg", scale: [280, 180, 80, -20, -120], channels: [
    { key: "pre", color: "#facc37", name: "Pre" },
    { key: "post", color: "#cba877", name: "Post" },
    { key: "drain", color: "#fb8633", name: "Drain" },
  ] },
  { name: "Circuit flow", unit: "L/min", scale: [8, 6, 4, 2, 0], channels: [
    { key: "flow", color: "#51dc8d", name: "Flow" },
  ] },
  { name: "Oxygenator pressure drop", unit: "mmHg", scale: [80, 60, 40, 20, 0], channels: [
    { key: "drop", color: "#eeedf5", name: "ΔP" },
  ] },
] as const;

function Stepper({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void;
}) {
  const move = (direction: number) => onChange(Math.min(max, Math.max(min, Number((value + direction * step).toFixed(1)))));
  return (
    <div className="console-setting" role="group" aria-label={label}>
      <span>{label}</span>
      <div className="console-stepper">
        <button type="button" disabled={value <= min} onClick={() => move(-1)} aria-label={`Decrease ${label}`}>−</button>
        <output>{value.toFixed(step < 1 ? 1 : 0)}</output>
        <button type="button" disabled={value >= max} onClick={() => move(1)} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}

const Trace = memo(function Trace({ trace, history, seconds, offline }: {
  trace: typeof TRACES[number]; history: ConsoleSample[]; seconds: number; offline: boolean;
}) {
  return (
    <div className="console-trace">
      <div className="console-trace-heading"><b>{trace.name}</b><div className="console-legend">
        {trace.channels.length > 1 && trace.channels.map((line) => <span key={line.key}><i style={{ background: line.color }} />{line.name}</span>)}
        <span>{trace.unit}</span>
      </div></div>
      <div className="console-plot">
        <div className="console-axis" aria-hidden="true">{trace.scale.map((value) => <span key={value}>{value}</span>)}</div>
        <div className="console-canvas">
          <WaveformCanvas
            label={`Simulated ${trace.name.toLowerCase()} over ${seconds} seconds`}
            lines={offline ? [] : trace.channels.map(({ key, color }) => ({
              color, data: history.map((sample) => ({ t: sample.t, v: sample[key] })),
            }))}
            timeWindow={seconds}
            yMin={trace.scale.at(-1)}
            yMax={trace.scale[0]}
            showZeroLine
          />
          {offline && <span className="console-no-data">Signal unavailable</span>}
        </div>
      </div>
    </div>
  );
});

export function DeviceConsole({ device, settings, onSettings, onReport }: {
  device: Device;
  settings: ConsoleSettings;
  onSettings: (settings: ConsoleSettings) => void;
  onReport: (scenario: Scenario) => void;
}) {
  const [history, setHistory] = useState(() => seedHistory(settings, device.signal));
  const [frozenHistory, setFrozenHistory] = useState<ConsoleSample[] | null>(null);
  const [seconds, setSeconds] = useState(30);
  const [scenario, setScenario] = useState<Scenario>("link");
  const offline = device.signal === "link";
  const latest = history[history.length - 1];
  const elapsed = Math.floor(latest.t);

  useEffect(() => {
    if (offline) return;
    const timer = window.setInterval(() => setHistory((samples) => {
      const t = samples[samples.length - 1].t + SAMPLE_MS / 1000;
      return [...samples.slice(1), demoSample(t, settings, device.signal)];
    }), SAMPLE_MS);
    return () => window.clearInterval(timer);
  }, [settings, device.signal, offline]);

  function change<K extends keyof ConsoleSettings>(key: K, value: ConsoleSettings[K]) {
    onSettings({ ...settings, [key]: value });
  }

  function reset() {
    onSettings(BASELINE_SETTINGS);
    setHistory(seedHistory(BASELINE_SETTINGS, device.signal));
    setFrozenHistory(null);
  }

  const reading = (name: string, value: string, unit = "", tone = "") => (
    <div><dt>{name}</dt><dd className={tone}>{offline ? "—" : value}<small>{unit}</small></dd></div>
  );

  return (
    <div className="device-console">
      <section className="console-display" aria-label="Simulated telemetry monitor">
        <div className="console-display-top">
          <div><strong>{device.id}</strong><span>{device.caseId ?? "Unassigned"} · {device.location}</span></div>
          <span className={offline ? "console-status offline" : "console-status"}>{offline ? "Link interrupted" : frozenHistory ? "Waveforms frozen" : "Demo feed running"}</span>
        </div>
        <div className="console-monitor-grid">
          <div className="console-traces">{TRACES.map((trace) => <Trace key={trace.name} trace={trace} history={frozenHistory ?? history} seconds={seconds} offline={offline} />)}</div>
          <dl className="console-readout" aria-label="Simulated device readings">
            {reading("Pre-oxygenator", latest.pre.toFixed(0), "mmHg")}
            {reading("Post-oxygenator", latest.post.toFixed(0), "mmHg")}
            {reading("Drainage", latest.drain.toFixed(0), "mmHg", "orange")}
            {reading("Pressure drop", latest.drop.toFixed(0), "mmHg")}
            {reading("Circuit flow", latest.flow.toFixed(2), "L/min", "green")}
            {reading("Pump speed", latest.speed.toFixed(0), "rpm")}
            {reading("Sweep gas setpoint", settings.sweepGas.toFixed(1), "L/min")}
            {reading("Sweep oxygen setpoint", settings.oxygenFraction.toFixed(0), "%")}
            {reading("Water setpoint", settings.waterTemperature.toFixed(1), "°C")}
            {reading("Power source", device.signal === "power" ? "Reserve flagged" : settings.powerSource === "battery" ? "Battery" : "Mains")}
          </dl>
        </div>
        <div className="console-display-foot"><span>{seconds}s window</span><span>Session {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}</span><span>Last device report · {displayTime(device.updatedAt)}</span></div>
      </section>

      <div className="console-toolbar">
        <button type="button" disabled={offline} onClick={() => setFrozenHistory(frozenHistory ? null : history)}>
          {frozenHistory ? "Resume waveforms" : "Freeze waveforms"}
        </button>
        <div className="console-window" role="group" aria-label="Waveform time window">
          {[15, 30, 60].map((windowSize) =>
            <button type="button" key={windowSize} aria-pressed={seconds === windowSize} onClick={() => setSeconds(windowSize)}>{windowSize}s</button>,
          )}
        </div>
        <button type="button" onClick={reset}>Reset demo settings</button>
      </div>

      <div className="console-controls">
        <section className="console-panel">
          <div className="console-panel-head"><h2>Simulation settings</h2><p>Controls change the software demo for {device.id}.</p></div>
          <div className="console-settings">
            <Stepper label="Pump speed (rpm)" value={settings.pumpSpeed} min={0} max={5000} step={100} onChange={(value) => change("pumpSpeed", value)} />
            <Stepper label="Sweep gas (L/min)" value={settings.sweepGas} min={0} max={10} step={0.5} onChange={(value) => change("sweepGas", value)} />
            <Stepper label="Sweep oxygen (%)" value={settings.oxygenFraction} min={20} max={100} step={5} onChange={(value) => change("oxygenFraction", value)} />
            <Stepper label="Water setpoint (°C)" value={settings.waterTemperature} min={32} max={40} step={0.5} onChange={(value) => change("waterTemperature", value)} />
            <Stepper label="Demo circuit load (×)" value={settings.circuitLoad} min={1} max={3} step={0.1} onChange={(value) => change("circuitLoad", value)} />
            <label>Pump drive<select value={settings.pumpDrive} onChange={(event) => change("pumpDrive", event.target.value === "running" ? "running" : "standby")}>
              <option value="running">Running</option><option value="standby">Standby</option>
            </select></label>
            <label>Power source<select value={settings.powerSource} onChange={(event) => change("powerSource", event.target.value === "battery" ? "battery" : "mains")}>
              <option value="mains">Mains</option><option value="battery">Battery</option>
            </select></label>
          </div>
        </section>
        <section className="console-panel">
          <div className="console-panel-head"><h2>Fault scenarios</h2><p>Send a demo event to the hospital inbox with a snapshot.</p></div>
          <div className="console-scenarios">
            <label>Scenario<select value={scenario} onChange={(event) => setScenario(event.target.value as Scenario)}>
              {Object.entries(SCENARIOS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select></label>
            <button className="ops-primary" type="button" onClick={() => onReport(scenario)}>Send simulated update</button>
            {device.signal !== "status" && <button type="button" onClick={() => onReport("status")}>Restore demo signal</button>}
          </div>
        </section>
      </div>
    </div>
  );
}
