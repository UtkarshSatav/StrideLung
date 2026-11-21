// C16 — Thermal water hoses
// Paired flexible lines · 10 mm visual OD · 1.6 m path total · 0.15 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C16-thermal-hoses.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C16ThermalHoses className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C16 (dimensions, mass, material and status). */
export const C16 = BY_ID.C16;

export function C16ThermalHoses(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C16" {...props} />;
}
