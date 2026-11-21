// A figure builder: one camera, one painter's recorder and every drawing helper the part files call.
//
// Each figure (the StrideLung 01 trolley, the parallel-oxygenator concept, its baseline thumbnail) makes its own
// builder with createBuilder(), so two figures can be generated side by side without sharing a recorder.
// Geometry is written in the SPEC frame (millimetres; x right, y back — negative y is the front — z up; origin at
// the floor centre). The isometric kit is mirrored for a right-handed world, so every point is flipped once into
// the kit's frame with K().
//
// Nothing here runs in the browser: the generator scripts run the parts, settle the painter's order and write
// JSON, which the React components render.
import * as kit from "../iso/iso-kit.mjs";
import * as lathe from "../iso/lathe.mjs";
import * as tube from "../iso/tube.mjs";
import * as audit from "../iso/audit.mjs";

export const k: any = kit;
export const G: any = lathe;
export const A: any = audit;
const { tubePieces, tubeSvg }: any = tube;

export type V3 = [number, number, number];
export type V2 = [number, number];

// ───────── camera-free helpers ─────────
export const K = ([x, y, z]: number[]): V3 => [x, -y, z];
export const f2 = (v: number) => Math.round(v * 100) / 100;
export const add = G.add3 as (a: number[], b: number[]) => V3;
export const mul = G.mul3 as (a: number[], s: number) => V3;
export const dot = G.dot3 as (a: number[], b: number[]) => number;
export const planOf = ([x0, y0]: number[], [x1, y1]: number[], r = 0) => ({ x: Math.min(x0, x1), y: -Math.max(y0, y1), w: Math.abs(x1 - x0), d: Math.abs(y1 - y0), r });
export const frameOf = (o: number[], a: number[], u: number[], v: number[]) => G.frameOf(K(o), K(a), K(u), K(v));
/** Rounded rectangle path in a flat (face) coordinate system. */
export const rr = (x0: number, y0: number, x1: number, y1: number, r: number) => {
  const w = x1 - x0, h = y1 - y0;
  r = Math.min(r, w / 2, h / 2);
  return `M${f2(x0 + r)} ${f2(y0)}H${f2(x1 - r)}A${r} ${r} 0 0 1 ${f2(x1)} ${f2(y0 + r)}V${f2(y1 - r)}A${r} ${r} 0 0 1 ${f2(x1 - r)} ${f2(y1)}H${f2(x0 + r)}A${r} ${r} 0 0 1 ${f2(x0)} ${f2(y1 - r)}V${f2(y0 + r)}A${r} ${r} 0 0 1 ${f2(x0 + r)} ${f2(y0)}Z`;
};
export const circ = (cx: number, cy: number, r: number) => `M${f2(cx - r)} ${f2(cy)}A${r} ${r} 0 1 0 ${f2(cx + r)} ${f2(cy)}A${r} ${r} 0 1 0 ${f2(cx - r)} ${f2(cy)}Z`;
export const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 10) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

export type Piece = { label: string; move: V3 };
export type Line = { name: string; c: string; length: number; flow: string | null };
type Common = { bias?: number; sys?: string; move?: number[]; ride?: string; owner?: string; also?: string; attrs?: string; title?: string; extra?: string; inner?: string };
type LineOpts = {
  tone?: string; bend?: number; maxLength?: number; spacing?: number; flow?: string | null; reverse?: boolean;
  ends?: string[]; fit?: number[]; fitLen?: number[]; gapsAlong?: number[][]; free?: boolean[]; limp?: boolean; bias?: number;
  sys?: string; move?: number[]; ride?: string; rings?: any; cls?: string; also?: string;
  /** names (prefix*) of solids this line may touch or pass inside on purpose: its own in-line fittings */
  touch?: string[];
  /** resample step (mm) used to find gapsAlong edges; finer steps land run tips exactly on their fittings */
  gapStep?: number;
};

export type BuilderConfig = {
  W: number;
  H: number;
  azimuth: number;
  elevation: number;
  /** spec-frame points the camera must fit */
  fit: number[][];
  pad?: number;
  /** assemblies and how each moves when the figure comes apart ("stand" is required) */
  pieces: Record<string, Piece>;
  /** spring order for the recorder (assemblies that move) */
  order: string[];
  spring: { stagger: number; stiffness: number; damping: number; substeps: number };
  /** component ID → subsystem, and the fallback */
  sysOf: Record<string, string>;
  defaultSys: string;
};

