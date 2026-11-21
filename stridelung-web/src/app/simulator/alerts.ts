// Trolley alarm checks and the hospital incident workflow — framework-free.
// Bands are DEMO LIMITS for the simulation, not clinical thresholds; a real system's limits would be set by the
// ECMO team for the selected equipment. Timers run on wall-clock milliseconds and never scale with demo speed.
import type { Sample, TrolleyState } from "./trolleySim.ts";

export type Tier = "urgent" | "attention" | "unavailable" | "routine";
export type Subsystem = "circuit" | "oxygenator" | "gas" | "power" | "thermal" | "link" | "service";
export type AlarmId =
  | "pumpStopped" | "lowFlow" | "highFlow" | "drainage" | "pressureDrop" | "gasLow" | "cylinderLow"
  | "mainsLost" | "batteryLow" | "batteryCritical" | "waterTemp" | "service" | "noData";

export const PERSIST_MS = 3000;
export const STALE_MS = 5000;
export const DELIVERY_MS = 1000;
export const ESCALATE_MS = 30000;
export const ESCALATION_TEAM = "Duty ECMO coordinator";

export const BANDS = {
  flow: [2.5, 6.5] as [number, number],
  drain: [-80, 5] as [number, number],
  drop: [0, 45] as [number, number],
  cylinderLow: 20,
  batteryLow: 25,
  batteryCritical: 10,
  waterTolerance: 1.5,
};

export const SUBSYSTEMS: Record<Subsystem, { label: string; team: string }> = {
  circuit: { label: "Blood circuit", team: "ECMO response team" },
  oxygenator: { label: "Oxygenator", team: "ECMO response team" },
  gas: { label: "Gas supply", team: "ECMO response team" },
  power: { label: "Power", team: "Biomedical engineering" },
  thermal: { label: "Thermal", team: "Biomedical engineering" },
  link: { label: "Monitoring link", team: "Hospital IT / Biomed" },
  service: { label: "Service", team: "Biomedical engineering" },
};

type AlarmDef = {
  label: string;
  subsystem: Subsystem;
  tier: Tier;
  /** register component the 3D model highlights */
  component: string;
  band: string;
  check(sample: Sample, s: TrolleyState): boolean;
  value(sample: Sample, s: TrolleyState): string;
};

const f = (v: number, dp = 0) => v.toFixed(dp);

export const ALARMS: Record<AlarmId, AlarmDef> = {
  pumpStopped: { label: "Pump stopped", subsystem: "circuit", tier: "urgent", component: "C07", band: "Pump speed > 0 rpm",
    check: (x) => x.speed === 0, value: (x) => `${f(x.speed)} rpm` },
  lowFlow: { label: "Low circuit flow", subsystem: "circuit", tier: "urgent", component: "C10", band: `≥ ${BANDS.flow[0]} L/min`,
    check: (x) => x.speed > 0 && x.flow < BANDS.flow[0], value: (x) => `${f(x.flow, 2)} L/min` },
  highFlow: { label: "High circuit flow", subsystem: "circuit", tier: "attention", component: "C10", band: `≤ ${BANDS.flow[1]} L/min`,
    check: (x) => x.flow > BANDS.flow[1], value: (x) => `${f(x.flow, 2)} L/min` },
  drainage: { label: "Drainage pressure too negative", subsystem: "circuit", tier: "urgent", component: "C23", band: `≥ ${BANDS.drain[0]} mmHg`,
    check: (x) => x.drain < BANDS.drain[0], value: (x) => `${f(x.drain)} mmHg` },
  pressureDrop: { label: "Oxygenator pressure drop rising", subsystem: "oxygenator", tier: "attention", component: "C05", band: `≤ ${BANDS.drop[1]} mmHg`,
    check: (x) => x.drop > BANDS.drop[1], value: (x) => `${f(x.drop)} mmHg` },
  gasLow: { label: "Sweep gas not delivered", subsystem: "gas", tier: "urgent", component: "C13", band: "≥ 50 % of setpoint",
    check: (x, s) => s.settings.sweepGas > 0 && x.sweep < 0.5 * s.settings.sweepGas, value: (x, s) => `${f(x.sweep, 1)} of ${f(s.settings.sweepGas, 1)} L/min` },
  cylinderLow: { label: "Oxygen cylinder low", subsystem: "gas", tier: "attention", component: "C11", band: `≥ ${BANDS.cylinderLow} %`,
    check: (x, s) => s.gasSource === "cylinder" && x.cylinder < BANDS.cylinderLow, value: (x) => `${f(x.cylinder)} %` },
  mainsLost: { label: "Running on battery — mains lost", subsystem: "power", tier: "attention", component: "C18", band: "Mains connected",
    check: (_x, s) => s.powerSource === "battery" && !s.mobility, value: () => "Battery" },
  batteryLow: { label: "Battery low", subsystem: "power", tier: "attention", component: "C17", band: `≥ ${BANDS.batteryLow} %`,
    check: (x, s) => s.powerSource === "battery" && x.battery < BANDS.batteryLow, value: (x) => `${f(x.battery)} %` },
  batteryCritical: { label: "Battery critical", subsystem: "power", tier: "urgent", component: "C17", band: `≥ ${BANDS.batteryCritical} %`,
    check: (x, s) => s.powerSource === "battery" && x.battery < BANDS.batteryCritical, value: (x) => `${f(x.battery)} %` },
  waterTemp: { label: "Water temperature off setpoint", subsystem: "thermal", tier: "attention", component: "C15", band: `± ${BANDS.waterTolerance} °C of the settling setpoint`,
    // compared with where the water should be after a setpoint change, so turning the setpoint never alarms by itself
    check: (x, s) => Math.abs(x.water - s.waterExpected) > BANDS.waterTolerance, value: (x) => `${f(x.water, 1)} °C` },
  service: { label: "Service review requested", subsystem: "service", tier: "routine", component: "C24", band: "No review pending",
    check: (_x, s) => s.conditions.serviceDue, value: () => "Requested" },
  noData: { label: "Monitor unavailable — no data received", subsystem: "link", tier: "unavailable", component: "C19", band: `Report within ${STALE_MS / 1000} s`,
    check: () => false, value: () => "No data" },
};

