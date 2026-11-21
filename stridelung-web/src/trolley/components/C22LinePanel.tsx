// C22 — Patient-line support/interface panel
// Recessed side panel · 20 × 120 × 70 · 0.35 kg allocated (P) · material status U
// Geometry: src/trolley/geometry/parts/C22-line-panel.ts · register row: src/trolley/register.ts
//
// Renders this component on its own, in the trolley camera and theme, cropped to its bounds.
// Server component; drop it anywhere: <C22LinePanel className="…" />
import { TrolleyPart } from "../TrolleyPart";
import { BY_ID } from "../register";

/** Register row for C22 (dimensions, mass, material and status). */
export const C22 = BY_ID.C22;

export function C22LinePanel(props: { className?: string; pad?: number; title?: string }) {
  return <TrolleyPart id="C22" {...props} />;
}
