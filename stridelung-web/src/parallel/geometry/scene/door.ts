// Artwork for the full-width front door, drawn flat in the door's own plane: u = mm from the hinge, Y = −z.
// The engine maps it onto the door plane every frame as it swings and shows the inner face once the outer face
// turns away. The inspection window is a real hole in the door face (even-odd), glazed with a faint pane, so the
// cartridges show through it when the door is closed. Window and hinge leaves carry their own part IDs.
import { f2, rr, circ } from "../builder.ts";
import { DOOR, HINGE } from "../layout.ts";

export function doorArt() {
  const { w: W, z0, z1 } = DOOR;
  const u = (x: number) => x - HINGE[0];
  const Y = (z: number) => -z;
  const L = (d: string, tone = "lo", free = false) => `<path class="iso-line" data-tone="${tone}"${free ? ' data-free=""' : ""} d="${d}"/>`;
  const screws = (pts: number[][]) => pts.map(([a, b]) => `<circle class="sl-screw" cx="${f2(a)}" cy="${f2(b)}" r="1.5"/>`).join("");
  const outline = rr(2, Y(z1), W - 2, Y(z0), 7);
  const win = rr(u(-214), Y(560), u(214), Y(300), 14);
  const frameOut = rr(u(-224), Y(570), u(224), Y(290), 20);
  const frameIn = rr(u(-218), Y(564), u(218), Y(296), 16);
  const hingeZ = [190, 600];
  const leaves = hingeZ.map((z) => rr(3, Y(z + 20), 19, Y(z - 20), 2)).join("");
  const vents = Array.from({ length: 16 }, (_, i) => rr(u(-168) + i * 21, Y(212), u(-168) + i * 21 + 8, Y(140), 4)).join("");
  const latch = rr(W - 28, Y(470), W - 10, Y(392), 4);
  // window frame: a bezel band (outer face) with screws round it, and the glazing's glare streak
  const frameScrews = [
    ...[-180, -60, 60, 180].flatMap((x) => [[u(x), Y(566)], [u(x), Y(294)]]),
    [u(-220), Y(430)], [u(220), Y(430)],
  ];
  const window = `<g data-sub="window"><path class="pl-bezel" d="${frameOut}${frameIn}"/>${L(frameOut, "lo")}${L(frameIn, "faint")}<path class="sl-glass" d="${win}"/>` +
    `<path class="sl-glare" d="M${u(-196)} ${Y(560)}L${u(-150)} ${Y(560)}L${u(-206)} ${Y(300)}L${u(-214)} ${Y(300)}L${u(-214)} ${Y(486)}Z"/>` +
    `<path class="sl-glare" d="M${u(-132)} ${Y(560)}L${u(-118)} ${Y(560)}L${u(-174)} ${Y(300)}L${u(-188)} ${Y(300)}Z"/>` +
    screws(frameScrews) + L(win, "mid") + `</g>`;
  const hinges = `<g data-sub="hinges"><path class="sl-hinge" d="${leaves}"/>${L(leaves, "lo")}${screws(hingeZ.flatMap((z) => [[11, Y(z + 12)], [11, Y(z - 12)]]))}</g>`;
  const outer = `<path class="sl-door-face" d="${outline}${win}"/>` + window +
    L(rr(10, Y(z1 - 8), W - 10, Y(z0 + 8), 5), "faint") +
    `<path class="sl-vent" d="${vents}"/>` +
    `<path class="sl-latch" d="${latch}"/>` + L(latch, "lo") + L(`M${W - 19} ${Y(470)}V${Y(392)}`, "mid") +
    hinges +
    L(rr(u(150), Y(268), u(236), Y(238), 2), "faint") + L(`M${u(158)} ${Y(258)}H${u(218)}M${u(158)} ${Y(248)}H${u(196)}`, "lo", true) +
    screws([[10, Y(z1 - 10)], [W - 10, Y(z1 - 10)], [10, Y(z0 + 10)], [W - 10, Y(z0 + 10)]]) +
    L(outline, "hi");
  const inner = `<path class="sl-door-face" d="${outline}${win}"/><g data-sub="window"><path class="pl-bezel" d="${frameOut}${frameIn}"/>${L(frameOut, "lo")}${L(frameIn, "faint")}<path class="sl-glass" d="${win}"/>${L(win, "mid")}</g>` +
    L(rr(26, Y(z1 - 22), W - 26, Y(z0 + 22), 10), "faint") +
    `<path class="sl-latch" d="${rr(W - 44, Y(462), W - 14, Y(400), 3)}"/>` + L(rr(W - 44, Y(462), W - 14, Y(400), 3), "lo") +
    hinges + L(outline, "hi");
  return { outer, inner, z0, z1, w: W };
}
