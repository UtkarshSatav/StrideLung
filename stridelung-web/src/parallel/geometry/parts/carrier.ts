// The shared cartridge carrier: one base plate on the lower shelf, two cups (a pad and a collar each), a rear spine
// with cradle bands round both cartridges, the label plates engraved CONCEPT A / CONCEPT B, and the central mast
// and arm the split manifold is bolted to. It is a visual carrier; no retention or load claim is made.
import { P, Ln, Dots, at, box, cyl, ringXY, splitArc, planeMatrix, rr, arc, k, engrave, seamOf, type Part } from "../builder.ts";
import { ARM, CARRIER, CART, MAST, SPINE } from "../layout.ts";

const annulus = (cx: number, cy: number, a0: number, a1: number, rIn: number, rOut: number) => [...arc(cx, cy, rOut, a0, a1, 24), ...arc(cx, cy, rIn, a1, a0, 24)];

export const part: Part = {
  id: "carrier",
  build() {
    const { x0, x1, y0, y1, z0, z1 } = CARRIER;
    // base plate with a groove and corner screws
    const plateDots = Dots([[x0 + 10, y0 + 10], [x1 - 10, y0 + 10], [x0 + 10, y1 - 10], [x1 - 10, y1 - 10]].map(([x, y]) => at([x, y, z1])), { size: 0.5 });
    box("carrier.base", "carrier", "stand", [x0, y0, z0], [x1, y1, z1], { tone: "mid" }, { r: 10, steps: 6, bevel: 0.8, bias: -8, extra: Ln(k.planOutline(k.insetPlan({ x: x0, y: -y1, w: x1 - x0, d: y1 - y0, r: 10 }, 5), z1, P, 6), { tone: "faint" }) + plateDots });
    for (const cx of CART.xs) {
      const id = cx < 0 ? "A" : "B";
      // the cup: a pad the cartridge stands on, and a collar round its foot (drawn as back and front pieces)
      cyl(`carrier.pad.${id}`, "carrier", "stand", [cx, CART.y], 66, z1, z1 + 6, { tone: "lo" }, { steps: 64 });
      for (const p of splitArc(-180, 180)) ringXY(`carrier.collar.${id}`, "carrier", "stand", annulus(cx, CART.y, p.from, p.to, CART.r + 0.4, 64), z1 + 6, z1 + 18, { tone: "mid" });
      // two cradle bands round the back of each cartridge, each on a tab from the spine
      for (const z of [300, 420]) {
        for (const p of splitArc(20, 160)) ringXY(`carrier.band.${id}${z}`, "carrier", "stand", annulus(cx, CART.y, p.from, p.to, CART.r + 0.4, CART.r + 4), z, z + 14, { tone: "mid" });
        box(`carrier.tab.${id}${z}`, "carrier", "stand", [cx - 8, CART.y + CART.r + 4, z], [cx + 8, SPINE.y0, z + 14], { tone: "lo" }, { r: 0.8 });
      }
    }
    // rear spine, with lightening slots between the cartridges and the two engraved label plates
    {
      const FACE = planeMatrix([SPINE.x0, SPINE.y0, SPINE.z1], [1, 0, 0], [0, 0, -1]); // u = x + 232, v = 552 − z
      const fu = (x: number) => x - SPINE.x0;
      const fv = (z: number) => SPINE.z1 - z;
      const slots = [[270, 330], [350, 410], [430, 490]].map(([za, zb]) => rr(fu(-52), fv(zb), fu(52), fv(za), 10)).join("");
      const label = (x: number, text: string) => {
        const u0 = fu(x - 30), u1 = fu(x + 30);
        return `<path class="sl-plate" d="${rr(u0, fv(534), u1, fv(514), 2.5)}"/><path class="iso-line" data-tone="faint" d="${rr(u0 + 2.5, fv(531.5), u1 - 2.5, fv(516.5), 1.5)}"/>` +
          engrave((u0 + u1) / 2, fv(521.6), text, 7.2, "middle", "hi") +
          `<circle class="sl-screw" cx="${u0 + 5}" cy="${fv(524)}" r="1.3"/><circle class="sl-screw" cx="${u1 - 5}" cy="${fv(524)}" r="1.3"/>`;
      };
      const art = `<g transform="${FACE}"><path class="sl-cavity" d="${slots}"/><path class="iso-line" data-tone="lo" d="${slots}"/>${label(-202, "CONCEPT A")}${label(202, "CONCEPT B")}</g>`;
      box("carrier.spine", "carrier", "stand", [SPINE.x0, SPINE.y0, z1], [SPINE.x1, SPINE.y1, SPINE.z1], { tone: "lo" }, { r: 1, bias: -12, extra: art, inner: Ln(seamOf([SPINE.x0, SPINE.y0], [SPINE.x1, SPINE.y1], z1 + 12, 1), { tone: "faint" }) });
    }
    // the central mast (bracing the upper shelf) and the arm the split manifold is bolted to
    box("carrier.mast", "carrier", "stand", [MAST.x0, MAST.y0, MAST.z0], [MAST.x1, MAST.y1, MAST.z1], { tone: "mid" }, { r: 1 });
    box("carrier.arm", "carrier", "stand", [ARM.x0, ARM.y0, ARM.z0], [ARM.x1, ARM.y1, ARM.z1], { tone: "mid" }, { r: 1.5, extra: Dots([[-6, ARM.y0 + 8], [6, ARM.y0 + 8], [-6, ARM.y1 - 8], [6, ARM.y1 - 8]].map(([x, y]) => at([x, y, ARM.z1])), { size: 0.5 }) });
  },
};
