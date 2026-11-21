// Server component: assembles the depth-sorted SVG of the parallel-oxygenator concept figure and its baseline
// thumbnail from the generated data, and hands both to the interactive stage. Only finished markup reaches the
// browser — no geometry code.
import figure from "./generated/figure.json";
import baseline from "./generated/baseline.json";
import { ParallelStage } from "./ParallelStage";
import type { EngineScene } from "./engine";

type Item = { i: number; n: string; c: string; x?: string; k: number; a?: string; t?: string; svg: string };

const LABEL =
  "Concept only — not a validated ECMO circuit, not for patient use. A StrideLung upright trolley on four casters with a part-raised handle, a fascia display and a full-width front door with an inspection window. " +
  "Inside the open bay, one shared carrier holds two matched concept cartridges, A and B, each with a transparent cutaway face showing a representative hollow-fibre bundle. A blue shared inlet enters through the right wall to a schematic split; " +
  "two blue branches pass through the cartridges; a schematic merge feeds a red shared outlet back out to a capped connector at the edge of the plinth. Amber gas stubs and teal heat-exchanger stubs are capped and tagged as not designed. " +
  "Muted isolation silhouettes have no states. Keys 1 to 7 choose a scene, arrow keys step through the parts, Space pauses motion, N and P step a review, Escape clears.";

export function itemMarkup(item: Item) {
  return `<g class="it" data-c="${item.c}"${item.x ? ` data-x="${item.x}"` : ""} data-n="${item.n}"${item.a ?? ""}>${item.t ? `<title>${item.t}</title>` : ""}${item.svg}</g>`;
}

export function ParallelFigure() {
  const items = (figure.items as Item[]).slice().sort((a, b) => a.i - b.i);
  const markup = `<defs>${figure.defs}</defs>${figure.back}<g class="pl-items">${items.map(itemMarkup).join("")}</g><g class="sl-door pl-door" data-c="door"></g>`;
  const scene: EngineScene = { P: figure.P as EngineScene["P"], V: figure.V as EngineScene["V"], hinge: figure.hinge as [number, number], openDeg: figure.openDeg, door: figure.door as EngineScene["door"] };
  return (
    <ParallelStage
      scene={scene}
      label={LABEL}
      inset={{ W: baseline.W, H: baseline.H, svg: baseline.svg }}
    >
      <svg className="iso-svg pl-main" viewBox={`0 0 ${figure.W} ${figure.H}`} role="img" aria-label={LABEL} dangerouslySetInnerHTML={{ __html: markup }} />
    </ParallelStage>
  );
}
