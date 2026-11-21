// Server component: assembles the depth-sorted SVG from the generated per-component data and hands it to the
// interactive stage. Nothing here ships geometry code to the browser — only finished markup.
import { partItems, scene } from "./generated";
import { TrolleyStage } from "./TrolleyStage";
import { HeroTrolleyStage } from "./HeroTrolleyStage";
import type { EngineScene } from "./engine";
import type { Item } from "./types";

const LABEL =
  "StrideLung 01 concept trolley on a display plinth, seen from the front right: a rounded upright case on four braked casters with a retractable push handle, a hinged front inspection door with a window and a lower service hatch. Inside: a membrane oxygenator with a heat-exchanger base, a centrifugal pump head and drive, a sensor interface, a medical oxygen cylinder in its cradles beside a gas-control block, a thermal module, battery, power and compute boxes, a display and an alarm. Two external blood lines leave a recessed panel on the right side with slack and run to a generic mannequin-interface fixture. Hover or tap a part to read its register entry; arrow keys step through the 27 components, Space opens the case, E explodes it, F cycles the flow overlays, P parks, T raises the handle, Escape resets.";

export function itemMarkup(item: Item) {
  const [mx, my, mz] = item.m;
  return `<g class="it" data-c="${item.c}" data-s="${item.s}"${item.x ? ` data-x="${item.x}"` : ""} data-piece="${item.p}"${item.r ? ` data-ride="${item.r}"` : ""} data-k="${item.k}" data-m="${mx},${my},${mz}" data-n="${item.n}"${item.a ?? ""}>${item.t ? `<title>${item.t}</title>` : ""}${item.svg}</g>`;
}

export function TrolleyFigure({ hero = false }: { hero?: boolean }) {
  const items = Object.values(partItems).flat().sort((a, b) => a.i - b.i);
  const clipId = hero ? "hero-handle-clip" : "sl-handle-clip";
  const content = items.map(itemMarkup).join("").replaceAll("url(#sl-handle-clip)", `url(#${clipId})`);
  const markup =
    `<defs><clipPath id="${clipId}"><path data-handle-clip d="${scene.handleClip}"/></clipPath></defs>` +
    scene.back +
    `<g class="sl-gashatch" data-c="C01" data-s="chassis">${scene.gasHatch}</g>` +
    `<g class="sl-doors-back"><g class="sl-door" data-door="hatch" data-c="C01" data-s="chassis"></g><g class="sl-door" data-door="main" data-c="C01" data-s="chassis"></g></g>` +
    `<g class="sl-items">${content}</g>` +
    `<g class="sl-doors-front"></g>`;
  const lite: EngineScene = {
    P: scene.P, V: scene.V, EX: scene.EX, EY: scene.EY, EZ: scene.EZ, hinge: scene.hinge, doors: scene.doors,
    explode: scene.explode, spring: scene.spring, mass: { total: scene.mass.total }, subsystems: scene.subsystems,
  };
  if (hero) {
    return (
      <HeroTrolleyStage scene={lite}>
        <svg className="iso-svg" viewBox={`0 0 ${scene.W} ${scene.H}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />
      </HeroTrolleyStage>
    );
  }
  return (
    <TrolleyStage scene={lite} label={LABEL}>
      <svg className="iso-svg" viewBox={`0 0 ${scene.W} ${scene.H}`} role="img" aria-label={LABEL} dangerouslySetInnerHTML={{ __html: markup }} />
    </TrolleyStage>
  );
}
