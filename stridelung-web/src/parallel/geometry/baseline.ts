// The baseline thumbnail for the "Compare with baseline" scene: the single-cartridge concept in a narrower open bay
// — one cartridge on one cup, one inlet, one outlet, both capped. Drawn with its own builder and camera (same
// azimuth and elevation as the main figure). It is labelled unvalidated in the page, exactly like the two-cartridge
// cutaway; the comparison is of topology and packaging only, never of performance.
import { createBuilder, frameOf, rr, arc, k, G, A, K } from "../../lib/figure/builder.ts";

export function buildBaseline() {
  const W = 340, H = 330;
  const B = createBuilder({
    W, H, azimuth: 60, elevation: 27, pad: 12,
    fit: [[-250, -200, -8], [330, -200, -8], [-250, 200, -8], [330, 200, -8], [-250, 180, 600], [230, 180, 600], [-250, -180, 600], [330, -150, 560]],
    pieces: { stand: { label: "Structure", move: [0, 0, 0] } }, order: [], spring: { stagger: 0, stiffness: 1, damping: 1, substeps: 1 }, sysOf: {}, defaultSys: "concept",
  });
  const { P, S, Ln, Dots, at, box, cyl, ringXY, turned, disc, line, padOn, path3, splitArc, towardViewer, R } = B;
  const back: string[] = [];
  // a small bench plate
  const PL = { x: -250, y: -200, w: 580, d: 400, r: 14 };
  back.push(`<path class="iso-halo" d="${k.haloOf(PL, -14, 18, P)}"/>`);
  back.push(S(k.slabOf(PL, -14, 14, P, 8, 1.6), { tone: "mid" }));
  back.push(Ln(k.planOutline(k.insetPlan(PL, 7), 0, P), { tone: "lo" }));
  B.record(A.slab(PL, -14, 14, { name: "bench", ground: true }, 8));
  // the narrower single-cartridge bay, cut away: floor, back shell, left wall, a cut-down right wall
  const x0 = -230, x1 = 230, y0 = -165, y1 = 165;
  box("bay.floor", "shell", "stand", [x0, y0, 0], [x1, y1, 8], { tone: "lo" }, { r: 22, steps: 6 });
  box("bay.back", "shell", "stand", [x0, y1 - 3, 8], [x1, y1, 560], { tone: "lo" }, { r: 0 });
  box("bay.left", "shell", "stand", [x0, y0 + 20, 8], [x0 + 3, y1 - 3, 560], { tone: "lo" }, { r: 0 });
  box("bay.right", "shell", "stand", [x1 - 3, y0 + 20, 8], [x1, y1 - 3, 90], { tone: "mid" }, { r: 0 });
  box("bay.shelf", "shelves", "stand", [x0 + 3, y0 + 4, 60], [x1 - 3, y1 - 3, 70], { tone: "mid" }, { r: 2 });
  for (const s of [-1, 1]) box("bay.rail", "side-rails", "stand", [s < 0 ? x0 + 3 : x1 - 16, -150, 50], [s < 0 ? x0 + 16 : x1 - 3, 146, 60], { tone: "lo" }, { r: 0.6 });
  // carrier pad and collar
  const cx = 0, cy = -10, r = 58;
  box("bay.carrier", "carrier", "stand", [-110, -110, 70], [110, 90, 80], { tone: "mid" }, { r: 8, steps: 5 });
  cyl("bay.pad", "carrier", "stand", [cx, cy], 66, 80, 86, { tone: "lo" }, { steps: 64 });
  const annulus = (a0: number, a1: number, rIn: number, rOut: number) => [...arc(cx, cy, rOut, a0, a1, 24), ...arc(cx, cy, rIn, a1, a0, 24)];
  for (const p of splitArc(-180, 180)) ringXY("bay.collar", "carrier", "stand", annulus(p.from, p.to, r + 0.4, 64), 86, 98, { tone: "mid" });
  // the cartridge (same family as the main figure's, offset down by 88 mm)
  const F = frameOf([cx, cy, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const dz = -88;
  const bottom = turned("cart.bottom", "cart", "stand", F, [[174 + dz, 54], [176.4 + dz, 57.2, 1], [179 + dz, r], [206 + dz, r]], { tone: "mid" }, { steps: 64 });
  turned("cart.hx", "cart", "stand", F, [[206 + dz, r + 2], [236 + dz, r + 2]], { tone: "hi", className: "sl-steel" }, { steps: 64, extra: k.fadedSvg(G.ribsOf(F, 207 + dz, 235 + dz, r + 2, 54, P, { fade: [0.08, 0.5], seams: true }), { tone: "lo" }) });
  const T = towardViewer();
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt = (rr2: number, a: number, z: number) => [cx + rr2 * Math.cos(rad(a)), cy + rr2 * Math.sin(rad(a)), z];
  const ring = (rr2: number, a0: number, a1: number, z: number, n = 28) => Array.from({ length: n + 1 }, (_, i) => pt(rr2, a0 + ((a1 - a0) * i) / n, z));
  const W0 = T - 40, W1 = T + 40, Z0 = 262 + dz, Z1 = 428 + dz, RB = r - 6;
  const outline = path3([...ring(r, W0, W1, Z1), ...ring(r, W1, W0, Z0)], true);
  const fibres: string[] = [];
  for (const slope of [0.34, -0.34]) {
    for (let a = W0 - 70; a <= W1 + 70; a += 5) {
      const pts: number[][] = [];
      for (let z = Z0 - 24; z <= Z1 + 24; z += 6) pts.push(pt(RB, a + (z - Z0) * slope, z));
      fibres.push(path3(pts));
    }
  }
  const lowerCut = path3([...ring(r, W0, W1, Z0), ...ring(RB, W1, W0, Z0)], true);
  const windowArt = `<clipPath id="pl-base-win"><path d="${outline}"/></clipPath><g clip-path="url(#pl-base-win)"><path class="pl-bundle" d="${outline}"/><path class="sl-fibre" d="${fibres.join("")}"/>` +
    `<path class="iso-top" d="${lowerCut}"/>${Ln(lowerCut, { tone: "lo" })}<path class="sl-glass" d="${outline}"/></g>${Ln(outline, { tone: "mid" })}`;
  turned("cart.body", "cart", "stand", F, [[236 + dz, r], [452 + dz, r]], { tone: "hi", className: "pl-clear" }, { steps: 72, extra: windowArt });
  turned("cart.top", "cart", "stand", F, [[452 + dz, r], [468 + dz, r], [478 + dz, r - 8]], { tone: "mid" }, { steps: 64 });
  turned("cart.boss", "cart", "stand", F, [[478 + dz, 22], [488 + dz, 22]], { tone: "mid" }, { steps: 40 });
  turned("cart.port.in", "cart", "stand", F, [[488 + dz, 8.5], [506 + dz, 8.5]], { tone: "mid" }, { steps: 32 });
  padOn("cart.port.out", "cart", "stand", bottom.shapes[0], [cx, cy, 196 + dz], [0, -1, 0], 8.5, r + 14, { tone: "mid" });
  // one inlet and one outlet, each to a capped connector on a small boundary post beyond the cut-down right wall
  const BR = 6.5;
  const PX = 300, PY = -100, IN = 470, OUT = 150;
  cyl("post.base", "caps", "stand", [PX, PY], 24, 0, 6, { tone: "mid" });
  cyl("post.pole", "caps", "stand", [PX, PY], 4.5, 6, 500, { tone: "hi" });
  for (const [z, cls] of [[IN, "pl-blue"], [OUT, "pl-red"]] as const) {
    box("post.arm", "caps", "stand", [282, PY - 4, z - 4], [PX - 4.5, PY + 4, z + 4], { tone: "mid" }, { r: 1 });
    const FC = frameOf([254, PY, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    turned("cap.body", "caps", "stand", FC, [[0, BR + 2], [10, BR + 2], [10, BR + 3.4], [18, BR + 3.4], [18, BR + 2.4]], { tone: "mid" }, { steps: 32 });
    turned("cap.dome", "caps", "stand", FC, [[18, BR + 2.4], [23, BR + 2.4], [28, BR - 1.5]], { tone: "hi", className: cls }, { steps: 32 });
  }
  line("base.in", "inlet-tube", "stand", [[254, PY, IN], [224, PY, IN], [60, -10, IN], [0, -10, IN - 20], [0, -10, 506 + dz]], BR, { bend: 3, cls: "pl-blue", ends: ["none", "none"] });
  const EB = BR + 2.5, EBIN = Math.sqrt(EB * EB - BR * BR), oz = 196 + dz;
  line("base.out", "outlet-tube", "stand", [[0, -82, oz], [0, -120 + EBIN, oz]], BR, { cls: "pl-red", ends: ["none", "none"], touch: ["base.elbow"] });
  B.ball("base.elbow", "outlet-tube", "stand", [0, -120, oz], EB, { tone: "mid" });
  line("base.out2", "outlet-tube", "stand", [[EBIN, -120, oz], [200, -120, oz], [228, PY, OUT], [254, PY, OUT]], BR, { bend: 3, cls: "pl-red", ends: ["none", "none"], touch: ["base.elbow"] });
  void Dots; void at; void rr; void disc; void K;
  A.settle(R, P);
  R.items.sort((a: any, b: any) => a.key - b.key);
  const svg = back.join("") + R.items.map((item: any) => `<g class="it" data-c="${item.c}">${item.svg}</g>`).join("");
  return { W, H, svg, count: R.items.length, audit: () => A.auditOrExit(R, P, { argv: ["--audit"] }) };
}