export function createBuilder(cfg: BuilderConfig) {
  const { W, H, pieces: PIECES, sysOf: SYS, defaultSys } = cfg;
  const P: any = k.fitProjection(cfg.fit.map(K), W, H, { pad: cfg.pad ?? 26, azimuth: cfg.azimuth, elevation: cfg.elevation });
  const KS: number = G.scaleOf(P);
  const VIEW: V3 = G.viewOf(P);
  const at = (p: number[]): V2 => k.iso(K(p), P);
  const path3 = (points: number[][], closed = false): string => k.pathOf(points.map(at), closed);
  const S = (paths: any, style?: any): string => k.solidSvg(paths, style);
  const Ln = (d: string, style?: any): string => k.lineSvg(d, style);
  const Dots = (points: any[], style?: any): string => k.dotsSvg(points, style);
  const depthS = (p: number[]) => dot(K(p), VIEW);
  const R: any = A.recorder(P, { order: cfg.order, spring: cfg.spring });
  const record = (shape: any) => R.solid(shape);
  const lines: Line[] = [];
  const sysFor = (c: string, sys?: string) => sys ?? SYS[c] ?? defaultSys;
  const meta = (name: string, more: any = {}) => ({ name, ...more });

  function put({ name, c, sys, piece = "stand", ref, svg, shapes = [], bias = 0, move, ride, also = "", attrs = "", title }: any) {
    const mv = move ?? PIECES[piece].move;
    return R.put({ name: R.nameFor(name), at: K(ref), bias, svg, shapes, piece, ride: ride ?? piece, move: K(mv), c, sys: sysFor(c, sys), also, attrs, title });
  }
  /** A rounded box between two spec corners. */
  function box(name: string, c: string, piece: string, [x0, y0, z0]: number[], [x1, y1, z1]: number[], style: any = {}, o: Common & { r?: number; steps?: number; bevel?: number; shape?: boolean } = {}) {
    const { r = 1, steps = 3, bevel = 0, extra = "", inner = "", shape = true } = o;
    const plan = planOf([x0, y0], [x1, y1], r);
    const paths = k.slabOf(plan, z0, z1 - z0, P, steps, bevel);
    const shapes = shape ? [record(A.slab(plan, z0, z1 - z0, meta(name, { owner: o.owner }), steps))] : [];
    return put({ ...o, name, c, piece, ref: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes });
  }
  /** An upright cylinder (posts, pads, discs lying flat). */
  function cyl(name: string, c: string, piece: string, [cx, cy]: number[], r: number, z0: number, z1: number, style: any = {}, o: Common & { steps?: number; bevel?: number } = {}) {
    const { steps = 32, bevel = 0, extra = "", inner = "" } = o;
    const paths = k.cylinder(cx, -cy, r, z0, z1 - z0, P, steps, bevel);
    const shapes = [record(A.cylinder(cx, -cy, r, z0, z1 - z0, meta(name, { owner: o.owner })))];
    return put({ ...o, name, c, piece, ref: [cx, cy, (z0 + z1) / 2], svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes });
  }
  /** Any floor outline (spec xy ring), extruded upright. */
  function ringXY(name: string, c: string, piece: string, ring: number[][], z0: number, z1: number, style: any = {}, o: Common & { convex?: boolean; ref?: number[] } = {}) {
    const { extra = "", inner = "", convex = false } = o;
    const kr = ring.map(([x, y]) => [x, -y]);
    const paths = k.extrude(kr, z0, z1 - z0, P, { convex });
    const cx = ring.reduce((a, p) => a + p[0], 0) / ring.length;
    const cy = ring.reduce((a, p) => a + p[1], 0) / ring.length;
    const shapes = [record(A.extruded(kr, z0, z1 - z0, meta(name, { owner: o.owner })))];
    return put({ ...o, name, c, piece, ref: o.ref ?? [cx, cy, (z0 + z1) / 2], svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes });
  }
  /** A turned part: a half-section profile [[s, r], …] around frame F. */
  function turned(name: string, c: string, piece: string, F: any, profile: number[][], style: any = {}, o: Common & { smooth?: any; steps?: number; rims?: string; bevel?: number; ref?: number[] } = {}) {
    const { extra = "", inner = "", bias = 0, smooth, steps, rims, bevel = 0 } = o;
    const opts = { bevel, ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(rims ? { rims } : {}) };
    const paths = G.solidOf(profile, F, P, opts);
    const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
    const shape = record(A.solid(F, profile, { name, owner: o.owner, curve: profile.some((p) => p[2]) && !(smooth && smooth.slope) ? profile : undefined }));
    const refK = o.ref ? K(o.ref) : G.add3(F.o, G.mul3(F.a, mid));
    return R.put({ name: R.nameFor(name), at: refK, bias, svg: S(paths, { tone: "mid", ...style, inner }) + extra, shapes: [shape], piece, ride: o.ride ?? piece, move: K(o.move ?? PIECES[piece].move), c, sys: sysFor(c, o.sys), also: o.also ?? "", title: o.title, attrs: o.attrs ?? "" });
  }
  const disc = (name: string, c: string, piece: string, F: any, s0: number, s1: number, r: number, style?: any, o?: any) => turned(name, c, piece, F, [[s0, r], [s1, r]], style, o);
  function ball(name: string, c: string, piece: string, centre: number[], r: number, style: any = {}, o: Common = {}) {
    const shape = record(A.ball(K(centre), r, { name, owner: o.owner }));
    return put({ ...o, name, c, piece, ref: centre, svg: S(G.sphereOf(K(centre), r, P, { steps: 32 }), { tone: "mid", ...style }), shapes: [shape] });
  }
  /** A record-only box (for items whose drawing is custom), in spec corners. */
  function boxShape(min: number[], max: number[], name: string, more: any = {}) {
    const a = K(min), b = K(max);
    return record(A.box([Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2])], [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])], meta(name, more)));
  }

  /** SVG matrix that lays a flat drawing on a plane: o + u·ex + v·ey (spec vectors, mm). */
  function planeMatrix(o: number[], ex: number[], ey: number[]) {
    const p0 = at(o);
    const px = at(add(o, ex));
    const py = at(add(o, ey));
    const v = (x: number) => x.toFixed(4);
    return `matrix(${v(px[0] - p0[0])} ${v(px[1] - p0[1])} ${v(py[0] - p0[0])} ${v(py[1] - p0[1])} ${p0[0].toFixed(2)} ${p0[1].toFixed(2)})`;
  }
  /** A seam or band around the visible side of a box, at height z. */
  const seamOf = ([x0, y0]: number[], [x1, y1]: number[], z: number, r = 1, steps = 3) => k.sideSeam(planOf([x0, y0], [x1, y1], r), z, P, steps);

  /**
   * A pipe, hose or cable along spec control points, filleted, split into depth-sorted chunks.
   * ends: "dot" | "shell" | "coupling" | "none". gapsAlong: [axis, from, to] spans (kit frame) where a clip wraps it.
   * flow names the overlay drawn along it.
   */
  function line(name: string, c: string, piece: string, control: number[][], r: number, o: LineOpts = {}) {
    const { tone = "hi", bend = 2.6, maxLength = 40, spacing = 1.4, flow = null, reverse = false, ends = ["dot", "dot"], fit = [r * 1.7, r * 1.7], fitLen = [r * 1.8, r * 1.8], gapsAlong = [], free = [false, false], limp = false, bias = 0.05, sys, move, ride, rings = null, cls = "", also = "", touch, gapStep = 0.25 } = o;
    const route = G.fillet(control.map(K), Math.max(r * bend, 4), 10, { P, tube: r });
    const total = G.pathLength(route);
    const gaps: number[][] = [];
    for (const [axis, v0, v1] of gapsAlong) {
      const dense = G.resample(route, gapStep);
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
    const sysId = sysFor(c, sys);
    R.route(name, route, r, { ...(touch ? { touch } : {}), gaps, limp, rims: [0, 1].map((side) => (ends[side] === "shell" || ends[side] === "coupling" ? fit[side] : r)), free, piece, move: K(mv), ride: rideId });
    lines.push({ name, c, length: total, flow });
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

  /** Split an arc [a0, a1] (degrees, spec frame) into pieces wholly behind or in front of its axis, as seen from
   *  the camera, so a ring around a body can be drawn as a back half and a front half. */
  function splitArc(a0: number, a1: number) {
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
  /** Spec-frame plan angle (degrees) that faces the camera. */
  const towardViewer = () => (Math.atan2(-VIEW[1], VIEW[0]) * 180) / Math.PI;

  /**
   * A saddle pad of radius a standing h out of a curved host (any recorded shapes), along `outward` from `point`
   * (spec frame). It meets the host along the true intersection and is recorded as a disc cut by its host.
   * Returns the pad's flat face centre (spec frame), where a port or stub continues.
   */
  function padOn(name: string, c: string, piece: string, host: any | any[], point: number[], outward: number[], a: number, h: number, style: any = {}, o: Common = {}) {
    const hosts = [host].flat();
    const inside = (p: number[]) => hosts.some((shape: any) => A.sdf(shape, p) < 0);
    const axis = G.unit3(K(outward));
    const F = G.frameAlong(K(point), axis);
    const start = (angle: number) => {
      let lo = -2.5 * a;
      let hi = h;
      if (!inside(G.pointOf(F, lo, a, angle))) return 0;
      for (let step = 0; step < 40; step++) {
        const mid = (lo + hi) / 2;
        if (inside(G.pointOf(F, mid, a, angle))) lo = mid;
        else hi = mid;
      }
      return hi;
    };
    const low = Math.min(...Array.from({ length: 48 }, (_, index) => start((index / 48) * Math.PI * 2)));
    const id = R.nameFor(name);
    const shape = record(A.disc(F, low - 0.05, h, a, { name: id, owner: o.owner, seated: true, cut: hosts }));
    R.put({ name: id, at: G.add3(F.o, G.mul3(axis, h / 2)), bias: o.bias ?? 0.1, svg: S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style, inner: o.inner ?? "" }) + (o.extra ?? ""), shapes: [shape], piece, ride: piece, move: K(PIECES[piece].move), c, sys: sysFor(c, o.sys), also: o.also ?? "", title: o.title, attrs: o.attrs ?? "" });
    return { end: K(G.add3(F.o, G.mul3(axis, h))) as V3, F, shape };
  }

  return { W, H, P, KS, VIEW, at, path3, S, Ln, Dots, depthS, PIECES, R, record, lines, put, box, cyl, ringXY, turned, disc, ball, boxShape, planeMatrix, seamOf, line, splitArc, towardViewer, padOn };
}

export type Builder = ReturnType<typeof createBuilder>;
