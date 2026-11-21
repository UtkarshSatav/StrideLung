// C17 — Battery assembly including case/BMS
// Low rectangular cassette · 220 × 80 × 70 · 1.80 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C17-battery.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C17Battery className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C17 (dimensions, mass, material and status). */
export const C17 = BY_ID.C17;

export function C17Battery(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C17" {...props} />;
}
