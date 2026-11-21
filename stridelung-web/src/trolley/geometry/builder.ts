// Shared geometry builder for the StrideLung 01 trolley.
//
// Every component file in ./parts calls these helpers. Geometry is written in the SPEC frame
// (millimetres; x right, y back — negative y is the front — z up; origin at the floor centre),
// exactly as STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md gives it. The isometric kit is
// mirrored for a right-handed world, so every point is flipped once into the kit's frame with K().
//
// Nothing here runs in the browser: scripts/generate-figure.ts runs the parts, settles the
// painter's order and writes src/trolley/generated/*.json, which the React components render.
import * as kit from "../../lib/iso/iso-kit.mjs";
import * as lathe from "../../lib/iso/lathe.mjs";
import * as tube from "../../lib/iso/tube.mjs";
import * as audit from "../../lib/iso/audit.mjs";
import { REGISTER } from "../register.ts";

export const k: any = kit;
export const G: any = lathe;
export const A: any = audit;
const { tubePieces, tubeSvg }: any = tube;

export type V3 = [number, number, number];
export type V2 = [number, number];

// ───────── frame and camera ─────────
export const K = ([x, y, z]: number[]): V3 => [x, -y, z];
export const W = 760;
export const H = 800;
export const AZIMUTH = 60; // the viewer stands front-right of the trolley
export const ELEVATION = 28;
export const PLINTH = { x0: -370, x1: 690, y0: -405, y1: 280, z0: -26, z1: 0 };

const fitPoints: number[][] = [
  ...[PLINTH.x0, PLINTH.x1].flatMap((x) => [PLINTH.y0, PLINTH.y1].flatMap((y) => [[x, y, PLINTH.z0 - 8], [x, y, 0]])),
  [-150, 152, 1050], [150, 152, 1050], [-150, 107, 1050], [150, 107, 1050],
  [-230, 165, 790], [230, 165, 790], [-230, -165, 790],
  [-330, -551, 785], [-330, -551, 95],
  [-200, -650, 625], [130, -760, 265], [-40, -650, 125],
];
export const P: any = k.fitProjection(fitPoints.map(K), W, H, { pad: 26, azimuth: AZIMUTH, elevation: ELEVATION });
export const KS: number = G.scaleOf(P);
export const VIEW: V3 = G.viewOf(P);
export const at = (p: number[]): V2 => k.iso(K(p), P);
export const path3 = (points: number[][], closed = false): string => k.pathOf(points.map(at), closed);
export const f2 = (v: number) => Math.round(v * 100) / 100;
export const S = (paths: any, style?: any): string => k.solidSvg(paths, style);
export const Ln = (d: string, style?: any): string => k.lineSvg(d, style);
export const Dots = (points: any[], style?: any): string => k.dotsSvg(points, style);
export const add = G.add3 as (a: number[], b: number[]) => V3;
export const mul = G.mul3 as (a: number[], s: number) => V3;
export const dot = G.dot3 as (a: number[], b: number[]) => number;
export const depthS = (p: number[]) => dot(K(p), VIEW);

// ───────── assemblies: how the figure comes apart ─────────
// Every module leaves through the open front (−y). Whatever sits in front leaves first; closing reverses it.
export const PIECES: Record<string, { label: string; move: V3 }> = {
  kit: { label: "Service kit", move: [0, -620, 0] },
  battery: { label: "Battery cassette", move: [0, -520, 0] },
  compute: { label: "Compute and I/O", move: [0, -560, 0] },
  gasctl: { label: "Gas control block", move: [0, -520, 0] },
  oxy: { label: "Oxygenator", move: [0, -380, 0] },
  power: { label: "Power conversion", move: [0, -300, 0] },
  // pump and sensor also drift left so they clear the front-right chassis post on the way out
  pump: { label: "Pump head and internal lines", move: [-45, -250, 0] },
  sensor: { label: "Sensor interface", move: [-10, -210, 0] },
  drive: { label: "Pump drive", move: [0, -130, 0] },
  thermal: { label: "Thermal module", move: [0, -360, 0] },
  gas: { label: "Cylinder bay", move: [0, -330, 0] },
  handle: { label: "Push handle", move: [0, 0, 260] },
  stab: { label: "Stabilisers", move: [0, 0, 0] },
  brake: { label: "Brakes", move: [0, 0, -5] },
  gashatch: { label: "Gas hatch", move: [-150, 0, 0] },
  stand: { label: "Structure", move: [0, 0, 0] },
};
export const EXPLODE = ["kit", "battery", "compute", "gasctl", "oxy", "power", "pump", "sensor", "drive", "thermal", "gas"];
export const ORDER = [...EXPLODE, "handle", "stab", "brake", "gashatch"];
export const SPRING = { stagger: 0.035, stiffness: 64, damping: 14.2, substeps: 4 };
export const R: any = A.recorder(P, { order: ORDER, spring: SPRING });
export const record = (shape: any) => R.solid(shape);

