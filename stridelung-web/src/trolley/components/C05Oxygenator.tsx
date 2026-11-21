// C05 — Membrane oxygenator with integrated heat exchanger
// Rounded cartridge · 180 × 100 × 160 · 1.10 kg allocated (P) · material status R/U
// Geometry: src/trolley/geometry/parts/C05-oxygenator.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C05Oxygenator className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C05 (dimensions, mass, material and status). */
export const C05 = BY_ID.C05;

export function C05Oxygenator(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C05" {...props} />;
}
