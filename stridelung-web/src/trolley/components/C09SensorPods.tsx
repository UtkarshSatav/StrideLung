// C09 — Three pressure/temperature sensor pods
// Three small blocks · 35 × 25 × 25 each · 0.12 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C09-sensor-pods.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C09SensorPods className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C09 (dimensions, mass, material and status). */
export const C09 = BY_ID.C09;

export function C09SensorPods(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C09" {...props} />;
}
