# StrideLung parallel oxygenator — Anatomy-style concept brief

**Purpose:** Direct a 3D modeller or coding agent to create an Anatomy-style product illustration of the proposed two-branch oxygenator idea: one conceptual blood inlet divides toward two oxygenator cartridges and the branches rejoin before a shared return.

**Status:** Concept visualization only. This is not a circuit design, a valve design, a construction guide, or evidence that the arrangement can safely support a patient. Do not connect the model to blood, a patient, a clinical circuit, or pressurized gas.

**Related documents:** [Product anatomy model brief](STRIDELUNG_03_PRODUCT_ANATOMY_MODEL_BRIEF.md) · [Safety monitor and help-alert concept](STRIDELUNG_05_SAFETY_MONITOR_AND_HELP_ALERT_CONCEPT.md) · [How current ECMO works](../ECMO_ARTIFICIAL_LUNG_SYSTEM_EXPLAINED.md)

## 1. One-sentence idea to illustrate

**“Could a future ECMO circuit package two oxygenator modules on parallel conceptual branches between a shared inlet and a shared outlet?”**

The figure should show the question and its unresolved engineering problems. It must not answer “yes, this safely extends ECMO runtime.” It must not portray an automatic changeover as a proven capability.

## 2. Anatomy figure target

Build one **interactive isometric product cutaway** using the object-first principles of the [Anatomy skill](https://skills.wheresryan.sh/anatomy): a recognizable trolley, solid mounted components, an inspectable mechanism, and one short explanation of what the viewer is seeing. The machine itself is the explanation; do not make a flowchart with boxes and arrows.

- Keep the StrideLung upright suitcase/trolley silhouette, with wheels, handle, casing, display and an open cutaway bay.
- Place two matched, clearly named **concept oxygenator cartridges** side-by-side in one visible carrier.
- Show one abstract shared inlet connection, a schematic split into two distinct paths, two separate cartridge blood-side passages, and a schematic merge into one shared outlet.
- Use blue for the shared inlet and branch paths, and red for the merged outlet. Use small moving highlights to explain conceptual direction only; no speeds, pressures, flows, performance numbers or clinical thresholds.
- Use distinct amber dashed stubs at each cartridge to indicate that gas-side distribution is **not designed in this concept**. Likewise, show heat-exchanger interfaces as neutral capped stubs labeled **thermal arrangement unresolved** if the cartridges are drawn with heat exchangers.
- Make split/merge housings visually recognizable but label them **“schematic manifolds — geometry and design unresolved.”** They are not functional connectors.
- Show valve-like geometry only as muted, nonselectable silhouette symbols labeled **“isolation/switching approach not designed.”** Do not depict a working valve state, operating sequence, or switch-over action.
- Put captions and risk notes in a side panel, not as floating labels on the equipment.
- Add a persistent banner: **“CONCEPT ONLY · NOT A VALIDATED ECMO CIRCUIT · NOT FOR PATIENT USE.”**

This concept changes the oxygenator packaging. Do not preserve the earlier single-cartridge volume, weight, fit, runtime, or enclosure claims as if a second cartridge were free. The paired layout needs its own packaging, mass, connection and clearance review.

## 3. The topology the image may communicate

Keep the blood-side concept abstract and linear:

```text
Shared conceptual inlet
         │
   schematic split
      ┌──┴──┐
      │     │
  cartridge A   cartridge B
      │     │
      └──┬──┘
   schematic merge
         │
Shared conceptual outlet
```

The visual can highlight each branch separately to help a viewer compare the two paths. Highlighting a branch is a **visual selection state**, not a statement that the other branch is isolated, safe to disconnect, or capable of carrying all required flow. Never animate a cartridge being removed while the other continues to support a patient.

### Important unresolved placement question

This sketch does not decide where a pump, pressure/flow sensors, gas supply, heat-exchange loop, sampling points, or any isolation components belong. Do not silently copy the previous single-oxygenator diagram and assume the same layout works. In the figure, show the common inlet/outlet as **circuit interfaces outside the scope of this concept**, and list these questions in the companion panel.

## 4. What the visual should help reviewers notice

Make the tradeoffs visible beside the cutaway:

| Review question | Visual cue | Caption |
| --- | --- | --- |
| Does blood divide evenly between the two branches? | Split block is neutral gray; branch paths share a border/uncertainty pattern, not a numerical flow animation | “Branch flow distribution is unverified.” |
| Does operating two oxygenators in parallel improve useful support? | Two identical modules are shown, but no performance meter or doubled output | “Additional cartridge does not prove doubled support or longer use.” |
| Can one cartridge be isolated while the other remains active? | Muted valve symbols with no moving/selected positions | “Isolation and changeover design not defined.” |
| What new failure points are introduced? | Highlight the extra junctions and branch interfaces one at a time | “More joints and paths create additional design and verification work.” |
| Do gas and thermal paths support both cartridges? | Amber/teal unresolved stubs; do not join them to invented manifolds | “Gas and heat-exchanger integration unresolved.” |
| Can both cartridges fit in the current trolley? | Show the pair in a visibly provisional expanded bay or let the case open wider in a separate pack-out state | “Packaging, mass and stability require a new review.” |

The image should not imply that a second cartridge doubles the circuit's approved lifetime. Each cartridge/set has a product-specific intended-use limit and approval. Parallel layout alone does not change those instructions.

## 5. Component inventory for this concept figure

Create at least 40 meaningful attached solids, grouped so the viewer can distinguish the product shell, carrier, branch topology and unresolved connections. These are **visual parts**, not a bill of materials.

### Trolley and support

- Outer trolley shell and back shell
- Open front cutaway door and hinge pair
- Inspection window and frame
- Four wheels with forks and brake tabs
- Retractable handle rails and crossbar
- Internal side rails and two module shelves
- Shared cartridge carrier
- Cable/line support features shown without functional load claims

### Concept blood-side path

- Shared inlet tube segment
- Schematic inlet block
- Schematic split body
- Branch A tube segments and two couplers (symbolic)
- Branch B tube segments and two couplers (symbolic)
- Oxygenator cartridge A outer shell and transparent cutaway face
- Oxygenator cartridge B outer shell and transparent cutaway face
- Representative hollow-fiber bundles inside each cartridge (not to scale; no fiber-count or membrane performance claim)
- Schematic merge body
- Shared outlet tube segment
- Symbolic connection caps at the outer concept boundary
- Muted valve/isolation silhouettes with no operational state animation

### Unresolved supporting paths and user interface

- Amber gas-side port stubs and small “not designed” plaques
- Teal heat-exchanger port stubs and small “not designed” plaques
- Neutral sensor-location markers with no numeric display
- Side explanation card for the selected branch
- Persistent concept-only banner
- Risk/unknowns panel
- Scene selector and pause control

Each object must attach to a visible parent or surface. Use the hollow-fiber geometry only to communicate what a membrane oxygenator looks like internally; do not add plausible-sounding fiber dimensions, material certificates, surface area, flow values or gas-exchange results.

## 6. Interaction states

Create these states using one shared model and the same component identities:

1. **Closed product:** normal StrideLung suitcase/trolley appearance.
2. **Concept cutaway:** open case reveals two cartridge mock-ups, shared inlet/split/merge/outlet topology, and clearly unresolved gas/thermal stubs.
3. **Branch A focus:** highlight only the conceptual path through cartridge A; display the uncertainty card.
4. **Branch B focus:** highlight only the conceptual path through cartridge B; display the same uncertainty card.
5. **Topology review:** highlight the shared split, extra joins and shared merge in sequence. The animation is a presentation highlight, not a flow or switching sequence.
6. **Risk review:** call out unequal branch distribution, additional connections, packaging growth, and changeover validation as open questions.
7. **Compare with baseline:** show a single-cartridge concept thumbnail beside the two-cartridge cutaway. Label both as unvalidated; show no fabricated performance comparison.

Pointer/touch and keyboard selection should work. Provide reduced-motion behavior and a static still frame. State captions and accessibility text should repeat **concept only** and explain that highlighted branches do not represent operating instructions.

## 7. Data model for the figure

The simple model should synchronize selection, captions and highlighting. Keep it explicitly visual-only:

```ts
type Scene =
  | "closed"
  | "cutaway"
  | "branch-a"
  | "branch-b"
  | "topology-review"
  | "risk-review"
  | "baseline-compare";

type ConceptFigureState = {
  scene: Scene;
  selectedPartId: string | null;
  conceptOnly: true;
  motionPaused: boolean;
};
```

Do not encode valves, alarms, flow rates, timers, oxygen transfer or changeover behavior in this model. The highlight state chooses a drawing layer only; it must not be described as an operational state of a medical circuit.

## 8. Ready-to-use prompt for an Anatomy-style coding agent

> Build an interactive Anatomy-style isometric product cutaway titled **“StrideLung parallel oxygenator — concept exploration.”** Use a recognizable suitcase/trolley shell with a cutaway bay containing two side-by-side oxygenator cartridge mock-ups. The figure is a product object, not a flowchart.
>
> Show a conceptual shared blood inlet that reaches a schematic split, two separate branches each passing through one cartridge’s representative blood-side region, a schematic merge, and a shared conceptual outlet. Highlight branch A or branch B as a visual selection only. Show the extra split/merge interfaces as areas requiring review.
>
> Keep gas supply and thermal-water connections unresolved; show capped/dashed amber and teal interface stubs with “not designed” captions. Do not decide pump placement, pressure/flow sensor placement, gas distribution, heat-exchanger plumbing, valve type or valve configuration. Muted valve silhouettes may appear only as unresolved symbols; do not show valve states or a switching procedure.
>
> Use attached solid parts, realistic product casing, cartridge carriers and service surfaces. Use no clinical settings, thresholds, flow values, pressure values, runtime extension claims, or working simulation. Do not animate removal or changeover while another branch is active. Put the persistent banner **“CONCEPT ONLY · NOT A VALIDATED ECMO CIRCUIT · NOT FOR PATIENT USE”** on the figure card.
>
> Add scenes for closed product, cutaway, branch A focus, branch B focus, topology review, risk review and a clearly unvalidated single-versus-dual concept comparison. Keep data and captions synchronized. Add keyboard/touch controls, a pause control, reduced-motion behavior and accessible scene descriptions.
>
> Before delivery, inspect every scene for component attachment, occlusion and clarity. Confirm the concept cannot be mistaken for an approved circuit or a safe switching method. Explain in the side panel that parallel branches do not automatically double support or extend an oxygenator’s approved use duration.

## 9. Review checklist

- [ ] First frame reads as a coherent StrideLung trolley product.
- [ ] Two cartridges are visibly mounted, distinct and labeled “concept A” and “concept B.”
- [ ] Shared inlet, split, separate paths, merge and shared outlet are easy to follow.
- [ ] Gas and heat-exchanger pathways are visibly unresolved rather than fabricated.
- [ ] The image contains no executable valve positions, changeover sequence or removal animation.
- [ ] No performance, runtime-extension, patient-support, safety or efficacy claim appears.
- [ ] The cutaway is clearly marked concept-only and not for patient use.
- [ ] A viewer can understand that branch highlighting is not an operating state.
- [ ] The expanded packaging does not reuse the earlier single-cartridge dimensions or mass claims without rework.
- [ ] No labels imply that PMP fibers are individually exchanged as a standalone subcomponent; the illustrated cartridge is a complete conceptual module.

## 10. Scope and references

The concept is a topology exploration for product visualization. It is not an engineering recommendation. A real parallel ECMO circuit would require a selected manufacturer/platform, clinical and perfusion engineering input, risk analysis, compatible components and extensive verification. The Anatomy skill supplies an object-first visualization method only; it is not a medical-device design standard. [Anatomy skill](https://skills.wheresryan.sh/anatomy)

For context, the existing system description and safety-monitor documents explain the conventional ECMO circuit and why any added branch, connector or automatic alert must be validated before patient use. [StrideLung system explanation](STRIDELUNG_02_SYSTEM_EXPLANATION_AND_PITCH_GUIDE.md) · [StrideGuard safety-monitor concept](STRIDELUNG_05_SAFETY_MONITOR_AND_HELP_ALERT_CONCEPT.md)