const TIER_RANK: Record<Tier, number> = { routine: 0, attention: 1, unavailable: 2, urgent: 3 };
export const tierRank = (t: Tier) => TIER_RANK[t];

// ── persistence: an alarm activates only after PERSIST_MS out of band, and clears after PERSIST_MS back in ──
export type Tracker = { outSince: number | null; inSince: number | null; active: boolean };

export function trackAlarms(
  trackers: Partial<Record<AlarmId, Tracker>>,
  out: Partial<Record<AlarmId, boolean>>,
  now: number,
): { trackers: Partial<Record<AlarmId, Tracker>>; activated: AlarmId[]; cleared: AlarmId[] } {
  const next: Partial<Record<AlarmId, Tracker>> = {};
  const activated: AlarmId[] = [];
  const cleared: AlarmId[] = [];
  for (const id of Object.keys(out) as AlarmId[]) {
    const t = { ...(trackers[id] ?? { outSince: null, inSince: null, active: false }) };
    if (out[id]) {
      t.inSince = null;
      t.outSince ??= now;
      if (!t.active && now - t.outSince >= PERSIST_MS) {
        t.active = true;
        activated.push(id);
      }
    } else {
      t.outSince = null;
      if (t.active) {
        t.inSince ??= now;
        if (now - t.inSince >= PERSIST_MS) {
          t.active = false;
          t.inSince = null;
          cleared.push(id);
        }
      }
    }
    next[id] = t;
  }
  return { trackers: next, activated, cleared };
}

// ── incidents ──
export type SignalEntry = { alarm: AlarmId; value: string; since: number; active: boolean; clearedAt?: number };
export type IncidentView = { tier: Tier; signals: SignalEntry[]; backInBand: boolean; syncedAt: number };
export type Incident = {
  id: string;
  deviceId: string;
  caseId: string | null;
  location: string;
  subsystem: Subsystem;
  tier: Tier;
  signals: SignalEntry[];
  backInBand: boolean;
  createdAt: number;
  /** raised by the dashboard itself (no data arriving), not sent by the trolley */
  hospitalSide: boolean;
  sendStartedAt?: number;
  queuedOffline?: boolean;
  deliveredAt?: number;
  late?: boolean;
  /** the copy the hospital last received; null until delivered */
  hospital: IncidentView | null;
  acknowledgedAt?: number;
  closedAt?: number;
  escalatedAt?: number;
};

