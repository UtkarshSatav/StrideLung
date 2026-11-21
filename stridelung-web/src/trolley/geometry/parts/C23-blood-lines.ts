// C23 — External blood-line pair and visual patient interface. Two flexible curves, 13 mm visual OD,
// 1.5 m allocation per line (P); medical tubing and cannula model TBD (U). The lines leave the C22 pocket
// with visible slack and run to a generic mannequin-interface fixture: a weighted base, pole, clamp,
// connector manifold and a generic external cannula interface. Clinical cannula selection and placement are
// not modelled; 13 mm is not a lumen or connector size.
import { A, G, K, P, S, Ln, Dots, at, box, cyl, disc, turned, ringXY, ball, line, frameOf, planeMatrix, planOf, rr, circ, seamOf, arc, path3, f2, k, put, record, boxShape, scene, type Part } from "../builder.ts";
import { BR, STAND, PORTS } from "../layout.ts";

export const part: Part = {
  id: "C23",
  build() {
    const drain = line("stand.c23.drain", "C23", "stand", [[222, 20, 682], [262, 20, 682], [292, 10, 600], [330, -40, 330], [400, -120, 230], [470, -190, 300], [510, PORTS.drain[1], 520], [520, PORTS.drain[1], PORTS.drain[2]], PORTS.drain], BR, { flow: "drain", reverse: true, bend: 9, ends: ["none", "none"], also: "C25" });
    const ret = line("stand.c23.return", "C23", "stand", [[222, -35, 710], [266, -35, 710], [300, -48, 620], [338, -96, 360], [404, -170, 272], [468, -230, 340], [506, PORTS.ret[1], 540], [520, PORTS.ret[1], PORTS.ret[2]], PORTS.ret], BR, { flow: "return", bend: 9, ends: ["none", "none"], also: "C25" });
    scene.c23 = { drain: Math.round(drain.total), ret: Math.round(ret.total) };
    const sx = STAND.x, sy = STAND.y;
    for (let i = 0; i < 3; i++) {
      const a = ((i * 120 + 30) * Math.PI) / 180;
      cyl("stand.fixture.foot", "C23", "stand", [sx + Math.cos(a) * 88, sy + Math.sin(a) * 88], 12, 0, 5, { tone: "lo" });
    }
    cyl("stand.fixture.base", "C23", "stand", [sx, sy], 104, 5, 21, { tone: "mid" }, { steps: 72, bevel: 1, inner: Ln(k.sideArc(sx, -sy, 104, 13, P, 64), { tone: "faint" }), extra: Ln(k.ring(sx, -sy, 86, 21, P, 64), { tone: "faint" }) + Dots([0, 1, 2, 3, 4, 5].map((i) => at([sx + Math.cos(i * 1.047) * 72, sy + Math.sin(i * 1.047) * 72, 21])), { size: 0.5 }) });
    cyl("stand.fixture.boss", "C23", "stand", [sx, sy], 22, 21, 34, { tone: "lo" });
    cyl("stand.fixture.pole", "C23", "stand", [sx, sy], 11, 34, 548, { tone: "hi" }, { inner: Ln(k.sideArc(sx, -sy, 11, 300, P, 20), { tone: "faint" }) });
    cyl("stand.fixture.clamp", "C23", "stand", [sx, sy], 19, 548, 566, { tone: "mid" });
    box("stand.fixture.knob.neck", "C23", "stand", [sx + 18, sy - 4, 553], [sx + 30, sy + 4, 561], { tone: "lo" }, { r: 1 });
    cyl("stand.fixture.knob", "C23", "stand", [sx + 38, sy], 9, 549, 565, { tone: "hi" }, { extra: Ln(k.knurl(sx + 38, -sy, 9, 549.6, 564.4, 20, P), { tone: "lo" }) });
    box("stand.fixture.manifold", "C23", "stand", [sx - 46, sy - 46, 566], [sx + 30, sy + 46, 640], { tone: "mid" }, { r: 8, steps: 5, bevel: 0.8, inner: Ln(seamOf([sx - 46, sy - 46], [sx + 30, sy + 46], 628, 8, 5), { tone: "faint" }), title: "Mannequin-interface connector manifold (training fixture)" });
    disc("stand.fixture.port", "C23", "stand", frameOf(PORTS.drain, [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 6, 9.5, { tone: "mid" });
    disc("stand.fixture.port", "C23", "stand", frameOf(PORTS.ret, [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 6, 9.5, { tone: "mid" });
    const CF = frameOf([sx + 30, sy, 603], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    turned("stand.fixture.cannula", "C23", "stand", CF, [[0, 14], [10, 14], [10, 10], [34, 8, 1], [60, 6, 1], [86, 4.5, 1], [100, 3.6]], { tone: "hi" }, { title: "Generic external cannula interface — clinical cannula selection and placement not modelled", inner: Ln(G.arcOf(CF, 22, 9, P, { slope: -0.083 }), { tone: "faint" }) });
  },
};
