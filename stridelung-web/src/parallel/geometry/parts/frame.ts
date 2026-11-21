// Internal side rails (two levels on each inner wall) and the two module shelves they carry. The lower shelf takes
// the shared carrier; the split manifold's arm sits below the upper shelf. Shelf spacing is a drawing choice.
import { P, Ln, Dots, at, box, ringXY, arc, k, planOf, type Part } from "../builder.ts";
import { RAILS, SHELF1, SHELF2, WALL } from "../layout.ts";

export const part: Part = {
  id: "frame",
  build() {
    for (const z of RAILS) {
      for (const s of [-1, 1]) {
        const xw = s < 0 ? WALL.l : WALL.r;
        const xi = xw - s * 13;
        const [a, b] = s < 0 ? [xw + 3, xi] : [xi, xw - 3];
        // an angle rail: a flange on the wall and a ledge the shelf rests on, screwed every 60 mm
        box(`rail.flange.${s < 0 ? "L" : "R"}${z}`, "side-rails", "stand", [s < 0 ? xw : xw - 3, -142, z - 12], [s < 0 ? xw + 3 : xw, 142, z + 10], { tone: "lo" }, { r: 0.6, bias: -20 });
        box(`rail.ledge.${s < 0 ? "L" : "R"}${z}`, "side-rails", "stand", [a, -142, z], [b, 142, z + 10], { tone: "mid" }, { r: 0.8, bias: -19, extra: Dots([-120, -60, 0, 60, 120].map((y) => at([s < 0 ? xw + 3 : xw - 3, y, z - 6])), { size: 0.45, tone: "lo" }) });
      }
    }
    // a line-management strip on the left wall: a channel with four empty P-clips (no line is routed in it)
    {
      const x0 = WALL.l, y = 96;
      box("wall.channel", "supports", "stand", [x0, y - 9, 220], [x0 + 9, y + 9, 600], { tone: "mid" }, { r: 1, extra: Dots([240, 580].map((z) => at([x0 + 9, y, z])), { size: 0.5 }) });
      for (const z of [290, 370, 450, 530]) {
        const base = box("wall.clip.base", "supports", "stand", [x0 + 9, y - 6, z - 7], [x0 + 14, y + 6, z + 7], { tone: "lo" }, { r: 0.6 });
        ringXY("wall.clip.loop", "supports", "stand", [...arc(x0 + 22, y, 9, 205, 515, 28), ...arc(x0 + 22, y, 6.5, 515, 205, 28)], z - 5, z + 5, { tone: "hi" }, { owner: base.name });
      }
    }
    // lower shelf: its exposed front strip carries a row of slots and a front upstand
    {
      const { x0, x1, y0, y1, z0, z1 } = SHELF1;
      const slots = Array.from({ length: 13 }, (_, i) => k.planOutline(planOf([-258 + i * 40, y0 + 10], [-258 + i * 40 + 22, y0 + 22], 5), z1, P, 4)).join("");
      // notched round the front pillars (the pillars own x > 263 in front of y −144)
      const outline = [[-263, y0], [263, y0], [263, -143], [x1, -143], [x1, y1], [x0, y1], [x0, -143], [-263, -143]];
      ringXY("shelf.lower", "shelves", "stand", outline, z0, z1, { tone: "mid" }, { bias: -15, extra: Ln(slots, { tone: "faint" }) });
      box("shelf.lower.lip", "shelves", "stand", [-252, y0, z1], [252, y0 + 3, z1 + 6], { tone: "hi" }, { r: 0.6 });
    }
    // upper shelf: mostly hidden behind the fascia; its front lip folds down
    {
      const { x0, x1, y0, y1, z0, z1 } = SHELF2;
      box("shelf.upper", "shelves", "stand", [x0, y0, z0], [x1, y1, z1], { tone: "mid" }, { r: 2, steps: 3 });
      box("shelf.upper.lip", "shelves", "stand", [x0 + 10, y0, z0 - 12], [x1 - 10, y0 + 3, z0], { tone: "hi" }, { r: 0.6, extra: Dots([-240, -120, 120, 240].map((x) => at([x, y0, z0 - 6])), { size: 0.45, tone: "lo" }) });
    }

  },
};
