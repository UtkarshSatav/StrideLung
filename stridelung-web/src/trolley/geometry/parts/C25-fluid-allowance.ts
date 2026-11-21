// C25 — Illustrative fluid mass allowance: 0.60 kg thermal-fluid + 0.45 kg circuit, 1.05 kg (P).
// Water-equivalent planning mass only — not a fabricated part and not a clinical prime prescription.
// It has no geometry of its own. Selecting it lights where the mass is allocated: the reservoir window in
// C15 (tagged data-c="C25") and every blood line (tagged data-x="C25" in C06, C10 and C23).
import { type Part } from "../builder.ts";

export const part: Part = {
  id: "C25",
  build() {
    // metadata only — see the header comment
  },
};
