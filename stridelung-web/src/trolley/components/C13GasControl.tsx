// C13 — Gas flow/control and external-gas interface block
// Manifold enclosure · 80 × 90 × 150 · 0.50 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C13-gas-control.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C13GasControl className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C13 (dimensions, mass, material and status). */
export const C13 = BY_ID.C13;

export function C13GasControl(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C13" {...props} />;
}
