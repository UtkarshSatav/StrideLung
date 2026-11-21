// C18 — Power conversion, charging and isolation assembly. Low block 180 × 80 × 45 at (70, 10, 155) (P).
// Electronics in an insulated/metal enclosure; materials TBD (U). An abstract electrical block — no wiring
// schematic or compliance is claimed. Heat-sink slots on top, a socket bank on the front.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C18",
  build() {
    const FACE = planeMatrix([-20, -30, 178], [1, 0, 0], [0, 0, -1]); // (u = x + 20, v = 178 − z)
    const sockets = [20, 44, 68, 92].map((u) => `<path class="sl-cavity" d="${rr(u, 14, u + 14, 26, 2)}"/><path class="iso-line" data-tone="lo" d="${rr(u, 14, u + 14, 26, 2)}"/>`).join("");
    box("power.box", "C18", "power", [-20, -30, 132], [160, 50, 178], { tone: "mid" }, { r: 4, bevel: 0.6, extra: `<g transform="${FACE}">${sockets}<path class="iso-line" data-tone="lo" data-free="" d="M120 16H164M120 24H152"/></g>` + Ln(Array.from({ length: 10 }, (_, i) => k.planOutline(planOf([-6 + i * 16, -18], [0 + i * 16, 38], 3), 178, P, 3)).join(""), { tone: "faint" }) });
  },
};
