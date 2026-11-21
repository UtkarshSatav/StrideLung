// C03 — Four braked caster assemblies
// Wheel + fork, each · 75 × 60 × 90 each · 1.00 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C03-casters.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C03Casters className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C03 (dimensions, mass, material and status). */
export const C03 = BY_ID.C03;

export function C03Casters(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C03" {...props} />;
}