export function applyAlarmChanges(
  incidents: Incident[],
  unit: { id: string; caseId: string | null; location: string },
  activated: { alarm: AlarmId; value: string }[],
  cleared: AlarmId[],
  now: number,
  nextId: () => string,
): Incident[] {
  let list = incidents;
  // new signals merge only into an open, not-yet-acknowledged incident for the same unit AND case;
  // once someone has acknowledged an incident, a fresh activation is a new alert that must notify again
  const openFor = (sub: Subsystem) => list.findIndex((e) => e.deviceId === unit.id && e.caseId === unit.caseId && e.subsystem === sub && !e.closedAt && !e.acknowledgedAt);
  const holding = (alarm: AlarmId) => list.findIndex((e) => e.deviceId === unit.id && !e.closedAt && e.signals.some((s) => s.alarm === alarm && s.active));
  for (const { alarm, value } of activated) {
    const def = ALARMS[alarm];
    const entry: SignalEntry = { alarm, value, since: now, active: true };
    const at = openFor(def.subsystem);
    if (at >= 0) {
      const e = list[at];
      const signals = e.signals.some((s) => s.alarm === alarm)
        ? e.signals.map((s) => (s.alarm === alarm ? entry : s))
        : [...e.signals, entry];
      const tier = tierRank(def.tier) > tierRank(e.tier) ? def.tier : e.tier;
      list = list.map((x, i) => (i === at ? { ...e, signals, tier, backInBand: false } : x));
    } else {
      list = [{
        id: nextId(), deviceId: unit.id, caseId: unit.caseId, location: unit.location, subsystem: def.subsystem, tier: def.tier,
        signals: [entry], backInBand: false, createdAt: now, hospitalSide: alarm === "noData", hospital: null,
      }, ...list];
    }
  }
  for (const alarm of cleared) {
    const at = holding(alarm);
    if (at < 0) continue;
    const e = list[at];
    const signals = e.signals.map((s) => (s.alarm === alarm && s.active ? { ...s, active: false, clearedAt: now } : s));
    list = list.map((x, i) => (i === at ? { ...e, signals, backInBand: signals.every((s) => !s.active) } : x));
  }
  return list;
}

/** Delivery, the hospital's copy, and escalation. `connected(deviceId)` = trolley data can reach the hospital. */
export function syncIncidents(incidents: Incident[], connected: (deviceId: string) => boolean, now: number): Incident[] {
  return incidents.map((source) => {
    const e: Incident = { ...source };
    const reach = e.hospitalSide || connected(e.deviceId);
    if (e.deliveredAt === undefined) {
      if (e.hospitalSide) {
        // raised by the dashboard itself: no network hop to wait for
        e.deliveredAt = now;
        e.late = false;
      } else if (!reach) {
        e.sendStartedAt = undefined;
        e.queuedOffline = true;
      } else {
        e.sendStartedAt ??= now;
        if (now - e.sendStartedAt >= DELIVERY_MS) {
          e.deliveredAt = now;
          e.late = !!e.queuedOffline;
        }
      }
    }
    if (e.deliveredAt !== undefined && reach) {
      // replace the hospital's copy only when its content changes, so its identity (and the snapshot) stays stable
      const same = e.hospital && e.hospital.tier === e.tier && e.hospital.backInBand === e.backInBand
        && JSON.stringify(e.hospital.signals) === JSON.stringify(e.signals);
      if (!same) e.hospital = { tier: e.tier, signals: e.signals.map((s) => ({ ...s })), backInBand: e.backInBand, syncedAt: now };
    }
    if (e.deliveredAt !== undefined && !e.acknowledgedAt && !e.closedAt && e.escalatedAt === undefined && now - e.deliveredAt >= ESCALATE_MS) {
      e.escalatedAt = now;
    }
    return e;
  });
}

/** A unit stopped (unassigned or given a new case): its open incidents' signals stop; the reviews stay open. */
export function stopUnitIncidents(incidents: Incident[], deviceId: string, now: number): Incident[] {
  return incidents.map((e) => (e.deviceId !== deviceId || e.closedAt ? e : {
    ...e,
    backInBand: true,
    signals: e.signals.map((s) => (s.active ? { ...s, active: false, clearedAt: now } : s)),
  }));
}

export function acknowledge(incidents: Incident[], id: string, now: number): Incident[] {
  return incidents.map((e) => (e.id === id && e.deliveredAt !== undefined && !e.closedAt && !e.acknowledgedAt ? { ...e, acknowledgedAt: now } : e));
}

export function closeIncident(incidents: Incident[], id: string, now: number): Incident[] {
  return incidents.map((e) => (e.id === id && e.acknowledgedAt && !e.closedAt ? { ...e, closedAt: now } : e));
}
