import { test } from "node:test";
import assert from "node:assert/strict";
import { createFleet, SAMPLE_MS, HISTORY_LENGTH, type Fleet } from "../src/app/simulator/fleet.ts";
import { NO_CONDITIONS } from "../src/app/simulator/trolleySim.ts";

const T0 = 1_000_000;
function setup() {
  const fleet = createFleet(T0);
  let now = T0;
  const run = (ms: number, each?: (now: number) => void) => {
    for (const end = now + ms; now < end;) {
      now += SAMPLE_MS;
      each?.(now);
      fleet.step(now);
    }
  };
  return { fleet, run };
}
const unit = (fleet: Fleet, id: string) => fleet.getSnapshot().units.find((u) => u.id === id)!;
const incidentsFor = (fleet: Fleet, id: string) => fleet.getSnapshot().incidents.filter((e) => e.deviceId === id);

test("idle units produce no incidents", () => {
  const { fleet, run } = setup();
  run(20_000);
  assert.equal(fleet.isRunning("SL-D-007"), false);
  assert.equal(fleet.isRunning("SL-D-001"), true);
  assert.deepEqual(fleet.getSnapshot().incidents, []);
});

test("restriction on 003 creates a delivered circuit incident while 001 is stepped", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-003", "restriction");
  run(5_000);
  const [e] = incidentsFor(fleet, "SL-D-003");
  assert.equal(e.subsystem, "circuit");
  assert.equal(e.tier, "urgent");
  assert.ok(e.deliveredAt !== undefined);
  assert.equal(incidentsFor(fleet, "SL-D-001").length, 0);
});

test("fleet keeps per-unit state when another unit is stepped", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-003", "restriction");
  run(5_000);
  assert.equal(unit(fleet, "SL-D-003").sim.conditions.drainageRestriction, true);
  assert.equal(unit(fleet, "SL-D-001").sim.conditions.drainageRestriction, false);
  assert.equal(unit(fleet, "SL-D-003").received.length, HISTORY_LENGTH);
  assert.equal(unit(fleet, "SL-D-001").received.length, HISTORY_LENGTH);
  assert.deepEqual(unit(fleet, "SL-D-003").localActive.sort(), ["drainage", "lowFlow"]);
});

test("link lost: no delivery, noData incident after 5 s, gap points recorded", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-001", "linkLost");
  fleet.act("SL-D-001", "restriction");
  run(6_000);
  assert.equal(fleet.isConnected("SL-D-001"), false);
  const list = incidentsFor(fleet, "SL-D-001");
  const circuit = list.find((e) => e.subsystem === "circuit")!;
  const link = list.find((e) => e.subsystem === "link")!;
  assert.equal(circuit.deliveredAt, undefined);
  assert.equal(link.hospitalSide, true);
  assert.ok(link.deliveredAt !== undefined);
  assert.ok("gap" in unit(fleet, "SL-D-001").received.at(-1)!);
  fleet.act("SL-D-001", "restore");
  run(2_000);
  assert.equal(incidentsFor(fleet, "SL-D-001").find((e) => e.subsystem === "circuit")!.late, true);
  assert.equal(incidentsFor(fleet, "SL-D-001").find((e) => e.subsystem === "link")!.backInBand, true);
});

test("network flap does not duplicate incidents", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-001", "restriction");
  let on = true;
  run(20_000, (now) => {
    if (now % 500 === 0) fleet.setNetwork((on = !on));
  });
  fleet.setNetwork(true);
  run(2_000);
  assert.equal(incidentsFor(fleet, "SL-D-001").filter((e) => e.subsystem === "circuit").length, 1);
});

test("unassigned unit stops alarming", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-002", "restriction");
  run(5_000);
  assert.equal(incidentsFor(fleet, "SL-D-002").length, 1);
  fleet.assign("SL-D-002", null);
  run(10_000);
  assert.equal(fleet.isRunning("SL-D-002"), false);
  assert.equal(incidentsFor(fleet, "SL-D-002").length, 1);
  assert.deepEqual(unit(fleet, "SL-D-002").localActive, []);
});

