# Virtual Trolley Command Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scripted command panel with a causal virtual-trolley simulation for all 10 units, automatic alarm-driven hospital alerts, and the landing-page isometric trolley mirrored in the panel.

**Architecture:** Three framework-free TS modules — `trolleySim.ts` (per-unit physics-ish signals), `alerts.ts` (alarm checks, persistence, incidents, delivery, escalation), `fleet.ts` (a mutable store that steps every unit and owns incidents) — are unit-tested with `node --test`. React reads the store through `useSyncExternalStore`. The trolley engine gains additive methods (`mark`, `setAlarm`, `setTelemetry`, `setStale`) driven by a new `ConsoleTrolleyStage`.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript 5.8, Node 24 `node --test` (type stripping), Canvas 2D.

**Spec:** `docs/superpowers/specs/2026-11-22-virtual-trolley-command-panel-design.md`

## Global Constraints

- Every value labelled simulated; demo bands labelled "Demo limits — not clinical thresholds"; never "safe"/"all clear"; no runtime / time-remaining display; no patient physiology.
- Mirrored display has no device controls; settings and scenarios only in the "At the trolley (demo)" strip.
- No unprompted faults: no scheduler, no random fault timing.
- Timers on wall clock: `PERSIST_MS = 3000`, `STALE_MS = 5000`, `DELIVERY_MS = 1000`, `ESCALATE_MS = 30000`. Demo speed (1 | 10) scales slow variables only.
- Unassigned units idle (no signals, no alarms). Assigned units default to mains + external gas.
- Landing page (`/`) trolley behaviour unchanged.
- Modules imported by tests use relative imports with `.ts` extensions and only erasable TS syntax (no enums, no parameter properties).
- No new dependencies.

## Review Focus

1. Switching the selected unit mid-fault keeps that unit's fault, history and incidents — test in Task 3 (`fleet keeps per-unit state when another unit is stepped`).
2. Unassigning a unit with an open incident must not crash or keep alarming — test in Task 3 (`unassigned unit stops alarming`).
3. A setting change (e.g. water setpoint by one 0.5 °C step) must not raise an alert — test in Task 1/2 (`single setpoint step stays in band`).
4. Network toggled off and on repeatedly must not duplicate incidents — test in Task 3 (`network flap does not duplicate incidents`).
5. Restore normal after a slow fault: incident goes "back in band" but stays open until closed — test in Task 2.

---

### Task 1: Virtual trolley signal model

**Files:**
- Create: `stridelung-web/src/app/simulator/trolleySim.ts`
- Create: `stridelung-web/tests/trolleySim.test.ts`
- Modify: `stridelung-web/package.json` (add `"test": "node --test tests/"`), `stridelung-web/tsconfig.json` (add `"allowImportingTsExtensions": true`)

**Interfaces — Produces:**
```ts
export type Settings = { pumpSpeed: number; pumpDrive: "running" | "standby"; sweepGas: number; oxygenFraction: number; waterSetpoint: number };
export type Conditions = { drainageRestriction: boolean; oxygenatorCreep: boolean; gasFault: boolean; thermalFault: boolean; linkLost: boolean; serviceDue: boolean };
export type TrolleyState = { settings: Settings; conditions: Conditions; gasSource: "external" | "cylinder"; powerSource: "mains" | "battery"; mobility: boolean;
  waterTemp: number; batteryPct: number; cylinderPct: number; oxyResistance: number; t: number; phase: number };
export type Sample = { t: number; pre: number; post: number; drain: number; drop: number; flow: number; speed: number; sweep: number; water: number; battery: number; cylinder: number };
export const BASELINE_SETTINGS: Settings; // 3000 rpm, running, 5 L/min, 100 %, 37 °C
export const NO_CONDITIONS: Conditions;
export function createTrolley(phase: number): TrolleyState;          // waterTemp 37, battery 100, cylinder 100, oxyResistance 1, external gas, mains
export function stepTrolley(s: TrolleyState, dt: number, speed: number): TrolleyState; // pure; dt seconds wall; slow vars use dt*speed
export function sampleOf(s: TrolleyState): Sample;
```
Model (builder may tune constants, must keep tests): speed = running ? pumpSpeed : 0; flow = speed/700 / (1 + 1.4·restriction + 0.15·(oxyR−1)); drop = flow·oxyR·6; post = 100 + 14·flow; pre = post + drop; drain = −0.012·speed·(1 + 1.7·restriction); sweep = (gasFault || (cylinder gas && cylinderPct ≤ 0)) ? 0 : sweepGas; oxyR += 0.02/s·speed-scaled while creep (max 3.5); water → first-order lag τ=20 s (demo-scaled) toward thermalFault ? 24 : setpoint; battery drains (0.04 + 0.00002·speed) %/s demo-scaled on battery; cylinder drains 0.02·sweep %/s demo-scaled on cylinder gas. Seeded noise from `phase`: flow ±0.08, drain ±3, drop ±1.5, pressures ±2; zero when speed 0.