// Scene-level pieces that are not depth-sorted items (filled in by the parts that own them).
export const scene: {
  back: string[];
  gasHatch: string;
  handleClip: string;
  doors: Record<string, any>;
  rotor: any;
  display: any;
  hinge: V2;
  lines: { name: string; c: string; length: number; flow: string | null }[];
  c23: { drain: number; ret: number };
} = { back: [], gasHatch: "", handleClip: "", doors: {}, rotor: null, display: null, hinge: [-204, -165], lines: [], c23: { drain: 0, ret: 0 } };

// ───────── item helpers (spec frame) ─────────
const SYS = Object.fromEntries(REGISTER.map((row) => [row.id, row.sys]));
type Common = { bias?: number; sys?: string; move?: number[]; ride?: string; owner?: string; also?: string; attrs?: string; title?: string; extra?: string; inner?: string };

export function put({ name, c, sys, piece = "stand", ref, svg, shapes = [], bias = 0, move, ride, also = "", attrs = "", title }: any) {
  const mv = move ?? PIECES[piece].move;
  return R.put({ name: R.nameFor(name), at: K(ref), bias, svg, shapes, piece, ride: ride ?? piece, move: K(mv), c, sys: sys ?? SYS[c] ?? "chassis", also, attrs, title });
}
const meta = (name: string, more: any = {}) => ({ name, ...more });
export const planOf = ([x0, y0]: number[], [x1, y1]: number[], r = 0) => ({ x: Math.min(x0, x1), y: -Math.max(y0, y1), w: Math.abs(x1 - x0), d: Math.abs(y1 - y0), r });

/** A rounded box between two spec corners. */
export function box(name: string, c: string, piece: string, [x0, y0, z0]: number[], [x1, y1, z1]: number[], style: any = {}, o: Common & { r?: number; steps?: number; bevel?: number; shape?: boolean } = {}) {
  const { r = 1, steps = 3, bevel = 0, extra = "", inner = "", shape = true } = o;
  const plan = planOf([x0, y0], [x1, y1], r);
  const paths = k.slabOf(plan, z0, z1 - z0, P, steps, bevel);
  const shapes = shape ? [record(A.slab(plan, z0, z1 - z0, meta(name, { owner: o.owner }), steps))] : [];
  return put({ ...o, name, c, piece, ref: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes });
}
/** An upright cylinder (posts, pads, discs lying flat). */
export function cyl(name: string, c: string, piece: string, [cx, cy]: number[], r: number, z0: number, z1: number, style: any = {}, o: Common & { steps?: number; bevel?: number } = {}) {
  const { steps = 32, bevel = 0, extra = "", inner = "" } = o;
  const paths = k.cylinder(cx, -cy, r, z0, z1 - z0, P, steps, bevel);
  const shapes = [record(A.cylinder(cx, -cy, r, z0, z1 - z0, meta(name, { owner: o.owner })))];
  return put({ ...o, name, c, piece, ref: [cx, cy, (z0 + z1) / 2], svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes });
}
/** Any floor outline (spec xy ring), extruded upright. */
export function ringXY(name: string, c: string, piece: string, ring: number[][], z0: number, z1: number, style: any = {}, o: Common & { convex?: boolean; ref?: number[] } = {}) {
  const { extra = "", inner = "", convex = false } = o;
  const kr = ring.map(([x, y]) => [x, -y]);
  const paths = k.extrude(kr, z0, z1 - z0, P, { convex });
  const cx = ring.reduce((a, p) => a + p[0], 0) / ring.length;
  const cy = ring.reduce((a, p) => a + p[1], 0) / ring.length;
  const shapes = [record(A.extruded(kr, z0, z1 - z0, meta(name, { owner: o.owner })))];
  return put({ ...o, name, c, piece, ref: o.ref ?? [cx, cy, (z0 + z1) / 2], svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes });
}
export const frameOf = (o: number[], a: number[], u: number[], v: number[]) => G.frameOf(K(o), K(a), K(u), K(v));
/** A turned part: a half-section profile [[s, r], …] around frame F. */
export function turned(name: string, c: string, piece: string, F: any, profile: number[][], style: any = {}, o: Common & { smooth?: any; steps?: number; rims?: string; bevel?: number; ref?: number[] } = {}) {
  const { extra = "", inner = "", bias = 0, smooth, steps, rims, bevel = 0 } = o;
  const opts = { bevel, ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(rims ? { rims } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner: o.owner, curve: profile.some((p) => p[2]) && !(smooth && smooth.slope) ? profile : undefined }));
  const refK = o.ref ? K(o.ref) : G.add3(F.o, G.mul3(F.a, mid));
  const piece0 = piece;
  return R.put({ name: R.nameFor(name), at: refK, bias, svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes: [shape], piece: piece0, ride: o.ride ?? piece0, move: K(o.move ?? PIECES[piece0].move), c, sys: o.sys ?? SYS[c], also: o.also ?? "", title: o.title });
}
export const disc = (name: string, c: string, piece: string, F: any, s0: number, s1: number, r: number, style?: any, o?: any) => turned(name, c, piece, F, [[s0, r], [s1, r]], style, o);
export function ball(name: string, c: string, piece: string, centre: number[], r: number, style: any = {}, o: Common = {}) {
  const shape = record(A.ball(K(centre), r, { name, owner: o.owner }));
  return put({ ...o, name, c, piece, ref: centre, svg: S(G.sphereOf(K(centre), r, P, { steps: 32 }), { tone: "mid", ...style }), shapes: [shape] });
}
/** A record-only box (for items whose drawing is custom), in spec corners. */
export function boxShape(min: number[], max: number[], name: string) {
  const a = K(min), b = K(max);
  return record(A.box([Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2])], [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])], meta(name)));
}

