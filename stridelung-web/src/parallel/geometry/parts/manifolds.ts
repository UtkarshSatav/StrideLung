// Schematic manifolds — geometry and design unresolved. The inlet block (where the shared inlet enters the case),
// the split body (one port in, two out; bolted to the carrier's arm) and the merge body (two in, one out; on the
// carrier). Each is a neutral grey block with a hatched front face: an uncertainty pattern, not a construction.
// They are not functional connectors, and their ports are symbolic.
import { box, disc, frameOf, planeMatrix, rr, hatch, type Part } from "../builder.ts";
import { MERGE, SPLIT, RUN, BR } from "../layout.ts";
import { JOINS } from "../../model.ts";

const PORT = BR + 2;

function block(name: string, c: string, b: { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number }, r = 6) {
  const FACE = planeMatrix([b.x0, b.y0, b.z1], [1, 0, 0], [0, 0, -1]);
  const w = b.x1 - b.x0, h = b.z1 - b.z0;
  const i = 4;
  const face = `<g transform="${FACE}"><path class="pl-provisional" d="${rr(i, i, w - i, h - i, 2)}"/><path class="iso-line pl-hatch" data-tone="lo" d="${hatch(i, i, w - i, h - i, 5)}"/><path class="iso-line" data-tone="mid" d="${rr(i, i, w - i, h - i, 2)}"/></g>`;
  box(name, c, "stand", [b.x0, b.y0, b.z0], [b.x1, b.y1, b.z1], { tone: "mid" }, { r, steps: 5, bevel: 0.8, extra: face });
}
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const port = (name: string, c: string, o: number[], axis: number[], u: number[], title: string) =>
  disc(name, c, "stand", frameOf(o, axis, u, cross(axis, u)), 0, 12, PORT, { tone: "mid" }, { also: JOINS, title });

export const part: Part = {
  id: "manifolds",
  build() {
    // inlet block on the right wall's inner face
    const IB = { x0: 248, x1: 287, y0: -34, y1: 14, z0: 572, z1: 628 };
    block("inlet.block", "inlet-block", IB, 4);
    port("inlet.block.port", "inlet-block", [IB.x0, RUN.inlet.y, RUN.inlet.z], [-1, 0, 0], [0, 1, 0], "Schematic inlet block port — geometry and design unresolved");
    // split: right-face inlet, two bottom outlets
    block("split.body", "split", SPLIT);
    port("split.port.in", "split", [SPLIT.x1, RUN.inlet.y, RUN.inlet.z], [1, 0, 0], [0, 1, 0], "Split inlet port (symbolic)");
    for (const s of [-1, 1]) port(`split.port.${s < 0 ? "a" : "b"}`, "split", [s * 18, RUN.inlet.y, SPLIT.z0], [0, 0, -1], [1, 0, 0], `Split outlet to branch ${s < 0 ? "A" : "B"} (symbolic)`);
    // merge: two side inlets, one front outlet
    block("merge.body", "merge", MERGE);
    for (const s of [-1, 1]) port(`merge.port.${s < 0 ? "a" : "b"}`, "merge", [s * MERGE.x1, RUN.lower.y, RUN.lower.z], [s, 0, 0], [0, 1, 0], `Merge inlet from branch ${s < 0 ? "A" : "B"} (symbolic)`);
    port("merge.port.out", "merge", [0, MERGE.y0, RUN.outlet.z], [0, -1, 0], [1, 0, 0], "Merge outlet port (symbolic)");
  },
};
