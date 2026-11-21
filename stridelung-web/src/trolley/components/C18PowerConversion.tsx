// C18 — Power conversion, charging and isolation assembly
// Low rectangular block · 180 × 80 × 45 · 0.65 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C18-power-conversion.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C18PowerConversion className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C18 (dimensions, mass, material and status). */
export const C18 = BY_ID.C18;

export function C18PowerConversion(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C18" {...props} />;
}