// ───────── drawing on faces ─────────
/** SVG matrix that lays a flat drawing on a plane: o + u·ex + v·ey (spec vectors, mm). */
export function planeMatrix(o: number[], ex: number[], ey: number[]) {
  const p0 = at(o);
  const px = at(add(o, ex));
  const py = at(add(o, ey));
  const v = (x: number) => x.toFixed(4);
  return `matrix(${v(px[0] - p0[0])} ${v(px[1] - p0[1])} ${v(py[0] - p0[0])} ${v(py[1] - p0[1])} ${p0[0].toFixed(2)} ${p0[1].toFixed(2)})`;
}
/** Rounded rectangle path in a flat (face) coordinate system. */
export const rr = (x0: number, y0: number, x1: number, y1: number, r: number) => {
  const w = x1 - x0, h = y1 - y0;
  r = Math.min(r, w / 2, h / 2);
  return `M${f2(x0 + r)} ${f2(y0)}H${f2(x1 - r)}A${r} ${r} 0 0 1 ${f2(x1)} ${f2(y0 + r)}V${f2(y1 - r)}A${r} ${r} 0 0 1 ${f2(x1 - r)} ${f2(y1)}H${f2(x0 + r)}A${r} ${r} 0 0 1 ${f2(x0)} ${f2(y1 - r)}V${f2(y0 + r)}A${r} ${r} 0 0 1 ${f2(x0 + r)} ${f2(y0)}Z`;
};
export const circ = (cx: number, cy: number, r: number) => `M${f2(cx - r)} ${f2(cy)}A${r} ${r} 0 1 0 ${f2(cx + r)} ${f2(cy)}A${r} ${r} 0 1 0 ${f2(cx - r)} ${f2(cy)}Z`;
/** A seam or band around the visible side of a box, at height z. */
export const seamOf = ([x0, y0]: number[], [x1, y1]: number[], z: number, r = 1, steps = 3) => k.sideSeam(planOf([x0, y0], [x1, y1], r), z, P, steps);
export const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 10) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

// ───────── pipes, hoses and cables ─────────
type LineOpts = {
  tone?: string; bend?: number; maxLength?: number; spacing?: number; flow?: string | null; reverse?: boolean;
  ends?: string[]; fit?: number[]; fitLen?: number[]; gapsAlong?: number[][]; free?: boolean[]; limp?: boolean; bias?: number;
  sys?: string; move?: number[]; ride?: string; rings?: any; cls?: string; also?: string;
};
/**
 * A pipe, hose or cable along spec control points, filleted, split into depth-sorted chunks.
 * ends: "dot" | "shell" | "coupling" | "none". gapsAlong: [axis, from, to] spans (spec coords) where a clip wraps it.
 * flow names the overlay drawn along it (drain, return, gas, gasout, ext, water, power, data).
 */
