// StrideLung 01 component register — the single source of truth for every component's data.
// Transcribed from STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md (Concept v0.1, 21 Nov 2026), sections 5 and 6.
// Every dimension, coordinate and mass is P (proposed) unless a row says otherwise.
// Coordinates are millimetres in the spec frame: x right, y back (negative y is the front), z up.

export type SubsystemId = "blood" | "gas" | "thermal" | "electrical" | "chassis";
export type Status = "P" | "R" | "U" | "R/U";
export type ComponentRow = {
  id: string;
  /** URL slug for the component's own page */
  slug: string;
  name: string;
  shape: string;
  envelope: string;
  /** Row-total mass allocation in kg */
  mass: number;
  massNote?: string;
  material: string;
  matStatus: Status;
  position: string;
  role: string;
  sys: SubsystemId;
  /** true for rows with no geometry of their own (C25 mass metadata, C26 distributed hardware) */
  meta?: boolean;
};

export const SUBSYSTEMS: Record<SubsystemId, string> = {
  blood: "Blood path",
  gas: "Gas",
  thermal: "Thermal water",
  electrical: "Electrical and data",
  chassis: "Chassis and service",
};

// sys: the filter layer it belongs to. piece: the assembly it comes apart with.
const ROWS: Omit<ComponentRow, "slug">[] = [
  { id: "C01", name: "Rigid outer case, inspection window, service doors", shape: "Rounded upright case", envelope: "460 × 330 × 700", mass: 2.0, material: "PC/ABS shell candidate; clear polycarbonate window; grade and cleaning compatibility unverified", matStatus: "U", position: "0, 0, 440 · body z 90 to 790", role: "External skin. A fixed rear shell, a front inspection door, a lower dry-service hatch and a left gas hatch.", sys: "chassis" },
  { id: "C02", name: "Internal chassis and module shelves", shape: "Open rail frame", envelope: "400 × 270 × 640", mass: 1.8, material: "6061-T6 aluminium candidate; stainless fasteners", matStatus: "U", position: "0, 0, 440 · rails, not a solid block", role: "Structural frame inside the case: posts, rails, the core-module carrier, the thermal shelf and the battery tray.", sys: "chassis" },
  { id: "C03", name: "Four braked caster assemblies", shape: "Wheel + fork, each", envelope: "75 × 60 × 90 each", mass: 1.0, massNote: "row total for all four", material: "Polyurethane tread, polymer hub, metal fork; candidates", matStatus: "U", position: "±190, ±115, 45", role: "Four corners under the base. Brakes are shown visually; their appearance does not establish floor stability.", sys: "chassis" },
  { id: "C04", name: "Retractable push handle and lift grips", shape: "Twin rails + crossbar", envelope: "300 × 45 × 350 deployed", mass: 0.55, material: "Aluminium rails, TPE grip; candidates", matStatus: "U", position: "0, 130, 875 deployed · top at z 1050", role: "Rails run in rear channels; the crossbar stows flush in the lid. Side lift grips are for an unconnected mock-up only, not one-handed lifting of the loaded system.", sys: "chassis" },
  { id: "C05", name: "Membrane oxygenator with integrated heat exchanger", shape: "Rounded cartridge", envelope: "180 × 100 × 160", mass: 1.1, material: "PMP fibres and stainless heat-exchange material are reference examples [S3]; housing grade TBD", matStatus: "R/U", position: "65, −40, 590 · upper inspection bay", role: "Gas exchange across hollow fibres, with a separate heat-exchanger region at the base. Reserved envelope awaiting supplier fit; not a validated membrane design.", sys: "blood" },
  { id: "C06", name: "Disposable blood pump head", shape: "Circular chamber", envelope: "70 × 50 × 70", mass: 0.18, material: "Blood-contact polymer and impeller materials TBD; the transparent look is visual only", matStatus: "U", position: "50, 55, 540 · axis along y", role: "Centrifugal pump head behind and below the oxygenator. The blood path stays separate from the motor and wiring.", sys: "blood" },
  { id: "C07", name: "Reusable motor and pump drive", shape: "Rounded motor block", envelope: "90 × 60 × 85", mass: 0.8, material: "Aluminium housing and copper winding candidates; magnetic and internal materials TBD", matStatus: "U", position: "50, 110, 540 · drive starts at y 80", role: "Reusable drive behind the pump head. The coupling is symbolic, not a validated mechanical design.", sys: "electrical" },
  { id: "C08", name: "Core module carrier / reusable sensor interface", shape: "Small bridge block", envelope: "60 × 40 × 35", mass: 0.2, material: "Aluminium carrier and polymer electronics cover candidates", matStatus: "U", position: "165, 65, 620 · beside the cartridge", role: "Dry bridge block where the clip-on sensor pods connect to reusable electronics.", sys: "electrical" },
  { id: "C09", name: "Three pressure/temperature sensor pods", shape: "Three small blocks", envelope: "35 × 25 × 25 each", mass: 0.12, massNote: "row total for all three", material: "Dry housings: polymer candidate; blood-interface materials TBD", matStatus: "U", position: "Drainage/pre-pump · pre-oxygenator · post-oxygenator", role: "Symbolic housings at three labelled measurement sites. Not every real measurement is combined in one sensor.", sys: "blood" },
  { id: "C10", name: "Flow and bubble sensor assembly", shape: "Clip around a line", envelope: "65 × 50 × 35", mass: 0.22, material: "Polymer clip, sensor elements and cable; detailed specification TBD", matStatus: "U", position: "170, −35, 710 · return line", role: "Clip on an accessible return-line segment. Flow and bubble functions are proposed.", sys: "blood" },
  { id: "C11", name: "Medical oxygen cylinder with integral valve", shape: "Cylinder, shoulder, protected valve", envelope: "110 × 110 × 540", mass: 3.5, material: "Approved supplier cylinder material TBD; composite-look CAD surface only. Reference cylinder: 460 L nominal, 2 L water capacity, 3.5 kg [S4]", matStatus: "R/U", position: "−145, 70, 430 · upright, z 160 to 700", role: "Onboard gas storage in the left rear bay. The valve is counted inside this row.", sys: "gas" },
  { id: "C12", name: "Cylinder restraint and isolated bay hardware", shape: "Two cradles + straps", envelope: "120 × 140 × 560", mass: 0.45, material: "Aluminium cradle, replaceable TPE pads, strap material TBD", matStatus: "U", position: "−145, 70, 430 · overlaps C11 by design", role: "Open cradles and straps around the cylinder, not a second solid cylinder.", sys: "gas" },
  { id: "C13", name: "Gas flow/control and external-gas interface block", shape: "Manifold enclosure", envelope: "80 × 90 × 150", mass: 0.5, material: "Supplier-qualified oxygen-compatible materials TBD; no DIY manifold", matStatus: "U", position: "−145, −80, 550 · left front", role: "Supplier-selected gas control. Supply is either the onboard cylinder or external hospital blended gas, never both; internals and switching are unspecified.", sys: "gas" },
  { id: "C14", name: "Gas tubing and outlet guards", shape: "Flexible routed lines", envelope: "6 mm visual OD · 1.6 m path total", mass: 0.1, material: "Oxygen-compatible supplier tubing TBD", matStatus: "U", position: "Gas bay to the membrane gas ports", role: "Sweep gas to the oxygenator gas inlet and a separate exhaust path out of the gas bay vent. Gas never enters the blood line.", sys: "gas" },
  { id: "C15", name: "Thermal control module, dry", shape: "Rounded service block", envelope: "240 × 180 × 160", mass: 2.4, material: "Aluminium enclosure candidate; fluid-path components and materials TBD", matStatus: "U", position: "70, 45, 290 · lower centre/right", role: "Removable service block with an illustrative reservoir region, kept apart from the battery bay. Thermal capacity is unverified.", sys: "thermal" },
  { id: "C16", name: "Thermal water hoses", shape: "Paired flexible lines", envelope: "10 mm visual OD · 1.6 m path total", mass: 0.15, material: "Supplier-qualified flexible hose TBD", matStatus: "U", position: "Thermal module to heat exchanger", role: "Supply and return water to the heat-exchanger region of C05.", sys: "thermal" },
  { id: "C17", name: "Battery assembly including case/BMS", shape: "Low rectangular cassette", envelope: "220 × 80 × 70", mass: 1.8, material: "LiFePO4 cell chemistry candidate; aluminium case, insulating polymer", matStatus: "U", position: "70, −90, 160 · low front", role: "One battery assembly, not a declared hot-swappable redundant system. 200 Wh nominal scenario, unvalidated.", sys: "electrical" },
  { id: "C18", name: "Power conversion, charging and isolation assembly", shape: "Low rectangular block", envelope: "180 × 80 × 45", mass: 0.65, material: "Electronics in an insulated/metal enclosure; materials TBD", matStatus: "U", position: "70, 10, 155 · behind the battery", role: "Abstract electrical block. No wiring schematic or compliance is claimed.", sys: "electrical" },
  { id: "C19", name: "Compute, sensor acquisition and I/O assembly", shape: "Flat electronics box", envelope: "230 × 50 × 60", mass: 0.5, material: "PCB assembly, shielded aluminium enclosure candidates", matStatus: "U", position: "65, −110, 410 · below the core", role: "Dry front compartment that gathers sensor data and drives the display.", sys: "electrical" },
  { id: "C20", name: "Touchscreen/operator display", shape: "Recessed rectangular panel", envelope: "190 × 18 × 90", mass: 0.4, material: "Glass screen and polymer bezel candidates", matStatus: "U", position: "70, −156, 725 · flush at y −165", role: "Tabs: system overview, component information, illustrative signals. Nothing on it is an operating instruction.", sys: "electrical" },
  { id: "C21", name: "Audible/visual alarm assembly", shape: "Small indicator block", envelope: "70 × 40 × 25", mass: 0.1, material: "LED diffuser, polymer housing, buzzer elements; candidates", matStatus: "U", position: "−145, −115, 745 · upper front left", role: "Indicator and buzzer animation only. No silence or emergency-stop interaction is presented.", sys: "electrical" },
  { id: "C22", name: "Patient-line support/interface panel", shape: "Recessed side panel", envelope: "20 × 120 × 70", mass: 0.35, material: "Aluminium bracket and TPE supports candidates; blood connectors TBD", matStatus: "U", position: "220, 0, 700 · outer surface x 230", role: "Supports the visible line exit without pinching the tubes.", sys: "blood" },
  { id: "C23", name: "External blood-line pair and visual patient interface", shape: "Two flexible curves + mannequin connector", envelope: "13 mm visual OD · 1.5 m per line", mass: 0.35, material: "Medical blood-tubing material/coating and cannula model TBD", matStatus: "U", position: "Between the core and the mannequin connector", role: "Drainage and return lines with visible slack. Clinical cannula selection and placement not modelled; 13 mm is not a lumen or connector size.", sys: "blood" },
  { id: "C24", name: "Compatible backup/service-kit allowance", shape: "Service pouch/drawer proxy", envelope: "140 × 60 × 70", mass: 0.8, material: "Polymer case with supplier-compatible contents TBD", matStatus: "U", position: "60, −110, 300 · front of the lower thermal bay", role: "Contents depend on the chosen clinical system. Not a verified emergency kit, a spare console or guaranteed pump support.", sys: "chassis" },
  { id: "C25", name: "Illustrative fluid mass allowance", shape: "Metadata, not a part", envelope: "0.60 kg thermal + 0.45 kg circuit", mass: 1.05, material: "Water-equivalent mass for planning only; not a clinical prime prescription", matStatus: "P", position: "Allocated to the thermal reservoir and the blood circuit", role: "Selecting it lights the reservoir window and the blood lines that carry the allowance. No geometry of its own.", sys: "thermal", meta: true },
  { id: "C26", name: "Cables, vents, partitions and small mounting hardware", shape: "Distributed accessories", envelope: "Within routing and service clearances", mass: 0.6, material: "Copper cables, insulation, aluminium/polymer partitions; candidates", matStatus: "U", position: "Distributed · not a solid box", role: "Harness, battery-bay partition, vents, brackets and standoffs. Airflow, segregation and oxygen-enrichment risks need separate assessment.", sys: "electrical", meta: true },
  { id: "C27", name: "Deployable stabiliser pair", shape: "Fold-out arms/feet", envelope: "620 × 480 deployed support envelope", mass: 0.65, material: "Aluminium arms, elastomer feet; candidates", matStatus: "U", position: "Base · deployed view only", role: "Front and rear stabiliser bars with telescoping feet. The deployed footprint is larger than the trolley and is shown, not hidden.", sys: "chassis" },
];

