// C25 — Illustrative fluid mass allowance
// Metadata, not a part · 0.60 kg thermal + 0.45 kg circuit · 1.05 kg allocated (P) · material status P
// Geometry: src/trolley/geometry/parts/C25-fluid-allowance.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C25FluidAllowance className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C25 (dimensions, mass, material and status). */
export const C25 = BY_ID.C25;

export function C25FluidAllowance(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C25" {...props} />;
}
