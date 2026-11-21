// C11 — Medical oxygen cylinder with integral valve
// Cylinder, shoulder, protected valve · 110 × 110 × 540 · 3.50 kg allocated (P) · material status R/U
// Geometry: src/trolley/geometry/parts/C11-oxygen-cylinder.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C11OxygenCylinder className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C11 (dimensions, mass, material and status). */
export const C11 = BY_ID.C11;

export function C11OxygenCylinder(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C11" {...props} />;
}
