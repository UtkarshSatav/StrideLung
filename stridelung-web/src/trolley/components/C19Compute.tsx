// C19 — Compute, sensor acquisition and I/O assembly
// Flat electronics box · 230 × 50 × 60 · 0.50 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C19-compute.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C19Compute className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C19 (dimensions, mass, material and status). */
export const C19 = BY_ID.C19;

export function C19Compute(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C19" {...props} />;
}
