// C12 — Cylinder restraint and isolated bay hardware
// Two cradles + straps · 120 × 140 × 560 · 0.45 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C12-cylinder-restraint.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C12CylinderRestraint className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C12 (dimensions, mass, material and status). */
export const C12 = BY_ID.C12;

export function C12CylinderRestraint(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C12" {...props} />;
}
