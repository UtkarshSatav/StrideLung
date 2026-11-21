// C27 — Deployable stabiliser pair. 620 × 480 mm deployed support envelope (P); aluminium arms, elastomer feet
// candidates (U). Front and rear bars on slide rods through guides under the case; each bar carries two
// telescoping arms with foot pads and screw knobs. Shown deployed only in the Parked view. The deployed
// footprint is inlaid on the plinth so it is never hidden when quoting external size.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C27",
  build() {
    for (const side of [-1, 1]) {
      // side −1: front bar (moves −y); +1: rear bar (moves +y)
      const yc = side * 155;
      const dy = side * 63;
      const tag = side < 0 ? "F" : "B";
      for (const gx of [-80, 80]) {
        box(`stand.stab.hanger.${tag}`, "C27", "stand", [gx - 8, side < 0 ? -140 : 90, 34], [gx + 8, side < 0 ? -90 : 140, 90], { tone: "lo" }, { r: 1.5 });
        box(`stand.stab.guide.${tag}`, "C27", "stand", [gx - 13, side < 0 ? -140 : 90, 14], [gx + 13, side < 0 ? -90 : 140, 34], { tone: "mid" }, { r: 2, extra: Dots([at([gx - 8, side < 0 ? -140 : 140, 30]), at([gx + 8, side < 0 ? -140 : 140, 30])], { size: 0.4, tone: "lo" }) });
        const RF = frameOf([gx, side < 0 ? -146 : 146, 24], [0, -side, 0], [1, 0, 0], [0, 0, 1]);
        turned(`stab.rod.${tag}`, "C27", "stab", RF, [[-1, 5], [90, 5]], { tone: "hi" }, { move: [0, dy, 0] });
      }
      box(`stab.bar.${tag}`, "C27", "stab", [-150, yc - 10, 12], [150, yc + 10, 34], { tone: "mid" }, { r: 3, bevel: 0.6, move: [0, dy, 0], owner: `C27.${tag}`, inner: Ln(seamOf([-150, yc - 10], [150, yc + 10], 23, 3), { tone: "faint" }) });
      for (const sx of [-1, 1]) {
        const x0 = sx < 0 ? -150 : -50;
        const x1 = sx < 0 ? 50 : 150;
        const ye = yc + (sx < 0 ? 1 : -9);
        const ext = [sx * 160, dy, 0];
        box(`stab.ext.${tag}`, "C27", "stab", [x0, ye, 16], [x1, ye + 8, 30], { tone: "hi" }, { r: 1.5, move: ext, bias: -0.5, owner: `C27.${tag}` });
        box(`stab.foot.${tag}`, "C27", "stab", [sx < 0 ? -150 : 106, yc - 9, 14], [sx < 0 ? -106 : 150, yc + 9, 32], { tone: "hi" }, { r: 2, move: ext, owner: `C27.${tag}` });
        const px = sx * 128;
        cyl(`stab.pad.${tag}`, "C27", "stab", [px, yc], 22, 0, 11, { tone: "lo" }, { owner: `C27.${tag}`, steps: 40, move: ext, inner: Ln(k.sideArc(px, -yc, 22, 5, P, 40), { tone: "faint" }) });
        cyl(`stab.jack.${tag}`, "C27", "stab", [px, yc], 7, 11, 14, { tone: "mid" }, { owner: `C27.${tag}`, move: ext });
        cyl(`stab.knob.${tag}`, "C27", "stab", [px, yc], 11, 32, 39, { tone: "hi" }, { owner: `C27.${tag}`, move: ext, extra: Ln(k.knurl(px, -yc, 11, 32.6, 38.4, 26, P), { tone: "lo" }) });
      }
    }
  },
};
