// Artwork for C01's hinged front inspection door and lower dry-service hatch, drawn flat in the door's own
// plane: u = mm from the hinge, Y = −z. The engine maps it onto the door plane every frame as the door swings,
// and shows the inner face once the outer face turns away.
import { f2, rr, circ } from "../builder.ts";

export function doorArt(kind: "main" | "hatch") {
  const W = 406;
  const u = (x: number) => x + 204;
  const Y = (z: number) => -z;
  const L = (d: string, tone = "lo", free = false) => `<path class="iso-line" data-tone="${tone}"${free ? ' data-free=""' : ""} d="${d}"/>`;
  const screws = (pts: number[][]) => pts.map(([a, b]) => `<circle class="sl-screw" cx="${f2(a)}" cy="${f2(b)}" r="1.5"/>`).join("");
  if (kind === "main") {
    const z0 = 342, z1 = 785;
    const outline = rr(2, Y(z1), W - 2, Y(z0), 7);
    const win = rr(u(-40), Y(668), u(185), Y(495), 10);
    const apt = rr(u(-29), Y(774), u(169), Y(676), 5);
    const lens = circ(u(-145), Y(745), 12);
    const holes = win + apt + lens;
    const hinges = [380, 560, 740].map((z) => rr(3, Y(z + 16), 17, Y(z - 16), 2)).join("");
    const vents = Array.from({ length: 9 }, (_, i) => rr(34 + i * 13, Y(470), 41 + i * 13, Y(372), 3.5)).join("");
    const outer = `<path class="sl-door-face" d="${outline}${holes}"/>` +
      `<path class="sl-glass" d="${win}"/><path class="sl-lens" d="${lens}"/>` +
      L(rr(u(-47), Y(675), u(192), Y(488), 14), "lo") + L(rr(u(-52), Y(680), u(197), Y(483), 17), "faint") +
      L(rr(u(-33), Y(778), u(173), Y(672), 8), "faint") + L(circ(u(-145), Y(745), 16), "faint") +
      L(rr(10, Y(z1 - 8), W - 10, Y(z0 + 8), 5), "faint") +
      `<path class="sl-vent" d="${vents}"/>` +
      `<path class="sl-latch" d="${rr(W - 26, Y(470), W - 10, Y(400), 4)}"/>` + L(rr(W - 26, Y(470), W - 10, Y(400), 4), "lo") + L(`M${W - 18} ${Y(470)}V${Y(400)}`, "mid") +
      `<path class="sl-hinge" d="${hinges}"/>` + L(hinges, "lo") +
      `<path class="sl-glare" d="M${u(-30)} ${Y(668)}L${u(5)} ${Y(668)}L${u(-20)} ${Y(495)}L${u(-55)} ${Y(495)}Z"/>` +
      screws([[10, Y(z1 - 10)], [W - 10, Y(z1 - 10)], [10, Y(z0 + 10)], [W - 10, Y(z0 + 10)], ...[380, 560, 740].flatMap((z) => [[10, Y(z + 9)], [10, Y(z - 9)]])]) +
      L(outline, "hi");
    const inner = `<path class="sl-door-face" d="${outline}${holes}"/><path class="sl-glass" d="${win}"/><path class="sl-lens" d="${lens}"/>` +
      L(rr(26, Y(z1 - 22), W - 26, Y(z0 + 22), 10), "faint") + L(rr(u(-46), Y(674), u(191), Y(489), 13), "lo") + L(rr(u(-35), Y(780), u(175), Y(670), 8), "lo") +
      `<path class="sl-latch" d="${rr(W - 40, Y(462), W - 14, Y(408), 3)}"/>` + L(rr(W - 40, Y(462), W - 14, Y(408), 3), "lo") +
      `<path class="sl-hinge" d="${hinges}"/>` + L(hinges, "lo") + L(outline, "hi");
    return { outer, inner, z0, z1, w: W };
  }
  const z0 = 95, z1 = 338;
  const outline = rr(2, Y(z1), W - 2, Y(z0), 7);
  const hinges = [130, 300].map((z) => rr(3, Y(z + 16), 17, Y(z - 16), 2)).join("");
  const vents = Array.from({ length: 14 }, (_, i) => rr(46 + i * 14, Y(190), 53 + i * 14, Y(130), 3.5)).join("");
  const pull = rr(u(60), Y(316), u(150), Y(296), 6);
  const outer = `<path class="sl-door-face" d="${outline}"/>` + L(rr(10, Y(z1 - 8), W - 10, Y(z0 + 8), 5), "faint") +
    `<path class="sl-vent" d="${vents}"/><path class="sl-latch" d="${pull}"/>` + L(pull, "lo") + L(`M${u(60)} ${Y(306)}H${u(150)}`, "mid") +
    `<path class="sl-latch" d="${rr(W - 26, Y(240), W - 10, Y(190), 4)}"/>` + L(rr(W - 26, Y(240), W - 10, Y(190), 4), "lo") +
    `<path class="sl-hinge" d="${hinges}"/>` + L(hinges, "lo") +
    L(rr(u(-190), Y(260), u(-120), Y(214), 2), "faint") + L(`M${u(-184)} ${Y(242)}H${u(-136)}M${u(-184)} ${Y(232)}H${u(-150)}`, "lo", true) +
    screws([[10, Y(z1 - 10)], [W - 10, Y(z1 - 10)], [10, Y(z0 + 10)], [W - 10, Y(z0 + 10)], ...[130, 300].flatMap((z) => [[10, Y(z + 9)], [10, Y(z - 9)]])]) + L(outline, "hi");
  const inner = `<path class="sl-door-face" d="${outline}"/>` + L(rr(26, Y(z1 - 22), W - 26, Y(z0 + 22), 10), "faint") + `<path class="sl-hinge" d="${hinges}"/>` + L(hinges, "lo") + L(outline, "hi");
  return { outer, inner, z0, z1, w: W };
}
