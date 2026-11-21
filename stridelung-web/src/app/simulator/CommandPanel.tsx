"use client";
// The command panel: the trolley's own display, mirrored to the hospital. Everything above the "At the trolley"
// strip is read-only and shows only what the hospital has received; when no data arrives it goes stale.
import { memo, useState, type ReactNode } from "react";
import { ConsoleModelContext, type ConsoleModelState } from "@/trolley/ConsoleTrolleyStage";
import type { FlowId } from "@/trolley/engine";
import { WaveformCanvas, type WavePoint } from "./WaveformCanvas";
import { TrolleyStrip } from "./TrolleyStrip";
import { ALARMS, BANDS, SUBSYSTEMS, tierRank, type AlarmId } from "./alerts";
import { displayTime } from "./demo";
import type { Fleet, FleetSnapshot, Point, Unit } from "./fleet";
import type { Sample } from "./trolleySim";

type Channel = { key: keyof Sample; color: string; name: string };
const TRACES: { name: string; unit: string; scale: number[]; band: { lo?: number; hi?: number }; channels: Channel[] }[] = [
  { name: "Circuit pressure", unit: "mmHg", scale: [280, 180, 80, -20, -120], band: { lo: BANDS.drain[0] }, channels: [
    { key: "pre", color: "#facc37", name: "Pre" },
    { key: "post", color: "#cba877", name: "Post" },
    { key: "drain", color: "#fb8633", name: "Drain" },
  ] },
  { name: "Circuit flow", unit: "L/min", scale: [8, 6, 4, 2, 0], band: { lo: BANDS.flow[0], hi: BANDS.flow[1] }, channels: [
    { key: "flow", color: "#51dc8d", name: "Flow" },
  ] },
  { name: "Oxygenator pressure drop", unit: "mmHg", scale: [80, 60, 40, 20, 0], band: { hi: BANDS.drop[1] }, channels: [
    { key: "drop", color: "#eeedf5", name: "ΔP" },
  ] },
];

const Trace = memo(function Trace({ trace, points, seconds }: { trace: typeof TRACES[number]; points: Point[]; seconds: number }) {
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
            label={`Simulated ${trace.name.toLowerCase()} over ${seconds} seconds, with demo limits shaded`}
            lines={trace.channels.map(({ key, color }) => ({
              color, data: points.map((p): WavePoint => ({ t: p.t, v: "gap" in p ? NaN : (p[key] as number) })),
            }))}
            timeWindow={seconds}
            yMin={trace.scale[trace.scale.length - 1]}
            yMax={trace.scale[0]}
            band={trace.band}
            showZeroLine
          />
        </div>
      </div>
    </div>
  );
});

type Tile = { name: string; value: string; unit?: string; band?: string; alarms?: AlarmId[] };

