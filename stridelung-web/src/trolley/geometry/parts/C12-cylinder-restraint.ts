// C12 — Cylinder restraint and isolated bay hardware: two cradles + straps, 120 × 140 × 560 around C11 (P).
// Aluminium cradle, replaceable TPE pads, strap material TBD (U). Open arcs (they clear the rear-left post),
// a cup base on the chassis pedestal, front straps with buckles and a backbone. They overlap C11 by design;
// they are restraints, not a second solid cylinder.
import { splitArc, A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { CYL } from "../layout.ts";

export const part: Part = {
  id: "C12",
  build() {
    const cradle = (a0: number, a1: number, rIn: number, rOut: number) => [...arc(CYL[0], CYL[1], rOut, a0, a1, 18), ...arc(CYL[0], CYL[1], rIn, a1, a0, 18)];
    // each ring is drawn as back and front pieces so the cylinder sits between them in depth
    const ring = (name: string, a0: number, a1: number, rIn: number, rOut: number, z0: number, z1: number, style: any) => {
      for (const p of splitArc(a0, a1)) ringXY(name, "C12", "gas", cradle(p.from, p.to, rIn, rOut), z0, z1, style, { owner: "C12" });
    };
    cyl("gas.cup.base", "C12", "gas", CYL, 54, 150, 158, { tone: "lo" }, { steps: 48, owner: "C12" });
    // the cradles open toward the rear (40°…150°): clear of the rear-left post and the C04 handle channel
    ring("gas.cradle.low", 150, 400, 55.5, 62, 158, 196, { tone: "mid" });
    ring("gas.cradle.high", 150, 400, 55.5, 62, 560, 590, { tone: "mid" });
    ring("gas.strap.low", -160, -20, 55.2, 57.4, 203, 221, { tone: "lo" });
    ring("gas.strap.high", -160, -20, 55.2, 57.4, 530, 548, { tone: "lo" });
    for (const z of [204, 531]) box("gas.buckle", "C12", "gas", [-152, 6, z - 2], [-138, 12.6, z + 20], { tone: "hi" }, { r: 2, owner: "C12" });
    // backbone joining the cradles, at the front-left of the cylinder
    box("gas.backbone", "C12", "gas", [-197, 16, 158], [-187, 28, 590], { tone: "mid" }, { r: 1, owner: "C12" });
  },
};
