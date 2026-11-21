// Shared geometry builder for the StrideLung 01 trolley.
//
// Every component file in ./parts calls these helpers. Geometry is written in the SPEC frame
// (millimetres; x right, y back — negative y is the front — z up; origin at the floor centre),
// exactly as STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md gives it. The helpers themselves come from the
// shared figure builder (src/lib/figure/builder.ts); this file sets the trolley's camera, assemblies and recorder.
//
// Nothing here runs in the browser: scripts/generate-figure.ts runs the parts, settles the
// painter's order and writes src/trolley/generated/*.json, which the React components render.
import { createBuilder, k, G, A, K, f2, add, mul, dot, planOf, frameOf, rr, circ, arc, type V2, type V3 } from "../../lib/figure/builder.ts";
import { REGISTER } from "../register.ts";

export { k, G, A, K, f2, add, mul, dot, planOf, frameOf, rr, circ, arc };
export type { V2, V3 };

// ───────── frame and camera ─────────
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

const B = createBuilder({
  W, H, azimuth: AZIMUTH, elevation: ELEVATION, fit: fitPoints, pad: 26, pieces: PIECES, order: ORDER, spring: SPRING,
  sysOf: Object.fromEntries(REGISTER.map((row) => [row.id, row.sys])), defaultSys: "chassis",
});
export const { P, KS, VIEW, at, path3, S, Ln, Dots, depthS, R, record, put, box, cyl, ringXY, turned, disc, ball, boxShape, planeMatrix, seamOf, line, splitArc } = B;

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
} = { back: [], gasHatch: "", handleClip: "", doors: {}, rotor: null, display: null, hinge: [-204, -165], lines: B.lines, c23: { drain: 0, ret: 0 } };

/** Inner walls of a rectangular pocket in the right wall (x 230 face): bottom face, rear face, floor. */
export function pocketSvg(c: string, { y0, y1, z0, z1, back: xb }: { y0: number; y1: number; z0: number; z1: number; back: number }, sys: string) {
  const bottom = path3([[230, y0, z0], [230, y1, z0], [xb, y1, z0], [xb, y0, z0]], true);
  const rearWall = path3([[230, y1, z0], [230, y1, z1], [xb, y1, z1], [xb, y1, z0]], true);
  const floor = path3([[xb, y0, z0], [xb, y1, z0], [xb, y1, z1], [xb, y0, z1]], true);
  return `<g data-c="${c}" data-s="${sys}"><path class="sl-cavity" d="${floor}"/><path class="iso-top" d="${bottom}"/><path class="iso-shade" data-shade="1" d="${rearWall}"/>` + Ln(floor, { tone: "faint" }) + Ln(path3([[230, y0, z0], [230, y1, z0], [230, y1, z1], [230, y0, z1]], true), { tone: "lo" }) + `</g>`;
}

/** One component file. */
export type Part = { id: string; build: () => void };