function tilesFor(unit: Unit, x: Sample): Tile[] {
  const s = unit.sim;
  return [
    { name: "Pre-oxygenator", value: x.pre.toFixed(0), unit: "mmHg" },
    { name: "Post-oxygenator", value: x.post.toFixed(0), unit: "mmHg" },
    { name: "Drainage", value: x.drain.toFixed(0), unit: "mmHg", band: `≥ ${BANDS.drain[0]}`, alarms: ["drainage"] },
    { name: "Pressure drop", value: x.drop.toFixed(0), unit: "mmHg", band: `≤ ${BANDS.drop[1]}`, alarms: ["pressureDrop"] },
    { name: "Circuit flow", value: x.flow.toFixed(2), unit: "L/min", band: `${BANDS.flow[0]}–${BANDS.flow[1]}`, alarms: ["lowFlow", "highFlow"] },
    { name: "Pump speed", value: x.speed.toFixed(0), unit: "rpm", band: "> 0", alarms: ["pumpStopped"] },
    { name: "Sweep gas delivered", value: x.sweep.toFixed(1), unit: `of ${s.settings.sweepGas.toFixed(1)} L/min`, band: "≥ 50 % of set", alarms: ["gasLow"] },
    { name: s.gasSource === "cylinder" ? "Oxygen cylinder" : "Gas source", value: s.gasSource === "cylinder" ? x.cylinder.toFixed(0) : "External", unit: s.gasSource === "cylinder" ? "%" : "hospital supply", band: s.gasSource === "cylinder" ? `≥ ${BANDS.cylinderLow} %` : undefined, alarms: ["cylinderLow"] },
    { name: "Water temperature", value: x.water.toFixed(1), unit: `°C · set ${s.settings.waterSetpoint.toFixed(1)}`, band: `± ${BANDS.waterTolerance} °C`, alarms: ["waterTemp"] },
    { name: s.powerSource === "battery" ? "Battery" : "Power", value: s.powerSource === "battery" ? x.battery.toFixed(0) : "Mains", unit: s.powerSource === "battery" ? (s.mobility ? "% · mobility session" : "% · on battery") : "", band: s.powerSource === "battery" ? `≥ ${BANDS.batteryLow} %` : undefined, alarms: ["mainsLost", "batteryLow", "batteryCritical"] },
  ];
}

