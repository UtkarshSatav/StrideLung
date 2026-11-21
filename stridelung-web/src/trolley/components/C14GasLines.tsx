// C14 — Gas tubing and outlet guards
// Flexible routed lines · 6 mm visual OD · 1.6 m path total · 0.10 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C14-gas-lines.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C14GasLines className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C14 (dimensions, mass, material and status). */
export const C14 = BY_ID.C14;

export function C14GasLines(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C14" {...props} />;
}
