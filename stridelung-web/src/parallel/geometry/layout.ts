// Shared layout of the parallel-oxygenator concept figure (spec frame: mm, x right, y back — −y is the front —
// z up, origin at the floor centre). These are DRAWING positions for a concept illustration. They are not a
// packaging specification, and the single-cartridge concept's envelope, mass and fit are deliberately not reused.

/** Case: wider than the single-cartridge concept; corners r 26, 3 mm shell. */
export const CASE = { x0: -290, x1: 290, y0: -170, y1: 170, z0: 90, z1: 800, r: 26, t: 3 };
/** The provisional extension joint: the case grew from here to x 290 to take the second cartridge. */
export const JOINT = 170;
/** Door hinge axis (front-left pillar) and the door itself. */
export const HINGE: [number, number] = [-264, -170];
export const DOOR = { w: 528, z0: 102, z1: 714, t: 3 };
/** Fixed fascia above the bay, and the display set into it. */
export const FASCIA = { z0: 718, z1: 797 };
export const DISP = { x0: -110, x1: 110, z0: 730, z1: 788, y0: -176, y1: -170 };
/** Lid channel the handle rails rise out of; the handle is shown part-raised. */
export const CHAN = { x0: -162, x1: 162, y0: 124, y1: 156, floor: 772 };
export const HANDLE = { top: 958, rails: [[-158, -134], [134, 158]] as [number, number][], y0: 128, y1: 152 };
/** Inner wall faces, side rails and the two module shelves. */
export const WALL = { l: -287, r: 287 };
export const RAILS = [138, 642];
export const SHELF1 = { x0: -284, x1: 284, y0: -164, y1: 150, z0: 148, z1: 158 };
export const SHELF2 = { x0: -284, x1: 284, y0: -60, y1: 122, z0: 652, z1: 662 };
/** The shared carrier on the lower shelf. */
export const CARRIER = { x0: -236, x1: 236, y0: -128, y1: 96, z0: 158, z1: 168 };
export const SPINE = { x0: -232, x1: 232, y0: 76, y1: 86, z1: 552 };
/** The carrier's central mast and the arm the split manifold is bolted to. */
export const MAST = { x0: -14, x1: 14, y0: 76, y1: 88, z0: 552, z1: 652 };
export const ARM = { x0: -12, x1: 12, y0: 12, y1: 76, z0: 598, z1: 622 };
/** Two matched cartridges (identical modules, identical port angles). */
export const CART = { xs: [-160, 160] as const, y: -10, r: 58, pad: 174 };
export const CZ = {
  pad0: 168, // cup pad top is the cartridge seat
  bottom: [174, 206], // bottom cap
  hx: [206, 236], // heat-exchanger band
  body: [236, 452], // housing with the cutaway face
  top: [452, 478], // top cap
  boss: [478, 488],
  port: [488, 506], // blood-side inlet port (axial)
};
export const PORTZ = { out: 196, gasIn: 466, gasOut: 196, hx: 221 };
/** Port angles on each cartridge (spec plan degrees; −90 is straight to the front). */
export const ANG = { out: -90, gas: -12, hx: [-150, -128] };
/** Split (hangs from the upper shelf) and merge (on the carrier) manifolds. */
export const SPLIT = { x0: -32, x1: 32, y0: -32, y1: 12, z0: 590, z1: 630 };
export const MERGE = { x0: -34, x1: 34, y0: -124, y1: -80, z0: 168, z1: 222 };
/** Line levels and runs. */
export const BR = 6.5; // blood-side line radius (visual only, not a lumen size)
export const RUN = {
  inlet: { y: -10, z: 610 },
  upper: { z: 542 }, // upstream branch runs
  lower: { y: -108, z: 196 }, // downstream branch runs (level with the cartridge outlet ports)
  outlet: { y: -154, z: 182 },
};
/** Right-wall pass-throughs (inlet via the inlet block; outlet via a bulkhead). */
export const PASS = { inlet: [-10, 610], outlet: [-118, 182] } as const;
/** The outer concept boundary: a post at the plinth's edge with two capped connectors. */
export const POST = { x: 488, y: -118, inZ: 520, outZ: 336 };
export const BOUNDARY = { x0: 398, x1: 414, y0: -330, y1: 200 };
