// C21 — Audible/visual alarm assembly
// Small indicator block · 70 × 40 × 25 · 0.10 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C21-alarm.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C21Alarm className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C21 (dimensions, mass, material and status). */
export const C21 = BY_ID.C21;

export function C21Alarm(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C21" {...props} />;
}