export function line(name: string, c: string, piece: string, control: number[][], r: number, o: LineOpts = {}) {
  const { tone = "hi", bend = 2.6, maxLength = 40, spacing = 1.4, flow = null, reverse = false, ends = ["dot", "dot"], fit = [r * 1.7, r * 1.7], fitLen = [r * 1.8, r * 1.8], gapsAlong = [], free = [false, false], limp = false, bias = 0.05, sys, move, ride, rings = null, cls = "", also = "" } = o;
  const route = G.fillet(control.map(K), Math.max(r * bend, 4), 10, { P, tube: r });
  const total = G.pathLength(route);
  const gaps: number[][] = [];
  for (const [axis, v0, v1] of gapsAlong) {
    const dense = G.resample(route, 0.25);
    let walked = 0, start: number | null = null;
    for (let i = 0; i < dense.length; i++) {
      if (i) walked += G.len3(G.sub3(dense[i], dense[i - 1]));
      const v = K(dense[i])[axis];
      const inside = v >= v0 && v <= v1;
      if (inside && start === null) start = walked;
      if ((!inside || i === dense.length - 1) && start !== null) {
        gaps.push([start, walked]);
        start = null;
      }
    }
  }
  const collars: { side: number; len: number; r: number; kind: string }[] = [];
  [0, 1].forEach((side) => {
    const kind = ends[side];
    if (kind !== "shell" && kind !== "coupling") return;
    const len = fitLen[side];
    gaps.push(side ? [total - len, total] : [0, len]);
    collars.push({ side, len, r: fit[side], kind });
  });
  const mv = move ?? PIECES[piece].move;
  const rideId = ride ?? piece;
  const sysId = sys ?? SYS[c];
  R.route(name, route, r, { gaps, limp, rims: [0, 1].map((side) => (ends[side] === "shell" || ends[side] === "coupling" ? fit[side] : r)), free, piece, move: K(mv), ride: rideId });
  scene.lines.push({ name, c, length: total, flow });
  const flat = route.map((p: number[]) => k.iso(p, P));
  const cumulative = [0];
  for (let i = 1; i < flat.length; i++) cumulative.push(cumulative[i - 1] + Math.hypot(flat[i][0] - flat[i - 1][0], flat[i][1] - flat[i - 1][1]));
  const along3 = [0];
  for (let i = 1; i < route.length; i++) along3.push(along3[i - 1] + G.len3(G.sub3(route[i], route[i - 1])));
  const screenAt = (s3: number) => {
    let i = 1;
    while (i < along3.length - 1 && along3[i] < s3) i++;
    const t = (s3 - along3[i - 1]) / Math.max(1e-9, along3[i] - along3[i - 1]);
    return cumulative[i - 1] + (cumulative[i] - cumulative[i - 1]) * Math.max(0, Math.min(1, t));
  };
  const pieces = tubePieces(route, r, P, { maxLength, spacing, gaps, rings });
  pieces.forEach((p3: any, index: number) => {
    let flowSvg = "";
    if (flow) {
      // flow marks follow this chunk's centreline, phased by screen length from where the flow starts
      const startS = screenAt(p3.from);
      const endS = screenAt(p3.to);
      const fl = p3.points.map((p: number[]) => k.iso(p, P));
      const fw = reverse ? fl.slice().reverse() : fl;
      const totalScreen = cumulative[cumulative.length - 1];
      const offset = reverse ? totalScreen - endS : startS;
      flowSvg = `<path class="sl-flow" data-f="${flow}" d="${k.pathOf(fw)}" style="--o:${f2(offset)}"/>`;
      if (fw.length > 3) {
        const m = Math.floor(fw.length / 2);
        const [ax, ay] = fw[m - 1], [bx, by] = fw[m + 1];
        const len = Math.hypot(bx - ax, by - ay);
        if (len > 0.4 && endS - startS > 14) {
          const tx = (bx - ax) / len, ty = (by - ay) / len;
          const [cx, cy] = fw[m];
          const sz = 2.4;
          flowSvg += `<path class="sl-chev" data-f="${flow}" d="M${f2(cx - tx * sz - ty * sz)} ${f2(cy - ty * sz + tx * sz)}L${f2(cx)} ${f2(cy)}L${f2(cx - tx * sz + ty * sz)} ${f2(cy - ty * sz - tx * sz)}"/>`;
        }
      }
    }
    R.put({ name: `${name}:${index}`, at: p3.mid, bias, svg: `<g class="tb-wrap${cls ? ` ${cls}` : ""}">${tubeSvg(p3, { tone })}${flowSvg}</g>`, shapes: [A.tube(p3.points, p3.radii)], piece, ride: rideId, move: K(mv), c, sys: sysId, route: name, chunk: index, also });
  });
  collars.forEach(({ side, len, r: cr, kind }) => {
    const end = side ? route[route.length - 1] : route[0];
    const tangent = G.tangentAlong(route, side ? total : 0);
    const F = G.frameAlong(end, tangent);
    const [s0, s1] = side ? [-len, 0] : [0, len];
    // a coupling steps down toward its mating end; a connector shell is a plain collar
    const midS = side ? s0 + len * 0.55 : s0 + len * 0.45;
    const prof = kind === "coupling" ? (side ? [[s0, cr], [midS, cr], [midS, cr * 0.84], [s1, cr * 0.84]] : [[s0, cr * 0.84], [midS, cr * 0.84], [midS, cr], [s1, cr]]) : [[s0, cr], [s1, cr]];
    const shape = record(A.solid(F, prof, { name: `${name}.fit${side}`, owner: name }));
    R.put({ name: `${name}.fit${side}`, at: G.add3(end, G.mul3(tangent, (s0 + s1) / 2)), bias: bias + 0.1, svg: S(G.solidOf(prof, F, P, { steps: 24 }), { tone: "mid" }), shapes: [shape], piece, ride: rideId, move: K(mv), c, sys: sysId, also });
  });
  [0, 1].forEach((side) => {
    if (ends[side] !== "dot") return;
    const end = side ? route[route.length - 1] : route[0];
    const size = Math.max(0.55, r * KS * 0.9);
    R.put({ name: `${name}.end${side}`, at: end, bias: bias + 0.15, svg: Dots([k.iso(end, P)], { size, tone: "hi" }), shapes: [A.ball(end, size / KS, { name: `${name}.end${side}`, owner: name })], piece, ride: rideId, move: K(mv), c, sys: sysId, also });
  });
  return { route, total };
}

