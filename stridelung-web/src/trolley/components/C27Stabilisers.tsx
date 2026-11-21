// C27 — Deployable stabiliser pair
// Fold-out arms/feet · 620 × 480 deployed support envelope · 0.65 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C27-stabilisers.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C27Stabilisers className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C27 (dimensions, mass, material and status). */
export const C27 = BY_ID.C27;

export function C27Stabilisers(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C27" {...props} />;
}