- [ ] **Step 1: Write failing tests** — `baseline sits mid-band` (flow 3.9–4.7, drain −45…−27, drop 20–32); `restriction lowers flow below 2.5 and drain below −80`; `oxygenator creep raises drop above 45 within 10 s at speed 10`; `standby gives zero flow and speed`; `battery holds on mains, drains on battery`; `cylinder drains only on cylinder gas; sweep 0 when empty`; `thermal fault drifts water >1.5 °C off setpoint within 5 s at speed 10`; `single setpoint step stays in band` (0.5 °C step → |water−setpoint| ≤ 0.5 always); `stepTrolley does not mutate input`.
- [ ] **Step 2:** `cd stridelung-web && npm test` → FAIL (module missing).
- [ ] **Step 3:** Implement `trolleySim.ts`.
- [ ] **Step 4:** `npm test` → PASS.

### Task 2: Alarm checks and incidents

**Files:**
- Create: `stridelung-web/src/app/simulator/alerts.ts`
- Create: `stridelung-web/tests/alerts.test.ts`

**Interfaces — Consumes:** `Sample`, `TrolleyState` (type-only import from `./trolleySim.ts`).
**Produces:**
```ts
export type Tier = "urgent" | "attention" | "unavailable" | "routine";
export type Subsystem = "circuit" | "oxygenator" | "gas" | "power" | "thermal" | "link" | "service";
export type AlarmId = "pumpStopped" | "lowFlow" | "highFlow" | "drainage" | "pressureDrop" | "gasLow" | "cylinderLow" | "mainsLost" | "batteryLow" | "batteryCritical" | "waterTemp" | "service" | "noData";
export const ALARMS: Record<AlarmId, { label: string; subsystem: Subsystem; tier: Tier; component: string; band: string; check(sample: Sample, s: TrolleyState): boolean; value(sample: Sample, s: TrolleyState): string }>;
export const BANDS: { flow: [2.5, 6.5]; drain: [-80, 5]; drop: [0, 45]; cylinderLow: 20; batteryLow: 25; batteryCritical: 10; waterTolerance: 1.5 };
export const PERSIST_MS = 3000, STALE_MS = 5000, DELIVERY_MS = 1000, ESCALATE_MS = 30000;
export const SUBSYSTEMS: Record<Subsystem, { label: string; team: string }>; // escalation team "Duty ECMO coordinator"
export type Tracker = { outSince: number | null; inSince: number | null; active: boolean };
export function trackAlarms(trackers: Partial<Record<AlarmId, Tracker>>, out: Partial<Record<AlarmId, boolean>>, now: number): { trackers: Partial<Record<AlarmId, Tracker>>; activated: AlarmId[]; cleared: AlarmId[] };
export type SignalEntry = { alarm: AlarmId; value: string; since: number; active: boolean; clearedAt?: number };
export type IncidentView = { tier: Tier; signals: SignalEntry[]; backInBand: boolean; syncedAt: number };
export type Incident = { id: string; deviceId: string; caseId: string | null; location: string; subsystem: Subsystem; tier: Tier; signals: SignalEntry[]; backInBand: boolean;
  createdAt: number; hospitalSide: boolean; deliveredAt?: number; late?: boolean; hospital: IncidentView | null; acknowledgedAt?: number; closedAt?: number; escalatedAt?: number };
export function applyAlarmChanges(incidents: Incident[], unit: { id: string; caseId: string | null; location: string }, activated: { alarm: AlarmId; value: string }[], cleared: AlarmId[], now: number, nextId: () => string): Incident[];
export function syncIncidents(incidents: Incident[], connected: (deviceId: string) => boolean, now: number): Incident[]; // delivery after DELIVERY_MS, late flag, hospital copy refresh, escalation
export function acknowledge(incidents: Incident[], id: string, now: number): Incident[];
export function closeIncident(incidents: Incident[], id: string, now: number): Incident[]; // only if acknowledged
export const tierRank: (t: Tier) => number; // urgent 3, unavailable 2, attention 1, routine 0
```
Alarm rules: pumpStopped speed===0 (urgent); lowFlow flow<2.5 && speed>0 (urgent); highFlow >6.5 (attention); drainage drain<−80 (urgent); pressureDrop drop>45 (attention); gasLow sweepGas>0 && sweep<0.5·sweepGas (urgent); cylinderLow cylinder gas && cylinderPct<20 (attention); mainsLost battery && !mobility (attention); batteryLow <25 (attention); batteryCritical <10 (urgent); waterTemp |water−setpoint|>1.5 (attention); service conditions.serviceDue (routine); noData is hospital-raised (unavailable), never from `check`.

