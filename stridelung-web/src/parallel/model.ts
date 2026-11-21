// The parallel-oxygenator concept figure's model (STRIDELUNG_06_PARALLEL_OXYGENATOR_ANATOMY_CONCEPT.md).
//
// Visual-only by design. It chooses which drawing layers are lit, ghosted or muted, which captions show and
// which part is selected. It encodes no valves, alarms, flow rates, pressures, timers, oxygen transfer or
// changeover behaviour, and no number in it describes the circuit. A highlighted branch is a drawing layer,
// never an operating state of a medical circuit.
//
// Imported by the geometry generator (Node, explicit .ts paths) and by the site (Next), so it imports nothing.

export type Scene =
  | "closed"
  | "cutaway"
  | "branch-a"
  | "branch-b"
  | "topology-review"
  | "risk-review"
  | "baseline-compare";

export type ConceptFigureState = {
  scene: Scene;
  selectedPartId: string | null;
  conceptOnly: true;
  motionPaused: boolean;
};

export const BANNER = "CONCEPT ONLY · NOT A VALIDATED ECMO CIRCUIT · NOT FOR PATIENT USE";
export const TITLE = "StrideLung parallel oxygenator — concept exploration";
export const QUESTION = "Could a future ECMO circuit package two oxygenator modules on parallel conceptual branches between a shared inlet and a shared outlet?";

// ───────── parts: visual parts, not a bill of materials ─────────
export type PartGroup = "trolley" | "path" | "unresolved";
export type ConceptPart = {
  id: string;
  name: string;
  group: PartGroup;
  caption: string;
  /** muted silhouettes are drawn but cannot be picked */
  selectable: boolean;
};

export const GROUPS: Record<PartGroup, string> = {
  trolley: "Trolley and support",
  path: "Concept blood-side path",
  unresolved: "Unresolved supporting paths",
};

