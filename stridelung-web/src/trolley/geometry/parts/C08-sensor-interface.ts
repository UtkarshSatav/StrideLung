// C08 — Core module carrier / reusable sensor interface. Small bridge block 60 × 40 × 35 at (165, 65, 620) (P).
// Aluminium carrier and polymer electronics cover candidates (U). Its front face carries four sockets for the
// clip-on sensor pods; it stands on a pillar from the core-module carrier (tagged C26 hardware).
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";

export const part: Part = {
  id: "C08",
  build() {
    box("sensor.block", "C08", "sensor", [135, 45, 602], [195, 85, 638], { tone: "mid" }, { r: 4, bevel: 0.6, inner: Ln(seamOf([135, 45], [195, 85], 626, 4), { tone: "faint" }), extra: Dots([[143, 45, 614], [157, 45, 614], [171, 45, 614], [185, 45, 614]].map(at), { size: 1.1, tone: "hi" }) + Dots([[140, 82, 638], [190, 82, 638], [140, 48, 638], [190, 48, 638]].map(at), { size: 0.45, tone: "lo" }) });
  },
};