test("assigning a case starts an idle unit; a case cannot be on two units", () => {
  const { fleet } = setup();
  fleet.assign("SL-D-007", "DEMO-110");
  assert.equal(fleet.isRunning("SL-D-007"), true);
  assert.equal(unit(fleet, "SL-D-007").received.length, HISTORY_LENGTH);
  fleet.assign("SL-D-008", "DEMO-110");
  assert.equal(fleet.isRunning("SL-D-008"), false);
});

test("restore clears conditions", () => {
  const { fleet } = setup();
  fleet.act("SL-D-001", "restriction");
  fleet.act("SL-D-001", "thermalFault");
  fleet.act("SL-D-001", "standby");
  fleet.act("SL-D-001", "restore");
  const u = unit(fleet, "SL-D-001");
  assert.deepEqual(u.sim.conditions, NO_CONDITIONS);
  assert.equal(u.sim.settings.pumpDrive, "running");
});

test("mobility session switches to onboard supply without a mains alarm", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-001", "startMobility");
  run(5_000);
  const u = unit(fleet, "SL-D-001");
  assert.equal(u.sim.gasSource, "cylinder");
  assert.equal(u.sim.powerSource, "battery");
  assert.deepEqual(incidentsFor(fleet, "SL-D-001"), []);
});

test("snapshot changes identity on every step", () => {
  const { fleet, run } = setup();
  const a = fleet.getSnapshot();
  run(SAMPLE_MS);
  assert.notEqual(fleet.getSnapshot(), a);
  assert.equal(fleet.getSnapshot().version, a.version + 1);
});

test("network down raises one fleet-level incident, not one per unit", () => {
  const { fleet, run } = setup();
  fleet.setNetwork(false);
  run(7_000);
  const link = fleet.getSnapshot().incidents.filter((e) => e.subsystem === "link");
  assert.equal(link.length, 1);
  assert.equal(link[0].deviceId, "FLEET");
  assert.ok(link[0].deliveredAt !== undefined);
  fleet.setNetwork(true);
  run(500);
  const after = fleet.getSnapshot().incidents.filter((e) => e.subsystem === "link");
  assert.equal(after.length, 1);
  assert.equal(after[0].backInBand, true);
});

test("mirror view does not change while disconnected", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-003", "linkLost");
  fleet.act("SL-D-003", "standby");
  run(6_000);
  const u = unit(fleet, "SL-D-003");
  assert.ok(u.localActive.includes("pumpStopped"));
  assert.deepEqual(u.reported.localActive, []);
  assert.equal(u.reported.sim.settings.pumpDrive, "running");
  fleet.act("SL-D-003", "restore");
  run(SAMPLE_MS);
  assert.equal(unit(fleet, "SL-D-003").reported.sim.settings.pumpDrive, "running");
  assert.equal(unit(fleet, "SL-D-003").reported.sim.conditions.linkLost, false);
});

test("unassign clears active signals and conditions; a new case opens a new incident", () => {
  const { fleet, run } = setup();
  fleet.act("SL-D-004", "gasFault");
  run(5_000);
  fleet.assign("SL-D-004", null);
  const old = incidentsFor(fleet, "SL-D-004")[0];
  assert.equal(old.backInBand, true);
  assert.deepEqual(unit(fleet, "SL-D-004").sim.conditions, NO_CONDITIONS);
  fleet.assign("SL-D-004", "DEMO-112");
  fleet.act("SL-D-004", "gasFault");
  run(5_000);
  const gas = incidentsFor(fleet, "SL-D-004").filter((e) => e.subsystem === "gas");
  assert.equal(gas.length, 2);
  assert.equal(gas[0].caseId, "DEMO-112");
});