export function CommandPanel({ fleet, snapshot, unitId, model }: { fleet: Fleet; snapshot: FleetSnapshot; unitId: string; model: ReactNode }) {
  const live = snapshot.units.find((u) => u.id === unitId) ?? snapshot.units[0];
  const [seconds, setSeconds] = useState(30);
  const [frozen, setFrozen] = useState<{ unitId: string; points: Point[] } | null>(null);
  const running = live.caseId !== null;
  const connected = snapshot.network && !live.sim.conditions.linkLost;
  // the hospital only knows what the trolley last reported: the mirror reads the reported view, never live state
  const view: Unit = { ...live, sim: live.reported.sim, localActive: live.reported.localActive };
  const sample = live.lastSample;
  const stale = running && !connected;
  const alarms = running ? view.localActive : [];
  const worst = [...alarms].sort((a, b) => tierRank(ALARMS[b].tier) - tierRank(ALARMS[a].tier))[0];
  const points = frozen?.unitId === live.id ? frozen.points : live.received;

  const flows: FlowId[] = [];
  if (running && sample) {
    if (sample.speed > 0) flows.push("blood");
    if (sample.sweep > 0) flows.push("gas");
    if (!view.sim.conditions.thermalFault) flows.push("water");
    flows.push("electrical");
  }
  const modelState: ConsoleModelState = {
    flows,
    blocked: running && view.sim.conditions.drainageRestriction,
    gasExternal: view.sim.gasSource === "external",
    mark: worst ? ALARMS[worst].component : null,
    alarm: alarms.some((a) => ALARMS[a].tier !== "routine"),
    stale,
    telemetry: running && sample ? {
      flow: sample.flow / 8,
      pin: (sample.drain + 120) / 130,
      pout: sample.post / 300,
      warn: alarms.some((a) => ALARMS[a].subsystem === "circuit"),
    } : null,
  };

  const hop = (name: string, state: string, tone: "ok" | "warn" | "down") => (
    <li className={`console-hop ${tone}`}><b>{name}</b><span>{state}</span></li>
  );

  return (
    <div className="device-console">
      <section className="console-path" aria-label="Where this data comes from">
        <ol>
          {hop("Trolley sensors", running ? "Measuring" : "Not running", running ? "ok" : "down")}
          {hop("Trolley computer (C19)", !running ? "Idle" : stale ? "Unknown — no data" : alarms.length ? "Alarming locally" : "Checking demo limits", !running || stale ? "down" : alarms.length ? "warn" : "ok")}
          {hop("Hospital network", !snapshot.network ? "Down" : live.sim.conditions.linkLost ? "Link lost (this unit)" : "Connected", connected ? "ok" : "down")}
          {hop("This dashboard", !running ? "—" : stale ? `No data since ${displayTime(live.lastReceivedAt)}` : "Receiving", !running ? "down" : stale ? "down" : "ok")}
        </ol>
        <p><span className="ops-chip routine">Simulated device</span> Mirrored from the trolley display. In the product these values come from the trolley’s sensors and computer; in this demo the trolley is simulated.</p>
      </section>

      <div className="console-mirror">
        <section className="console-model-card" aria-label="Trolley model">
          <ConsoleModelContext.Provider value={modelState}>{model}</ConsoleModelContext.Provider>
          <div className="console-model-alarms">
            <b>{stale ? "Last reported alarms" : "Active alarms on the trolley"}</b>
            {!running ? <p>In equipment bay · not running. Assign a case in Assignments to start this unit.</p>
              : alarms.length === 0 ? <p>No active alarm reported{stale ? " before data stopped" : ""}.</p>
              : <ul>{alarms.map((a) => <li key={a} className={ALARMS[a].tier}><span>{ALARMS[a].label}</span><small>{SUBSYSTEMS[ALARMS[a].subsystem].label} · {ALARMS[a].tier}</small></li>)}</ul>}
          </div>
        </section>

        <section className={`console-display${stale ? " stale" : ""}`} aria-label="Mirrored trolley display">
          <div className="console-display-top">
            <div><strong>{live.id}</strong><span>{live.caseId ?? "Unassigned"} · {live.location}</span></div>
            <span className={`console-status${!running || stale ? " offline" : ""}`}>
              {!running ? "Not running" : stale ? `No data since ${displayTime(live.lastReceivedAt)}` : frozen?.unitId === live.id ? "Waveforms frozen" : "Trolley display · mirrored"}
            </span>
          </div>
          {running ? <div className="console-monitor-grid">
            <div className="console-traces">{TRACES.map((trace) => <Trace key={trace.name} trace={trace} points={points} seconds={seconds} />)}</div>
            <dl className="console-readout" aria-label="Mirrored trolley readings">
              {sample && tilesFor(view, sample).map((tile) => {
                const hit = (tile.alarms ?? []).filter((a) => alarms.includes(a));
                const tone = hit.some((a) => ALARMS[a].tier === "urgent") ? "alarm" : hit.length ? "warn" : "";
                return <div key={tile.name} className={tone}>
                  <dt>{tile.name}</dt>
                  <dd>{tile.value}<small>{tile.unit}</small></dd>
                  {tile.band && <span className="console-band">Demo limit {tile.band}</span>}
                </div>;
              })}
            </dl>
          </div> : <p className="console-idle">This unit is in the equipment bay. Its display is off.</p>}
          <div className="console-display-foot">
            <span>{seconds}s window</span>
            <span>Set at trolley · {view.sim.settings.pumpDrive === "running" ? `${view.sim.settings.pumpSpeed} rpm` : "pump standby"} · sweep {view.sim.settings.sweepGas.toFixed(1)} L/min · O₂ {view.sim.settings.oxygenFraction}% · water {view.sim.settings.waterSetpoint.toFixed(1)} °C</span>
            <span>Demo limits — not clinical thresholds</span>
          </div>
        </section>
      </div>

      <div className="console-toolbar">
        <button type="button" disabled={!running} onClick={() => setFrozen(frozen?.unitId === live.id ? null : { unitId: live.id, points: live.received })}>
          {frozen?.unitId === live.id ? "Resume waveforms" : "Freeze waveforms"}
        </button>
        <div className="console-window" role="group" aria-label="Waveform time window">
          {[15, 30, 60].map((size) => <button type="button" key={size} aria-pressed={seconds === size} onClick={() => setSeconds(size)}>{size}s</button>)}
        </div>
        <span className="console-toolbar-note">Viewing controls only — the hospital cannot change trolley settings.</span>
      </div>

      <TrolleyStrip fleet={fleet} snapshot={snapshot} unit={live} />
    </div>
  );
}
