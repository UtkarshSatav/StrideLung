// C20 — Touchscreen/operator display
// Recessed rectangular panel · 190 × 18 × 90 · 0.40 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C20-display.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C20Display className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C20 (dimensions, mass, material and status). */
export const C20 = BY_ID.C20;

export function C20Display(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C20" {...props} />;
}
