// Retractable handle: twin rails in rear channels inside the case, rising out of the lid slot to a crossbar with a
// grip sleeve and a release button. Shown part-raised. Each rail is drawn as its part inside the slot (hidden by
// the lid's front strip) and its part above the lid, so no clip is needed.
import { box, cyl, path3, Ln, seamOf, type Part } from "../builder.ts";
import { CASE, CHAN, HANDLE } from "../layout.ts";

export const part: Part = {
  id: "handle",
  build() {
    // rear channels the rails slide in (seen at the back of the bay above the carrier)
    for (const [r0, r1] of HANDLE.rails) box("handle.channel", "handle", "stand", [r0 - 4, CHAN.y0 + 2, 400], [r1 + 4, CASE.y1 - 3, CHAN.floor], { tone: "lo" }, { r: 1, bias: -10 });
    const bar0 = HANDLE.top - 24;
    for (const [r0, r1] of HANDLE.rails) {
      // inside the slot (drawn before the lid, whose front strip hides it) and above the lid
      box("handle.rail.low", "handle", "stand", [r0, HANDLE.y0, CHAN.floor], [r1, HANDLE.y1, CASE.z1], { tone: "hi" }, { r: 3, steps: 3 });
      box("handle.rail", "handle", "stand", [r0, HANDLE.y0, CASE.z1], [r1, HANDLE.y1, bar0], { tone: "hi" }, { r: 3, steps: 3, inner: Ln(seamOf([r0, HANDLE.y0], [r1, HANDLE.y1], CASE.z1 + 60, 3), { tone: "faint" }) });
    }
    const G0 = -110, G1 = 110;
    box("handle.crossbar.l", "handle", "stand", [HANDLE.rails[0][0], HANDLE.y0, bar0], [G0, HANDLE.y1, HANDLE.top], { tone: "hi" }, { r: 6, steps: 5, bevel: 0.8 });
    box("handle.crossbar.r", "handle", "stand", [G1, HANDLE.y0, bar0], [HANDLE.rails[1][1], HANDLE.y1, HANDLE.top], { tone: "hi" }, { r: 6, steps: 5, bevel: 0.8 });
    box("handle.grip", "handle", "stand", [G0, HANDLE.y0 - 2, bar0 - 1], [G1, HANDLE.y1 + 2, HANDLE.top + 1], { tone: "mid" }, { r: 8, steps: 6, extra: Ln(Array.from({ length: 13 }, (_, i) => path3([[-96 + i * 16, HANDLE.y0 - 2, bar0 - 1], [-96 + i * 16, HANDLE.y0 - 2, HANDLE.top + 1]])).join(""), { tone: "lo" }) });
    cyl("handle.button", "handle", "stand", [0, 140], 8, HANDLE.top + 1, HANDLE.top + 4, { tone: "hi" });
  },
};
