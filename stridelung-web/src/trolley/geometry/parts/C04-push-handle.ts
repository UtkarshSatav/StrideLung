// C04 — Retractable push handle and lift grips. 300 × 45 × 350 deployed; top at z 1050 (P).
// Rails are drawn 24 mm deep (y 128…152, inside the 45 mm allocation) so the stowed rails clear the C11 cylinder,
// which reaches y 125 in the same column: at the spec's y 107.5…152.5 the stowed rail would pass through it.
// Aluminium rails, TPE grip candidates (U). Twin rails run in rear channels; the crossbar stows flush in a
// channel in the lid and rises 260 mm in the Transport view. Everything above the lid plane is clipped at
// the channel's near edges so the rails appear to come out of the lid. The side lift grip lives in the
// right-wall pocket (drawn with C01's wall, tagged C04); lift grips are for an unconnected mock-up only.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";
import { CHAN } from "../layout.ts";

export const part: Part = {
  id: "C04",
  build() {
    // rear channels the rails slide in
    for (const s of [-1, 1]) box("stand.handle.channel", "C04", "stand", [s < 0 ? -156 : 122, 126, 430], [s < 0 ? -122 : 156, 156, 760], { tone: "lo" }, { r: 1, bias: -10, owner: "C04" });
    // the lid channel's recess (its own item, so the crossbar can be drawn after it)
    {
      const chanTop = path3([[CHAN.x0, CHAN.y0, 790], [CHAN.x1, CHAN.y0, 790], [CHAN.x1, CHAN.y1, 790], [CHAN.x0, CHAN.y1, 790]], true);
      const chanFloor = path3([[CHAN.x0, CHAN.y0, CHAN.floor], [CHAN.x1, CHAN.y0, CHAN.floor], [CHAN.x1, CHAN.y1, CHAN.floor], [CHAN.x0, CHAN.y1, CHAN.floor]], true);
      const chanBackWall = path3([[CHAN.x0, CHAN.y1, 790], [CHAN.x1, CHAN.y1, 790], [CHAN.x1, CHAN.y1, CHAN.floor], [CHAN.x0, CHAN.y1, CHAN.floor]], true);
      const chanLeftWall = path3([[CHAN.x0, CHAN.y0, 790], [CHAN.x0, CHAN.y1, 790], [CHAN.x0, CHAN.y1, CHAN.floor], [CHAN.x0, CHAN.y0, CHAN.floor]], true);
      const svg = `<g data-c="C04" data-s="chassis"><path class="sl-cavity" d="${chanTop}"/><path class="iso-shade" data-shade="1" d="${chanBackWall}"/><path class="iso-shade" data-shade="2" d="${chanLeftWall}"/>${Ln(chanFloor, { tone: "faint" })}${Ln(chanTop, { tone: "lo" })}</g>`;
      put({ name: "stand.lid.channel", c: "C04", piece: "stand", ref: [0, 130, 775], svg, shapes: [boxShape([CHAN.x0, CHAN.y0, CHAN.floor - 2], [CHAN.x1, CHAN.y1, CHAN.floor], "stand.lid.channel")] });
    }
    // rails, crossbar, TPE grip sleeve and release button (built stowed; the handle piece lifts them)
    const clip = ` clip-path="url(#sl-handle-clip)"`;
    const z0 = 440, top = 790;
    for (const s of [-1, 1]) {
      const x0 = s < 0 ? -150 : 128;
      const x1 = s < 0 ? -128 : 150;
      box("handle.rail", "C04", "handle", [x0, 128, z0], [x1, 152, top - 30], { tone: "hi" }, { attrs: clip, owner: "C04", r: 3, steps: 3, bias: 300, inner: Ln(seamOf([x0, 128], [x1, 152], top - 120, 3), { tone: "faint" }) });
    }
    box("handle.crossbar", "C04", "handle", [-150, 128, top - 30], [150, 152, top], { tone: "hi" }, { attrs: clip, owner: "C04", r: 6, steps: 5, bevel: 0.8, bias: 301 });
    box("handle.grip", "C04", "handle", [-108, 126, top - 31], [108, 154, top + 1], { tone: "mid" }, { attrs: clip, owner: "C04", r: 8, steps: 6, bias: 302, extra: Ln(Array.from({ length: 13 }, (_, i) => path3([[-96 + i * 16, 126, top - 31], [-96 + i * 16, 126, top + 1]])).join(""), { tone: "lo" }) });
    cyl("handle.button", "C04", "handle", [0, 140], 8, top + 1, top + 4, { tone: "hi" }, { bias: 303, owner: "C04" });
    // clip: everything above the near edges of the lid channel at z 790
    const a = at([CHAN.x0, CHAN.y0, 790]);
    const b = at([CHAN.x1, CHAN.y0, 790]);
    const c = at([CHAN.x1, CHAN.y1, 790]);
    const d = at([CHAN.x0, CHAN.y1, 790]);
    scene.handleClip = k.pathOf([a, b, c, [c[0], c[1] - 600], [d[0], d[1] - 600], [a[0], a[1] - 600]], true);
  },
};
