// C23 — External blood-line pair and visual patient interface
// Two flexible curves + mannequin connector · 13 mm visual OD · 1.5 m per line · 0.35 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C23-blood-lines.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C23BloodLines className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C23 (dimensions, mass, material and status). */
export const C23 = BY_ID.C23;

export function C23BloodLines(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C23" {...props} />;
}
