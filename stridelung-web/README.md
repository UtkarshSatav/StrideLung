# StrideLung 01 — interactive concept site (Next.js)

An interactive, isometric model of the **StrideLung 01** compact ECMO-support trolley concept, embedded in a mock
product site. Every one of the 27 components in the register has its own geometry file and its own React component.

> Concept packaging — not a clinical device. Every dimension, coordinate and mass is **P** (proposed); materials
> marked **U** are unselected; **R** marks a fact about an identified reference product. Source of truth:
> `STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md` (Concept v0.1).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

The figure data in `src/trolley/generated/` is committed, so the site builds without regenerating it.

## What's where

```
src/
  app/                           Next.js App Router
    page.tsx                     home: hero, explorer, subsystems, plan, mass budget, resources, evidence, register, limits, sources
    components/page.tsx          all 27 components, each drawn on its own (filterable)
    components/[slug]/page.tsx   one statically generated page per component
  trolley/
    register.ts                  the component register — single source of truth for every row's data
    geometry/                    generator-only code (never shipped to the browser)
      builder.ts                 camera, spec→kit frame flip, solids, pipes/cables, face drawing helpers
      layout.ts                  shared positions (case, pockets, ports, axes)
      parts/C01-case.ts … C27-stabilisers.ts   ONE FILE PER COMPONENT: its geometry
      scene/plinth.ts, scene/doors.ts          display plinth, hinged door artwork
    generated/                   output of the generator: scene.json + parts/Cxx.json (+ typed index)
    components/C01OuterCase.tsx … C27Stabilisers.tsx   ONE REACT COMPONENT PER PART (renders that part alone)
    engine.ts                    framework-free motion engine (doors, explode, flows, x-ray, display, tour)
    TrolleyProvider.tsx          shared state + actions so any section can drive the figure
    TrolleyFigure.tsx            server component: depth-sorted SVG markup
    TrolleyStage.tsx             client: the card, the focusable stage, mounts the engine
    TrolleyPart.tsx              server: one component drawn alone, cropped to its bounds
    Explorer.tsx, Controls.tsx, InfoPanel.tsx, PartList.tsx, Chip.tsx
    trolley.css                  figure styles and tokens (flow colours, subsystem hues)
  site/                          site sections (Header, Hero, Subsystems, MassBudget, RegisterTable, …)
  lib/iso/                       the isometric drawing kit (iso-kit, lathe, tube, audit, iso.css)
scripts/generate-figure.ts       runs every part file, settles painter's order, writes src/trolley/generated
```

## Using the components

```tsx
import { C05Oxygenator, C11OxygenCylinder } from "@/trolley/components";
import { Explorer } from "@/trolley/Explorer";
import { TrolleyProvider, useTrolley } from "@/trolley/TrolleyProvider";

<C05Oxygenator className="my-thumb" />          // server component: the part alone, in the trolley's camera

<TrolleyProvider>
  <Explorer />                                   // the full interactive trolley
  <MyButton />                                   // useTrolley().actions.focus(a => { a.setView("open"); a.pick("C05") })
</TrolleyProvider>
```

Actions: `setView("assembled" | "open" | "exploded" | "parked" | "transport")`, `toggleFlow` / `setFlows`
(`blood`, `gas`, `water`, `electrical`), `setLayer` (`all` or a subsystem), `pick(id)`, `hover(id)`,
`setGasExternal(bool)`, `setBlocked(bool)`, `reset()`, and `focus(run)` to scroll to the explorer first.
Deep link: `/?part=C05#explore` opens the case with C05 selected.

## Editing a component

1. Change its geometry in `src/trolley/geometry/parts/Cxx-*.ts` (spec frame: mm, x right, y back, z up;
   negative y is the front), or its data in `src/trolley/register.ts`.
2. Regenerate:
   ```bash
   npm run figure:fast    # quick depth settle (~15 s) while iterating
   npm run figure         # full settle over every frame of the explode (~5 min) before shipping
   npm run figure:audit   # full settle + geometry audit (clearances, supports, depth order)
   ```
3. `npm run dev` picks up the new `generated/` files.

Each part file tags what it draws with its register ID (`data-c`), its subsystem layer (`data-s`) and the assembly it
comes apart with (see `PIECES` in `builder.ts`). Hardware that rides with a module (legs, brackets) is tagged C26 but
lives next to what it mounts. If a supplier part doesn't fit, change the case — never shrink the imported part.

## Interaction

Hover or tap a part · arrow keys step through C01–C27 · Space opens/closes · E explodes · F cycles flows ·
P parks · T raises the handle · Esc resets. Reduced motion jumps straight to every state. Theme follows the
toggle in the header (saved locally).

## Findings from building the model (for the spec)

Building every envelope at its register coordinates surfaced a packaging conflict the spec's acceptance check 3
("major envelopes fit the nominated space without unintended intersections") would flag:

- **C04 vs C11/C12 at the rear-left.** The push-handle rails sit at y 107.5…152.5, x ±128…150 (centre y 130, 45 deep),
  and stow downward inside the case. The oxygen cylinder (centre −145, 70, Ø110) reaches y 125 in the same column, and
  the C12 cradles reach y 132, so a stowed left rail would pass through both. The model resolves it by drawing the rails
  24 mm deep at y 128…152 (still inside C04's 45 mm allocation), opening the cradles toward the rear, and moving the
  C12 backbone to the cylinder's front-left. Options for the next spec revision: a shallower rail section, moving C11
  ~20 mm forward, or a two-stage telescoping handle that stows above the cylinder.
- **Chassis frame vs modules.** C15 (to y 135, x 190) and C08 (to x 195) touch the C02 400 × 270 frame envelope, so
  corner posts collide unless they are slimmed (right posts drawn 10 mm wide) or the modules notched. The rear
  partition post was moved to y 80…100 to keep the handle zone clear.
- **Line lengths.** Modelled routes are shorter than the allocations (C16 hoses ≈ 0.32 m of 1.6 m; C23 lines ≈ 0.96 and
  0.93 m of 1.5 m each). The allocations remain the mass basis; the model does not change them.
