// C24 — Compatible backup/service-kit allowance. Pouch/drawer proxy 140 × 60 × 70 at (60, −110, 300) (P).
// Polymer case with supplier-compatible contents TBD (U). Contents depend on the chosen clinical system: not a
// verified emergency kit, a spare console or guaranteed pump support. Zip seam, label card, pull tab, strap.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C24",
  build() {
    const FACE = planeMatrix([-10, -140, 335], [1, 0, 0], [0, 0, -1]);
    const card = `<path class="sl-plate" d="${rr(16, 18, 64, 44, 2)}"/><path class="iso-line" data-tone="faint" d="${rr(16, 18, 64, 44, 2)}"/><path class="iso-line" data-tone="lo" data-free="" d="M22 27H54M22 34H46"/>`;
    box("kit.pouch", "C24", "kit", [-10, -140, 265], [130, -80, 335], { tone: "mid" }, { r: 8, steps: 5, bevel: 0.7, inner: Ln(seamOf([-10, -140], [130, -80], 322, 8, 5), { tone: "lo" }), extra: `<g transform="${FACE}">${card}</g>` });
    box("kit.tab", "C24", "kit", [90, -144, 318], [108, -140, 326], { tone: "hi" }, { r: 1 });
    box("kit.strap", "C24", "kit", [36, -142, 265], [48, -138, 335], { tone: "lo" }, { r: 0.5 });
  },
};