export const SLUGS: Record<string, string> = {"C01": "outer-case", "C02": "chassis", "C03": "casters", "C04": "push-handle", "C05": "oxygenator", "C06": "pump-head", "C07": "pump-drive", "C08": "sensor-interface", "C09": "sensor-pods", "C10": "flow-bubble-sensor", "C11": "oxygen-cylinder", "C12": "cylinder-restraint", "C13": "gas-control", "C14": "gas-lines", "C15": "thermal-module", "C16": "thermal-hoses", "C17": "battery", "C18": "power-conversion", "C19": "compute", "C20": "display", "C21": "alarm", "C22": "line-panel", "C23": "blood-lines", "C24": "service-kit", "C25": "fluid-allowance", "C26": "cables-hardware", "C27": "stabilisers"};
export const REGISTER: ComponentRow[] = ROWS.map((row) => ({ ...row, slug: SLUGS[row.id] }));
export const BY_ID: Record<string, ComponentRow> = Object.fromEntries(REGISTER.map((row) => [row.id, row]));
export const BY_SLUG: Record<string, ComponentRow> = Object.fromEntries(REGISTER.map((row) => [row.slug, row]));

export const MASS = (() => {
  const sum = REGISTER.reduce((total, row) => total + row.mass, 0);
  const contingency = sum * 0.2;
  return { sum, contingency, total: sum + contingency, ceiling: 28, margin: 28 - (sum + contingency) };
})();

