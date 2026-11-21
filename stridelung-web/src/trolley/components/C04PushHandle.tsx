// C04 — Retractable push handle and lift grips
// Twin rails + crossbar · 300 × 45 × 350 deployed · 0.55 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C04-push-handle.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C04PushHandle className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C04 (dimensions, mass, material and status). */
export const C04 = BY_ID.C04;

export function C04PushHandle(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C04" {...props} />;
}
