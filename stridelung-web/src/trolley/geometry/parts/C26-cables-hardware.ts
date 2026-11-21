// C26 — Cables, vents, partitions and small mounting hardware, 0.60 kg distributed (P).
// Copper cables, insulation, aluminium/polymer partitions (U). Distributed — never a solid box. Here:
// the battery-bay partition, standoffs, brackets, legs and pillars (each rides with the module it carries),
// and the harness: battery → power → compute, compute → display, sensor interface, drive and alarm, plus
// the charge inlet. (Vents and the inlet face are drawn on C01's right wall, tagged C26.)
// Airflow, segregation and oxygen-enrichment risks need separate engineering assessment.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { CR } from "../layout.ts";

export const part: Part = {
  id: "C26",
  build() {
    // partition between the gas bay and the battery compartment
    box("stand.partition", "C26", "stand", [-80, -115, 113], [-77, 115, 200], { tone: "lo" }, { r: 0, sys: "chassis" });
    // hardware that rides with its module
    box("sensor.pillar", "C26", "sensor", [160, 45, 497.5], [170, 55, 602], { tone: "lo" }, { r: 1, sys: "electrical" });
    box("gas.c13.bracket", "C26", "gasctl", [-105, -96, 560], [-80, -84, 572], { tone: "lo" }, { r: 1, sys: "gas" });
    for (const x of [-30, 140]) box("compute.leg", "C26", "compute", [x - 3, -105, 210], [x + 3, -95, 380], { tone: "lo" }, { r: 0.5, sys: "electrical" });
    for (const x of [8, 112]) box("kit.leg", "C26", "kit", [x - 4, -104, 210], [x + 4, -96, 265], { tone: "lo" }, { r: 1, sys: "chassis" });
    // fixed brackets and standoffs
    box("stand.c18.standoff", "C26", "stand", [-14, -24, 113], [-4, -14, 132], { tone: "lo" }, { r: 1, sys: "electrical" });
    box("stand.c18.standoff", "C26", "stand", [144, 34, 113], [154, 44, 132], { tone: "lo" }, { r: 1, sys: "electrical" });
    // C10 hangs from the front-right post, clear of the C22 pocket
    box("stand.c10.bracket", "C26", "stand", [192, -115, 712], [200, -60, 720], { tone: "lo" }, { r: 1, sys: "electrical" });
    for (const x of [10, 130]) box("stand.disp.bracket", "C26", "stand", [x - 6, -147, 752], [x + 6, -135, 766], { tone: "lo" }, { r: 1, sys: "electrical" });
    box("stand.alarm.bracket", "C26", "stand", [-150, -128, 758], [-140, -118, 765], { tone: "lo" }, { r: 0.5, sys: "electrical" });
    // harness (amber overlay: power and data)
    const cable = { tone: "mid", sys: "electrical", limp: true };
    line("power.link", "C26", "power", [[150, -50, 160], [150, -30, 160]], CR, { ...cable, ends: ["shell", "none"], fit: [4.5, 0], fitLen: [5, 0], free: [true, false], flow: "power" });
    line("compute.harness", "C26", "compute", [[-20, 10, 155], [-56, 10, 155], [-56, -100, 155], [-56, -100, 360], [-40, -100, 360], [-40, -100, 375]], CR, { ...cable, ends: ["shell", "none"], fit: [4.5, 0], fitLen: [5, 0], free: [true, false], flow: "power" });
    line("stand.display.cable", "C26", "stand", [[185, -110, 410], [215, -110, 410], [215, -110, 700], [150, -110, 700], [150, -147, 700]], CR, { ...cable, ends: ["shell", "dot"], fit: [4.5, 0], fitLen: [5, 0], free: [true, false], flow: "data" });
    line("sensor.cable", "C26", "sensor", [[175, 65, 602], [175, 65, 470], [175, -100, 470], [165, -100, 470], [165, -100, 440]], CR, { ...cable, reverse: true, ends: ["none", "shell"], fit: [0, 4.5], fitLen: [0, 5], free: [false, true], flow: "data" });
    line("stand.drive.cable", "C26", "stand", [[40, 146, 520], [40, 152, 520], [40, 152, 465], [40, -90, 465], [40, -90, 445]], CR, { ...cable, reverse: true, ends: ["shell", "shell"], fit: [4.5, 4.5], fitLen: [5, 5], free: [true, true], flow: "data" });
    line("stand.inlet.cable", "C26", "stand", [[227, 64, 151], [200, 64, 151], [200, 20, 151], [160, 20, 151]], CR, { ...cable, ends: ["dot", "shell"], fit: [0, 4.5], fitLen: [0, 5], free: [false, true], flow: "power" });
    line("stand.alarm.cable", "C26", "stand", [[-110, -105, 745], [-50, -105, 745], [-50, -156, 745], [-25, -156, 745]], CR, { ...cable, reverse: true, ends: ["dot", "dot"], flow: "data" });
  },
};
