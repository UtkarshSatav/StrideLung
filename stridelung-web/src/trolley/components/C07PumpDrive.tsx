// C07 — Reusable motor and pump drive
// Rounded motor block · 90 × 60 × 85 · 0.80 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C07-pump-drive.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C07PumpDrive className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C07 (dimensions, mass, material and status). */
export const C07 = BY_ID.C07;

export function C07PumpDrive(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C07" {...props} />;
}
