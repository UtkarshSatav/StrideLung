// Neutral sensor-location markers — blank collars with a blank flag, where sensing might be needed; no sensor type,
// position or reading is decided — and the muted isolation silhouettes: isolation/switching approach not designed.
// The silhouettes are symbols. They cannot be picked, have no positions and no states, and never move.
import { P, S, Ln, box, disc, frameOf, put, k, planOf, boxShape, type Part } from "../builder.ts";
import { BR, RUN } from "../layout.ts";
import { MARKERS, VALVES } from "./lines.ts";

export const part: Part = {
  id: "markers",
  build() {
    const marker = (name: string, _route: string, x0: number, x1: number, y: number, z: number) => {
      disc(name, "sensor-markers", "stand", frameOf([x0, y, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, x1 - x0, BR + 3.6, { tone: "hi" }, { title: "Sensor-location marker — no sensor or reading is decided" });
      const xm = (x0 + x1) / 2;
      box(`${name}.flag`, "sensor-markers", "stand", [xm - 4.5, y - 1, z + BR + 3.6], [xm + 4.5, y + 1, z + BR + 12.9], { tone: "mid" }, { r: 0.8 });
    };
    marker("marker.inlet", "inlet.int", MARKERS.inlet[0], MARKERS.inlet[1], RUN.inlet.y, RUN.inlet.z);
    marker("marker.a", "a.up", MARKERS.up[0], MARKERS.up[1], RUN.inlet.y, RUN.upper.z);
    marker("marker.b", "b.up", -MARKERS.up[1], -MARKERS.up[0], RUN.inlet.y, RUN.upper.z);
    marker("marker.outlet", "outlet.int", MARKERS.outlet[0], MARKERS.outlet[1], RUN.outlet.y, RUN.outlet.z);

    // isolation silhouettes: a body round the line, a stem and a handwheel — muted, translucent, stateless
    const silhouette = (name: string, _route: string, x: number, y: number, z: number) => {
      const h = 11;
      const body = k.slabOf(planOf([x - h, y - h], [x + h, y + h], 3), z - h, 2 * h, P, 3, 0.6);
      const stem = k.cylinder(x, -y, 2.6, z + h, 9, P, 16);
      const wheel = k.cylinder(x, -y, 9, z + h + 9, 2.6, P, 32);
      const shapes = [boxShape([x - h, y - h, z - h], [x + h, y + h, z + h], name)];
      put({ name, c: "valves", piece: "stand", ref: [x, y, z], bias: 1.2, svg: `<g class="pl-sil">${S(body, { tone: "faint" })}${S(stem, { tone: "faint" })}${S(wheel, { tone: "faint" })}${Ln(k.ring(x, -y, 5, z + h + 11.6, P, 20), { tone: "faint" })}</g>`, shapes, attrs: ' data-nonselect=""', title: "Isolation/switching approach not designed" });
    };
    for (const s of [-1, 1]) {
      const id = s < 0 ? "a" : "b";
      silhouette(`valve.${id}.up`, `${id}.up`, s * -VALVES.up, RUN.inlet.y, RUN.upper.z);
      silhouette(`valve.${id}.down`, `${id}.down2`, s * -VALVES.down, RUN.lower.y, RUN.lower.z);
    }
  },
};
