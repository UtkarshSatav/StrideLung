// C15 — Thermal control module, dry. Rounded service block 240 × 180 × 160 at (70, 45, 290) (P).
// Aluminium enclosure candidate; fluid-path components TBD (U). Body and lid with a seam, an illustrative
// reservoir window (tagged C25: it holds the 0.60 kg thermal-fluid allowance), vents, a carry handle and two
// hose ports on top. Kept apart from the battery bay by the C02 thermal shelf. Thermal capacity is unverified.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { TH } from "../layout.ts";

export const part: Part = {
  id: "C15",
  build() {
    const FACE = planeMatrix([TH.x0, TH.y0, TH.z1], [1, 0, 0], [0, 0, -1]); // (u = x + 50, v = 370 − z)
    const res = { u0: 18, u1: 46, v0: 22, v1: 132 };
    const level = 58;
    const reservoir = `<g data-c="C25" data-s="thermal" data-sub="reservoir"><path class="sl-cavity" d="${rr(res.u0, res.v0, res.u1, res.v1, 6)}"/><path class="sl-water" d="${rr(res.u0 + 2, level, res.u1 - 2, res.v1 - 2, 4)}"/>` +
      `<path class="iso-line" data-tone="mid" d="M${res.u0 + 2} ${level}H${res.u1 - 2}"/><path class="iso-line" data-tone="lo" d="${rr(res.u0, res.v0, res.u1, res.v1, 6)}"/>` +
      [0, 1, 2, 3, 4].map((i) => `<path class="iso-line" data-tone="${i % 2 ? "lo" : "mid"}" d="M${res.u1} ${res.v0 + 14 + i * 20}H${res.u1 + (i % 2 ? 4 : 7)}"/>`).join("") + `</g>`;
    const vents = Array.from({ length: 8 }, (_, i) => rr(70 + i * 14, 30, 78 + i * 14, 92, 4)).join("");
    const face = `<g transform="${FACE}">${reservoir}<path class="sl-vent" d="${vents}"/><path class="iso-line" data-tone="faint" d="${rr(70, 112, 200, 146, 6)}"/><path class="iso-line" data-tone="lo" data-free="" d="M168 32H210M168 40H198"/></g>`;
    box("thermal.body", "C15", "thermal", [TH.x0, TH.y0, TH.z0], [TH.x1, TH.y1, TH.z1 - 12], { tone: "mid" }, { r: 14, steps: 6, inner: Ln(seamOf([TH.x0, TH.y0], [TH.x1, TH.y1], 300, 14, 6), { tone: "faint" }), extra: face });
    box("thermal.lid", "C15", "thermal", [TH.x0, TH.y0, TH.z1 - 12], [TH.x1, TH.y1, TH.z1], { tone: "hi" }, { r: 14, steps: 6, bevel: 1, extra: Dots([[-38, -33], [176, -33], [-38, 123], [176, 123]].map(([x, y]) => at([x, y, TH.z1])), { size: 0.5, tone: "lo" }) + Ln(Array.from({ length: 6 }, (_, i) => k.planOutline(planOf([10 + i * 14, 40], [16 + i * 14, 120], 3), TH.z1, P, 3)).join(""), { tone: "faint" }) });
    for (const x of [26, 140]) box("thermal.handle.post", "C15", "thermal", [x - 4, TH.y0 - 14, 238], [x + 4, TH.y0, 246], { tone: "mid" }, { r: 1 });
    box("thermal.handle.bar", "C15", "thermal", [20, TH.y0 - 20, 236], [146, TH.y0 - 12, 248], { tone: "hi" }, { r: 3 });
    for (const x of [110, 135]) disc("thermal.port", "C15", "thermal", frameOf([x, -20, 370], [0, 0, 1], [1, 0, 0], [0, -1, 0]), 0, 8, 7.5, { tone: "mid" });
  },
};
