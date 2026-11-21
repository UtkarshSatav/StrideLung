// C05 — Membrane oxygenator with integrated heat exchanger. Rounded cartridge 180 × 100 × 160 at
// (65, −40, 590) (P). PMP fibres and a stainless heat exchanger are reference examples [S3]; housing grade TBD.
// Stacked as base cap, stainless-look heat-exchanger band (a separate sub-region), hollow-fibre body with a
// cutaway window showing representative fibre bundles, and a top cap. Ports are schematic stubs with
// tooltips. A reserved envelope awaiting supplier fit — not a validated membrane design.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";
import { OX } from "../layout.ts";

export const part: Part = {
  id: "C05",
  build() {
    const band5 = (name: string, z0: number, z1: number, style: any, opts: any = {}) => box(name, "C05", "oxy", [OX.x0, OX.y0, z0], [OX.x1, OX.y1, z1], style, { r: 22, steps: 8, ...opts });
    box("oxy.standoff", "C05", "oxy", [-15, -58, 497.5], [145, -46, 510], { tone: "lo" }, { r: 1 });
    box("oxy.standoff", "C05", "oxy", [-15, -4, 497.5], [145, 8, 510], { tone: "lo" }, { r: 1 });
    band5("oxy.base", 510, 520, { tone: "mid" });
    const fins: string[] = [];
    for (let x = -3; x <= 133; x += 8) fins.push(path3([[x, OX.y0, 520.6], [x, OX.y0, 555.4]]));
    for (let y = -68; y <= -12; y += 8) fins.push(path3([[OX.x1, y, 520.6], [OX.x1, y, 555.4]]));
    band5("oxy.hx", 520, 556, { tone: "hi", className: "sl-steel" }, { extra: `<g data-c="C05" data-sub="hx">${Ln(fins.join(""), { tone: "lo" })}</g>` });
    // hollow-fibre body: a cutaway on the front face with a density impression of fibre layers
    const FACE = planeMatrix([OX.x0, OX.y0, 656], [1, 0, 0], [0, 0, -1]); // (u = x + 25, v = 656 − z)
    const cut = { u0: 22, u1: 158, v0: 12, v1: 88 };
    const fibres: string[] = [];
    for (let i = 0; i < 15; i++) {
      const v = cut.v0 + 4 + i * 5;
      const pts: string[] = [];
      for (let u = cut.u0 - 4; u <= cut.u1 + 4; u += 4) pts.push(`${u === cut.u0 - 4 ? "M" : "L"}${f2(u)} ${f2(v + Math.sin(u * 0.11 + i * 0.9) * 1.6)}`);
      fibres.push(pts.join(""));
    }
    const fibreX: string[] = [];
    for (let u = cut.u0 + 6; u < cut.u1; u += 11) fibreX.push(`M${u} ${cut.v0}V${cut.v1}`);
    const cutaway = `<g data-c="C05" data-sub="fibres" transform="${FACE}"><clipPath id="sl-fibre-clip"><path d="${rr(cut.u0, cut.v0, cut.u1, cut.v1, 8)}"/></clipPath>` +
      `<path class="sl-cavity" d="${rr(cut.u0, cut.v0, cut.u1, cut.v1, 8)}"/><g clip-path="url(#sl-fibre-clip)"><path class="sl-fibre" d="${fibres.join("")}"/><path class="sl-fibre-x" d="${fibreX.join("")}"/></g>` +
      `<path class="iso-line" data-tone="lo" d="${rr(cut.u0, cut.v0, cut.u1, cut.v1, 8)}"/><path class="iso-line" data-tone="faint" d="${rr(cut.u0 - 4, cut.v0 - 4, cut.u1 + 4, cut.v1 + 4, 11)}"/></g>`;
    band5("oxy.body", 556, 656, { tone: "hi", className: "sl-clear" }, { extra: cutaway });
    band5("oxy.cap", 656, 670, { tone: "mid" }, { bevel: 1.2, extra: Ln(k.planOutline(planOf([OX.x0 + 10, OX.y0 + 10], [OX.x1 - 10, OX.y1 - 10], 14), 670, P, 8), { tone: "faint" }) });
    disc("oxy.port.bloodout", "C05", "oxy", frameOf([20, -35, 670], [0, 0, 1], [1, 0, 0], [0, -1, 0]), 0, 8, 10, { tone: "mid" }, { title: "C05 blood outlet → return line (schematic stub)" });
    disc("oxy.port.bloodin", "C05", "oxy", frameOf([110, 10, 620], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 12, 10, { tone: "mid" }, { title: "C05 blood inlet ← pump outlet (schematic stub)" });
    disc("oxy.port.gasin", "C05", "oxy", frameOf([-25, -40, 645], [-1, 0, 0], [0, -1, 0], [0, 0, 1]), 0, 12, 6, { tone: "mid" }, { title: "C05 sweep-gas inlet ← C14 (schematic stub)" });
    disc("oxy.port.gasout", "C05", "oxy", frameOf([-25, -60, 566], [-1, 0, 0], [0, -1, 0], [0, 0, 1]), 0, 12, 6, { tone: "mid" }, { title: "C05 gas exhaust → gas-bay outlet guard (schematic stub)" });
    for (const x of [110, 135]) disc("oxy.port.hx", "C05", "oxy", frameOf([x, -75, 510], [0, 0, -1], [1, 0, 0], [0, -1, 0]), 0, 10, 7, { tone: "hi", className: "sl-steel" }, { title: x === 110 ? "C05 heat-exchanger water in ← C16 supply" : "C05 heat-exchanger water out → C16 return" });
  },
};
