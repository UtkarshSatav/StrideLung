// C07 — Reusable motor and pump drive. Rounded motor block 90 × 60 × 85 at (50, 110, 540); the drive
// starts at y 80, touching the pump-head coupling plane (P). Aluminium housing / copper winding candidates (U).
// The coupling disc is symbolic, not a validated mechanical design.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";

export const part: Part = {
  id: "C07",
  build() {
    box("drive.body", "C07", "drive", [5, 84, 497.5], [95, 140, 582.5], { tone: "mid" }, { r: 12, steps: 6, bevel: 1, inner: Ln(seamOf([5, 84], [95, 140], 512, 12, 6), { tone: "faint" }), extra: Ln(Array.from({ length: 7 }, (_, i) => k.planOutline(planOf([18 + i * 10, 96], [22 + i * 10, 130], 2), 582.5, P, 3)).join(""), { tone: "lo" }) });
    disc("drive.coupling", "C07", "drive", frameOf([50, 80, 540], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 4, 30, { tone: "hi" });
    disc("drive.gland", "C07", "drive", frameOf([40, 140, 520], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 6, 6, { tone: "lo" });
  },
};
