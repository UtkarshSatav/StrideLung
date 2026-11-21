import { test } from "node:test";
import assert from "node:assert/strict";
import { createTrolley, stepTrolley, sampleOf, BASELINE_SETTINGS, type TrolleyState } from "../src/app/simulator/trolleySim.ts";

const DT = 0.125;
function run(s: TrolleyState, seconds: number, speed = 1, each?: (s: TrolleyState) => void): TrolleyState {
  for (let i = 0; i < Math.round(seconds / DT); i++) {
    s = stepTrolley(s, DT, speed);
    each?.(s);
  }
  return s;
}
const withConditions = (s: TrolleyState, c: Partial<TrolleyState["conditions"]>): TrolleyState => ({ ...s, conditions: { ...s.conditions, ...c } });

test("baseline sits mid-band", () => {
  run(createTrolley(0.7), 30, 1, (s) => {
    const x = sampleOf(s);
    assert.ok(x.flow >= 3.9 && x.flow <= 4.7, `flow ${x.flow}`);
    assert.ok(x.drain >= -45 && x.drain <= -27, `drain ${x.drain}`);
    assert.ok(x.drop >= 20 && x.drop <= 32, `drop ${x.drop}`);
  });
});

test("restriction lowers flow below 2.5 and drain below -80", () => {
  const x = sampleOf(run(withConditions(createTrolley(0), { drainageRestriction: true }), 1));
  assert.ok(x.flow < 2.5, `flow ${x.flow}`);
  assert.ok(x.drain < -80, `drain ${x.drain}`);
});

test("oxygenator creep raises drop above 45 within 10 s at speed 10", () => {
  const x = sampleOf(run(withConditions(createTrolley(0), { oxygenatorCreep: true }), 10, 10));
  assert.ok(x.drop > 45, `drop ${x.drop}`);
});

test("standby gives zero flow and speed", () => {
  const s = createTrolley(0);
  const x = sampleOf(run({ ...s, settings: { ...s.settings, pumpDrive: "standby" } }, 1));
  assert.equal(x.flow, 0);
  assert.equal(x.speed, 0);
});

test("battery holds on mains, drains on battery", () => {
  assert.equal(run(createTrolley(0), 20, 10).batteryPct, 100);
  assert.ok(run({ ...createTrolley(0), powerSource: "battery" }, 20, 10).batteryPct < 90);
});

test("cylinder drains only on cylinder gas; sweep 0 when empty", () => {
  assert.equal(run(createTrolley(0), 20, 10).cylinderPct, 100);
  assert.ok(run({ ...createTrolley(0), gasSource: "cylinder" }, 20, 10).cylinderPct < 90);
  const empty = run({ ...createTrolley(0), gasSource: "cylinder", cylinderPct: 0 }, 1);
  assert.equal(sampleOf(empty).sweep, 0);
  assert.equal(sampleOf(run(createTrolley(0), 1)).sweep, BASELINE_SETTINGS.sweepGas);
});

test("thermal fault drifts water >1.5 °C off setpoint within 5 s at speed 10", () => {
  const s = run(withConditions(createTrolley(0), { thermalFault: true }), 5, 10);
  assert.ok(Math.abs(s.waterTemp - s.settings.waterSetpoint) > 1.5, `water ${s.waterTemp}`);
});

test("single setpoint step stays in band", () => {
  const s = createTrolley(0);
  run({ ...s, settings: { ...s.settings, waterSetpoint: 37.5 } }, 30, 10, (x) => {
    assert.ok(Math.abs(x.waterTemp - x.settings.waterSetpoint) <= 0.5 + 1e-9);
  });
});

test("stepTrolley does not mutate input", () => {
  const s = withConditions(createTrolley(0), { oxygenatorCreep: true });
  const before = JSON.stringify(s);
  stepTrolley(s, DT, 10);
  assert.equal(JSON.stringify(s), before);
});

test("multi-step setpoint change never trips the water check", async () => {
  const { ALARMS } = await import("../src/app/simulator/alerts.ts");
  const s = createTrolley(0);
  run({ ...s, settings: { ...s.settings, waterSetpoint: 39 } }, 60, 1, (x) => {
    assert.equal(ALARMS.waterTemp.check(sampleOf(x), x), false, `water ${x.waterTemp}`);
  });
});

test("thermal fault trips the water check", async () => {
  const { ALARMS } = await import("../src/app/simulator/alerts.ts");
  const s = run(withConditions(createTrolley(0), { thermalFault: true }), 5, 10);
  assert.equal(ALARMS.waterTemp.check(sampleOf(s), s), true);
});
