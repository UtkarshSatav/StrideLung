// C10 — Flow and bubble sensor assembly
// Clip around a line · 65 × 50 × 35 · 0.22 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C10-flow-bubble-sensor.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C10FlowBubbleSensor className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C10 (dimensions, mass, material and status). */
export const C10 = BY_ID.C10;

export function C10FlowBubbleSensor(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C10" {...props} />;
}
