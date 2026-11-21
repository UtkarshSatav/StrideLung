// Shapes of the generated figure data (see scripts/generate-figure.ts).
export type Item = {
  /** global painter's index after the depth settle */
  i: number;
  /** item name, e.g. "oxy.body" or "pump.drain:3" */
  n: string;
  /** register component ID */
  c: string;
  /** subsystem layer */
  s: string;
  /** extra component IDs this item also counts for (e.g. "C25") */
  x?: string;
  /** assembly it highlights with / comes apart with */
  p: string;
  /** assembly whose spring moves it, when different */
  r?: string;
  /** settled painter's key */
  k: number;
  /** explode move vector, kit frame */
  m: [number, number, number];
  /** extra attributes (e.g. a clip-path) */
  a?: string;
  /** tooltip */
  t?: string;
  svg: string;
};

export type DoorArt = { outer: string; inner: string; z0: number; z1: number; w: number };

export type SceneData = {
  W: number;
  H: number;
  P: { origin: [number, number]; scale: number; azimuth: number; elevation: number };
  V: [number, number, number];
  KS: number;
  EX: [number, number];
  EY: [number, number];
  EZ: [number, number];
  back: string;
  gasHatch: string;
  handleClip: string;
  hinge: [number, number];
  doors: { main: DoorArt; hatch: DoorArt };
  display: { o: number[]; ex: number[]; ey: number[] };
  pieces: Record<string, { label: string }>;
  explode: string[];
  spring: { stagger: number; stiffness: number; damping: number; substeps: number };
  lines: Record<string, number>;
  c23: { drain: number; ret: number };
  bounds: Record<string, [number, number, number, number] | null>;
  mass: { sum: number; contingency: number; total: number; ceiling: number; margin: number };
  resources: { battery: { wh: number; factor: number; loads: number[] }; gas: { usableL: number; lpm: number } };
  subsystems: Record<string, string>;
  itemCount: number;
};
