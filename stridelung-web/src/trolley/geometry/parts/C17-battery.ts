// C17 — Battery assembly including case/BMS. Low cassette 220 × 80 × 70 at (70, −90, 160) (P).
// LiFePO4 cell chemistry candidate (U). One battery assembly — not a declared hot-swappable redundant system.
// Front face: vents, a five-segment state-of-charge strip and a pull handle. 200 Wh nominal scenario, unvalidated.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C17",
  build() {
    const FACE = planeMatrix([-40, -130, 195], [1, 0, 0], [0, 0, -1]); // (u = x + 40, v = 195 − z)
    const soc = Array.from({ length: 5 }, (_, i) => `<path class="sl-led" data-led="${i}" d="${rr(150 + i * 10, 14, 157 + i * 10, 19, 1.5)}"/>`).join("");
    const vents = Array.from({ length: 7 }, (_, i) => rr(18 + i * 12, 28, 24 + i * 12, 58, 3)).join("");
    const face = `<g transform="${FACE}"><path class="sl-vent" d="${vents}"/>${soc}<path class="iso-line" data-tone="faint" d="${rr(140, 8, 210, 26, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M150 40H196M150 48H184"/></g>`;
    box("battery.case", "C17", "battery", [-40, -130, 125], [180, -50, 195], { tone: "mid" }, { r: 6, bevel: 0.8, inner: Ln(seamOf([-40, -130], [180, -50], 183, 6), { tone: "faint" }), extra: face });
    box("battery.pull", "C17", "battery", [40, -141, 150], [100, -134, 170], { tone: "hi" }, { r: 2 });
    for (const x of [44, 96]) box("battery.pull.post", "C17", "battery", [x - 3, -134, 155], [x + 3, -130, 165], { tone: "mid" }, { r: 0.5 });
  },
};
