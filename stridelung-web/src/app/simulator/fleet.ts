// The simulated StrideLung fleet: steps every running trolley, runs each trolley's alarm checks, and carries the
// resulting incidents to the hospital dashboard with delivery state. Framework-free; React subscribes via
// useSyncExternalStore. Nothing goes wrong unless the presenter triggers it — there is no fault scheduler.
import { createTrolley, stepTrolley, sampleOf, NO_CONDITIONS, type Sample, type Settings, type TrolleyState } from "./trolleySim.ts";
import {
  ALARMS, STALE_MS, trackAlarms, applyAlarmChanges, syncIncidents, acknowledge, closeIncident, stopUnitIncidents,
  type AlarmId, type Incident, type Tracker,
} from "./alerts.ts";

export const SAMPLE_MS = 125;
export const HISTORY_LENGTH = (60 * 1000) / SAMPLE_MS + 1;

export type Point = Sample | { t: number; gap: true };
export type Unit = {
  id: string;
  caseId: string | null;
  location: string;
  sim: TrolleyState;
  trackers: Partial<Record<AlarmId, Tracker>>;
  /** what the hospital has received: samples, or gap markers while no data arrives */
  received: Point[];
  lastReceivedAt: number | null;
  /** the last sample the hospital received */
  lastSample: Sample | null;
  /** alarms active on the trolley itself (sounding locally, whether or not the hospital hears) */
  localActive: AlarmId[];
  /** the trolley state as last reported to the hospital — the mirror reads only this */
  reported: { localActive: AlarmId[]; sim: TrolleyState };
  noDataActive: boolean;
};
/** device id used for the single incident raised when the hospital network is down for the whole fleet */
export const FLEET_ID = "FLEET";
export type FleetSnapshot = { version: number; units: Unit[]; incidents: Incident[]; network: boolean; speed: 1 | 10; now: number };
export type TrolleyAction =
  | "restriction" | "oxygenator" | "gasFault" | "mainsUnplugged" | "plugIn" | "thermalFault" | "standby"
  | "linkLost" | "service" | "startMobility" | "endMobility" | "swapCylinder" | "restore";

export type Fleet = {
  getSnapshot(): FleetSnapshot;
  subscribe(fn: () => void): () => void;
  step(nowMs: number): void;
  setSettings(id: string, settings: Settings): void;
  act(id: string, action: TrolleyAction): void;
  setNetwork(on: boolean): void;
  setSpeed(speed: 1 | 10): void;
  assign(id: string, caseId: string | null): void;
  acknowledge(incidentId: string): void;
  close(incidentId: string): void;
  isConnected(id: string): boolean;
  isRunning(id: string): boolean;
};

const MONITORED = (Object.keys(ALARMS) as AlarmId[]).filter((id) => id !== "noData");
const DT = SAMPLE_MS / 1000;

function seedHistory(sim: TrolleyState): Sample[] {
  return Array.from({ length: HISTORY_LENGTH }, (_, i) => sampleOf({ ...sim, t: sim.t - (HISTORY_LENGTH - 1 - i) * DT }));
}

function startUnit(u: Unit, now: number): Unit {
  const sim = createTrolley(u.sim.phase);
  const received = seedHistory(sim);
  return { ...u, sim, trackers: {}, received, lastReceivedAt: now, lastSample: received[received.length - 1], localActive: [], reported: { localActive: [], sim }, noDataActive: false };
}

