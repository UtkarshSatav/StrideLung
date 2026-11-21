// The display plinth (back layer, not depth-sorted): slab on six feet, an inset groove, corner screws, a ruler
// strip along the front, the case's footprint inlay, and the hatched strip that marks the outer concept boundary —
// everything right of it is outside the scope of this concept.
import { A, P, S, Ln, Dots, at, k, path3, planOf, record, depthS, scene } from "../builder.ts";
import { PLINTH } from "../builder.ts";
import { BOUNDARY } from "../layout.ts";

export function buildPlinth() {
  const back = scene.back;
  const PL = planOf([PLINTH.x0, PLINTH.y0], [PLINTH.x1, PLINTH.y1], 18);
  back.push(`<path class="iso-halo" d="${k.haloOf(PL, PLINTH.z0 - 8, 26, P)}"/>`);
  const mx = (PLINTH.x0 + PLINTH.x1) / 2;
  const feetAt = [[PLINTH.x0 + 40, PLINTH.y0 + 40], [PLINTH.x1 - 40, PLINTH.y0 + 40], [PLINTH.x0 + 40, PLINTH.y1 - 40], [PLINTH.x1 - 40, PLINTH.y1 - 40], [mx, PLINTH.y0 + 40], [mx, PLINTH.y1 - 40]];
  for (const [x, y] of feetAt.sort((a, b) => depthS([a[0], a[1], 0]) - depthS([b[0], b[1], 0]))) {
    back.push(S(k.cylinder(x, -y, 22, PLINTH.z0 - 8, 2.4, P, 32), { tone: "lo" }));
    back.push(S(k.cylinder(x, -y, 16, PLINTH.z0 - 5.6, 5.6, P, 28), { tone: "mid" }));
  }
  back.push(S(k.slabOf(PL, PLINTH.z0, -PLINTH.z0, P, 8, 2.2), { tone: "mid", inner: Ln(k.sideSeam(PL, -9, P, 8), { tone: "faint" }) }));
  record(A.slab(PL, PLINTH.z0, -PLINTH.z0, { name: "stand.plinth", ground: true }, 8));
  back.push(Ln(k.planOutline(k.insetPlan(PL, 9), 0, P), { tone: "lo" }));
  const screws = [[PLINTH.x0 + 18, PLINTH.y0 + 18], [PLINTH.x1 - 18, PLINTH.y0 + 18], [PLINTH.x0 + 18, PLINTH.y1 - 18], [PLINTH.x1 - 18, PLINTH.y1 - 18]];
  back.push(Ln(screws.map(([x, y]) => k.ring(x, -y, 5, 0, P, 18)).join(""), { tone: "lo" }));
  back.push(Dots(screws.map(([x, y]) => at([x, y, 0])), { size: 0.55 }));
  // a ruler strip along the front edge (no scale is claimed for the concept; it is the bench's own ruler)
  const FX = { x0: -360, x1: 380, y0: PLINTH.y0 + 22, y1: PLINTH.y0 + 34 };
  back.push(S(k.slabOf(planOf([FX.x0, FX.y0], [FX.x1, FX.y1], 1.5), 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  const minor: string[] = [], major: string[] = [];
  for (let x = FX.x0 + 10; x <= FX.x1 - 10; x += 10) {
    const big = (x - FX.x0) % 50 === 0;
    const len = (x - FX.x0) % 100 === 0 ? 8 : big ? 6 : 3.4;
    (big ? major : minor).push(path3([[x, FX.y0, 0.8], [x, FX.y0 + len, 0.8]]));
  }
  back.push(Ln(minor.join(""), { tone: "lo" }), Ln(major.join(""), { tone: "mid" }));
  // the case footprint inlay
  back.push(Ln(k.planOutline(planOf([-296, -176], [296, 176], 30), 0, P), { tone: "faint" }));
  // outer concept boundary: a hatched inlay strip, its hatch ending on the strip's outline
  const B0 = planOf([BOUNDARY.x0, BOUNDARY.y0], [BOUNDARY.x1, BOUNDARY.y1], 2);
  back.push(`<g data-c="caps" class="pl-boundary">${S(k.slabOf(B0, 0, 0.8, P, 3), { tone: "lo", crease: "none" })}`);
  const hatchLines: string[] = [];
  for (let y = BOUNDARY.y0 + 6; y < BOUNDARY.y1 - 4; y += 9) hatchLines.push(path3([[BOUNDARY.x0 + 1.5, y, 0.8], [BOUNDARY.x1 - 1.5, Math.min(BOUNDARY.y1 - 1.5, y + 9), 0.8]]));
  back.push(Ln(hatchLines.join(""), { tone: "mid" }) + Ln(k.planOutline(k.insetPlan(B0, 1.5), 0.8, P, 3), { tone: "lo" }) + `</g>`);
  // a label plate at the front right of the plinth: three rule lines, no words
  const LP = planOf([440, -410], [560, -366], 2);
  back.push(S(k.slabOf(LP, 0, 1, P, 3), { tone: "lo", crease: "none" }));
  back.push(Ln(k.planOutline(k.insetPlan(LP, 3), 1, P, 3), { tone: "faint" }));
  back.push(Ln([84, 60, 72].map((w, i) => path3([[452, -402 + i * 11, 1], [452 + w, -402 + i * 11, 1]])).join(""), { tone: "lo", free: true }));
  back.push(Dots([at([548, -402, 1]), at([548, -374, 1])], { size: 0.5 }));
}
