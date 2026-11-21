// C06 — Disposable blood pump head. Circular chamber 70 × 50 × 70 at (50, 55, 540), axis along y (P).
// Blood-contact materials TBD; the clear look is visual only. A turned volute with an axial inlet facing
// front, a tangential outlet boss, and a schematic rotor that turns only while the blood overlay runs.
// The disposable internal lines go with it: the drainage line from C22 (behind the cartridge, into an
// elbow at the inlet) and the pre-oxygenator line from the outlet to C05's rear inlet.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, pocketSvg, scene, PIECES, type Part } from "../builder.ts";
import { PUMP_AXIS, BR } from "../layout.ts";

export const part: Part = {
  id: "C06",
  build() {
    const PF = frameOf([PUMP_AXIS[0], 30, PUMP_AXIS[1]], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
    const plane = planeMatrix([PUMP_AXIS[0], 38, PUMP_AXIS[1]], [1, 0, 0], [0, 0, -1]);
    // the rotor is drawn in the plane of the volute's front face; the engine only turns its inner group
    const rotorFace = `<g data-part="rotor" transform="${plane}" data-plane="${plane}"><g class="sl-rotor">${Array.from({ length: 6 }, (_, i) => {
      const a0 = (i * 60 * Math.PI) / 180;
      const pts = Array.from({ length: 7 }, (_, j) => {
        const r = 5 + j * 2.6;
        const a = a0 + j * 0.13;
        return `${j ? "L" : "M"}${f2(Math.cos(a) * r)} ${f2(Math.sin(a) * r)}`;
      }).join("");
      return `<path class="iso-line" data-tone="lit" d="${pts}"/>`;
    }).join("")}<circle class="sl-hub" r="4.6"/></g></g>`;
    turned("pump.volute", "C06", "pump", PF, [[0, 9], [8, 9], [8, 22], [14, 33, 1], [16, 35, 1], [42, 35], [42, 33], [50, 33]], { tone: "hi", className: "sl-clear" }, { inner: Ln(G.arcOf(PF, 42, 35, P), { tone: "faint" }), extra: rotorFace, owner: "pump.head" });
    disc("pump.outlet", "C06", "pump", frameOf([84, 55, 540], [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 7, 8, { tone: "mid" }, { owner: "pump.head" });
    ball("pump.elbow", "C06", "pump", [50, 20, 540], 9.2, { tone: "mid" });
    disc("pump.neck", "C06", "pump", frameOf([50, 26.5, 540], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 3.5, 6.5, { tone: "mid" }, { owner: "pump.head" });
    // drainage: C22 inlet → riser → behind the cartridge → elbow → axial pump inlet
    line("pump.drain", "C06", "pump", [[203, 20, 682], [180, 20, 682], [180, 20, 540], [56.5, 20, 540]], BR, { flow: "drain", ends: ["coupling", "none"], fit: [8.6, 0], fitLen: [9, 0], free: [true, false], sys: "blood", gapsAlong: [[2, 591.5, 627.5]], also: "C25" });
    // pump → oxygenator inlet (pre-oxygenator)
    line("pump.preox", "C06", "pump", [[91, 55, 540], [110, 55, 540], [110, 55, 620], [110, 22, 620]], BR, { flow: "drain", ends: ["none", "coupling"], fit: [0, 8.6], fitLen: [0, 8], free: [false, true], sys: "blood", gapsAlong: [[2, 576.5, 602.5]], also: "C25" });
  },
};
