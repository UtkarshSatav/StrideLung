// C08 — Core module carrier / reusable sensor interface
// Small bridge block · 60 × 40 × 35 · 0.20 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C08-sensor-interface.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C08SensorInterface className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C08 (dimensions, mass, material and status). */
export const C08 = BY_ID.C08;

export function C08SensorInterface(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C08" {...props} />;
}
