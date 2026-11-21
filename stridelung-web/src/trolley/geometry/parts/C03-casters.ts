// C03 — Four braked caster assemblies, 75 × 60 × 90 each, 1.00 kg for all four (P).
// Polyurethane tread, polymer hub, metal fork candidates (U). Mounting plate, swivel race, fork crown,
// fork legs, wheel with hubs and axle nuts, and a brake lever with a pedal that pushes down 5 mm when parked.
// Brake appearance does not establish floor stability.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";

export const CASTERS = [[-190, -115], [190, -115], [-190, 115], [190, 115]];

export const part: Part = {
  id: "C03",
  build() {
    for (const [cx, cy] of CASTERS) {
      const out = Math.sign(cx);
      const tag = `${cx > 0 ? "R" : "L"}${cy < 0 ? "F" : "B"}`;
      box(`stand.caster.plate.${tag}`, "C03", "stand", [cx - 32, cy - 26, 84], [cx + 32, cy + 26, 90], { tone: "mid" }, { r: 3, bevel: 0.6, extra: Dots([[-24, -18], [24, -18], [-24, 18], [24, 18]].map(([dx, dy]) => at([cx + dx, cy + dy, 84])), { size: 0.45, tone: "lo" }) });
      cyl(`stand.caster.race.${tag}`, "C03", "stand", [cx, cy], 19, 76, 84, { tone: "lo" }, { inner: Ln(k.sideArc(cx, -cy, 19, 80, P, 32), { tone: "faint" }) });
      box(`stand.caster.crown.${tag}`, "C03", "stand", [cx - 17, cy - 13, 66], [cx + 17, cy + 13, 76], { tone: "mid" }, { r: 4 });
      for (const s of [-1, 1]) box(`stand.caster.leg.${tag}`, "C03", "stand", [cx + s * 17 - (s > 0 ? 3 : 0), cy - 10, 26], [cx + s * 17 + (s < 0 ? 3 : 0), cy + 10, 66], { tone: "mid" }, { r: 1 });
      const WF = frameOf([cx - 11, cy, 29], [1, 0, 0], [0, -1, 0], [0, 0, 1]);
      turned(`stand.caster.wheel.${tag}`, "C03", "stand", WF, [[0, 24], [1.5, 27.5, 1], [4, 29, 1], [18, 29, 1], [20.5, 27.5, 1], [22, 24]], { tone: "hi" }, { inner: Ln(G.arcOf(WF, 11, 29, P), { tone: "faint" }) });
      const HF = frameOf([cx - 13, cy, 29], [1, 0, 0], [0, -1, 0], [0, 0, 1]);
      disc(`stand.caster.hub.${tag}`, "C03", "stand", HF, 0, 2, 13, { tone: "mid" });
      disc(`stand.caster.hub2.${tag}`, "C03", "stand", HF, 24, 26, 13, { tone: "mid" });
      for (const side of [-1, 1]) {
        const AF = frameOf([cx + side * 20, cy, 29], [side, 0, 0], [0, -1, 0], [0, 0, 1]);
        disc(`stand.caster.axle.${tag}`, "C03", "stand", AF, 0, 3, 5.5, { tone: "lo" });
      }
      // brake lever bolted to the outer fork leg, pedal at its end
      const px0 = out > 0 ? cx + 17 : cx - 37;
      const px1 = out > 0 ? cx + 37 : cx - 17;
      box(`brake.arm.${tag}`, "C03", "brake", [Math.min(px0, px1), cy - 6, 52], [Math.max(px0, px1), cy + 6, 57], { tone: "mid" }, { r: 1 });
      box(`brake.pedal.${tag}`, "C03", "brake", [out > 0 ? cx + 24 : cx - 38, cy - 10, 57], [out > 0 ? cx + 38 : cx - 24, cy + 10, 61], { tone: "hi" }, { r: 2, bevel: 0.4, extra: Ln([0, 1, 2].map((i) => path3([[out > 0 ? cx + 26 + i * 4 : cx - 36 + i * 4, cy - 8, 61], [out > 0 ? cx + 26 + i * 4 : cx - 36 + i * 4, cy + 8, 61]])).join(""), { tone: "lo" }) });
    }
  },
};