export function createFleet(nowMs: number): Fleet {
  let units: Unit[] = Array.from({ length: 10 }, (_, i) => {
    const base: Unit = {
      id: `SL-D-${String(i + 1).padStart(3, "0")}`,
      caseId: i < 6 ? `DEMO-${104 + i}` : null,
      location: i < 6 ? `ICU · Bay ${i + 1}` : "Equipment bay",
      sim: createTrolley(i * 1.7),
      trackers: {}, received: [], lastReceivedAt: null, lastSample: null, localActive: [], reported: { localActive: [], sim: createTrolley(i * 1.7) }, noDataActive: false,
    };
    return base.caseId ? startUnit(base, nowMs) : base;
  });
  let incidents: Incident[] = [];
  let network = true;
  let networkDownAt: number | null = null;
  let fleetNoData = false;
  let speed: 1 | 10 = 1;
  let counter = 1;
  let now = nowMs;
  let version = 0;
  const listeners = new Set<() => void>();
  const nextId = () => `EVT-${String(counter++).padStart(3, "0")}`;
  const running = (u: Unit) => u.caseId !== null;
  const connected = (id: string) => {
    const u = units.find((x) => x.id === id);
    return network && !!u && !u.sim.conditions.linkLost;
  };

  let snapshot: FleetSnapshot = { version, units, incidents, network, speed, now };
  const emit = () => {
    snapshot = { version: ++version, units, incidents, network, speed, now };
    for (const fn of listeners) fn();
  };
  const update = (id: string, change: (u: Unit) => Unit) => {
    units = units.map((u) => (u.id === id ? change(u) : u));
    emit();
  };
  const updateSim = (id: string, change: (s: TrolleyState) => TrolleyState) =>
    update(id, (u) => (running(u) ? { ...u, sim: change(u.sim) } : u));
  const withConditions = (s: TrolleyState, c: Partial<TrolleyState["conditions"]>) => ({ ...s, conditions: { ...s.conditions, ...c } });

  function stepUnit(u: Unit): Unit {
    if (!running(u)) return u;
    const sim = stepTrolley(u.sim, DT, speed);
    const sample = sampleOf(sim);
    const out = Object.fromEntries(MONITORED.map((id) => [id, ALARMS[id].check(sample, sim)])) as Record<AlarmId, boolean>;
    const r = trackAlarms(u.trackers, out, now);
    const unitInfo = { id: u.id, caseId: u.caseId, location: u.location };
    incidents = applyAlarmChanges(incidents, unitInfo, r.activated.map((alarm) => ({ alarm, value: ALARMS[alarm].value(sample, sim) })), r.cleared, now, nextId);
    const localActive = MONITORED.filter((id) => r.trackers[id]?.active);

    const reach = network && !sim.conditions.linkLost;
    const point: Point = reach ? sample : { t: sim.t, gap: true };
    const received = [...u.received.slice(-(HISTORY_LENGTH - 1)), point];
    const lastReceivedAt = reach ? now : u.lastReceivedAt;
    let noDataActive = u.noDataActive;
    // per-unit "no data" only for this unit's own link; a whole-network outage raises one fleet incident instead
    if (network && !reach && !noDataActive && lastReceivedAt !== null && now - lastReceivedAt > STALE_MS) {
      noDataActive = true;
      incidents = applyAlarmChanges(incidents, unitInfo, [{ alarm: "noData", value: ALARMS.noData.value(sample, sim) }], [], now, nextId);
    } else if (reach && noDataActive) {
      noDataActive = false;
      incidents = applyAlarmChanges(incidents, unitInfo, [], ["noData"], now, nextId);
    }
    const reported = reach ? { localActive, sim } : u.reported;
    return { ...u, sim, trackers: r.trackers, localActive, reported, received, lastReceivedAt, lastSample: reach ? sample : u.lastSample, noDataActive };
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    step(nowMs) {
      now = nowMs;
      units = units.map(stepUnit);
      const fleetInfo = { id: FLEET_ID, caseId: null, location: "All running units" };
      if (!network && !fleetNoData && networkDownAt !== null && now - networkDownAt > STALE_MS && units.some(running)) {
        fleetNoData = true;
        incidents = applyAlarmChanges(incidents, fleetInfo, [{ alarm: "noData", value: "No data from any unit" }], [], now, nextId);
      } else if (network && fleetNoData) {
        fleetNoData = false;
        incidents = applyAlarmChanges(incidents, fleetInfo, [], ["noData"], now, nextId);
      }
      incidents = syncIncidents(incidents, connected, now);
      emit();
    },
    setSettings: (id, settings) => updateSim(id, (s) => ({ ...s, settings: { ...settings } })),
    act(id, action) {
      updateSim(id, (s) => {
        switch (action) {
          case "restriction": return withConditions(s, { drainageRestriction: true });
          case "oxygenator": return withConditions(s, { oxygenatorCreep: true });
          case "gasFault": return withConditions(s, { gasFault: true });
          case "thermalFault": return withConditions(s, { thermalFault: true });
          case "linkLost": return withConditions(s, { linkLost: true });
          case "service": return withConditions(s, { serviceDue: true });
          case "mainsUnplugged": return { ...s, powerSource: "battery" };
          case "plugIn": return { ...s, powerSource: "mains", mobility: false };
          case "standby": return { ...s, settings: { ...s.settings, pumpDrive: "standby" } };
          case "startMobility": return { ...s, gasSource: "cylinder", powerSource: "battery", mobility: true };
          case "endMobility": return { ...s, gasSource: "external", powerSource: "mains", mobility: false };
          case "swapCylinder": return { ...s, cylinderPct: 100 };
          case "restore": return {
            ...s,
            conditions: { ...NO_CONDITIONS },
            settings: { ...s.settings, pumpDrive: "running" },
            oxyResistance: 1,
            powerSource: s.mobility ? s.powerSource : "mains",
          };
        }
      });
    },
    setNetwork(on) {
      if (network && !on) networkDownAt = now;
      network = on;
      emit();
    },
    setSpeed(next) {
      speed = next;
      emit();
    },
    assign(id, caseId) {
      if (caseId && units.some((u) => u.id !== id && u.caseId === caseId)) return;
      const current = units.find((u) => u.id === id);
      if (!current || current.caseId === caseId) return;
      // the previous case's alarms stop with it; its incidents stay open for review
      incidents = stopUnitIncidents(incidents, id, now);
      update(id, (u) => {
        if (!caseId) {
          const sim = { ...u.sim, conditions: { ...NO_CONDITIONS } };
          return { ...u, caseId: null, location: "Equipment bay", sim, trackers: {}, localActive: [], reported: { localActive: [], sim }, noDataActive: false };
        }
        if (running(u)) return { ...u, caseId, trackers: {}, localActive: [], noDataActive: false };
        return startUnit({ ...u, caseId, location: "Staging · Demo ward" }, now);
      });
    },
    acknowledge(incidentId) {
      incidents = acknowledge(incidents, incidentId, now);
      emit();
    },
    close(incidentId) {
      incidents = closeIncident(incidents, incidentId, now);
      emit();
    },
    isConnected: connected,
    isRunning: (id) => units.some((u) => u.id === id && running(u)),
  };
}
