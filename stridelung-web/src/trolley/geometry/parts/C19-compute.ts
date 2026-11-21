// C19 — Compute, sensor acquisition and I/O assembly. Flat box 230 × 50 × 60 at (65, −110, 410) (P).
// PCB assembly in a shielded aluminium enclosure candidate (U). In the dry front compartment below the core:
// connector row, ventilation grille, lid screws and three cable connectors (left, right, top).
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C19",
  build() {
    const FACE = planeMatrix([-50, -135, 440], [1, 0, 0], [0, 0, -1]); // (u = x + 50, v = 440 − z)
    const ports = [16, 46, 76].map((u) => `<path class="sl-cavity" d="${rr(u, 22, u + 22, 34, 3)}"/><path class="iso-line" data-tone="lo" d="${rr(u, 22, u + 22, 34, 3)}"/>${[0, 1, 2, 3].map((j) => `<circle class="sl-pin" cx="${u + 4.5 + j * 4.4}" cy="28" r=".9"/>`).join("")}`).join("");
    const grille = Array.from({ length: 9 }, (_, i) => rr(118 + i * 11, 14, 124 + i * 11, 46, 3)).join("");
    box("compute.box", "C19", "compute", [-50, -135, 380], [180, -85, 440], { tone: "mid" }, { r: 3, bevel: 0.6, inner: Ln(seamOf([-50, -135], [180, -85], 430, 3), { tone: "faint" }), extra: `<g transform="${FACE}">${ports}<path class="sl-vent" d="${grille}"/></g>` + Dots([[-44, -129], [174, -129], [-44, -91], [174, -91]].map(([x, y]) => at([x, y, 440])), { size: 0.45, tone: "lo" }) });
    disc("compute.conn.l", "C19", "compute", frameOf([-40, -100, 380], [0, 0, -1], [1, 0, 0], [0, -1, 0]), 0, 5, 5, { tone: "lo" });
    disc("compute.conn.r", "C19", "compute", frameOf([180, -110, 410], [1, 0, 0], [0, -1, 0], [0, 0, 1]), 0, 5, 5, { tone: "lo" });
    disc("compute.conn.t", "C19", "compute", frameOf([40, -90, 440], [0, 0, 1], [1, 0, 0], [0, -1, 0]), 0, 5, 5, { tone: "lo" });
  },
};
