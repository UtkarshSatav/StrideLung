// C22 — Patient-line support/interface panel. Recessed side panel 20 × 120 × 70 at (220, 0, 700), outer
// surface x 230 (P). Aluminium bracket, TPE supports; blood connectors TBD (U). The pocket itself is cut into
// the right wall (drawn with C01, tagged C22); here are the bulkhead connectors (inside and outside) and
// the TPE cradles that carry the lines over the lip without pinching them.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C22",
  build() {
    disc("stand.c22.stub", "C22", "stand", frameOf([210, 20, 682], [-1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 7, 9, { tone: "mid" }, { sys: "blood", title: "C22 drainage bulkhead (inside)" });
    disc("stand.c22.stub", "C22", "stand", frameOf([210, -35, 710], [-1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 7, 9, { tone: "mid" }, { sys: "blood", title: "C22 return bulkhead (inside)" });
    disc("stand.c22.port", "C22", "stand", frameOf([213, 20, 682], [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 9, 9, { tone: "mid" }, { sys: "blood", title: "C22 drainage line connector" });
    disc("stand.c22.port", "C22", "stand", frameOf([213, -35, 710], [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 9, 9, { tone: "mid" }, { sys: "blood", title: "C22 return line connector" });
    for (const [y, z] of [[20, 682], [-35, 710]]) box("stand.c22.cradle", "C22", "stand", [222, y - 10, z - 13.5], [230, y + 10, z - 6.5], { tone: "lo" }, { r: 1, sys: "blood", title: "C22 TPE line support" });
  },
};
