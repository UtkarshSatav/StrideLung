// C01 — Rigid outer case, inspection window, service doors.
// Envelope 460 × 330 × 700 (z 90…790), 25 mm corners, 3 mm shell (P). PC/ABS shell candidate (U).
// Split as the spec asks: a fixed rear shell, a front inspection door, a lower dry-service hatch and a
// left gas hatch. The doors are drawn live (they swing on the hinge at HINGE); their artwork is in
// ../scene/doors.ts. The right wall also carries the face features of C04 (lift grip), C22 (line-exit
// pocket) and C26 (vents, charge inlet), each tagged with its own ID so selection and filters find it.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";
import { CASE, CHAN, C22B, GRIP, HINGE, fu, fv } from "../layout.ts";
import { doorArt } from "../scene/doors.ts";

export const part: Part = {
  id: "C01",
  build() {
    const CR = CASE.r;
    const RI = CR - CASE.t;
    const band = (outer: number[][], inner: number[][]) => [...outer, ...inner.slice().reverse()];
    // floor (its inner face shows through the open front)
    box("stand.case.floor", "C01", "stand", [CASE.x0, CASE.y0, CASE.z0], [CASE.x1, CASE.y1, CASE.z0 + CASE.t], { tone: "lo" }, { r: CR, steps: 8, bias: -40 });
    // rear shell: rear-left arc, back wall, rear-right arc
    {
      const outer = [[-230, 140], ...arc(-205, 140, CR, 180, 90), ...arc(205, 140, CR, 90, 0), [230, 140]];
      const inner = [[-227, 140], ...arc(-205, 140, RI, 180, 90), ...arc(205, 140, RI, 90, 0), [227, 140]];
      ringXY("stand.case.rear", "C01", "stand", band(outer, inner), 93, 787, { tone: "lo" }, { bias: -60, ref: [0, 163, 440] });
    }
    // left wall strips around the gas-hatch opening (y −140…140, z 140…720)
    box("stand.case.left.low", "C01", "stand", [-230, -140, 93], [-227, 140, 140], { tone: "lo" }, { r: 0, bias: -50 });
    box("stand.case.left.high", "C01", "stand", [-230, -140, 720], [-227, 140, 787], { tone: "lo" }, { r: 0, bias: -50 });
    // left gas hatch: a removable panel with louvres, drawn behind everything (it is on the far side)
    {
      const plan = planOf([-230, -139], [-227, 139], 0);
      const shape = record(A.slab(plan, 140, 580, { name: "gashatch.panel" }, 2));
      shape.move = K(PIECES.gashatch.move);
      shape.ride = shape.piece = "gashatch";
      const louvres = Array.from({ length: 7 }, (_, i) => path3([[-227, -100 + i * 30, 600], [-227, -100 + i * 30 + 18, 600], [-227, -100 + i * 30 + 18, 690], [-227, -100 + i * 30, 690]], true)).join("");
      scene.gasHatch = S(k.slabOf(plan, 140, 580, P, 2), { tone: "lo", inner: "" }) + Ln(louvres, { tone: "faint" });
    }
    // front pillars: corner arcs only, so the doors open the full front
    {
      const outerL = [[-230, -140], ...arc(-205, -140, CR, 180, 270), [-204, -165]];
      const innerL = [[-227, -140], ...arc(-205, -140, RI, 180, 270), [-204, -162]];
      ringXY("stand.case.pillarL", "C01", "stand", band(outerL, innerL), 93, 787, { tone: "mid" }, { ref: [-218, -153, 440] });
      const outerR = [[204, -165], ...arc(205, -140, CR, 270, 360), [230, -140]];
      const innerR = [[204, -162], ...arc(205, -140, RI, 270, 360), [227, -140]];
      ringXY("stand.case.pillarR", "C01", "stand", band(outerR, innerR), 93, 787, { tone: "mid" }, { ref: [218, -153, 440] });
    }
    // hinge knuckles (door and hatch share one vertical hinge axis) and the latch keepers
    for (const z of [380, 560, 740, 130, 300]) {
      const F = frameOf([HINGE[0] - 2, HINGE[1] - 2.5, z - 14], [0, 0, 1], [1, 0, 0], [0, -1, 0]);
      disc("stand.case.knuckle", "C01", "stand", F, 0, 28, 4.2, { tone: "mid" }, { bias: 2 });
    }
    box("stand.case.keeper", "C01", "stand", [205, -170, 430], [214, -165, 470], { tone: "mid" }, { r: 1.5, bias: 2 });
    box("stand.case.keeper2", "C01", "stand", [205, -170, 200], [214, -165, 236], { tone: "mid" }, { r: 1.5, bias: 2 });

    // right wall: one slab with a real C22 pocket and lift-grip pocket (recorded as a frame of boxes around them)
    {
      const shapes = [
        boxShape([227, -140, 93], [230, 140, C22B.z0], "stand.case.right.low"),
        boxShape([227, -140, C22B.z0], [230, C22B.y0, C22B.z1], "stand.case.right.front"),
        boxShape([227, C22B.y1, C22B.z0], [230, 140, C22B.z1], "stand.case.right.rear"),
        boxShape([227, -140, C22B.z1], [230, GRIP.y0, 787], "stand.case.right.top"),
        boxShape([227, GRIP.y1, C22B.z1], [230, 140, 787], "stand.case.right.topr"),
        boxShape([227, GRIP.y0, C22B.z1], [230, GRIP.y1, GRIP.z0], "stand.case.right.gripb"),
        boxShape([227, GRIP.y0, GRIP.z1], [230, GRIP.y1, 787], "stand.case.right.gript"),
        boxShape([C22B.back - 2, C22B.y0, C22B.z0], [C22B.back, C22B.y1, C22B.z1], "C22.backplate"),
        boxShape([GRIP.back - 2, GRIP.y0, GRIP.z0], [GRIP.back, GRIP.y1, GRIP.z1], "C04.grip.back"),
      ];
      const RIGHT_FACE = planeMatrix([230, -140, 787], [0, 1, 0], [0, 0, -1]); // (u = y + 140, v = 787 − z)
      // the wall really has both pockets cut out of it (even-odd), so parts inside a pocket show through
      const wallPaths = k.slabOf(planOf([227, -140], [230, 140], 0), 93, 694, P, 2);
      const opening = (b: { y0: number; y1: number; z0: number; z1: number }) => path3([[230, b.y0, b.z0], [230, b.y1, b.z0], [230, b.y1, b.z1], [230, b.y0, b.z1]], true);
      const holes = opening(C22B) + opening(GRIP);
      wallPaths.fill += holes;
      wallPaths.shades = wallPaths.shades.map((d: string) => (d ? d + holes : d));
      const wall = `<g class="sl-wall">${S(wallPaths, { tone: "mid" })}</g>`;
      const vents = Array.from({ length: 9 }, (_, i) => rr(fu(-96 + i * 22), fv(330), fu(-96 + i * 22) + 9, fv(236), 4.5)).join("");
      // the one engraved label on the drawing: the ID plate
      const plate = `<g data-c="C01" data-s="chassis"><path class="sl-plate" d="${rr(fu(-128), fv(178), fu(-6), fv(128), 3)}"/>` +
        `<path class="iso-line" data-tone="faint" d="${rr(fu(-124), fv(174), fu(-10), fv(132), 2)}"/>` +
        `<path class="iso-line" data-tone="lo" data-free="" d="M${fu(-116)} ${fv(150)}H${fu(-56)}M${fu(-116)} ${fv(141)}H${fu(-72)}"/>` +
        `<text class="iso-face-text" data-tone="mid" x="${fu(-116)}" y="${fv(159)}" font-size="6.6" letter-spacing=".4">STRIDELUNG 01 · CONCEPT</text>` +
        `<circle class="sl-screw" cx="${fu(-124) + 3}" cy="${fv(174) + 3}" r="1.6"/><circle class="sl-screw" cx="${fu(-10) - 3}" cy="${fv(174) + 3}" r="1.6"/></g>`;
      const inlet = `<g data-c="C26" data-s="electrical"><path class="sl-plate" d="${rr(fu(40), fv(176), fu(84), fv(128), 4)}"/><path class="sl-cavity" d="${rr(fu(48), fv(166), fu(76), fv(140), 3)}"/>` +
        `<path class="iso-line" data-tone="lo" d="${rr(fu(48), fv(166), fu(76), fv(140), 3)}"/><circle class="sl-pin" cx="${fu(56)}" cy="${fv(153)}" r="2.2"/><circle class="sl-pin" cx="${fu(68)}" cy="${fv(153)}" r="2.2"/></g>`;
      const faceArt = `<g transform="${RIGHT_FACE}"><g data-c="C26" data-s="chassis"><path class="sl-vent" d="${vents}"/></g>${plate}${inlet}` +
        `<path class="iso-line" data-tone="faint" d="${rr(fu(-60) - 6, fv(735) - 6, fu(60) + 6, fv(665) + 6, 6)}"/>` +
        `<g data-c="C22" data-s="blood">${[[-60, 735], [60, 735], [-60, 665], [60, 665]].map(([y, z]) => `<circle class="sl-screw" cx="${fu(y) + (y < 0 ? -2.5 : 2.5)}" cy="${fv(z) + (z > 700 ? -2.5 : 2.5)}" r="1.4"/>`).join("")}</g></g>`;
      const pocket22 = pocketSvg("C22", C22B, "blood");
      const pocketGrip = pocketSvg("C04", GRIP, "chassis");
      const gripBar = `<g data-c="C04" data-s="chassis">${S(G.solidOf([[0, 6], [GRIP.y1 - GRIP.y0 - 8, 6]], frameOf([224, GRIP.y0 + 4, GRIP.z0 + 12], [0, 1, 0], [1, 0, 0], [0, 0, 1]), P, { steps: 24 }), { tone: "hi" })}</g>`;
      put({ name: "stand.case.right", c: "C01", sys: "chassis", piece: "stand", ref: [228.5, 0, 440], svg: wall + faceArt + pocket22 + pocketGrip + gripBar, shapes });
    }
    // lid, with the handle channel really cut out of it so the stowed crossbar shows through
    {
      const lidPlan = planOf([CASE.x0, CASE.y0], [CASE.x1, CASE.y1], CR);
      const lid = k.slabOf(lidPlan, 787, 3, P, 8, 1.4);
      const chanTop = path3([[CHAN.x0, CHAN.y0, 790], [CHAN.x1, CHAN.y0, 790], [CHAN.x1, CHAN.y1, 790], [CHAN.x0, CHAN.y1, 790]], true);
      const vents = Array.from({ length: 6 }, (_, i) => k.planOutline(planOf([-100 + i * 36, -120], [-100 + i * 36 + 10, -40], 5), 790, P, 4)).join("");
      const inner = Ln(k.planOutline(k.insetPlan(lidPlan, 12), 790, P, 8), { tone: "faint" }) + Ln(vents, { tone: "faint" });
      lid.fill += chanTop;
      lid.top += chanTop;
      const shapes = [
        boxShape([-230, -165, 787], [230, CHAN.y0, 790], "stand.case.lid.front"),
        boxShape([-230, CHAN.y1, 787], [230, 165, 790], "stand.case.lid.back"),
        boxShape([-230, CHAN.y0, 787], [CHAN.x0, CHAN.y1, 790], "stand.case.lid.l"),
        boxShape([CHAN.x1, CHAN.y0, 787], [230, CHAN.y1, 790], "stand.case.lid.r"),
      ];
      put({ name: "stand.case.lid", c: "C01", sys: "chassis", piece: "stand", ref: [0, 0, 788.5], bias: 30, svg: `<g class="sl-lid">${S(lid, { tone: "mid", inner })}</g>`, shapes });
    }
    // the hinged front door and lower dry-service hatch (drawn live, see engine.ts)
    scene.hinge = HINGE;
    scene.doors = { main: doorArt("main"), hatch: doorArt("hatch") };
  },
};
