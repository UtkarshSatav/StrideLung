// The display plinth the trolley stands on (back layer, not depth-sorted): slab on six feet, an inset
// groove, corner screws, two ruler strips (10 mm minor, 50 mm major, 100 mm long ticks), inlays of the
// stowed footprint and of the deployed C27 stabiliser envelope (620 × 480), and a label plate.
import { A, P, S, Ln, Dots, at, k, path3, planOf, record, depthS, PLINTH, scene } from "../builder.ts";

export function buildPlinth() {
  const back = scene.back;
  const PL = planOf([PLINTH.x0, PLINTH.y0], [PLINTH.x1, PLINTH.y1], 18);
  back.push(`<path class="iso-halo" d="${k.haloOf(PL, PLINTH.z0 - 8, 26, P)}"/>`);
  const feetAt = [[PLINTH.x0 + 40, PLINTH.y0 + 40], [PLINTH.x1 - 40, PLINTH.y0 + 40], [PLINTH.x0 + 40, PLINTH.y1 - 40], [PLINTH.x1 - 40, PLINTH.y1 - 40], [(PLINTH.x0 + PLINTH.x1) / 2, PLINTH.y0 + 40], [(PLINTH.x0 + PLINTH.x1) / 2, PLINTH.y1 - 40]];
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
  const FX = { x0: -300, x1: 320, y0: PLINTH.y0 + 22, y1: PLINTH.y0 + 34 };
  back.push(S(k.slabOf(planOf([FX.x0, FX.y0], [FX.x1, FX.y1], 1.5), 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  const minor: string[] = [], major: string[] = [];
  for (let x = FX.x0 + 10; x <= FX.x1 - 10; x += 10) {
    const big = (x - FX.x0) % 50 === 0;
    const len = (x - FX.x0) % 100 === 0 ? 8 : big ? 6 : 3.4;
    (big ? major : minor).push(path3([[x, FX.y0, 0.8], [x, FX.y0 + len, 0.8]]));
  }
  back.push(Ln(minor.join(""), { tone: "lo" }), Ln(major.join(""), { tone: "mid" }));
  const RY = { x0: PLINTH.x1 - 34, x1: PLINTH.x1 - 22, y0: -330, y1: 240 };
  back.push(S(k.slabOf(planOf([RY.x0, RY.y0], [RY.x1, RY.y1], 1.5), 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  const m2: string[] = [], M2: string[] = [];
  for (let y = RY.y0 + 10; y <= RY.y1 - 10; y += 10) {
    const big = (y - RY.y0) % 50 === 0;
    const len = (y - RY.y0) % 100 === 0 ? 8 : big ? 6 : 3.4;
    (big ? M2 : m2).push(path3([[RY.x1, y, 0.8], [RY.x1 - len, y, 0.8]]));
  }
  back.push(Ln(m2.join(""), { tone: "lo" }), Ln(M2.join(""), { tone: "mid" }));
  back.push(`<g data-c="C27" data-s="chassis" class="sl-inlay">${Ln(k.planOutline(planOf([-310, -240], [310, 240], 22), 0, P), { tone: "faint" })}${Ln(k.planOutline(planOf([-318, -248], [318, 248], 30), 0, P), { tone: "faint" })}</g>`);
  back.push(Ln(k.planOutline(planOf([-236, -171], [236, 171], 30), 0, P), { tone: "faint" }));
  const LP = planOf([470, -390], [610, -342], 2);
  back.push(S(k.slabOf(LP, 0, 1, P, 3), { tone: "lo", crease: "none" }));
  back.push(Ln(k.planOutline(k.insetPlan(LP, 3), 1, P, 3), { tone: "faint" }));
  back.push(Ln([96, 70, 84].map((w, i) => path3([[482, -382 + i * 12, 1], [482 + w, -382 + i * 12, 1]])).join(""), { tone: "lo", free: true }));
  back.push(Dots([at([598, -382, 1]), at([598, -350, 1])], { size: 0.5 }));
}