/** Inner walls of a rectangular pocket in the right wall (x 230 face): bottom face, rear face, floor. */
export function pocketSvg(c: string, { y0, y1, z0, z1, back: xb }: { y0: number; y1: number; z0: number; z1: number; back: number }, sys: string) {
  const bottom = path3([[230, y0, z0], [230, y1, z0], [xb, y1, z0], [xb, y0, z0]], true);
  const rearWall = path3([[230, y1, z0], [230, y1, z1], [xb, y1, z1], [xb, y1, z0]], true);
  const floor = path3([[xb, y0, z0], [xb, y1, z0], [xb, y1, z1], [xb, y0, z1]], true);
  return `<g data-c="${c}" data-s="${sys}"><path class="sl-cavity" d="${floor}"/><path class="iso-top" d="${bottom}"/><path class="iso-shade" data-shade="1" d="${rearWall}"/>` + Ln(floor, { tone: "faint" }) + Ln(path3([[230, y0, z0], [230, y1, z0], [230, y1, z1], [230, y0, z1]], true), { tone: "lo" }) + `</g>`;
}

/** Split an arc [a0, a1] (degrees, spec frame) into pieces wholly behind or in front of its axis, as seen from
 *  the camera, so a ring around a body can be drawn as a back half and a front half. */
export function splitArc(a0: number, a1: number) {
  const towards = (Math.atan2(-VIEW[1], VIEW[0]) * 180) / Math.PI; // spec-frame plan angle toward the viewer
  const cuts = [towards - 90, towards + 90].flatMap((c) => [-720, -360, 0, 360, 720].map((t) => c + t)).filter((c) => c > a0 && c < a1).sort((x, y) => x - y);
  const edges = [a0, ...cuts, a1];
  return edges.slice(0, -1).map((from, i) => {
    const to = edges[i + 1];
    const mid = ((from + to) / 2) * (Math.PI / 180);
    const facing = Math.cos(mid) * Math.cos((towards * Math.PI) / 180) + Math.sin(mid) * Math.sin((towards * Math.PI) / 180);
    return { from, to, front: facing > 0 };
  });
}

/** One component file. */
export type Part = { id: string; build: () => void };
