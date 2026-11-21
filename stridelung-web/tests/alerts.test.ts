import { test } from "node:test";
import assert from "node:assert/strict";
import {
  trackAlarms, applyAlarmChanges, syncIncidents, acknowledge, closeIncident, stopUnitIncidents, ALARMS,
  PERSIST_MS, DELIVERY_MS, ESCALATE_MS, type Incident, type AlarmId, type Tracker,
} from "../src/app/simulator/alerts.ts";
import { createTrolley, sampleOf } from "../src/app/simulator/trolleySim.ts";

const UNIT = { id: "SL-D-001", caseId: "DEMO-104", location: "ICU · Bay 1" };
const ids = () => { let n = 1; return () => `EVT-${String(n++).padStart(3, "0")}`; };
const up = () => true;
const down = () => false;

function holdOut(alarm: AlarmId, from: number, to: number, step = 125) {
  let trackers: Partial<Record<AlarmId, Tracker>> = {};
  const activated: number[] = [];
  for (let now = from; now <= to; now += step) {
    const r = trackAlarms(trackers, { [alarm]: true }, now);
    trackers = r.trackers;
    if (r.activated.includes(alarm)) activated.push(now);
  }
  return { trackers, activated };
}

test("alarm checks match the spec bands", () => {
  const s = createTrolley(0);
  const x = sampleOf(s);
  assert.equal(ALARMS.lowFlow.check({ ...x, flow: 2.4 }, s), true);
  assert.equal(ALARMS.lowFlow.check(x, s), false);
  assert.equal(ALARMS.drainage.check({ ...x, drain: -81 }, s), true);
  assert.equal(ALARMS.pressureDrop.check({ ...x, drop: 46 }, s), true);
  assert.equal(ALARMS.pumpStopped.check({ ...x, speed: 0 }, s), true);
  assert.equal(ALARMS.gasLow.check({ ...x, sweep: 2 }, s), true);
  assert.equal(ALARMS.mainsLost.check(x, { ...s, powerSource: "battery" }), true);
  assert.equal(ALARMS.mainsLost.check(x, { ...s, powerSource: "battery", mobility: true }), false);
  assert.equal(ALARMS.waterTemp.check({ ...x, water: 35.4 }, s), true);
  assert.equal(ALARMS.waterTemp.check({ ...x, water: 36.5 }, s), false);
});

test("short excursion under 3 s does not activate", () => {
  const { activated } = holdOut("lowFlow", 0, PERSIST_MS - 125);
  assert.deepEqual(activated, []);
});

test("activates after 3 s out and clears after 3 s back in", () => {
  const { trackers, activated } = holdOut("lowFlow", 0, PERSIST_MS);
  assert.deepEqual(activated, [PERSIST_MS]);
  let t = trackers;
  let clearedAt: number | null = null;
  for (let now = PERSIST_MS + 125; now <= PERSIST_MS * 3; now += 125) {
    const r = trackAlarms(t, { lowFlow: false }, now);
    t = r.trackers;
    if (r.cleared.includes("lowFlow") && clearedAt === null) clearedAt = now;
  }
  assert.equal(clearedAt, PERSIST_MS + 125 + PERSIST_MS);
});

test("two circuit alarms share one incident with highest tier", () => {
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "highFlow", value: "6.8" }], [], 0, ids());
  inc = applyAlarmChanges(inc, UNIT, [{ alarm: "drainage", value: "-97" }], [], 10, ids());
  assert.equal(inc.length, 1);
  assert.equal(inc[0].subsystem, "circuit");
  assert.equal(inc[0].tier, "urgent");
  assert.deepEqual(inc[0].signals.map((s) => s.alarm), ["highFlow", "drainage"]);
});

test("battery low upgrades open power incident to urgent when critical", () => {
  const next = ids();
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "batteryLow", value: "24 %" }], [], 0, next);
  assert.equal(inc[0].tier, "attention");
  inc = applyAlarmChanges(inc, UNIT, [{ alarm: "batteryCritical", value: "9 %" }], [], 5, next);
  assert.equal(inc.length, 1);
  assert.equal(inc[0].tier, "urgent");
});

test("closed incident → new activation opens a new incident", () => {
  const next = ids();
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "lowFlow", value: "1.8" }], [], 0, next);
  inc = syncIncidents(inc, up, 0);
  inc = syncIncidents(inc, up, DELIVERY_MS);
  inc = closeIncident(acknowledge(inc, inc[0].id, 2000), inc[0].id, 3000);
  inc = applyAlarmChanges(inc, UNIT, [{ alarm: "lowFlow", value: "1.7" }], [], 4000, next);
  assert.equal(inc.length, 2);
  assert.equal(inc.filter((e) => !e.closedAt).length, 1);
});

test("back in band keeps incident open", () => {
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "pressureDrop", value: "52" }], [], 0, ids());
  inc = applyAlarmChanges(inc, UNIT, [], ["pressureDrop"], 9000, ids());
  assert.equal(inc[0].backInBand, true);
  assert.equal(inc[0].closedAt, undefined);
});

