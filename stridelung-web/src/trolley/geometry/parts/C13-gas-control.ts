// C13 — Gas flow/control and external-gas interface block. Manifold enclosure 80 × 90 × 150 at
// (−145, −80, 550) (P). Supplier-qualified oxygen-compatible materials TBD; no DIY manifold.
// Front face: a contents gauge, a flow window with float, a two-position selector and the external-gas
// interface port. The alternative supply — an external hospital blended-gas hose into that port — is drawn
// here and shown only in that view: the two supplies are mutually exclusive. No connection sequence is taught.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";

export const part: Part = {
  id: "C13",
  build() {
    const FACE = planeMatrix([-185, -125, 625], [1, 0, 0], [0, 0, -1]); // (u = x + 185, v = 625 − z)
    const gauge = `<g data-c="C13" data-sub="gauge"><circle class="sl-dial" cx="26" cy="30" r="17"/><path class="iso-line" data-tone="lo" d="${circ(26, 30, 17)}"/>` +
      Array.from({ length: 11 }, (_, i) => {
        const a = (-220 + i * 26) * (Math.PI / 180);
        const r1 = i % 5 === 0 ? 11.5 : 13.5;
        return `<path class="iso-line" data-tone="${i % 5 === 0 ? "mid" : "lo"}" d="M${f2(26 + Math.cos(a) * 17)} ${f2(30 + Math.sin(a) * 17)}L${f2(26 + Math.cos(a) * r1)} ${f2(30 + Math.sin(a) * r1)}"/>`;
      }).join("") + `<path class="iso-line sl-needle" data-tone="lit" data-free="end" d="M26 30L${f2(26 + Math.cos(-0.6) * 12)} ${f2(30 + Math.sin(-0.6) * 12)}"/><circle class="sl-screw" cx="26" cy="30" r="1.8"/></g>`;
    const flowWin = `<path class="sl-cavity" d="${rr(52, 12, 66, 70, 4)}"/><path class="iso-line" data-tone="lo" d="${rr(52, 12, 66, 70, 4)}"/>` +
      Array.from({ length: 6 }, (_, i) => `<path class="iso-line" data-tone="${i % 5 === 0 ? "mid" : "lo"}" d="M52 ${16 + i * 10}H${i % 5 === 0 ? 58 : 56}"/>`).join("") + `<circle class="sl-float" cx="59" cy="46" r="3.2"/>`;
    const selector = `<circle class="sl-plate" cx="26" cy="72" r="10"/><path class="iso-line" data-tone="lo" d="${circ(26, 72, 10)}"/><path class="iso-line" data-tone="hi" d="M26 72L26 64"/>`;
    const extPort = `<circle class="sl-cavity" cx="58" cy="118" r="7"/><path class="iso-line" data-tone="lo" d="${circ(58, 118, 7)}"/><path class="iso-line" data-tone="faint" d="${circ(58, 118, 10.5)}"/>`;
    const label = `<path class="iso-line" data-tone="lo" data-free="" d="M12 100H40M12 107H32"/>`;
    box("gas.c13", "C13", "gasctl", [-185, -125, 475], [-105, -35, 625], { tone: "mid" }, { r: 5, bevel: 0.7, inner: Ln(seamOf([-185, -125], [-105, -35], 612, 5), { tone: "faint" }), extra: `<g transform="${FACE}">${gauge}${flowWin}${selector}${extPort}${label}</g>`, title: "C13 gas control and external-gas interface (supplier-selected; internals unspecified)" });
    disc("gas.c13.inlet", "C13", "gasctl", frameOf([-145, -60, 625], [0, 0, 1], [1, 0, 0], [0, -1, 0]), 0, 8, 6, { tone: "mid" });
    disc("gas.c13.outlet", "C13", "gasctl", frameOf([-105, -80, 600], [1, 0, 0], [0, -1, 0], [0, 0, 1]), 0, 8, 5.5, { tone: "mid" });
    // alternative supply: external hospital blended gas (shown only in that view)
    line("ext.hose", "C13", "gasctl", [[-127, -125, 507], [-127, -230, 507], [-127, -300, 300], [-127, -330, 16], [-240, -362, 16], [-312, -380, 16]], 5, { flow: "ext", bend: 6, ends: ["coupling", "shell"], fit: [8, 8], fitLen: [9, 10], tone: "hi", cls: "sl-gasline" });
    box("ext.adapter", "C13", "gasctl", [-344, -394, 0], [-312, -366, 30], { tone: "mid" }, { r: 3, bevel: 0.5, title: "External hospital blended-gas outlet adapter (alternative connection)" });
  },
};
