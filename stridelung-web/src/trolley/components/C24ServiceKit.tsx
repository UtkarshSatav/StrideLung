// C24 — Compatible backup/service-kit allowance
// Service pouch/drawer proxy · 140 × 60 × 70 · 0.80 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C24-service-kit.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C24ServiceKit className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C24 (dimensions, mass, material and status). */
export const C24 = BY_ID.C24;

export function C24ServiceKit(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C24" {...props} />;
}
