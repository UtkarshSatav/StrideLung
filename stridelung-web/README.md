# StrideLung 01 — interactive concept site (Next.js)

An interactive, isometric model of the **StrideLung 01** compact ECMO-support trolley concept, embedded in a mock
product site. Every one of the 27 components in the register has its own geometry file and its own React component.

A second figure, the **parallel-oxygenator concept exploration** (`/parallel-oxygenator`), draws the question from
`STRIDELUNG_06_PARALLEL_OXYGENATOR_ANATOMY_CONCEPT.md`: two cartridge mock-ups on parallel conceptual branches between a
shared inlet and a shared outlet. It is concept only — not a validated ECMO circuit, not for patient use — and it shows
the open questions rather than answering them (see [Parallel-oxygenator figure](#parallel-oxygenator-figure)).

> Concept packaging — not a clinical device. Every dimension, coordinate and mass is **P** (proposed); materials
> marked **U** are unselected; **R** marks a fact about an identified reference product. Source of truth:
> `STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md` (Concept v0.1).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

The figure data in `src/trolley/generated/` and `src/parallel/generated/` is committed, so the site builds without
regenerating it.

## Hospital dashboard

The **Hospital dashboard** link opens `/simulator`. It runs a simulated fleet of ten StrideLung trolleys in the browser: six with a demo case assigned are running, four sit idle in the equipment bay.

**Command panel** is presented as the trolley's own display (C20) mirrored to the hospital: the landing page's trolley model (live flows, the affected part highlighted, the alarm light), pressure / flow / pressure-drop waveforms with shaded demo limits, and readout tiles. The mirrored display is read-only. The dashed **At the trolley (demo)** strip below it stands in for staff at the bedside: settings, scenarios (drainage restriction, oxygenator resistance rising, gas interrupted, mains unplugged, thermal fault, pump standby, telemetry link lost, service reminder), mobility sessions, the whole-fleet network switch and 1× / 10× demo time.

Alerts are not sent from the dashboard. Each trolley checks its own readings against demo limits; a reading that stays out of band for 3 s raises an alert, grouped one per subsystem, with delivery state (queued on the trolley, delivered, delivered late), "back in band", acknowledgement and a 30 s demo escalation. When data stops arriving the mirror goes stale ("No data since …") and a "Monitor unavailable" alert opens. Nothing goes wrong unless the presenter triggers it. The session resets on reload.

Demo walk-through: on SL-D-003 start **Oxygenator resistance rising** with **Demo time ×10**, switch to SL-D-001 — the SL-D-003 alert arrives while you watch another unit. Untick **Hospital network up**, trigger a fault, then reconnect to show the queued alert delivered late.

Simulation and alert logic is framework-free and unit-tested: `npm test` (Node's built-in test runner).

## What's where

```
src/
  app/                           Next.js App Router
    page.tsx                     home: hero, explorer, subsystems, plan, mass budget, resources, evidence, register, limits, sources
    components/page.tsx          all 27 components, each drawn on its own (filterable)
    components/[slug]/page.tsx   one statically generated page per component
    parallel-oxygenator/page.tsx the parallel-oxygenator concept exploration (figure, review table, topology, limits)
    simulator/                   hospital dashboard: trolleySim.ts (signal model), alerts.ts (demo limits, incidents),
                                 fleet.ts (store), CommandPanel.tsx, TrolleyStrip.tsx, alert snapshots
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
  parallel/                      the parallel-oxygenator concept figure
    model.ts                     scenes, captions, parts, review sequences — visual-only, no circuit values
    geometry/                    generator-only: builder.ts (camera), layout.ts, parts/*.ts, scene/, baseline.ts
    generated/                   figure.json (depth-sorted items, door art) + baseline.json (the thumbnail)
    engine.ts                    framework-free engine: door, scene layers, review steps, pause, tour, selection
    ParallelProvider.tsx, ParallelFigure.tsx, ParallelStage.tsx, SceneControls.tsx, ScenePanel.tsx, KeyPanel.tsx,
    PartsList.tsx, ParallelExplorer.tsx, parallel.css
  site/                          site sections (Header, Hero, Subsystems, MassBudget, RegisterTable, …)
  lib/iso/                       the isometric drawing kit (iso-kit, lathe, tube, audit, iso.css)
  lib/figure/builder.ts          createBuilder(): camera, recorder and every drawing helper, one instance per figure
scripts/generate-figure.ts       runs every trolley part file, settles painter's order, writes src/trolley/generated
scripts/generate-parallel.ts     the same for the parallel-oxygenator figure and its baseline thumbnail
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

## Parallel-oxygenator figure

`/parallel-oxygenator` (also linked from the home page and the header). One shared model drives seven scenes, with
the same part identities in all of them:

| Key | Scene | What it shows |
| --- | --- | --- |
| 1 | Closed product | The trolley closed; both cartridges visible through the door's inspection window |
| 2 | Concept cutaway | Door open, right side panel phantom; shared inlet → split → two branches → merge → shared outlet |
| 3 / 4 | Branch A / B focus | One branch lit, the other ghosted, with the uncertainty card — a visual selection, not an operating state |
| 5 | Topology review | Split, extra joins, merge — highlighted in turn (a presentation highlight, not a flow or switching sequence) |
| 6 | Risk review | Unequal distribution, additional connections, packaging growth, changeover validation |
| 7 | Compare with baseline | A single-cartridge thumbnail beside the two-cartridge cutaway, both labelled unvalidated |

Keys: 1–7 scenes · arrows step through parts · N / P step a review · Space pauses motion · Esc clears. Deep links:
`/parallel-oxygenator?scene=branch-a&part=split`. Reduced motion: the door jumps, highlights stand still and review steps
advance only when asked. The isolation silhouettes are deliberately not selectable.

What the drawing encodes, and what it refuses to: `src/parallel/model.ts` is visual-only. It holds no flow rates,
pressures, valve states, timers, alarms, oxygen transfer or changeover behaviour, and the figure shows no numbers. Gas and
thermal interfaces end in capped stubs tagged "not designed" / "unresolved"; the manifolds carry a hatched face
(schematic, geometry unresolved); the case carries a joint rib and a hatched lid panel marking a provisional extension.
The single-cartridge concept's dimensions and mass are not reused.

Regenerate after editing `src/parallel/geometry/**`:

```bash
npm run parallel         # build + depth settle (~10 s), writes src/parallel/generated
npm run parallel:audit   # the same, then the geometry audit
```