export const PARTS: ConceptPart[] = [
  // trolley and support
  { id: "shell", name: "Outer trolley shell", group: "trolley", selectable: true, caption: "Rigid upright case with front pillars, a lid and a fixed fascia above the bay. Drawn wider than the single-cartridge concept; its size is provisional." },
  { id: "back-shell", name: "Back shell", group: "trolley", selectable: true, caption: "Rear shell and its corner returns. It carries the handle channels; no mounting loads are claimed." },
  { id: "extension", name: "Provisional bay extension", group: "trolley", selectable: true, caption: "The joint rib and hatched lid panel mark where the case had to grow to take a second cartridge. Packaging, mass and stability require a new review." },
  { id: "door", name: "Front cutaway door", group: "trolley", selectable: true, caption: "Full-width door hinged on the left front pillar. Opening it is a viewing state of the model, not a service procedure." },
  { id: "hinges", name: "Hinge pair", group: "trolley", selectable: true, caption: "Two knuckle hinges on the left pillar carry the door. Hinge loads and door stiffness are not analysed." },
  { id: "window", name: "Inspection window and frame", group: "trolley", selectable: true, caption: "Framed glazing in the door, so the two cartridges can be seen with the door closed." },
  { id: "wheels", name: "Wheels, forks and brake tabs", group: "trolley", selectable: true, caption: "Four swivel casters with forks and brake tabs. Brake appearance does not establish floor stability for the wider, heavier package." },
  { id: "handle", name: "Retractable handle rails and crossbar", group: "trolley", selectable: true, caption: "Twin rails run in rear channels and rise out of a lid slot; shown part-raised." },
  { id: "side-rails", name: "Internal side rails", group: "trolley", selectable: true, caption: "Angle rails on both inner walls, two levels, carrying the module shelves." },
  { id: "shelves", name: "Two module shelves", group: "trolley", selectable: true, caption: "A lower shelf for the shared carrier and an upper shelf the split manifold hangs from. Their spacing is a drawing choice." },
  { id: "carrier", name: "Shared cartridge carrier", group: "trolley", selectable: true, caption: "One carrier — base plate, two cups, a rear spine and cradle bands — holds both cartridge mock-ups and the merge manifold. Engraved concept A and concept B." },
  { id: "supports", name: "Line support features", group: "trolley", selectable: true, caption: "Wall pass-throughs, saddle clips and a hanger for the lines. Shown without any functional load or retention claim." },
  { id: "display", name: "Display", group: "trolley", selectable: true, caption: "The trolley's fascia display. It repeats the concept-only banner and the scene name; it shows no settings or readings." },
  // concept blood-side path
  { id: "caps", name: "Symbolic boundary caps", group: "path", selectable: true, caption: "The shared inlet and outlet end in capped connectors on a post at the edge of the plinth: circuit interfaces outside the scope of this concept." },
  { id: "inlet-tube", name: "Shared inlet tube", group: "path", selectable: true, caption: "One conceptual inlet, drawn blue, from the boundary cap through the right wall to the split. What it connects to upstream is not decided." },
  { id: "inlet-block", name: "Schematic inlet block", group: "path", selectable: true, caption: "Where the shared inlet enters the case. Schematic manifold — geometry and design unresolved." },
  { id: "split", name: "Schematic split body", group: "path", selectable: true, caption: "One port in, two out. Schematic manifold — geometry and design unresolved. Branch flow distribution is unverified." },
  { id: "branch-a", name: "Branch A segments and couplers", group: "path", selectable: true, caption: "Upstream and downstream segments for cartridge A, each with a symbolic coupler." },
  { id: "branch-b", name: "Branch B segments and couplers", group: "path", selectable: true, caption: "Upstream and downstream segments for cartridge B, each with a symbolic coupler." },
  { id: "cart-a", name: "Concept cartridge A", group: "path", selectable: true, caption: "A complete conceptual module: outer shell, a transparent cutaway face, a heat-exchanger band and capped stubs. Not a product, and not a performance claim." },
  { id: "cart-b", name: "Concept cartridge B", group: "path", selectable: true, caption: "Matched to cartridge A. A second cartridge does not prove doubled support or longer use." },
  { id: "fibres", name: "Representative hollow-fibre bundles", group: "path", selectable: true, caption: "Shows what a membrane oxygenator looks like inside. Not to scale; no fibre count, surface area or gas-exchange claim. The fibres are not a separately exchangeable part." },
  { id: "merge", name: "Schematic merge body", group: "path", selectable: true, caption: "Two ports in, one out, on the shared carrier. Schematic manifold — geometry and design unresolved." },
  { id: "outlet-tube", name: "Shared outlet tube", group: "path", selectable: true, caption: "The merged outlet, drawn red, from the merge through the right wall to its boundary cap." },
  { id: "valves", name: "Isolation silhouettes", group: "path", selectable: false, caption: "Muted silhouettes on each branch: isolation/switching approach not designed. They have no positions and no states." },
  // unresolved supporting paths
  { id: "gas-stubs", name: "Gas-side stubs (amber)", group: "unresolved", selectable: true, caption: "Dashed amber stubs, capped, with “not designed” tags. Gas-side distribution to two cartridges is not designed in this concept." },
  { id: "thermal-stubs", name: "Heat-exchanger stubs (teal)", group: "unresolved", selectable: true, caption: "Neutral capped teal stubs on each heat-exchanger band, tagged unresolved: thermal arrangement unresolved." },
  { id: "sensor-markers", name: "Sensor-location markers", group: "unresolved", selectable: true, caption: "Blank collars where sensing might be needed. No sensor type, position or reading is decided, and nothing is displayed." },
];
export const PART_BY_ID: Record<string, ConceptPart> = Object.fromEntries(PARTS.map((p) => [p.id, p]));
export const SELECTABLE = PARTS.filter((p) => p.selectable).map((p) => p.id);

/** Every join on the branch topology (couplers, cartridge ports, manifold ports) carries this tag too. */
export const JOINS = "joins";

// ───────── scenes ─────────
export type Layers = {
  /** parts drawn as the lit accent */
  lit: string[];
  /** parts ghosted right down */
  ghost: string[];
  /** everything else steps down to a quiet tone */
  mute: boolean;
  /** moving direction highlights shown (conceptual direction only) */
  flows: string[];
};
export type SceneDef = {
  id: Scene;
  label: string;
  key: string;
  caption: string;
  /** read to assistive technology on entering the scene */
  description: string;
  door: "closed" | "open";
  layers: Layers;
};