// Section 11: illustrative arithmetic only.
export const RESOURCES = {
  battery: { wh: 200, factor: 0.8, loads: [100, 150] },
  gas: { usableL: 300, lpm: 5 },
};

export const SOURCES: Record<string, { title: string; url: string }> = {
  S1: { title: "Getinge — Cardiohelp system specifications", url: "https://www.getinge.com/us/products/cardiohelp-system/" },
  S2: { title: "Getinge — HLS set instructions for use, US, January 2025", url: "https://www.getinge.com/dam/hospital/documents/english/mcp-dms-_2014678-v6-ifu__hls_set_advanced__g-660__us-102001-en.pdf" },
  S3: { title: "LivaNova — EOS ECMO product/material information", url: "https://www.livanova.com/cardiopulmonary/en-gb/oxygenators/eos-ecmo" },
  S4: { title: "BOC — Medical oxygen integral-valve cylinder leaflet", url: "https://www.boconline.co.uk/en/images/Medical-Oxygen-Integral-Valve-Cylinders-leaflet_tcm410-671502.pdf" },
  S5: { title: "ELSO — Early rehabilitation/mobilisation guideline, 2025", url: "https://pubmed.ncbi.nlm.nih.gov/39883803/" },
  S6: { title: "Alfred — Mobilisation and physiotherapy", url: "https://ecmo.icu/daily-care-organ-support-in-ecmo-mobilisation-physiotherapy/" },
  S7: { title: "Alfred — Circuit components", url: "https://ecmo.icu/safety-essentials-circuit-components/" },
  S8: { title: "Alfred — Patient and ECMO monitoring", url: "https://ecmo.icu/daily-care-nursing-routine-patient-and-ecmo-monitoring/" },
  S9: { title: "Alfred — Console, heater and blender", url: "https://ecmo.icu/daily-care-nursing-routine-ecmo-console-heater-blender/" },
};