- [ ] **Step 1: Write failing tests** — `short excursion under 3 s does not activate`; `activates after 3 s out and clears after 3 s back in`; `two circuit alarms share one incident with highest tier`; `battery low upgrades open power incident to urgent when critical`; `closed incident → new activation opens a new incident`; `back in band keeps incident open`; `close requires acknowledge`; `not delivered while disconnected, delivered late after reconnect + 1 s`; `escalates 30 s after delivery when unacknowledged, not after acknowledge`; `hospital copy does not change while disconnected`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement `alerts.ts`.
- [ ] **Step 4:** `npm test` → PASS.

### Task 3: Fleet store

**Files:**
- Create: `stridelung-web/src/app/simulator/fleet.ts`
- Create: `stridelung-web/tests/fleet.test.ts`

**Interfaces — Consumes:** Task 1 and Task 2 exports.
**Produces:**
```ts
export const SAMPLE_MS = 125; export const HISTORY_LENGTH = 481;
export type Point = Sample | { t: number; gap: true };
export type Unit = { id: string; caseId: string | null; location: string; sim: TrolleyState; trackers: Partial<Record<AlarmId, Tracker>>;
  received: Point[]; lastReceivedAt: number | null; lastSample: Sample | null; localActive: AlarmId[] };
export type FleetSnapshot = { version: number; units: Unit[]; incidents: Incident[]; network: boolean; speed: 1 | 10; now: number };
export type TrolleyAction = "restriction" | "oxygenator" | "gasFault" | "mainsUnplugged" | "plugIn" | "thermalFault" | "standby" | "linkLost" | "service" | "startMobility" | "endMobility" | "swapCylinder" | "restore";
export type Fleet = {
  getSnapshot(): FleetSnapshot; subscribe(fn: () => void): () => void;
  step(nowMs: number): void;                       // advance every assigned unit by SAMPLE_MS, run alarms, sync incidents, append received/gap
  setSettings(id: string, settings: Settings): void; act(id: string, action: TrolleyAction): void;
  setNetwork(on: boolean): void; setSpeed(speed: 1 | 10): void;
  assign(id: string, caseId: string | null): void; acknowledge(incidentId: string): void; close(incidentId: string): void;
  isConnected(id: string): boolean; isRunning(id: string): boolean;
};
export function createFleet(nowMs: number): Fleet; // 10 units SL-D-001…010, DEMO-104…109 on 001–006 in "ICU · Bay n", others idle "Equipment bay"; histories seeded with HISTORY_LENGTH baseline samples
```
`restore` clears all conditions and sets pumpDrive running at the current pumpSpeed (keeps battery/cylinder levels, gas/power source). `standby` sets pumpDrive standby. `plugIn` → mains. `startMobility` → cylinder + battery + mobility true; `endMobility` → external + mains + mobility false. Connected = network && !linkLost. Hospital-side `noData` incident opens when a running unit has `now − lastReceivedAt > STALE_MS`, and goes back in band when data resumes. Snapshot is a new object each step (version++) so `useSyncExternalStore` re-renders.

- [ ] **Step 1: Write failing tests** — `idle units produce no incidents`; `restriction on 003 creates a delivered circuit incident while 001 is stepped`; `fleet keeps per-unit state when another unit is stepped`; `link lost: no delivery, noData incident after 5 s, gap points recorded`; `network flap does not duplicate incidents`; `unassigned unit stops alarming` (assign null mid-fault → no new incidents, existing stays for review); `restore clears conditions`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement `fleet.ts`.
- [ ] **Step 4:** `npm test` → PASS.

### Task 4: Trolley model in the console

**Files:**
- Modify: `stridelung-web/src/trolley/engine.ts` (additive), `stridelung-web/src/trolley/TrolleyFigure.tsx` (`variant` prop), `stridelung-web/src/trolley/trolley.css` (`[data-alarm]` mirrors `[data-blocked]` diffuser/lens rules; `[data-stale]` greys the stage)
- Create: `stridelung-web/src/trolley/ConsoleTrolleyStage.tsx`

