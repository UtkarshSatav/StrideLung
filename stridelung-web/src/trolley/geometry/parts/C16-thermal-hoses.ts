// C16 — Thermal water hoses, paired, 10 mm visual OD, 1.6 m model path allocation (P).
// Supplier-qualified flexible hose TBD (U). Supply and return between C15's top ports and the heat-exchanger
// ports under C05, jogging under the core carrier. Water, blood and gas paths stay separate.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { HR } from "../layout.ts";

export const part: Part = {
  id: "C16",
  build() {
    line("thermal.supply", "C16", "thermal", [[110, -20, 378], [110, -20, 460], [110, -75, 460], [110, -75, 500]], HR, { flow: "water", ends: ["none", "coupling"], fit: [0, 7], fitLen: [0, 7], free: [false, true], bend: 3.4 });
    line("thermal.return", "C16", "thermal", [[135, -75, 500], [135, -75, 452], [135, -20, 452], [135, -20, 378]], HR, { flow: "water", ends: ["coupling", "none"], fit: [7, 0], fitLen: [7, 0], free: [true, false], bend: 3.4 });
  },
};
