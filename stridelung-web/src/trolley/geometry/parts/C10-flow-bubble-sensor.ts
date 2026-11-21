// C10 — Flow and bubble sensor assembly. A clip 65 × 50 × 35 around the return line at (170, −35, 710) (P).
// Polymer clip, sensor elements and cable; specification TBD (U). Flow and bubble functions are proposed.
// This file also owns the internal return line (oxygenator outlet → post-oxygenator pod → C10 → C22),
// which stays home in the exploded view; its oxygenator end has a coupling that comes apart.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { BR } from "../layout.ts";

export const part: Part = {
  id: "C10",
  build() {
    line("blood.return", "C10", "stand", [[20, -35, 678], [20, -35, 710], [203, -35, 710]], BR, { flow: "return", ends: ["coupling", "none"], fit: [8.6, 0], fitLen: [8, 0], free: [true, false], sys: "blood", gapsAlong: [[0, 66.5, 102.5], [0, 136.5, 203]], also: "C25" });
    box("stand.c10.jaw", "C10", "stand", [137, -60, 692], [203, -10, 708], { tone: "mid" }, { r: 4, bevel: 0.5, sys: "blood" });
    box("stand.c10.lid", "C10", "stand", [137, -60, 712], [203, -10, 728], { tone: "hi" }, { title: "C10 flow and bubble sensing (proposed functions) on the return line", r: 4, bevel: 0.6, sys: "blood", extra: Ln(k.planOutline(planOf([146, -52], [194, -18], 3), 728, P, 3), { tone: "faint" }) + Dots([at([150, -60, 720]), at([190, -60, 720])], { size: 1.0, tone: "hi" }) });
    box("stand.c10.hinge", "C10", "stand", [137, -12, 706], [203, -8, 714], { tone: "lo" }, { r: 1, sys: "blood" });
  },
};
