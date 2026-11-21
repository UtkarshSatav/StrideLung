// The outer concept boundary. A weighted post at the plinth's edge carries the shared inlet's and the shared
// outlet's capped connectors on two arms: symbolic connection caps where the concept stops. What lies beyond them
// (pump, sensing, the rest of a circuit) is outside the scope of this concept and is not drawn.
import { G, P, Ln, Dots, at, box, cyl, turned, frameOf, k, type Part } from "../builder.ts";
import { POST, BR } from "../layout.ts";

export const part: Part = {
  id: "boundary",
  build() {
    const { x, y } = POST;
    for (let i = 0; i < 3; i++) {
      const a = ((i * 120 + 30) * Math.PI) / 180;
      cyl("post.foot", "caps", "stand", [x + Math.cos(a) * 46, y + Math.sin(a) * 46], 10, 0, 4, { tone: "lo" });
    }
    cyl("post.base", "caps", "stand", [x, y], 56, 4, 16, { tone: "mid" }, { steps: 64, bevel: 1, inner: Ln(k.sideArc(x, -y, 56, 10, P, 56), { tone: "faint" }), extra: Ln(k.ring(x, -y, 44, 16, P, 56), { tone: "faint" }) + Dots([0, 1, 2, 3, 4, 5].map((i) => at([x + Math.cos(i * 1.047 + 0.5) * 36, y + Math.sin(i * 1.047 + 0.5) * 36, 16])), { size: 0.5 }) });
    cyl("post.boss", "caps", "stand", [x, y], 18, 16, 28, { tone: "lo" });
    const cuts = [28, POST.outZ - 9, POST.outZ + 9, POST.inZ - 9, POST.inZ + 9, 556];
    for (let i = 0; i < cuts.length; i += 2) cyl("post.pole", "caps", "stand", [x, y], 9, cuts[i], cuts[i + 1], { tone: "hi" }, { inner: i === 0 ? Ln(k.sideArc(x, -y, 9, 200, P, 20), { tone: "faint" }) : "" });
    cyl("post.cap", "caps", "stand", [x, y], 11, 556, 562, { tone: "mid" }, { bevel: 0.6 });
    for (const [z, cls, label] of [[POST.inZ, "pl-blue", "Shared inlet — capped at the concept boundary"], [POST.outZ, "pl-red", "Shared outlet — capped at the concept boundary"]] as const) {
      // a clamp collar on the pole and an arm out to the connector
      cyl("post.collar", "caps", "stand", [x, y], 14, z - 9, z + 9, { tone: "mid" }, { extra: Ln(k.knurl(x, -y, 14, z - 8.4, z + 8.4, 24, P), { tone: "lo" }) });
      box("post.arm", "caps", "stand", [428, y - 6, z - 6], [x - 14, y + 6, z + 6], { tone: "mid" }, { r: 1.5 });
      // the capped connector: a coupling body the line enters, closed by a domed cap that is never opened
      const F = frameOf([400, y, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
      turned("post.connector", "caps", "stand", F, [[0, BR + 2], [12, BR + 2], [12, BR + 3.6], [21, BR + 3.6], [21, BR + 2.4]], { tone: "mid" }, { steps: 32, title: label });
      turned("post.capdome", "caps", "stand", F, [[21, BR + 2.4], [24, BR + 2.2, 1], [26.4, BR, 1], [28, 0]], { tone: "hi", className: cls }, { steps: 32, title: label, inner: Ln(G.arcOf(F, 22.5, BR + 2.3, P), { tone: "faint" }) });
    }
  },
};