**Interfaces — Produces:**
```ts
// engine additions
mark(id: string | null): void;            // highlight only (data-on + data-focus dimming), no x-ray
setAlarm(on: boolean): void;              // toggles data-alarm on the stage
setTelemetry(t: { flow: number; pin: number; pout: number; warn: boolean } | null): void; // 0..1 values; C20 signals tab uses them, label "MIRRORED · SIMULATED DEVICE"
setStale(on: boolean): void;              // data-stale; stops trace sampling
// TrolleyFigure
export function TrolleyFigure({ variant }: { variant?: "explorer" | "hero" | "console" }): JSX.Element; // keep `hero` boolean working
// ConsoleTrolleyStage + context
export type ConsoleModelState = { flows: FlowId[]; blocked: boolean; gasExternal: boolean; mark: string | null; alarm: boolean; stale: boolean; telemetry: { flow: number; pin: number; pout: number; warn: boolean } | null };
export const ConsoleModelContext: React.Context<ConsoleModelState | null>;
export function ConsoleTrolleyStage(props: { scene: EngineScene; children: ReactNode }): JSX.Element; // engine with autoTour false, view "open", stage not focusable; applies context state on change
```
- [ ] **Step 1:** Implement engine additions; when `telemetry` is set, `sampleTraces` uses it instead of `synthetic`, and the C20 tab shows signals.
- [ ] **Step 2:** Implement `ConsoleTrolleyStage`, `variant="console"` (clip id `console-handle-clip`), CSS.
- [ ] **Step 3:** `npx tsc --noEmit` → no errors; `npm run build` passes; landing page explorer still opens/explodes/flows (manual check in dev).

### Task 5: Command panel UI

**Files:**
- Create: `stridelung-web/src/app/simulator/WaveformCanvas.tsx` (moved from `src/simulator/`, own `{ t: number; v: number }[]` type, NaN breaks the line, optional `bands?: { lo: number; hi: number }`, shaded out-of-band zones)
- Create: `stridelung-web/src/app/simulator/CommandPanel.tsx` (data-path strip, model + local alarm list left, mirrored display right, freeze/window toolbar)
- Create: `stridelung-web/src/app/simulator/TrolleyStrip.tsx` ("At the trolley (demo)": settings steppers, scenario buttons, mobility/plug/swap, global network toggle and 1×/10× speed, "alarming locally" + "outbox" lines)
- Delete: `stridelung-web/src/app/simulator/DeviceConsole.tsx`, `stridelung-web/src/app/simulator/consoleModel.ts`
- Modify: `stridelung-web/src/app/simulator/console.css`

**Interfaces — Consumes:** `Fleet`, `FleetSnapshot`, `Unit` (Task 3); `ALARMS`, `BANDS` (Task 2); `ConsoleModelContext` (Task 4).
**Produces:** `CommandPanel({ fleet, snapshot, unitId, model }: { fleet: Fleet; snapshot: FleetSnapshot; unitId: string; model: ReactNode })`.

Copy fixed by spec: data path "Trolley sensors → Trolley computer (C19) → Hospital network → This dashboard" + tag "Simulated device"; note "Mirrored from the trolley display. In the product these values come from the trolley's sensors and computer; in this demo the trolley is simulated."; stale "No data since HH:MM:SS"; "Demo limits — not clinical thresholds"; "Demo time ×10".

- [ ] **Step 1:** Build the three components and CSS; idle unit shows "In equipment bay · not running" with an "Assign a case to start" hint.
- [ ] **Step 2:** `npx tsc --noEmit` clean.

### Task 6: Dashboard integration

**Files:**
- Modify: `stridelung-web/src/app/simulator/HospitalDashboard.tsx` (create fleet once, `setInterval(step, SAMPLE_MS)`, `useSyncExternalStore`; incidents/inbox show tier, signals, delivery state "Queued on trolley / Delivered / Delivered late", "Signal back in band", escalation line; fleet table live status from incidents + stale; assignments call `fleet.assign`; nav badge counts delivered unacknowledged; remove "Send simulated update")
- Modify: `stridelung-web/src/app/simulator/demo.ts` (keep `displayTime`; rewrite `eventSnapshot(incident)` to list signals, value, band, time out of band; drop old `SCENARIOS`/`receiveUpdate`)
- Modify: `stridelung-web/src/app/simulator/page.tsx` (server: `<HospitalDashboard model={<TrolleyFigure variant="console" />} />`)
- Modify: `stridelung-web/src/app/simulator/dashboard.css`

- [ ] **Step 1:** Implement; Service & circuits lists service-subsystem incidents.
- [ ] **Step 2:** `npm test && npm run build` pass.
- [ ] **Step 3:** Manual walk-through in `npm run dev`: each scenario on SL-D-001 raises the right incident within ~5 s (slow ones at 10×); fault on 003 while viewing 001 lands in inbox; network down → stale + outbox → back up → delivered late; restore → back in band, close after acknowledge.

### Task 7: Cleanup and docs

**Files:**
- Delete: `stridelung-web/src/simulator/` (whole directory)
- Modify: `stridelung-web/README.md` (Hospital dashboard section), root `README.md` (Hospital portal prototype paragraph)

- [ ] **Step 1:** Delete, update READMEs to describe the new flow.
- [ ] **Step 2:** `grep -rn "@/simulator" src` → no matches; `npm test && npm run build` pass.
