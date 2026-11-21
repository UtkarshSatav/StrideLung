// C26 — Cables, vents, partitions and small mounting hardware
// Distributed accessories · Within routing and service clearances · 0.60 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C26-cables-hardware.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C26CablesHardware className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C26 (dimensions, mass, material and status). */
export const C26 = BY_ID.C26;

export function C26CablesHardware(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C26" {...props} />;
}
