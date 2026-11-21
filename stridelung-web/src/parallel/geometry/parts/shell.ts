// Outer trolley shell, back shell, the provisional bay extension, the hinge knuckles and the door.
// The case is drawn wider than the single-cartridge concept so a second cartridge fits; where it grew is marked by
// a joint rib (lid, fascia, sill) and a hatched lid panel over the extension. None of it is a packaging claim.
import { G, P, S, Ln, Dots, at, box, disc, ringXY, frameOf, planeMatrix, planOf, rr, path3, k, put, boxShape, arc, scene, engrave, hatch, type Part } from "../builder.ts";
import { CASE, CHAN, DISP, FASCIA, HINGE, JOINT, DOOR } from "../layout.ts";
import { doorArt } from "../scene/door.ts";

export const part: Part = {
  id: "shell",
  build() {
    const CR = CASE.r;
    const RI = CR - CASE.t;
    const band = (outer: number[][], inner: number[][]) => [...outer, ...inner.slice().reverse()];
    const { x0, x1, y0, y1 } = CASE;
    const zt = CASE.z1 - 3; // underside of the lid
    // floor: its inner face shows through the open front
    box("case.floor", "shell", "stand", [x0, y0, CASE.z0], [x1, y1, CASE.z0 + CASE.t], { tone: "lo" }, { r: CR, steps: 8, bias: -40 });
    // back shell: rear corner returns and the back wall
    {
      const outer = [[x0, y1 - CR], ...arc(x0 + CR, y1 - CR, CR, 180, 90), ...arc(x1 - CR, y1 - CR, CR, 90, 0), [x1, y1 - CR]];
      const inner = [[x0 + 3, y1 - CR], ...arc(x0 + CR, y1 - CR, RI, 180, 90), ...arc(x1 - CR, y1 - CR, RI, 90, 0), [x1 - 3, y1 - CR]];
      ringXY("case.rear", "back-shell", "stand", band(outer, inner), CASE.z0 + 3, zt, { tone: "lo" }, { bias: -60, ref: [0, y1 - 2, 440] });
    }
    // left wall: only its inner face is seen, through the bay
    box("case.left", "shell", "stand", [x0, y0 + CR, CASE.z0 + 3], [x0 + 3, y1 - CR, zt], { tone: "lo" }, { r: 0, bias: -50 });
    // front pillars: corner returns only, so the door opens the full front
    {
      const outerL = [[x0, y0 + CR], ...arc(x0 + CR, y0 + CR, CR, 180, 270), [x0 + CR, y0]];
      const innerL = [[x0 + 3, y0 + CR], ...arc(x0 + CR, y0 + CR, RI, 180, 270), [x0 + CR, y0 + 3]];
      ringXY("case.pillarL", "shell", "stand", band(outerL, innerL), CASE.z0 + 3, zt, { tone: "mid" }, { ref: [x0 + 12, y0 + 12, 440] });
      const outerR = [[x1 - CR, y0], ...arc(x1 - CR, y0 + CR, CR, 270, 360), [x1, y0 + CR]];
      const innerR = [[x1 - CR, y0 + 3], ...arc(x1 - CR, y0 + CR, RI, 270, 360), [x1 - 3, y0 + CR]];
      ringXY("case.pillarR", "shell", "stand", band(outerR, innerR), CASE.z0 + 3, zt, { tone: "mid" }, { ref: [x1 - 12, y0 + 12, 440] });
    }
    // sill under the door, and the fixed fascia above the bay
    box("case.sill", "shell", "stand", [x0 + CR, y0, CASE.z0 + 3], [x1 - CR, y0 + 3, DOOR.z0 - 1], { tone: "mid" }, { r: 0 });
    {
      const FACE = planeMatrix([x0 + CR, y0, FASCIA.z1], [1, 0, 0], [0, 0, -1]); // u = x + 264, v = 797 − z
      const fu = (x: number) => x - (x0 + CR);
      const fv = (z: number) => FASCIA.z1 - z;
      const plate = `<g data-c="shell"><path class="sl-plate" d="${rr(fu(-246), fv(778), fu(-134), fv(742), 3)}"/>` +
        `<path class="iso-line" data-tone="faint" d="${rr(fu(-242), fv(774), fu(-138), fv(746), 2)}"/>` +
        engrave(fu(-236), fv(764), "STRIDELUNG · PARALLEL", 6) +
        `<path class="iso-line" data-tone="lo" data-free="" d="M${fu(-236)} ${fv(756)}H${fu(-176)}"/>` +
        `<circle class="sl-screw" cx="${fu(-242) + 3}" cy="${fv(774) + 3}" r="1.5"/><circle class="sl-screw" cx="${fu(-138) - 3}" cy="${fv(774) + 3}" r="1.5"/></g>`;
      // a status strip of five blank indicator windows right of the display (no states are shown)
      const leds = Array.from({ length: 5 }, (_, i) => `<path class="sl-led" d="${rr(fu(132 + i * 18), fv(770), fu(144 + i * 18), fv(762), 2)}"/>`).join("");
      const grille = Array.from({ length: 7 }, (_, i) => rr(fu(-244 + i * 15), fv(732), fu(-238 + i * 15), fv(724), 3)).join("");
      put({
        name: "case.fascia", c: "shell", piece: "stand", ref: [0, y0 + 1.5, (FASCIA.z0 + FASCIA.z1) / 2],
        svg: S(k.slabOf(planOf([x0 + CR, y0], [x1 - CR, y0 + 3], 0), FASCIA.z0, FASCIA.z1 - FASCIA.z0, P, 2), { tone: "mid", inner: "" }) +
          `<g transform="${FACE}">${plate}<g data-c="shell">${leds}<path class="sl-vent" d="${grille}"/></g>` +
          `<path class="iso-line" data-tone="faint" d="${rr(fu(DISP.x0) - 6, fv(DISP.z1) - 6, fu(DISP.x1) + 6, fv(DISP.z0) + 6, 6)}"/></g>`,
        shapes: [boxShape([x0 + CR, y0, FASCIA.z0], [x1 - CR, y0 + 3, FASCIA.z1], "case.fascia")],
      });
    }
    // hinge knuckles on the left pillar (the door's leaves are drawn with the door) and the latch keeper
    for (const z of [190, 600]) {
      const F = frameOf([HINGE[0], HINGE[1] - 4.4, z - 20], [0, 0, 1], [1, 0, 0], [0, -1, 0]);
      disc("case.knuckle", "hinges", "stand", F, 0, 40, 4.4, { tone: "mid" }, { bias: 2, extra: Ln(G.arcOf(F, 20, 4.4, P), { tone: "faint" }) });
    }

    // right wall: vents, a recessed lift grip, and the two line pass-throughs (their bulkheads are line supports)
    {
      const RIGHT = planeMatrix([x1, y0 + CR, zt], [0, 1, 0], [0, 0, -1]); // u = y + 144, v = 797 − z
      const ru = (y: number) => y - (y0 + CR);
      const rv = (z: number) => zt - z;
      const vents = Array.from({ length: 10 }, (_, i) => rr(ru(-70 + i * 20), rv(300), ru(-70 + i * 20) + 9, rv(220), 4.5)).join("");
      const grip = rr(ru(40), rv(770), ru(126), rv(744), 9);
      const gripIn = rr(ru(46), rv(764), ru(120), rv(750), 6);
      const art = `<g transform="${RIGHT}"><g data-c="shell"><path class="sl-vent" d="${vents}"/><path class="sl-cavity" d="${grip}"/>${Ln(grip, { tone: "lo" })}<path class="pl-grip" d="${gripIn}"/>${Ln(gripIn, { tone: "faint" })}</g>` +
        Ln(rr(ru(-120), rv(682), ru(110), rv(520), 8), { tone: "faint" }) + `</g>`;
      put({
        name: "case.right", c: "shell", piece: "stand", ref: [x1 - 1.5, 0, 440], attrs: ' data-sidewall=""',
        svg: S(k.slabOf(planOf([x1 - 3, y0 + CR], [x1, y1 - CR], 0), CASE.z0 + 3, zt - CASE.z0 - 3, P, 2), { tone: "mid" }) + art,
        shapes: [boxShape([x1 - 3, y0 + CR, CASE.z0 + 3], [x1, y1 - CR, zt], "case.right")],
      });
    }

    // lid, with the handle slot really cut out of it so the rails show coming out of it
    {
      const lidPlan = planOf([x0, y0], [x1, y1], CR);
      const lid = k.slabOf(lidPlan, zt, 3, P, 8, 1.4);
      const slot = path3([[CHAN.x0, CHAN.y0, CASE.z1], [CHAN.x1, CHAN.y0, CASE.z1], [CHAN.x1, CHAN.y1, CASE.z1], [CHAN.x0, CHAN.y1, CASE.z1]], true);
      const vents = Array.from({ length: 6 }, (_, i) => k.planOutline(planOf([-130 + i * 40, -132], [-130 + i * 40 + 12, -52], 6), CASE.z1, P, 4)).join("");
      lid.fill += slot;
      lid.top += slot;
      const inner = Ln(k.planOutline(k.insetPlan(lidPlan, 12), CASE.z1, P, 8), { tone: "faint" }) + Ln(vents, { tone: "faint" });
      const shapes = [
        boxShape([x0, y0, zt], [x1, CHAN.y0, CASE.z1], "case.lid.front"),
        boxShape([x0, CHAN.y1, zt], [x1, y1, CASE.z1], "case.lid.back"),
        boxShape([x0, CHAN.y0, zt], [CHAN.x0, CHAN.y1, CASE.z1], "case.lid.l"),
        boxShape([CHAN.x1, CHAN.y0, zt], [x1, CHAN.y1, CASE.z1], "case.lid.r"),
      ];
      put({ name: "case.lid", c: "shell", piece: "stand", ref: [0, 0, CASE.z1 - 1.5], bias: 30, svg: `<g class="sl-lid">${S(lid, { tone: "mid", inner })}</g>`, shapes });
      // the slot's recess (its own item, so the rails are drawn after it)
      const floor = path3([[CHAN.x0, CHAN.y0, CHAN.floor], [CHAN.x1, CHAN.y0, CHAN.floor], [CHAN.x1, CHAN.y1, CHAN.floor], [CHAN.x0, CHAN.y1, CHAN.floor]], true);
      const backWall = path3([[CHAN.x0, CHAN.y1, CASE.z1], [CHAN.x1, CHAN.y1, CASE.z1], [CHAN.x1, CHAN.y1, CHAN.floor], [CHAN.x0, CHAN.y1, CHAN.floor]], true);
      const leftWall = path3([[CHAN.x0, CHAN.y0, CASE.z1], [CHAN.x0, CHAN.y1, CASE.z1], [CHAN.x0, CHAN.y1, CHAN.floor], [CHAN.x0, CHAN.y0, CHAN.floor]], true);
      put({
        name: "case.slot", c: "handle", piece: "stand", ref: [0, 140, 786], bias: 31,
        svg: `<path class="sl-cavity" d="${slot}"/><path class="iso-shade" data-shade="1" d="${backWall}"/><path class="iso-shade" data-shade="2" d="${leftWall}"/>${Ln(floor, { tone: "faint" })}${Ln(slot, { tone: "lo" })}`,
        // recorded as the slot's far wall: the rails stand in front of it, on their channels
        shapes: [boxShape([CHAN.x0, CHAN.y1 - 0.5, CHAN.floor], [CHAN.x1, CHAN.y1, CASE.z1 - 3], "case.slot")],
      });
    }

    // provisional extension: a joint rib round the case where it grew, and a hatched lid panel over the extension
    {
      const J0 = JOINT - 4, J1 = JOINT + 4;
      const bolts = (pts: number[][]) => Dots(pts.map(at), { size: 0.55, tone: "hi" });
      box("ext.rib.lid", "extension", "stand", [J0, y0 + 6, CASE.z1], [J1, y1 - 6, CASE.z1 + 3], { tone: "hi" }, { r: 1, bias: 32, extra: bolts([-120, -60, 0, 60, 120].map((y) => [JOINT, y, CASE.z1 + 3])) });
      box("ext.rib.fascia", "extension", "stand", [J0, y0 - 3, FASCIA.z0], [J1, y0, FASCIA.z1 - 6], { tone: "hi" }, { r: 1, bias: 3, extra: bolts([734, 760, 786].map((z) => [JOINT, y0 - 3, z])) });
      box("ext.rib.sill", "extension", "stand", [J0, y0 - 3, CASE.z0 + 3], [J1, y0, DOOR.z0 - 1], { tone: "hi" }, { r: 1, bias: 3 });
      const TOP = planeMatrix([JOINT + 14, y0 + 18, CASE.z1], [1, 0, 0], [0, 1, 0]); // u along x, v along +y
      const pw = x1 - CR - 6 - (JOINT + 14), pd = 270;
      const panel = `<g transform="${TOP}"><path class="pl-provisional" d="${rr(0, 0, pw, pd, 6)}"/><path class="iso-line pl-hatch" data-tone="lo" d="${hatch(0, 0, pw, pd, 9)}"/>` +
        `<path class="iso-line" data-tone="mid" d="${rr(0, 0, pw, pd, 6)}"/></g>`;
      put({ name: "ext.panel", c: "extension", piece: "stand", ref: [JOINT + 60, 0, CASE.z1 + 0.2], bias: 31, svg: panel, shapes: [boxShape([JOINT + 14, y0 + 18, CASE.z1], [JOINT + 14 + pw, y0 + 18 + pd, CASE.z1 + 0.3], "ext.panel")] });
    }

    // the door (drawn live by the engine)
    scene.door = doorArt();




  },
};
