// C14 — Gas tubing and outlet guards, 6 mm visual OD, 1.6 m model path allocation (P).
// Oxygen-compatible supplier tubing TBD (U). Three lines: cylinder valve → C13 (supply), C13 → the oxygenator's
// gas inlet (sweep), and a separate exhaust from the oxygenator's gas outlet, down through the gas bay
// to an outlet guard on the left wall — never into the battery compartment. Gas never enters a blood line.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { GR } from "../layout.ts";

export const part: Part = {
  id: "C14",
  build() {
    line("gas.supply", "C14", "gas", [[-145, 48, 675], [-145, -60, 675], [-145, -60, 633]], GR, { flow: "gas", ends: ["none", "coupling"], fit: [0, 4.8], fitLen: [0, 6], free: [false, true], cls: "sl-gasline" });
    line("gas.sweep", "C14", "gasctl", [[-97, -80, 600], [-75, -80, 600], [-75, -80, 645], [-75, -40, 645], [-37, -40, 645]], GR, { flow: "gas", ends: ["none", "coupling"], fit: [0, 4.8], fitLen: [0, 6], free: [false, true], cls: "sl-gasline" });
    line("gas.exhaust", "C14", "gas", [[-37, -60, 566], [-66, -60, 566], [-66, -60, 455], [-198, -60, 455], [-198, -60, 125], [-221, -60, 125]], GR, { flow: "gasout", ends: ["coupling", "shell"], fit: [4.8, 5], fitLen: [6, 6], free: [true, true], cls: "sl-gasline" });
    box("stand.exhaust.guard", "C14", "stand", [-227, -76, 112], [-221, -44, 138], { tone: "mid" }, { r: 2, sys: "gas", title: "C14 exhaust outlet guard (gas bay, left wall)", extra: Ln([0, 1, 2].map((i) => path3([[-221, -72 + i * 10, 117], [-221, -68 + i * 10, 117], [-221, -68 + i * 10, 133], [-221, -72 + i * 10, 133]], true)).join(""), { tone: "lo" }) });
  },
};
