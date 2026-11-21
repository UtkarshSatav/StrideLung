// C02 — Internal chassis and module shelves
// Open rail frame · 400 × 270 × 640 · 1.80 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C02-chassis.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C02Chassis className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C02 (dimensions, mass, material and status). */
export const C02 = BY_ID.C02;

export function C02Chassis(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C02" {...props} />;
}
