// The trolley's fascia display. Its screen is drawn in the face plane and filled by the engine with the
// concept-only banner and the current scene's name — never settings, readings or instructions.
import { box, planeMatrix, rr, scene, type Part } from "../builder.ts";
import { DISP } from "../layout.ts";

export const part: Part = {
  id: "display",
  build() {
    const face = { o: [DISP.x0, DISP.y0, DISP.z1], ex: [1, 0, 0], ey: [0, 0, -1] };
    const FACE = planeMatrix(face.o, face.ex, face.ey);
    const w = DISP.x1 - DISP.x0, h = DISP.z1 - DISP.z0;
    const glass = rr(7, 7, w - 7, h - 7, 4);
    const screen = `<g transform="${FACE}" data-c="display"><path class="sl-screen" d="${glass}"/><clipPath id="pl-screen-clip"><path d="${glass}"/></clipPath>` +
      `<g clip-path="url(#pl-screen-clip)" data-part="screen"></g><path class="iso-line" data-tone="lo" d="${glass}"/><path class="iso-line" data-tone="faint" d="${rr(3.5, 3.5, w - 3.5, h - 3.5, 6)}"/></g>`;
    box("display.bezel", "display", "stand", [DISP.x0, DISP.y0, DISP.z0], [DISP.x1, DISP.y1, DISP.z1], { tone: "mid" }, { r: 5, bevel: 0.6, extra: screen, bias: 5 });
    scene.display = face;
  },
};
