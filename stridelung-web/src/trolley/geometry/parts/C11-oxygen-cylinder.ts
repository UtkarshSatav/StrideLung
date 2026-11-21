// C11 — Medical oxygen cylinder with integral valve, 110 × 110 × 540, upright at (−145, 70), z 160…700 (P).
// Reference cylinder [S4]: 460 L nominal contents, 2 L water capacity, 3.5 kg — that does not fix this CAD
// outline. Composite-look surface only. Turned body with a smooth shoulder, filament-wound wrap texture,
// integral valve block, handwheel, front outlet and a split valve-protection guard. The valve is counted here.
import { splitArc, A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { CYL } from "../layout.ts";

export const part: Part = {
  id: "C11",
  build() {
    const F = frameOf([CYL[0], CYL[1], 160], [0, 0, 1], [1, 0, 0], [0, -1, 0]);
    const shoulder = (s: number) => (s <= 440 ? 55 : 18 + 37 * Math.sqrt(Math.max(0, 1 - ((s - 440) / 50) ** 2)));
    const prof: number[][] = [[0, 50], [4, 53, 1], [8, 55], [440, 55]];
    for (let s = 444; s <= 490; s += 4) prof.push([s, shoulder(s), 1]);
    prof.push([490, 18], [500, 18]);
    const wraps = G.ribsOf(F, 30, 420, 55, 40, P, { twist: 0.9, fade: [0.08, 0.5] });
    turned("gas.cylinder", "C11", "gas", F, prof, { tone: "hi", className: "sl-composite" }, { owner: "C11", inner: Ln(G.arcOf(F, 30, 55, P) + G.arcOf(F, 420, 55, P), { tone: "faint" }), extra: k.fadedSvg(wraps, { tone: "faint" }) });
    box("gas.valve", "C11", "gas", [-157, 58, 660], [-133, 82, 690], { tone: "mid" }, { r: 3, bevel: 0.5, owner: "C11" });
    const HW = frameOf([CYL[0], CYL[1], 690], [0, 0, 1], [1, 0, 0], [0, -1, 0]);
    disc("gas.handwheel", "C11", "gas", HW, 0, 6, 16, { tone: "hi" }, { owner: "C11", extra: k.fadedSvg(G.ribsOf(HW, 0, 6, 16, 30, P, { fade: [0.1, 0.55] }), { tone: "lo" }) });
    disc("gas.valve.outlet", "C11", "gas", frameOf([-145, 58, 675], [0, -1, 0], [1, 0, 0], [0, 0, 1]), 0, 10, 5.5, { tone: "mid" }, { owner: "C11" });
    const guard = (a0: number, a1: number) => [...arc(CYL[0], CYL[1], 33, a0, a1, 10), ...arc(CYL[0], CYL[1], 29, a1, a0, 10)];
    // the valve-protection guard sits on the shoulder, split into back and front pieces around the neck
    for (const [a0, a1] of [[110, 250], [-70, 70]]) for (const p of splitArc(a0, a1)) ringXY("gas.guard", "C11", "gas", guard(p.from, p.to), 640, 700, { tone: "lo" }, { owner: "C11" });
  },
};
