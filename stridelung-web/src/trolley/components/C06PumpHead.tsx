// C06 — Disposable blood pump head
// Circular chamber · 70 × 50 × 70 · 0.18 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C06-pump-head.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C06PumpHead className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C06 (dimensions, mass, material and status). */
export const C06 = BY_ID.C06;

export function C06PumpHead(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C06" {...props} />;
}
