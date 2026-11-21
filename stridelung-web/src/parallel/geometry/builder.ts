// The parallel-oxygenator figure's builder: its camera, its recorder and the helpers every part file calls.
// Built on the shared figure builder (src/lib/figure/builder.ts), so the trolley and this figure share one set of
// drawing helpers but never one recorder. Nothing in this figure comes apart; the only live motion is the door.
import { createBuilder, k, G, A, K, f2, add, mul, dot, planOf, frameOf, rr, circ, arc, type V2, type V3 } from "../../lib/figure/builder.ts";
import { HINGE, DOOR, CASE, HANDLE, POST } from "./layout.ts";

export { k, G, A, K, f2, add, mul, dot, planOf, frameOf, rr, circ, arc };
export type { V2, V3 };

export const W = 760;
export const H = 720;
export const AZIMUTH = 60;
export const ELEVATION = 27;
export const OPEN_DEG = 104;
export const PLINTH = { x0: -440, x1: 590, y0: -430, y1: 260, z0: -26 };

const doorEnd = (deg: number): number[] => {
  const th = (deg * Math.PI) / 180;
  return [HINGE[0] + DOOR.w * Math.cos(th), HINGE[1] - DOOR.w * Math.sin(th)];
};
const [dx, dy] = doorEnd(OPEN_DEG);
const fit: number[][] = [
  ...[PLINTH.x0, PLINTH.x1].flatMap((x) => [PLINTH.y0, PLINTH.y1].flatMap((y) => [[x, y, PLINTH.z0 - 8], [x, y, 0]])),
  [-160, 152, HANDLE.top + 3], [160, 152, HANDLE.top + 3],
  [CASE.x0, CASE.y1, CASE.z1], [CASE.x1, CASE.y1, CASE.z1], [CASE.x0, CASE.y0, CASE.z1],
  [dx, dy, DOOR.z1], [dx, dy, DOOR.z0],
  [POST.x, POST.y, 560],
];

export const PIECES: Record<string, { label: string; move: V3 }> = { stand: { label: "Structure", move: [0, 0, 0] } };

const B = createBuilder({ W, H, azimuth: AZIMUTH, elevation: ELEVATION, fit, pad: 22, pieces: PIECES, order: [], spring: { stagger: 0, stiffness: 1, damping: 1, substeps: 1 }, sysOf: {}, defaultSys: "concept" });
export const { P, KS, VIEW, at, path3, S, Ln, Dots, depthS, R, record, lines, put, box, cyl, ringXY, turned, disc, ball, boxShape, planeMatrix, seamOf, line, splitArc, towardViewer, padOn } = B;

/** Scene-level drawing that is not depth-sorted, filled in by the parts that own it. */
export const scene: {
  back: string[];
  defs: string[];
  door: { outer: string; inner: string; z0: number; z1: number; w: number } | null;
  hinge: V2;
  openDeg: number;
  display: { o: number[]; ex: number[]; ey: number[] } | null;
} = { back: [], defs: [], door: null, hinge: HINGE, openDeg: OPEN_DEG, display: null };

/** One part file builds one or more of the model's visual parts. */
export type Part = { id: string; build: () => void };

/** Engraved text drawn in a face plane (u right, v down, mm). */
export const engrave = (x: number, y: number, text: string, size = 6, anchor = "start", tone = "mid") =>
  `<text class="iso-face-text" data-tone="${tone}" x="${f2(x)}" y="${f2(y)}" font-size="${size}" letter-spacing=".5"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}>${text}</text>`;
/** A closed polyline in a face plane. */
export const poly = (pts: number[][]) => "M" + pts.map(([u, v]) => `${f2(u)} ${f2(v)}`).join("L") + "Z";
/** Diagonal hatch lines clipped to a rectangle (u0, v0)–(u1, v1) in a face plane, each ending on its edges. */
export function hatch(u0: number, v0: number, u1: number, v1: number, pitch = 6) {
  const out: string[] = [];
  const w = u1 - u0, h = v1 - v0;
  for (let s = pitch; s < w + h; s += pitch) {
    // the line u + v = s (shifted), clipped to the box
    const a = [Math.min(s, w), Math.max(0, s - w)];
    const b = [Math.max(0, s - h), Math.min(s, h)];
    out.push(`M${f2(u0 + a[0])} ${f2(v0 + a[1])}L${f2(u0 + b[0])} ${f2(v0 + b[1])}`);
  }
  return out.join("");
}
