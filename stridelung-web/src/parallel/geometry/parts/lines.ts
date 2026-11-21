// The concept blood-side lines and the features that carry them. Blue: the shared inlet (outside and inside the
// case) and both branches; red: the merged outlet. Each branch has an upstream and a downstream segment with one
// symbolic coupler each. Line supports: right-wall bulkheads, two saddle clips on the lower shelf. The moving
// highlights drawn along them show conceptual direction only — no speed, pressure or flow is implied.
import { G, P, Ln, Dots, at, box, ball, disc, line, frameOf, type Part } from "../builder.ts";
import { BR, POST, RUN, SPLIT, MERGE, CART, PASS } from "../layout.ts";
import { JOINS } from "../../model.ts";

// collars that wrap a line (couplers, markers, clips) leave a gap in it
export const COUPLERS = { up: [-62, -48], down: [-126, -112] };
export const MARKERS = { inlet: [135, 145], up: [-115, -105], outlet: [120, 130] };
export const VALVES = { up: -88, down: -88 };
export const CLIPS = [64, 186];
const VH = 11; // half-size of an isolation silhouette's body: the line is gapped through it
const EB = BR + 2.5; // elbow ball radius
const EBIN = Math.sqrt(EB * EB - BR * BR); // a line ends where its rim meets the ball
const FINE = { gapStep: 0.02 };

