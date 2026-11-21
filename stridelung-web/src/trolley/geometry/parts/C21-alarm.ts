// C21 — Audible/visual alarm assembly. Indicator block 70 × 40 × 25 at (−145, −115, 745) (P).
// LED diffuser, polymer housing, buzzer candidates (U). Sits behind a lens in the front door. It blinks during
// the blocked-line illustration. No "silence" or "emergency stop" interaction is presented.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C21",
  build() {
    const FACE = planeMatrix([-180, -135, 758], [1, 0, 0], [0, 0, -1]);
    box("stand.alarm", "C21", "stand", [-180, -135, 732], [-110, -95, 758], { tone: "mid" }, { r: 4, bevel: 0.5, sys: "electrical", extra: `<g transform="${FACE}"><g class="sl-alarm-led" data-part="alarm-led"><path class="sl-diffuser" d="${rr(30, 5, 64, 21, 6)}"/><path class="iso-line" data-tone="lo" d="${rr(30, 5, 64, 21, 6)}"/></g>${Array.from({ length: 12 }, (_, i) => `<circle class="sl-pin" cx="${7 + (i % 4) * 5}" cy="${7 + Math.floor(i / 4) * 5}" r="1"/>`).join("")}</g>` });
  },
};
