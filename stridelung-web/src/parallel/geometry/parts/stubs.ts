// Unresolved supporting paths. Each cartridge carries two amber gas-side stubs (dashed: segmented bodies on necks)
// and two teal heat-exchanger stubs (plain), every one capped and joined to nothing. One tag hangs from a gas stub
// ("NOT DESIGNED") and one from a thermal stub ("UNRESOLVED"). Gas-side distribution and the thermal arrangement
// for two cartridges are not designed in this concept.
import { box, turned, padOn, planeMatrix, rr, engrave, type Part } from "../builder.ts";
import { ANG, CART, PORTZ } from "../layout.ts";
import { HOSTS } from "./cartridges.ts";

const rad = (d: number) => (d * Math.PI) / 180;
// a dashed amber stub: three segments on thin necks, then a cap
const DASHED = [[0, 3.8], [4.5, 3.8], [4.5, 1.5], [8.5, 1.5], [8.5, 3.8], [13, 3.8], [13, 1.5], [17, 1.5], [17, 3.8], [21.5, 3.8], [21.5, 5.2], [26.5, 5.2]];
// a plain teal stub with a cap
const PLAIN = [[0, 4.4], [15, 4.4], [15, 6.4], [21, 6.4]];

function tag(name: string, c: string, x: number, y: number, ztop: number, text: string) {
  const w = 30, h = 14;
  const FACE = planeMatrix([x - w / 2, y - 0.8, ztop], [1, 0, 0], [0, 0, -1]);
  const art = `<g transform="${FACE}"><path class="iso-line" data-tone="faint" d="${rr(1.4, 1.4, w - 1.4, h - 1.4, 1.2)}"/><circle class="sl-screw" cx="${w / 2}" cy="3.4" r="1.1"/>${engrave(w / 2, 10.2, text, 3.7, "middle", "hi")}</g>`;
  box(name, c, "stand", [x - w / 2, y - 0.8, ztop - h], [x + w / 2, y + 0.8, ztop], { tone: "mid", className: c === "gas-stubs" ? "pl-amber" : "pl-teal" }, { r: 1.2, extra: art, title: text === "NOT DESIGNED" ? "Gas-side distribution — not designed in this concept" : "Heat-exchanger interface — thermal arrangement unresolved" });
}

export const part: Part = {
  id: "stubs",
  build() {
    for (const cx of CART.xs) {
      const id = cx < 0 ? "a" : "b";
      const host = HOSTS[id];
      const cy = CART.y;
      const radial = (a: number) => [Math.cos(rad(a)), Math.sin(rad(a)), 0];
      // gas side: one on the top cap, one on the bottom cap
      for (const [where, z, h] of [["top", PORTZ.gasIn, host.top], ["bottom", PORTZ.gasOut, host.bottom]] as const) {
        const pad = padOn(`gas.${id}.${where}.pad`, "gas-stubs", "stand", h, [cx, cy, z], radial(ANG.gas), 5.2, CART.r + 4, { tone: "mid", className: "pl-amber" });
        turned(`gas.${id}.${where}.stub`, "gas-stubs", "stand", pad.F, DASHED.map(([s, r]) => [CART.r + 4 + s, r]), { tone: "hi", className: "pl-amber" }, { steps: 20, title: "Gas-side stub — distribution not designed in this concept" });
        if (where === "top") {
          const e = [cx + (CART.r + 4 + 24) * Math.cos(rad(ANG.gas)), cy + (CART.r + 4 + 24) * Math.sin(rad(ANG.gas))];
          tag(`gas.${id}.tag`, "gas-stubs", e[0], e[1], z - 5.2, "NOT DESIGNED");
        }
      }
      // heat-exchanger band: two capped teal stubs
      ANG.hx.forEach((a, i) => {
        const pad = padOn(`hx.${id}.${i}.pad`, "thermal-stubs", "stand", host.hx, [cx, cy, PORTZ.hx], radial(a), 5.4, CART.r + 6, { tone: "mid", className: "pl-teal" });
        turned(`hx.${id}.${i}.stub`, "thermal-stubs", "stand", pad.F, PLAIN.map(([s, r]) => [CART.r + 6 + s, r]), { tone: "hi", className: "pl-teal" }, { steps: 20, title: "Heat-exchanger stub — thermal arrangement unresolved" });
        if (i === 0) {
          const e = [cx + (CART.r + 6 + 18) * Math.cos(rad(a)), cy + (CART.r + 6 + 18) * Math.sin(rad(a))];
          tag(`hx.${id}.tag`, "thermal-stubs", e[0], e[1], PORTZ.hx - 6.4, "UNRESOLVED");
        }
      });
    }
  },
};