const PATH_A = ["caps", "inlet-tube", "inlet-block", "split", "branch-a", "cart-a", "merge", "outlet-tube"];
const PATH_B = ["caps", "inlet-tube", "inlet-block", "split", "branch-b", "cart-b", "merge", "outlet-tube"];
const SAME = " Concept only: highlighted branches are drawing layers, not operating instructions.";

export const SCENES: SceneDef[] = [
  {
    id: "closed", key: "1", label: "Closed product", door: "closed",
    caption: "The StrideLung trolley closed: case, fascia display, part-raised handle and casters. The two cartridge mock-ups show through the inspection window.",
    description: "Closed product. An upright suitcase-style trolley on four casters with its door shut; two cartridge mock-ups are visible through the door window." + SAME,
    layers: { lit: [], ghost: [], mute: false, flows: [] },
  },
  {
    id: "cutaway", key: "2", label: "Concept cutaway", door: "open",
    caption: "Door open. One shared inlet reaches a schematic split, two branches pass through two matched cartridges, and a schematic merge feeds one shared outlet. Gas and thermal stubs stay capped.",
    description: "Concept cutaway. The open bay shows a shared inlet, a split, two branches through cartridges A and B, a merge and a shared outlet; amber gas and teal thermal stubs are capped and unresolved." + SAME,
    layers: { lit: [], ghost: [], mute: false, flows: ["in", "a", "b", "out"] },
  },
  {
    id: "branch-a", key: "3", label: "Branch A focus", door: "open",
    caption: "Only the conceptual path through cartridge A is lit. This is a visual selection: it does not mean branch B is isolated, safe to disconnect, or able to carry all the flow.",
    description: "Branch A focus. The path through cartridge A is highlighted and branch B is ghosted." + SAME,
    layers: { lit: PATH_A, ghost: ["branch-b", "cart-b"], mute: true, flows: ["in", "a", "out"] },
  },
  {
    id: "branch-b", key: "4", label: "Branch B focus", door: "open",
    caption: "Only the conceptual path through cartridge B is lit. This is a visual selection: it does not mean branch A is isolated, safe to disconnect, or able to carry all the flow.",
    description: "Branch B focus. The path through cartridge B is highlighted and branch A is ghosted." + SAME,
    layers: { lit: PATH_B, ghost: ["branch-a", "cart-a"], mute: true, flows: ["in", "b", "out"] },
  },
  {
    id: "topology-review", key: "5", label: "Topology review", door: "open",
    caption: "The shared split, the extra joins and the shared merge, one at a time. A presentation highlight — not a flow or switching sequence.",
    description: "Topology review. The split, the extra joins and the merge are highlighted in turn." + SAME,
    layers: { lit: [], ghost: [], mute: true, flows: [] },
  },
  {
    id: "risk-review", key: "6", label: "Risk review", door: "open",
    caption: "Four open questions, called out in turn: unequal branch distribution, additional connections, packaging growth and changeover validation.",
    description: "Risk review. Open questions are called out in turn: unequal branch distribution, additional connections, packaging growth and changeover validation." + SAME,
    layers: { lit: [], ghost: [], mute: true, flows: [] },
  },
  {
    id: "baseline-compare", key: "7", label: "Compare with baseline", door: "open",
    caption: "A single-cartridge concept thumbnail beside the two-cartridge cutaway. Both are unvalidated, and no performance comparison is made or implied.",
    description: "Compare with baseline. A single-cartridge concept thumbnail sits beside the two-cartridge cutaway; both are labelled unvalidated." + SAME,
    layers: { lit: [], ghost: [], mute: false, flows: [] },
  },
];
export const SCENE_BY_ID: Record<Scene, SceneDef> = Object.fromEntries(SCENES.map((s) => [s.id, s])) as Record<Scene, SceneDef>;

