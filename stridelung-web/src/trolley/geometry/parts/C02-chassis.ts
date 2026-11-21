// C02 — Internal chassis and module shelves. Open rail frame, 400 × 270 × 640 envelope (P).
// 6061-T6 aluminium candidate (U). Posts, bottom and top ring rails, the battery tray (S1), the
// thermal shelf (S2), the core-shelf runners and the core-module carrier rails, and the gas-bay pedestal.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";

export const part: Part = {
  id: "C02",
  build() {
    // the rear partition post stands at y 80…100, clear of the handle zone at the rear
    const POSTS = [[-200, -180, 115, 135], [190, 200, 115, 135], [190, 200, -135, -115], [-80, -60, -135, -115], [-80, -60, 80, 100]];
    for (const [x0, x1, y0, y1] of POSTS) box("stand.post", "C02", "stand", [x0, y0, 93], [x1, y1, 785], { tone: "mid" }, { r: 1.5, inner: Ln(seamOf([x0, y0], [x1, y1], 440, 1.5), { tone: "faint" }) });
    // bottom ring rails
    box("stand.rail.bf", "C02", "stand", [-60, -135, 93], [190, -115, 113], { tone: "lo" }, { r: 1 });
    box("stand.rail.bb", "C02", "stand", [-180, 115, 93], [190, 135, 113], { tone: "lo" }, { r: 1, bias: -5 });
    box("stand.rail.br", "C02", "stand", [190, -115, 93], [200, 115, 113], { tone: "lo" }, { r: 1 });
    box("stand.rail.bl", "C02", "stand", [-80, -115, 93], [-60, 100, 113], { tone: "lo" }, { r: 1 });
    // top rails; the front one carries the display and alarm brackets
    box("stand.rail.tf", "C02", "stand", [-200, -135, 765], [200, -115, 785], { tone: "mid" }, { r: 1.5, bevel: 0.5 });
    box("stand.rail.tr", "C02", "stand", [190, -115, 765], [200, 115, 785], { tone: "mid" }, { r: 1 });
    box("stand.rail.tl", "C02", "stand", [-80, -115, 765], [-60, 100, 785], { tone: "mid" }, { r: 1 });
    box("stand.rail.tg", "C02", "stand", [-200, -115, 765], [-180, 115, 785], { tone: "mid" }, { r: 1 });
    // S1 battery tray, S2 thermal shelf
    box("stand.tray.battery", "C02", "stand", [-45, -135, 113], [185, -45, 125], { tone: "lo" }, { r: 2, extra: Dots([[-38, -128], [178, -128], [-38, -52], [178, -52]].map(([x, y]) => at([x, y, 125])), { size: 0.45, tone: "lo" }) });
    box("stand.shelf.thermal", "C02", "stand", [-50, -118, 200], [188, 135, 210], { tone: "lo" }, { r: 2, inner: Ln(seamOf([-50, -118], [188, 135], 205, 2), { tone: "faint" }) });
    box("stand.shelf.web", "C02", "stand", [188, -115, 200], [190, 115, 210], { tone: "lo" }, { r: 0 });
    // core-shelf runners (fore-aft) and the core-module carrier cross rails
    box("stand.runner.l", "C02", "stand", [-60, -115, 482], [-50, 115, 494], { tone: "mid" }, { r: 1 });
    box("stand.runner.r", "C02", "stand", [180, -115, 482], [190, 115, 494], { tone: "mid" }, { r: 1 });
    for (const [y0, y1] of [[-60, -45], [-5, 10], [40, 55], [100, 115]]) box("stand.carrier.rail", "C02", "stand", [-50, y0, 490], [y0 === 100 ? 118 : 180, y1, 497.5], { tone: "mid" }, { r: 1 });
    // gas-bay pedestal under the cylinder cradle
    cyl("stand.pedestal", "C02", "stand", [-145, 70], 46, 93, 150, { tone: "lo" }, { steps: 48, inner: Ln(k.sideArc(-145, -70, 46, 121, P, 40), { tone: "faint" }) });
  },
};
