// C15 — Thermal control module, dry
// Rounded service block · 240 × 180 × 160 · 2.40 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C15-thermal-module.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C15ThermalModule className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C15 (dimensions, mass, material and status). */
export const C15 = BY_ID.C15;

export function C15ThermalModule(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C15" {...props} />;
}