// ───────── review sequences (presentation highlights) ─────────
export type Step = { title: string; caption: string; lit: string[]; callout?: string };
export const SEQUENCES: Partial<Record<Scene, Step[]>> = {
  "topology-review": [
    { title: "Shared split", caption: "One shared inlet divides at a schematic split. Its geometry and design are unresolved, and branch flow distribution is unverified.", lit: ["inlet-tube", "inlet-block", "split"] },
    { title: "Extra joins", caption: "Every coupler and port added by the second branch. More joints and paths create additional design and verification work.", lit: [JOINS] },
    { title: "Shared merge", caption: "The branches rejoin at a schematic merge before one shared outlet. Its geometry and design are unresolved.", lit: ["merge", "outlet-tube"] },
  ],
  "risk-review": [
    { title: "Unequal branch distribution", caption: "Does blood divide evenly between the two branches? Branch flow distribution is unverified.", lit: ["split", "branch-a", "branch-b", "merge"] },
    { title: "Additional connections", caption: "What new failure points are introduced? More joints and paths create additional design and verification work.", lit: [JOINS, "caps", "inlet-block"] },
    { title: "Packaging growth", caption: "Can both cartridges fit in the current trolley? Packaging, mass and stability require a new review.", lit: ["extension", "carrier", "shelves", "cart-a", "cart-b"] },
    { title: "Changeover validation", caption: "Can one cartridge be isolated while the other remains active? Isolation and changeover design not defined.", lit: [], callout: "valves" },
  ],
};

// ───────── the reviewers' table (spec §4) ─────────
export const REVIEW = [
  { question: "Does blood divide evenly between the two branches?", cue: "The split block is neutral grey and both branch paths are drawn identically — no numerical flow animation.", caption: "Branch flow distribution is unverified." },
  { question: "Does operating two oxygenators in parallel improve useful support?", cue: "Two identical modules are shown, with no performance meter and no doubled output.", caption: "Additional cartridge does not prove doubled support or longer use." },
  { question: "Can one cartridge be isolated while the other remains active?", cue: "Muted valve silhouettes with no moving or selected positions.", caption: "Isolation and changeover design not defined." },
  { question: "What new failure points are introduced?", cue: "The extra junctions and branch interfaces are highlighted one at a time.", caption: "More joints and paths create additional design and verification work." },
  { question: "Do gas and thermal paths support both cartridges?", cue: "Amber and teal stubs end in caps; they are never joined to invented manifolds.", caption: "Gas and heat-exchanger integration unresolved." },
  { question: "Can both cartridges fit in the current trolley?", cue: "The pair sits in a visibly provisional, extended bay.", caption: "Packaging, mass and stability require a new review." },
];

/** Where things belong is not decided by this sketch (spec §3). */
export const PLACEMENT = [
  "Pump",
  "Pressure and flow sensors",
  "Gas supply and gas-side distribution",
  "Heat-exchange loop",
  "Sampling points",
  "Any isolation components",
];

export const NOT_CLAIMED = [
  "No speeds, pressures, flows, performance numbers or clinical thresholds appear anywhere in the figure.",
  "A second cartridge does not double the circuit’s approved lifetime: each cartridge or set has its own product-specific intended-use limit and approval, and a parallel layout alone does not change those instructions.",
  "No valve positions, changeover sequence or removal animation is shown, and no cartridge is ever removed while the other branch is shown active.",
  "The earlier single-cartridge volume, weight, fit, runtime and enclosure figures are not carried over: the paired layout needs its own packaging, mass, connection and clearance review.",
  "The illustrated cartridge is a complete conceptual module; its fibres are not shown as an individually exchangeable subcomponent.",
];

export const CHECKLIST = [
  "First frame reads as a coherent StrideLung trolley product.",
  "Two cartridges are visibly mounted, distinct and labelled concept A and concept B.",
  "Shared inlet, split, separate paths, merge and shared outlet are easy to follow.",
  "Gas and heat-exchanger pathways are visibly unresolved rather than fabricated.",
  "No executable valve positions, changeover sequence or removal animation.",
  "No performance, runtime-extension, patient-support, safety or efficacy claim.",
  "The cutaway is clearly marked concept-only and not for patient use.",
  "Branch highlighting is explained as not being an operating state.",
  "The expanded packaging does not reuse the single-cartridge dimensions or mass claims.",
  "No label implies the fibres are exchanged as a standalone subcomponent.",
];
