// C20 — Touchscreen/operator display. Recessed panel 190 × 18 × 90, front flush at y −165, centre
// (70, −156, 725) (P). Glass screen / polymer bezel candidates (U). The screen is drawn in the face plane and
// filled live by the engine with three tabs — system, component, synthetic signals. Nothing shown on it is an
// operating instruction. It is mounted to the chassis, so it stays put when the door opens.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { DISP } from "../layout.ts";

export const part: Part = {
  id: "C20",
  build() {
    const face = { o: [DISP.x0, DISP.y0, DISP.z1], ex: [1, 0, 0], ey: [0, 0, -1] };
    const FACE = planeMatrix(face.o, face.ex, face.ey);
    const glass = rr(7, 7, 183, 83, 4);
    const screen = `<g transform="${FACE}" data-c="C20"><path class="sl-screen" d="${glass}"/><clipPath id="sl-screen-clip"><path d="${glass}"/></clipPath><g clip-path="url(#sl-screen-clip)" data-part="screen"></g><path class="iso-line" data-tone="lo" d="${glass}"/><path class="iso-line" data-tone="faint" d="${rr(3.5, 3.5, 186.5, 86.5, 6)}"/></g>`;
    box("stand.display", "C20", "stand", [DISP.x0, DISP.y0, DISP.z0], [DISP.x1, DISP.y1, DISP.z1], { tone: "mid" }, { r: 5, bevel: 0.6, sys: "electrical", extra: screen, bias: 5 });
    scene.display = face;
  },
};
