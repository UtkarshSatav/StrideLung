// Concept cartridges A and B: two matched, complete conceptual modules (identical shape and port angles) standing
// in the shared carrier. Each has a rounded bottom cap, a stainless-look heat-exchanger band, a housing with a
// transparent cutaway face, a top cap with boss and an axial blood-side inlet port, and a blood-side outlet port on
// its bottom cap. Through the cutaway face: a representative hollow-fibre bundle — not to scale, no fibre count,
// surface area or gas-exchange claim, and not a separately exchangeable part.
import { G, P, Ln, frameOf, path3, turned, padOn, towardViewer, k, type Part } from "../builder.ts";
import { ANG, CART, CZ, PORTZ } from "../layout.ts";
import { JOINS } from "../../model.ts";

/** Each cartridge's recorded host shapes, for the stubs and pads seated on it. */
export const HOSTS: Record<string, { bottom: any; hx: any; body: any; top: any }> = {};

const rad = (d: number) => (d * Math.PI) / 180;

export const part: Part = {
  id: "cartridges",
  build() {
    const T = towardViewer();
    for (const cx of CART.xs) {
      const id = cx < 0 ? "a" : "b";
      const c = `cart-${id}`;
      const cy = CART.y;
      const F = frameOf([cx, cy, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
      const pt = (r: number, a: number, z: number) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a)), z];
      const ring = (r: number, a0: number, a1: number, z: number, n = 28) => Array.from({ length: n + 1 }, (_, i) => pt(r, a0 + ((a1 - a0) * i) / n, z));

      const bottom = turned(`${c}.bottom`, c, "stand", F, [[CZ.bottom[0], 54], [CZ.bottom[0] + 2.4, 57.2, 1], [CZ.bottom[0] + 5, CART.r], [CZ.bottom[1], CART.r]], { tone: "mid" }, { steps: 64 });
      const fins = k.fadedSvg(G.ribsOf(F, CZ.hx[0] + 1, CZ.hx[1] - 1, CART.r + 2, 54, P, { fade: [0.08, 0.5], seams: true }), { tone: "lo" });
      const hx = turned(`${c}.hx`, c, "stand", F, [[CZ.hx[0], CART.r + 2], [CZ.hx[1], CART.r + 2]], { tone: "hi", className: "sl-steel" }, { steps: 64, extra: fins });

      // the cutaway face: a window in the housing, the bundle seen through it, the cut faces of the shell and a clear pane
      const W0 = T - 40, W1 = T + 40, Z0 = 262, Z1 = 428, RB = CART.r - 6;
      const outline = path3([...ring(CART.r, W0, W1, Z1), ...ring(CART.r, W1, W0, Z0)], true);
      const lowerCut = path3([...ring(CART.r, W0, W1, Z0), ...ring(RB, W1, W0, Z0)], true);
      const sideCut = (a: number) => path3([pt(CART.r, a, Z0), pt(CART.r, a, Z1), pt(RB, a, Z1), pt(RB, a, Z0)], true);
      const fibre = (a0: number, slope: number) => {
        const pts: number[][] = [];
        for (let z = Z0 - 24; z <= Z1 + 24; z += 6) pts.push(pt(RB, a0 + (z - Z0) * slope, z));
        return path3(pts);
      };
      const warp: string[] = [], weft: string[] = [];
      for (let a = W0 - 70; a <= W1 + 10; a += 4.2) warp.push(fibre(a, 0.34));
      for (let a = W0 - 10; a <= W1 + 70; a += 4.2) weft.push(fibre(a, -0.34));
      const mats = [0, 1, 2, 3, 4, 5].map((i) => path3(ring(RB, W0 - 6, W1 + 6, Z0 + 14 + i * 28, 30))).join("");
      const passage: number[][] = [];
      for (let z = Z1; z >= Z0; z -= 4) passage.push(pt(RB, T + Math.sin((z - Z0) / 26) * 9, z));
      const clipId = `pl-win-${id}`;
      const glare = path3([pt(CART.r, T + 22, Z1), pt(CART.r, T + 30, Z1), pt(CART.r, T + 12, Z0), pt(CART.r, T + 4, Z0)], true);
      const windowArt =
        `<g data-sub="fibres"><clipPath id="${clipId}"><path d="${outline}"/></clipPath><g clip-path="url(#${clipId})">` +
        `<path class="pl-bundle" d="${outline}"/><path class="sl-fibre-x" d="${weft.join("")}"/><path class="sl-fibre" d="${warp.join("")}"/>` +
        `<path class="iso-line" data-tone="faint" d="${mats}"/>` +
        `<path class="sl-flow" data-f="${id}" d="${path3(passage)}" style="--o:0"/>` +
        `<path class="iso-top" d="${lowerCut}"/><path class="iso-shade" data-shade="2" d="${sideCut(W0)}"/><path class="iso-shade" data-shade="1" d="${sideCut(W1)}"/>` +
        `${Ln(lowerCut, { tone: "lo" })}${Ln(sideCut(W0) + sideCut(W1), { tone: "lo" })}` +
        `<path class="sl-glass" d="${outline}"/><path class="sl-glare" d="${glare}"/></g>${Ln(outline, { tone: "mid" })}</g>`;
      const seams = Ln(G.arcOf(F, CZ.body[0] + 6, CART.r, P) + G.arcOf(F, CZ.body[1] - 6, CART.r, P), { tone: "faint" });
      const body = turned(`${c}.body`, c, "stand", F, [[CZ.body[0], CART.r], [CZ.body[1], CART.r]], { tone: "hi", className: "pl-clear" }, { steps: 72, extra: seams + windowArt });
      const top = turned(`${c}.top`, c, "stand", F, [[CZ.top[0], CART.r], [CZ.top[0] + 16, CART.r], [CZ.top[1], CART.r - 8]], { tone: "mid" }, { steps: 64, inner: Ln(G.arcOf(F, CZ.top[0] + 8, CART.r, P), { tone: "faint" }) });
      turned(`${c}.boss`, c, "stand", F, [[CZ.boss[0], 22], [CZ.boss[1], 22]], { tone: "mid" }, { steps: 40 });
      turned(`${c}.port.in`, c, "stand", F, [[CZ.port[0], 8.5], [CZ.port[1], 8.5]], { tone: "mid" }, { steps: 32, also: JOINS, title: `Cartridge ${id.toUpperCase()} blood-side inlet port (symbolic)` });
      HOSTS[id] = { bottom: bottom.shapes[0], hx: hx.shapes[0], body: body.shapes[0], top: top.shapes[0] };
      // blood-side outlet port on the bottom cap, seated on the curve
      const out = [Math.cos(rad(ANG.out)), Math.sin(rad(ANG.out)), 0];
      padOn(`${c}.port.out`, c, "stand", HOSTS[id].bottom, [cx, cy, PORTZ.out], out, 8.5, CART.r + 14, { tone: "mid" }, { also: JOINS, title: `Cartridge ${id.toUpperCase()} blood-side outlet port (symbolic)` });
    }
  },
};
