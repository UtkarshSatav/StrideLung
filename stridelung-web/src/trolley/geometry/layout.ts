// Shared layout constants (spec frame, millimetres). Positions that more than one component
// file needs — case outline, pocket openings, ports, axes — live here so the parts agree.

/** C01 body: 460 × 330 × 700, bottom at z 90, top at z 790, 25 mm corners, 3 mm shell. */
export const CASE = { x0: -230, x1: 230, y0: -165, y1: 165, z0: 90, z1: 790, r: 25, t: 3 };
/** Shared vertical hinge axis of the front door and the lower hatch (front-left corner). */
export const HINGE: [number, number] = [-204, -165];
/** C22 line-exit pocket in the right wall, and the C04 lift-grip pocket. */
export const C22B = { y0: -60, y1: 60, z0: 665, z1: 735, back: 212 };
export const GRIP = { y0: 78, y1: 138, z0: 746, z1: 776, back: 216 };
/** Lid channel the C04 crossbar stows flush in. */
export const CHAN = { x0: -153, x1: 153, y0: 124, y1: 156, floor: 760 };
/** C05 oxygenator footprint (z 510…670). */
export const OX = { x0: -25, x1: 155, y0: -90, y1: 10 };
/** C06 pump axis (along y) at x 50, z 540. */
export const PUMP_AXIS: [number, number] = [50, 540];
/** C11 cylinder centre. */
export const CYL: [number, number] = [-145, 70];
/** C15 thermal module envelope. */
export const TH = { x0: -50, x1: 188, y0: -45, y1: 135, z0: 210, z1: 370 };
/** C20 display envelope; its screen is drawn in the face plane at y −165. */
export const DISP = { x0: -25, x1: 165, z0: 680, z1: 770, y0: -165, y1: -147 };
/** Visual line radii: 13 mm blood (C23), 6 mm gas (C14), 10 mm water (C16), cables. */
export const BR = 6.5;
export const GR = 3;
export const HR = 5;
export const CR = 2.5;
/** Mannequin-interface fixture and its two line ports. */
export const STAND = { x: 600, y: -250 };
export const PORTS = { drain: [STAND.x - 52, STAND.y + 18, 588], ret: [STAND.x - 52, STAND.y - 18, 612] };
/** Right-wall face coordinates (u along y, v down from the lid). */
export const fu = (y: number) => y + 140;
export const fv = (z: number) => 787 - z;