test("close requires acknowledge", () => {
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "lowFlow", value: "1.8" }], [], 0, ids());
  inc = syncIncidents(syncIncidents(inc, up, 0), up, DELIVERY_MS);
  inc = closeIncident(inc, inc[0].id, 2000);
  assert.equal(inc[0].closedAt, undefined);
});

test("not delivered while disconnected, delivered late after reconnect + 1 s", () => {
  let inc: Incident[] = applyAlarmChanges([], UNIT, [{ alarm: "lowFlow", value: "1.8" }], [], 0, ids());
  for (let now = 0; now <= 10_000; now += 125) inc = syncIncidents(inc, down, now);
  assert.equal(inc[0].deliveredAt, undefined);
  assert.equal(inc[0].hospital, null);
  inc = syncIncidents(inc, up, 10_125);
  assert.equal(inc[0].deliveredAt, undefined);
  inc = syncIncidents(inc, up, 10_125 + DELIVERY_MS);
  assert.equal(inc[0].deliveredAt, 10_125 + DELIVERY_MS);
  assert.equal(inc[0].late, true);
});

test("escalates 30 s after delivery when unacknowledged, not after acknowledge", () => {
  const next = ids();
  let a = applyAlarmChanges([], UNIT, [{ alarm: "lowFlow", value: "1.8" }], [], 0, next);
  a = syncIncidents(syncIncidents(a, up, 0), up, DELIVERY_MS);
  assert.equal(a[0].late, false);
  let b = acknowledge(a, a[0].id, 2000);
  a = syncIncidents(a, up, DELIVERY_MS + ESCALATE_MS);
  b = syncIncidents(b, up, DELIVERY_MS + ESCALATE_MS);
  assert.equal(a[0].escalatedAt, DELIVERY_MS + ESCALATE_MS);
  assert.equal(b[0].escalatedAt, undefined);
});

test("hospital copy does not change while disconnected", () => {
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "highFlow", value: "6.8" }], [], 0, ids());
  inc = syncIncidents(syncIncidents(inc, up, 0), up, DELIVERY_MS);
  assert.equal(inc[0].hospital?.tier, "attention");
  inc = applyAlarmChanges(inc, UNIT, [{ alarm: "drainage", value: "-97" }], [], 2000, ids());
  inc = syncIncidents(inc, down, 2125);
  assert.equal(inc[0].tier, "urgent");
  assert.equal(inc[0].hospital?.tier, "attention");
  assert.equal(inc[0].hospital?.signals.length, 1);
  inc = syncIncidents(inc, up, 2250);
  assert.equal(inc[0].hospital?.tier, "urgent");
});

test("hospital-side incident is delivered immediately", () => {
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "noData", value: "No data" }], [], 0, ids());
  inc = syncIncidents(inc, down, 0);
  assert.equal(inc[0].hospitalSide, true);
  assert.equal(inc[0].deliveredAt, 0);
  assert.equal(inc[0].late, false);
});

test("activation on an acknowledged incident opens a new incident", () => {
  const next = ids();
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "pumpStopped", value: "0 rpm" }], [], 0, next);
  inc = syncIncidents(syncIncidents(inc, up, 0), up, DELIVERY_MS);
  inc = acknowledge(inc, inc[0].id, 2000);
  inc = applyAlarmChanges(inc, UNIT, [{ alarm: "drainage", value: "-97" }], [], 3000, next);
  assert.equal(inc.length, 2);
  assert.equal(inc[0].acknowledgedAt, undefined);
  assert.deepEqual(inc[0].signals.map((s) => s.alarm), ["drainage"]);
  inc = applyAlarmChanges(inc, UNIT, [], ["drainage"], 9000, next);
  assert.equal(inc[0].backInBand, true);
  assert.equal(inc[1].signals[0].active, true);
});

test("incident matching is per case", () => {
  const next = ids();
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "gasLow", value: "0" }], [], 0, next);
  inc = applyAlarmChanges(inc, { ...UNIT, caseId: "DEMO-112" }, [{ alarm: "gasLow", value: "0" }], [], 10, next);
  assert.equal(inc.length, 2);
  assert.equal(inc[0].caseId, "DEMO-112");
});

test("hospital copy keeps identity when nothing changed", () => {
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "lowFlow", value: "1.8" }], [], 0, ids());
  inc = syncIncidents(syncIncidents(inc, up, 0), up, DELIVERY_MS);
  const first = inc[0].hospital;
  inc = syncIncidents(inc, up, DELIVERY_MS + 125);
  assert.equal(inc[0].hospital, first);
});

test("stopUnitIncidents clears active signals for that unit only", () => {
  const next = ids();
  let inc = applyAlarmChanges([], UNIT, [{ alarm: "gasLow", value: "0" }], [], 0, next);
  inc = applyAlarmChanges(inc, { ...UNIT, id: "SL-D-002" }, [{ alarm: "gasLow", value: "0" }], [], 0, next);
  inc = stopUnitIncidents(inc, "SL-D-001", 500);
  const mine = inc.find((e) => e.deviceId === "SL-D-001")!;
  assert.equal(mine.backInBand, true);
  assert.equal(mine.signals[0].clearedAt, 500);
  assert.equal(inc.find((e) => e.deviceId === "SL-D-002")!.signals[0].active, true);
});
