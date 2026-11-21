// Four swivel casters: mounting plate, swivel race, fork crown and legs, wheel with hubs and axle nuts, and a
// brake tab on the outer leg. Brake appearance does not establish floor stability for the wider package.
import { G, P, Ln, Dots, at, box, cyl, disc, turned, frameOf, path3, k, type Part } from "../builder.ts";

export const CASTERS = [[-220, -118], [220, -118], [-220, 118], [220, 118]];

export const part: Part = {
  id: "wheels",
  build() {
    for (const [cx, cy] of CASTERS) {
      const out = Math.sign(cx);
      const tag = `${cx > 0 ? "R" : "L"}${cy < 0 ? "F" : "B"}`;
      box(`caster.plate.${tag}`, "wheels", "stand", [cx - 32, cy - 26, 84], [cx + 32, cy + 26, 90], { tone: "mid" }, { r: 3, bevel: 0.6, extra: Dots([[-24, -18], [24, -18], [-24, 18], [24, 18]].map(([dx, dy]) => at([cx + dx, cy + dy, 84])), { size: 0.45, tone: "lo" }) });
      cyl(`caster.race.${tag}`, "wheels", "stand", [cx, cy], 19, 76, 84, { tone: "lo" }, { inner: Ln(k.sideArc(cx, -cy, 19, 80, P, 32), { tone: "faint" }) });
      box(`caster.crown.${tag}`, "wheels", "stand", [cx - 17, cy - 13, 66], [cx + 17, cy + 13, 76], { tone: "mid" }, { r: 4 });
      for (const s of [-1, 1]) box(`caster.leg.${tag}`, "wheels", "stand", [cx + s * 17 - (s > 0 ? 3 : 0), cy - 10, 26], [cx + s * 17 + (s < 0 ? 3 : 0), cy + 10, 66], { tone: "mid" }, { r: 1 });
      const WF = frameOf([cx - 11, cy, 29], [1, 0, 0], [0, -1, 0], [0, 0, 1]);
      turned(`caster.wheel.${tag}`, "wheels", "stand", WF, [[0, 24], [1.5, 27.5, 1], [4, 29, 1], [18, 29, 1], [20.5, 27.5, 1], [22, 24]], { tone: "hi" }, { inner: Ln(G.arcOf(WF, 11, 29, P), { tone: "faint" }) });
      const HF = frameOf([cx - 13, cy, 29], [1, 0, 0], [0, -1, 0], [0, 0, 1]);
      disc(`caster.hub.${tag}`, "wheels", "stand", HF, 0, 2, 13, { tone: "mid" });
      disc(`caster.hub2.${tag}`, "wheels", "stand", HF, 24, 26, 13, { tone: "mid" });
      for (const side of [-1, 1]) disc(`caster.axle.${tag}`, "wheels", "stand", frameOf([cx + side * 17, cy, 29], [side, 0, 0], [0, -1, 0], [0, 0, 1]), 0, 3, 5.5, { tone: "lo" });
      // brake tab bolted to the outer fork leg
      const px0 = out > 0 ? cx + 17 : cx - 37;
      const px1 = out > 0 ? cx + 37 : cx - 17;
      box(`caster.brake.arm.${tag}`, "wheels", "stand", [Math.min(px0, px1), cy - 6, 52], [Math.max(px0, px1), cy + 6, 57], { tone: "mid" }, { r: 1 });
      box(`caster.brake.tab.${tag}`, "wheels", "stand", [out > 0 ? cx + 24 : cx - 38, cy - 10, 57], [out > 0 ? cx + 38 : cx - 24, cy + 10, 61], { tone: "hi" }, { r: 2, bevel: 0.4, extra: Ln([0, 1, 2].map((i) => path3([[out > 0 ? cx + 26 + i * 4 : cx - 36 + i * 4, cy - 8, 61], [out > 0 ? cx + 26 + i * 4 : cx - 36 + i * 4, cy + 8, 61]])).join(""), { tone: "lo" }) });
    }
  },
};
