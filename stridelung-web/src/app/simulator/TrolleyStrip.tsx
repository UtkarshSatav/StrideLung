"use client";
// "At the trolley (demo)": stands in for staff at the bedside. These controls change the simulated trolley itself;
// they are deliberately outside the mirrored display, because the hospital view can never change trolley settings.
import { ALARMS, SUBSYSTEMS } from "./alerts";
import type { Fleet, FleetSnapshot, TrolleyAction, Unit } from "./fleet";
import type { Settings } from "./trolleySim";

function Stepper({ label, value, min, max, step, disabled, onChange }: {
  label: string; value: number; min: number; max: number; step: number; disabled: boolean; onChange: (value: number) => void;
}) {
  const move = (direction: number) => onChange(Math.min(max, Math.max(min, Number((value + direction * step).toFixed(1)))));
  return (
    <div className="console-setting" role="group" aria-label={label}>
      <span>{label}</span>
      <div className="console-stepper">
        <button type="button" disabled={disabled || value <= min} onClick={() => move(-1)} aria-label={`Decrease ${label}`}>−</button>
        <output>{value.toFixed(step < 1 ? 1 : 0)}</output>
        <button type="button" disabled={disabled || value >= max} onClick={() => move(1)} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}

const SCENARIOS: { action: TrolleyAction; label: string; on: (u: Unit) => boolean; hint: string }[] = [
  { action: "restriction", label: "Drainage line restriction", on: (u) => u.sim.conditions.drainageRestriction, hint: "Fast · blood circuit" },
  { action: "oxygenator", label: "Oxygenator resistance rising", on: (u) => u.sim.conditions.oxygenatorCreep, hint: "Slow · use 10× to speed up" },
  { action: "gasFault", label: "Gas supply interrupted", on: (u) => u.sim.conditions.gasFault, hint: "Fast · gas" },
  { action: "mainsUnplugged", label: "Mains unplugged", on: (u) => u.sim.powerSource === "battery" && !u.sim.mobility, hint: "Battery drains" },
  { action: "thermalFault", label: "Thermal module fault", on: (u) => u.sim.conditions.thermalFault, hint: "Water drifts from setpoint" },
  { action: "standby", label: "Pump to standby", on: (u) => u.sim.settings.pumpDrive === "standby", hint: "Flow stops" },
  { action: "linkLost", label: "Telemetry link lost", on: (u) => u.sim.conditions.linkLost, hint: "This unit only" },
  { action: "service", label: "Service reminder", on: (u) => u.sim.conditions.serviceDue, hint: "Routine" },
];

export function TrolleyStrip({ fleet, snapshot, unit }: { fleet: Fleet; snapshot: FleetSnapshot; unit: Unit }) {
  const running = unit.caseId !== null;
  const s = unit.sim.settings;
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => fleet.setSettings(unit.id, { ...s, [key]: value });
  const outbox = snapshot.incidents.filter((e) => e.deviceId === unit.id && !e.hospitalSide && e.deliveredAt === undefined);

  return (
    <section className="trolley-strip" aria-label="At the trolley (demo)">
      <header className="trolley-strip-head">
        <div><h2>At the trolley (demo)</h2><p>Stands in for staff at the bedside of {unit.id}. These controls change the simulated trolley, not the hospital view.</p></div>
        <div className="trolley-strip-global">
          <label className="trolley-toggle"><input type="checkbox" checked={snapshot.network} onChange={(e) => fleet.setNetwork(e.target.checked)} /> Hospital network up <small>(whole fleet)</small></label>
          <div className="console-window" role="group" aria-label="Demo time">
            {([1, 10] as const).map((v) => <button key={v} type="button" aria-pressed={snapshot.speed === v} onClick={() => fleet.setSpeed(v)}>{v === 1 ? "Real time" : "Demo time ×10"}</button>)}
          </div>
        </div>
      </header>

      <div className={`trolley-local${unit.localActive.length ? " alarming" : ""}`} role="status" aria-live="polite">
        <span><b>Trolley alarming locally:</b> {!running ? "unit not running" : unit.localActive.length
          ? unit.localActive.map((a) => `${SUBSYSTEMS[ALARMS[a].subsystem].label} — ${ALARMS[a].label.toLowerCase()}`).join(" · ")
          : "no"}</span>
        <span><b>Trolley outbox:</b> {outbox.length === 0 ? "nothing waiting to send" : `${outbox.length} alert${outbox.length > 1 ? "s" : ""} waiting to send`}</span>
      </div>

      {!running ? <p className="trolley-idle">Assign a case to {unit.id} in Assignments to start this unit.</p> : <div className="console-controls">
        <section className="console-panel">
          <div className="console-panel-head"><h3>Settings at the trolley</h3><p>Changes here flow through the trolley’s calculations to the mirrored display.</p></div>
          <div className="console-settings">
            <Stepper label="Pump speed (rpm)" value={s.pumpSpeed} min={500} max={5000} step={100} disabled={false} onChange={(v) => set("pumpSpeed", v)} />
            <Stepper label="Sweep gas (L/min)" value={s.sweepGas} min={0} max={10} step={0.5} disabled={false} onChange={(v) => set("sweepGas", v)} />
            <Stepper label="Sweep oxygen (%)" value={s.oxygenFraction} min={21} max={100} step={1} disabled={false} onChange={(v) => set("oxygenFraction", v)} />
            <Stepper label="Water setpoint (°C)" value={s.waterSetpoint} min={33} max={39} step={0.5} disabled={false} onChange={(v) => set("waterSetpoint", v)} />
            <label>Pump drive<select value={s.pumpDrive} onChange={(e) => set("pumpDrive", e.target.value === "standby" ? "standby" : "running")}>
              <option value="running">Running</option><option value="standby">Standby</option>
            </select></label>
            <div className="trolley-supply">
              <span>Supply · {unit.sim.gasSource === "cylinder" ? "onboard cylinder" : "hospital gas"} · {unit.sim.powerSource === "battery" ? "battery" : "mains"}</span>
              <div>
                {unit.sim.mobility
                  ? <button type="button" onClick={() => fleet.act(unit.id, "endMobility")}>End mobility session</button>
                  : <button type="button" onClick={() => fleet.act(unit.id, "startMobility")}>Start mobility session</button>}
                {unit.sim.powerSource === "battery" && !unit.sim.mobility && <button type="button" onClick={() => fleet.act(unit.id, "plugIn")}>Plug in mains</button>}
                {unit.sim.gasSource === "cylinder" && <button type="button" onClick={() => fleet.act(unit.id, "swapCylinder")}>Swap cylinder</button>}
              </div>
            </div>
          </div>
        </section>
        <section className="console-panel">
          <div className="console-panel-head"><h3>Scenarios</h3><p>Each changes the trolley’s physical conditions. The trolley’s own checks decide whether an alert follows.</p></div>
          <div className="trolley-scenarios">
            {SCENARIOS.map((sc) => <button key={sc.action} type="button" aria-pressed={sc.on(unit)} onClick={() => fleet.act(unit.id, sc.action)}>
              <span>{sc.label}</span><small>{sc.hint}</small>
            </button>)}
            <button type="button" className="ops-primary" onClick={() => fleet.act(unit.id, "restore")}><span>Restore normal</span><small>Clears faults · levels stay</small></button>
          </div>
        </section>
      </div>}
    </section>
  );
}
