// C01 — Rigid outer case, inspection window, service doors
// Rounded upright case · 460 × 330 × 700 · 2.00 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C01-case.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C01OuterCase className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C01 (dimensions, mass, material and status). */
export const C01 = BY_ID.C01;

export function C01OuterCase(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C01" {...props} />;
}