export const part: Part = {
  id: "lines",
  build() {
    const blue = "pl-blue", red = "pl-red";
    // shared inlet: boundary cap → right-wall bulkhead (outside), then inlet block → split (inside)
    line("inlet.ext", "inlet-tube", "stand", [[400, POST.y, POST.inZ], [370, POST.y, POST.inZ], [344, -70, 572], [334, PASS.inlet[0], PASS.inlet[1]], [306, PASS.inlet[0], PASS.inlet[1]]], BR, { bend: 3, flow: "in", cls: blue, ends: ["none", "none"] });
    line("inlet.int", "inlet-tube", "stand", [[236, RUN.inlet.y, RUN.inlet.z], [SPLIT.x1 + 12, RUN.inlet.y, RUN.inlet.z]], BR, { ...FINE, flow: "in", cls: blue, ends: ["none", "none"], touch: ["marker.inlet*"], gapsAlong: [[0, MARKERS.inlet[0], MARKERS.inlet[1]]] });
    for (const s of [-1, 1]) {
      const id = s < 0 ? "a" : "b";
      const cx = s * Math.abs(CART.xs[0]);
      const span = (r: number[]) => (s < 0 ? r : [-r[1], -r[0]]);
      const around = (x: number) => span([x - VH, x + VH]);
      // upstream: split outlet → down → across → down into the cartridge's axial port
      line(`${id}.up`, `branch-${id}`, "stand", [[s * 18, RUN.inlet.y, SPLIT.z0 - 12], [s * 18, RUN.inlet.y, RUN.upper.z], [cx, RUN.inlet.y, RUN.upper.z], [cx, CART.y, 506]], BR, { ...FINE, bend: 3.4, flow: id, cls: blue, ends: ["none", "none"], touch: [`${id}.coupler.up`, `marker.${id}*`, `valve.${id}.up`], gapsAlong: [[0, ...span(COUPLERS.up)], [0, ...span(MARKERS.up)], [0, ...around(VALVES.up)]] });
      // downstream: cartridge outlet → forward into an elbow ball → across into the merge's side port
      const elbow = [cx, RUN.lower.y, RUN.lower.z];
      line(`${id}.down`, `branch-${id}`, "stand", [[cx, -82, RUN.lower.z], [cx, RUN.lower.y + EBIN, RUN.lower.z]], BR, { flow: id, cls: blue, ends: ["none", "none"], touch: [`${id}.elbow`] });
      ball(`${id}.elbow`, `branch-${id}`, "stand", elbow, EB, { tone: "mid" }, { also: JOINS, title: `Branch ${id.toUpperCase()} elbow (symbolic)` });
      line(`${id}.down2`, `branch-${id}`, "stand", [[cx - s * EBIN, RUN.lower.y, RUN.lower.z], [s * (MERGE.x1 + 12), RUN.lower.y, RUN.lower.z]], BR, { ...FINE, flow: id, cls: blue, ends: ["none", "none"], touch: [`${id}.elbow`, `${id}.coupler.down`, `valve.${id}.down`], gapsAlong: [[0, ...span(COUPLERS.down)], [0, ...around(VALVES.down)]] });
      // one symbolic coupler on each segment
      const coupler = (name: string, xs: number[], y: number, z: number) => {
        const a = s < 0 ? xs[0] : -xs[1];
        const F = frameOf([a, y, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
        disc(name, `branch-${id}`, "stand", F, 0, xs[1] - xs[0], BR + 2.6, { tone: "mid" }, { also: JOINS, title: `Branch ${id.toUpperCase()} coupler (symbolic)`, extra: Ln(G.arcOf(F, 2.5, BR + 2.6, P) + G.arcOf(F, xs[1] - xs[0] - 2.5, BR + 2.6, P), { tone: "faint" }) });
      };
      coupler(`${id}.coupler.up`, COUPLERS.up, RUN.inlet.y, RUN.upper.z);
      coupler(`${id}.coupler.down`, COUPLERS.down, RUN.lower.y, RUN.lower.z);
    }
    // merged outlet: merge front port → elbow → along the shelf front → right-wall bulkhead (inside), then out to its cap
    const oy = RUN.outlet.y, oz = RUN.outlet.z;
    line("outlet.int", "outlet-tube", "stand", [[0, MERGE.y0 - 12, oz], [0, oy + EBIN, oz]], BR, { flow: "out", cls: red, ends: ["none", "none"], touch: ["outlet.elbow"] });
    ball("outlet.elbow", "outlet-tube", "stand", [0, oy, oz], EB, { tone: "mid" }, { also: JOINS, title: "Outlet elbow (symbolic)" });
    line("outlet.int2", "outlet-tube", "stand", [[EBIN, oy, oz], [232, oy, oz], [232, PASS.outlet[0], oz], [275, PASS.outlet[0], oz]], BR, { ...FINE, flow: "out", cls: red, ends: ["none", "none"], touch: ["outlet.elbow", "clip.*", "marker.outlet*"], gapsAlong: [[0, MARKERS.outlet[0], MARKERS.outlet[1]], ...CLIPS.map((x) => [0, x - 4, x + 4])] });
    line("outlet.ext", "outlet-tube", "stand", [[306, PASS.outlet[0], PASS.outlet[1]], [352, PASS.outlet[0], PASS.outlet[1]], [352, POST.y, POST.outZ], [400, POST.y, POST.outZ]], BR, { bend: 3, flow: "out", cls: red, ends: ["none", "none"] });

    // line supports: two saddle clips on the lower shelf under the outlet run
    for (const x of CLIPS) {
      box("clip.foot", "supports", "stand", [x - 10, oy - 7, 158], [x + 10, oy + 7, 161], { tone: "lo" }, { r: 1.5, extra: Dots([at([x - 6, oy, 161]), at([x + 6, oy, 161])], { size: 0.4 }) });
      const band = disc("clip.band", "supports", "stand", frameOf([x - 4, oy, oz], [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 8, BR + 2.4, { tone: "mid" });
      box("clip.post", "supports", "stand", [x - 3, oy - 3, 161], [x + 3, oy + 3, oz - BR - 2.4], { tone: "mid" }, { r: 0.5, owner: band.name });
    }
    // right-wall bulkheads: an outer flange plate and stub at both pass-throughs, and the outlet's inner stub
    for (const [name, [y, z]] of [["inlet", PASS.inlet], ["outlet", PASS.outlet]] as const) {
      box(`bulkhead.${name}.plate`, "supports", "stand", [290, y - 17, z - 17], [294, y + 17, z + 17], { tone: "mid" }, { r: 3, extra: Dots([[-11, -11], [11, -11], [-11, 11], [11, 11]].map(([dy, dz]) => at([294, y + dy, z + dz])), { size: 0.5 }) });
      disc(`bulkhead.${name}.stub`, "supports", "stand", frameOf([294, y, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 12, BR + 2, { tone: "mid" }, { title: `Right-wall pass-through (${name})` });
    }
    disc("bulkhead.outlet.inner", "supports", "stand", frameOf([287, PASS.outlet[0], PASS.outlet[1]], [-1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 12, BR + 2, { tone: "mid" });
  },
};
