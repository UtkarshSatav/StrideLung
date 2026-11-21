// Generates the parallel-oxygenator concept figure from src/parallel/geometry and its baseline thumbnail.
//
//   npm run parallel          build and settle the painter's order (both figures)
//   npm run parallel:audit    the same, then the geometry audit (clearances, supports, depth order, …)
//
// Output: src/parallel/generated/figure.json   (camera, back layer, door art, depth-sorted items)
//         src/parallel/generated/baseline.json (the single-cartridge thumbnail, finished markup)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { A, P, R, W, H, VIEW, KS, k, scene, lines } from "../src/parallel/geometry/builder.ts";
import { buildPlinth } from "../src/parallel/geometry/scene/plinth.ts";
import { PARTS } from "../src/parallel/geometry/parts/index.ts";
import { buildBaseline } from "../src/parallel/geometry/baseline.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "src", "parallel", "generated");
const AUDIT = process.argv.includes("--audit");
const f2 = (v: number) => Math.round(v * 100) / 100;

const t0 = Date.now();
buildPlinth();
for (const part of PARTS) part.build();
A.settle(R, P);
R.items.sort((a: any, b: any) => a.key - b.key);
const settle = ((Date.now() - t0) / 1000).toFixed(1);

const unitScreen = (v: number[]) => {
  const o = k.iso([0, 0, 0], P);
  const p = k.iso(v, P);
  return [f2(p[0] - o[0]), f2(p[1] - o[1])];
};
const items = R.items.map((item: any, i: number) => ({ i, n: item.name, c: item.c, x: item.also || undefined, k: f2(item.key), a: item.attrs || undefined, t: item.title || undefined, svg: item.svg }));
const figure = {
  W, H, P, V: VIEW, KS,
  EX: unitScreen([1, 0, 0]), EY: unitScreen([0, 1, 0]), EZ: unitScreen([0, 0, 1]),
  back: scene.back.join(""),
  defs: scene.defs.join(""),
  door: scene.door,
  hinge: scene.hinge,
  openDeg: scene.openDeg,
  display: scene.display,
  items,
};
const baseline = buildBaseline();
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "figure.json"), JSON.stringify(figure));
writeFileSync(join(OUT, "baseline.json"), JSON.stringify({ W: baseline.W, H: baseline.H, svg: baseline.svg, count: baseline.count }));
const kb = Math.round(JSON.stringify(figure).length / 1024);
console.log(`parallel: ${R.items.length} items · ${R.solids.length} solids · ${R.tubes.length} tube runs · ${kb} KB · settle ${settle}s`);
console.log(`lines: ${lines.map((l: any) => `${l.name} ${Math.round(l.length)}mm`).join(" · ")}`);
console.log(`baseline: ${baseline.count} items · ${Math.round(baseline.svg.length / 1024)} KB`);
if (AUDIT) {
  console.log("— main figure —");
  A.auditOrExit(R, P, { argv: ["--audit"] });
  console.log("— baseline thumbnail —");
  baseline.audit();
}
