// C09 — Three pressure/temperature sensor pods, 35 × 25 × 25 each, 0.12 kg for all three (P).
// Symbolic housings clipped at three labelled measurement sites: (1) drainage / pre-pump on the drainage
// riser, (2) pre-oxygenator on the pump outlet leg, (3) post-oxygenator on the return line. Not every real
// measurement is combined in one sensor; no invasive port construction is shown. Each pod carries a tooltip.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C09",
  build() {
    box("pump.pod.a", "C09", "pump", [167.5, 7.5, 592], [192.5, 32.5, 627], { tone: "hi" }, { title: "C09 pressure/temperature site 1: drainage / pre-pump", r: 3, bevel: 0.5, extra: Dots([at([180, 7.5, 618])], { size: 1.2, tone: "hi" }) + Ln(path3([[170, 7.5, 600], [190, 7.5, 600]]), { tone: "faint" }) });
    box("pump.pod.b", "C09", "pump", [97.5, 42.5, 577], [122.5, 67.5, 602], { tone: "hi" }, { title: "C09 pressure/temperature site 2: pre-oxygenator", r: 3, bevel: 0.5 });
    box("stand.pod.c", "C09", "stand", [67, -47.5, 697.5], [102, -22.5, 722.5], { tone: "hi" }, { title: "C09 pressure/temperature site 3: post-oxygenator", r: 3, bevel: 0.5, sys: "blood", extra: Dots([at([84.5, -47.5, 716])], { size: 1.2, tone: "hi" }) });
  },
};
