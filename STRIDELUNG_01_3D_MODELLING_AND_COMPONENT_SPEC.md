# StrideLung 01 — Compact trolley architecture and 3D modelling brief

**Revision:** Concept v0.1 · 21 November 2026  
**Deliverable:** Directions for a modeller/developer; no 3D model has been created by this document.  
**Companion:** [System explanation and pitch preparation](STRIDELUNG_02_SYSTEM_EXPLANATION_AND_PITCH_GUIDE.md).

## 1. Design decision: trolley first

Create a rigid medical equipment case that resembles an upright trolley bag, with four braked wheels, a retractable push handle, an inspection window and separate service compartments. The baseline concept places **all proposed ECMO-core/support modules on the trolley**. It does not place the blood-processing unit on the patient.

This is a change from the earlier body-worn-core idea. Keep that earlier idea as a future variant; do not combine its weight or layout with this version. The trolley is moved upright by staff. The luggage-like shape is an industrial-design reference, not permission to tilt or drag a connected life-support circuit like a suitcase.

Primary purpose: explain how gas exchange, blood pumping, power, heat management and monitoring could be consolidated for supervised hospital mobility. The reference clinical configuration is VV ECMO; the native heart remains responsible for systemic pumping. Patient monitoring, clinical staffing and any ventilator remain external dependencies.

## How to read the specifications

- **R — Referenced:** a fact about an identified existing product or clinical practice, with a source.
- **P — Proposed:** a design decision or numerical allocation for this concept.
- **U — Unverified:** not selected, measured, or substantiated yet.

**All dimensions, coordinates, quantities, and mass allocations in the component register are P unless explicitly identified as R in the separate reference table.** They are exact inputs for a consistent 3D model, not measured medical-device specifications. Exact materials inside purchased blood-contacting, gas-pressure, sensor and electrical assemblies remain U where noted. A material name does not establish biocompatibility, oxygen compatibility, sterilisation compatibility or regulatory approval.

The present deliverable is a **3D explanation/packaging concept and a non-clinical demonstration plan**. It is not a fabrication drawing for an oxygenator, pump, pressure vessel, cannula or life-support controller.

## 2. Plan for making it compact

| Order | Packaging decision | Why it helps | Evidence needed before hardware claims |
| --- | --- | --- | --- |
| 1 | Select a compatible clinical pump/oxygenator family before freezing a real enclosure | Avoids designing a shell around imaginary parts | Supplier CAD, weight, approved accessory interfaces and operating clearances |
| 2 | Group the pump head, oxygenator, thermal interface and nearby sensing into one accessible core bay | Reduces scattered mounts and crossing routes | Compatible assembly, access and performance review |
| 3 | Put gas storage vertically on the left and battery/thermal support low in the case | Uses height and limits bulky equipment at the top | Loaded stability and impact/retention tests |
| 4 | Use one display and a shared dry electronics zone | Avoids duplicated housings in the concept | Full control, alarm and independence requirements |
| 5 | Use defined routing channels and a supported patient-line exit | Makes the layout understandable and inspectable | Acceptable line loads, bend behaviour and clinical usability |
| 6 | Use removable service doors rather than opening the whole enclosure | Separates routine access from internal equipment | Cleaning, liquid ingress, oxygen/thermal separation and service review |
| 7 | Keep supplier-qualified blood/gas assemblies intact | Avoids pretending smaller geometry proves a new device | Product compatibility and verification |
| 8 | Iterate enclosure size when selected parts do not fit | Preserves the actual functional requirements | Updated fit, mass, runtime and access budgets |

**Do not scale a commercial console down in the renderer and call it a real miniaturised console.** The small C07/C18/C19 modules below represent a future custom subsystem allocation. A complete reference console may require a larger case. The concept must pass that feasibility gate before a functional compactness claim is made.

## 3. Existing reference facts versus our design

| Verified reference fact | What it supports | What it does not establish |
| --- | --- | --- |
| Getinge lists one Cardiohelp console at 255 W × 315 H × 427 D mm and approximately 12 kg [S1] | Existing portable equipment has a substantial envelope | That the proposed smaller drive/electronics fit or perform equivalently |
| HLS documentation shows integrated oxygenator, heat exchanger and centrifugal pump functions [S2] | Functional integration already exists | That our custom cartridge geometry is validated |
| LivaNova EOS lists PMP membrane material and a stainless-steel heat exchanger [S3] | These are real material examples | A universal housing resin, steel grade, or a selected supplier for our concept |
| BOC lists a CD reference cylinder with 460 L nominal contents, 2 L water capacity and 3.5 kg nominal weight [S4] | Gas storage is a meaningful mass/space dependency | The duration or exact external dimensions of our CAD cylinder |
| ECMO mobilisation is addressed in ELSO guidance and existing clinical practice [S5, S6] | The clinical workflow already exists | That this case makes a patient eligible to mobilise |

There is no measured incumbent trolley in this project. Do not claim a percentage size, weight, cost or staffing reduction. Use the source products as reality checks, not as interchangeable components of a qualified new assembly.

## 4. Overall CAD specification

| Parameter | P: model input |
| --- | --- |
| Body width × depth × height | 460 × 330 × 700 mm |
| Body bottom/top relative to floor | z = 90 / 790 mm |
| Overall stowed rolling envelope | 460 × 330 × 790 mm, including wheels; exclude patient tubing |
| Deployed handle top | z = 1050 mm |
| Deployed stabiliser support envelope | 620 × 480 mm, excluding patient tubing |
| Gross body bounding-box volume | 106.26 L; not usable internal volume |
| Functional placement envelope | x = −210…210, y = −145…145, z = 110…770 mm; local frame/rails still require collision review |
| Shell visual thickness / corner radius | 3 mm / 25 mm; rendering inputs, not structural validation |
| Nominal battery-energy scenario | 200 Wh; unselected pack and unvalidated capacity |
| Loaded mass planning ceiling | 28 kg including a 20% allowance; not a tested lifting/load rating |
| Primary operating depiction | Upright, staff supervised, connected to a mannequin |

The gas cylinder and thermal equipment remain in the baseline. No oxygen concentrator, ventilator, dialysis machine or patient-worn pump is silently included. An external hospital blended-gas supply can be shown as an alternative connection; it is not an onboard air cylinder.

## 5. Component/material/shape/size/mass register

Mass is **row total**, not mass per item. The three sensor pods together weigh the allocated 0.12 kg; the four casters together weigh the allocated 1.00 kg. Outer envelopes include notional housings unless stated. Child graphics inside C05 do not add another cartridge mass.

| ID | Component | Shape | CAD envelope W × D × H, mm, unless stated | Mass allocation, kg | Material specification status | Position/function |
| --- | --- | --- | --- | ---: | --- | --- |
| C01 | Rigid outer case; inspection window; service doors | Rounded upright case | 460 × 330 × 700 | 2.00 | PC/ABS shell candidate; clear polycarbonate window; grade/cleaning compatibility unverified | External skin and front/side access |
| C02 | Internal chassis and module shelves | Open rail frame | 400 × 270 × 640 | 1.80 | 6061-T6 aluminium candidate; stainless fasteners | Structural frame inside case |
| C03 | Four braked caster assemblies | Wheel + fork, each | 75 × 60 × 90 each | 1.00 | Polyurethane tread, polymer hub, metal fork; candidates | Four corners under base |
| C04 | Retractable push handle and lift grips | Twin rails + crossbar | 300 × 45 × 350 deployed | 0.55 | Aluminium rails, TPE grip; candidates | Rear channels; deployed top at 1050 mm |
| C05 | Membrane oxygenator with integrated heat exchanger | Rounded cartridge | 180 × 100 × 160 | 1.10 | PMP fibres and stainless heat-exchange material are reference examples; housing grade TBD | Upper inspection bay |
| C06 | Disposable blood pump head | Circular chamber | 70 × 50 × 70 | 0.18 | Blood-contact polymer/impeller materials TBD; transparent shader is visual only | Behind/below oxygenator |
| C07 | Reusable motor and pump drive | Rounded motor block | 90 × 60 × 85 | 0.80 | Aluminium housing/copper winding candidates; magnetic and internal materials TBD | Coupled behind pump head |
| C08 | Core module carrier / reusable sensor interface | Small bridge block | 60 × 40 × 35 | 0.20 | Aluminium carrier/polymer electronics cover candidates | Upper bay, beside cartridge |
| C09 | Three pressure/temperature sensor pods | Three small blocks | 35 × 25 × 25 each | 0.12 | Dry housings: polymer candidate; blood-interface materials TBD | At labelled circuit measurement locations |
| C10 | Flow and bubble sensor assembly | Clip around a line | 65 × 50 × 35 | 0.22 | Polymer clip, sensor elements and cable; detailed specification TBD | Accessible return-line segment |
| C11 | Medical oxygen cylinder with integral valve | Cylinder with shoulder and protected valve | 110 × 110 × 540 | 3.50 | Approved supplier cylinder material TBD; composite-look CAD surface only | Left rear, upright |
| C12 | Cylinder restraint and isolated bay hardware | Two cradles + straps | 120 × 140 × 560 | 0.45 | Aluminium cradle, replaceable TPE pads, strap material TBD | Around C11; structural overlap intentional |
| C13 | Gas flow/control and external-gas interface block | Manifold enclosure | 80 × 90 × 150 | 0.50 | Supplier-qualified oxygen-compatible materials TBD; no DIY manifold | Left front service area |
| C14 | Gas tubing and outlet guards | Flexible routed lines | 6 mm visual OD; 1.6 m model path total | 0.10 | Oxygen-compatible supplier tubing TBD; flexible polymer visual | Gas bay to membrane gas ports |
| C15 | Thermal control module, dry | Rounded service block | 240 × 180 × 160 | 2.40 | Aluminium enclosure candidate; fluid-path components/materials TBD | Lower centre/right, separated from battery |
| C16 | Thermal water hoses | Paired flexible lines | 10 mm visual OD; 1.6 m model path total | 0.15 | Supplier-qualified flexible hose TBD | Thermal module to heat exchanger |
| C17 | Battery assembly including case/BMS | Low rectangular cassette | 220 × 80 × 70 | 1.80 | LiFePO4 cell chemistry candidate; aluminium case, insulating polymer | Low front battery bay |
| C18 | Power conversion, charging and isolation assembly | Low rectangular block | 180 × 80 × 45 | 0.65 | Electronics assembly in insulated/metal enclosure; materials TBD | Low central dry compartment |
| C19 | Compute, sensor acquisition and I/O assembly | Flat electronics box | 230 × 50 × 60 | 0.50 | PCB assembly, shielded aluminium enclosure candidates | Dry front compartment, below core |
| C20 | Touchscreen/operator display | Recessed rectangular panel | 190 × 18 × 90 | 0.40 | Glass screen/polymer bezel candidates | Upper front, flush with case |
| C21 | Audible/visual alarm assembly | Small indicator block | 70 × 40 × 25 | 0.10 | LED diffuser, polymer housing, buzzer elements; candidates | Upper front left |
| C22 | Patient-line support/interface panel | Recessed side panel | 20 × 120 × 70 | 0.35 | Aluminium bracket and TPE supports candidates; blood connectors TBD | Upper right side |
| C23 | External blood-line pair and visual patient interface | Two flexible curves + mannequin connector | 13 mm visual OD; 1.5 m per line | 0.35 | Medical blood-tubing material/coating and cannula model TBD | Visible route between core and mannequin |
| C24 | Compatible backup/service-kit allowance | Service pouch/drawer proxy | 140 × 60 × 70 | 0.80 | Polymer case with supplier-compatible contents TBD | Front of lower thermal bay |
| C25 | Illustrative fluid mass allowance | Metadata, not a fabricated part | 0.60 kg thermal + 0.45 kg circuit allowance | 1.05 | Water-equivalent mass for planning only; not a clinical prime prescription | Allocated to thermal unit and circuit |
| C26 | Cables, vents, partitions and small mounting hardware | Distributed accessories | Allocated within routing/service clearances | 0.60 | Copper cables, insulation, aluminium/polymer partitions; candidates | Distributed; do not model as a new solid box |
| C27 | Deployable stabiliser pair | Fold-out arms/feet | 620 × 480 mm deployed support envelope | 0.65 | Aluminium arms, elastomer feet; candidates | Base; deployed view only |

### Mass accounting

- Sum of all 27 row allocations: **22.32 kg**.
- Twenty-percent planning contingency: **4.464 kg**.
- Subtotal plus contingency: **26.784 kg**, displayed as **26.78 kg**.
- Remaining space under the 28 kg planning ceiling: **1.216 kg**.

This total already includes the integral cylinder valve in C11, the battery case/BMS in C17, and the illustrative fluid allowance in C25. Do not add those again. Cylinder nominal gas contents are not another 460 kg or another 460 L of case volume. The total excludes the patient, ventilator, separate patient monitor and clinical consumables not listed. Its apparent precision is accounting precision only; the input masses remain allocations.

## 6. Coordinate system and internal arrangement

Use **millimetres** in the design document. Use metres in Blender/glTF: 1000 mm = 1 m. Use x left/right, y front/back, z upward. The origin is the centre of the floor footprint. Negative y is the viewing/front side.

The table below gives component centre points and nominal occupied boxes. It is a visual placement plan, not a validated service-clearance drawing.

| ID | Centre x, y, z in mm | Placement note |
| --- | --- | --- |
| C01 | 0, 0, 440 | Body from z90 to z790 |
| C02 | 0, 0, 440 | Rail structure, not a solid 400 × 270 × 640 block |
| C03 | ±190, ±115, 45 | Four caster bounding boxes; total height 90 |
| C04 | 0, 130, 875 deployed | Overall deployed top 1050; rear rail routing separately modelled |
| C05 | 65, −40, 590 | Membrane cartridge; front inspection access |
| C06 | 50, 55, 540 | Pump-head axis along y |
| C07 | 50, 110, 540 | Drive starts at y80; touches pump-head coupling plane |
| C08 | 165, 65, 620 | Dry carrier/sensor bridge beside core |
| C09 | At three labelled pressure/temperature sites | Use small clips/pods; do not invent invasive port construction |
| C10 | 170, −35, 710 | Return line accessible to inspection |
| C11 | −145, 70, 430 | Upright cylinder, z160…700 |
| C12 | −145, 70, 430 | Open restraint around cylinder; overlaps intentionally |
| C13 | −145, −80, 550 | Gas controls in front of cylinder bay |
| C15 | 70, 45, 290 | Lower thermal unit |
| C17 | 70, −90, 160 | Low battery cassette |
| C18 | 70, 10, 155 | Dry power assembly behind battery |
| C19 | 65, −110, 410 | Above thermal service level, below core |
| C20 | 70, −156, 725 | Front face flush at y−165 |
| C21 | −145, −115, 745 | Upper left alarm indicator |
| C22 | 220, 0, 700 | Recessed right-side panel, outer surface x230 |
| C24 | 60, −110, 300 | Front service-kit space, clear of thermal block |
| C27 | Base deployment only | Feet extend to the support envelope |

C14/C16/C23 are curves, C25 is mass metadata, C26 is distributed hardware. Do not stack additional solid proxy boxes for these rows.

**Reserved zones:** the cylinder bay is on the left rear; gas controls are on the left front; the inspection core is upper centre/right; the thermal module is lower centre/right; the battery and power equipment are lowest; the display is on the upper front. Keep partitions visible in cutaway mode. Gas-bay ventilation and oxygenator exhaust must not be depicted as discharging into the battery compartment. Actual ventilation/separation design remains U.

## 7. Directions for modelling each assembly

### 7.1 Case, chassis, wheels, handle and stabilisers: C01–C04, C27

1. Model C01 as a rounded hollow upright shell, not a solid suitcase. Split it into fixed rear shell, front inspection/service door, left gas hatch and lower dry-service hatch. Keep the initial front door within the stated external envelope.
2. Add a clear window around the core inspection area; model a rim and latch as nonfunctional visual parts. Window location must let viewers see the cartridge and its line connections.
3. Model C02 using rails and shelves. A carrier supporting C05–C08 is part of the reusable chassis; it is not a sterile component.
4. Add four caster assemblies at the listed centres. Show brakes visually; do not claim floor stability from brake appearance.
5. Animate handle extension along the rear channels. Add lift grips for an unconnected mock-up view, without implying one-handed lifting of the loaded system.
6. Animate C27 only in a separate parked/deployed view. Show the larger footprint and do not conceal it when quoting external size.

### 7.2 Membrane/pump core: C05–C08

1. C05: create the rounded cartridge envelope. Add labelled blood inlet/outlet, gas inlet/outlet and thermal interfaces as schematic stubs, not manufacturing connector drawings.
2. Inside a cutaway child group, draw representative fibre bundles. Use a few repeated hollow-fibre curves with a density impression; do not claim fibre count, wall thickness or performance from this visual.
3. Add a separate heat-exchanger sub-region. The proposed render may use a stainless-metal shader to explain its purpose; real material grade and internal geometry remain unselected.
4. C06: create a circular pump-head housing and a visibly schematic rotor. Keep the blood path independent from the motor and electrical wiring.
5. C07: create the reusable drive block behind C06. Rotate only the illustrative rotor during playback; the coupling is symbolic, not a validated mechanical design.
6. C08: add the reusable carrier/sensor interface beside the module. Group C05/C06 as disposable blood-path illustrations and C07/C08 as reusable hardware.
7. Treat the entire core as a **reserved envelope awaiting supplier fit and engineering validation**. Do not render a new membrane design as clinically proven.

### 7.3 Sensing and patient-line support: C09–C10, C22–C23

Create three labelled pressure locations: drainage/pre-pump, pre-oxygenator and post-oxygenator. Place temperature indicators at clearly named locations. Use C09’s three pods as symbolic housings; not every required measurement is necessarily combined inside one real sensor.

C10 is a clip-like line sensor; label its intended flow/bubble functions as proposed. C22 supports the visible line exit without appearing to pinch the tubes. C23 uses two smooth curves to a mannequin, with visible slack and no sharp kinks. Show a generic external cannula interface labelled “clinical cannula selection and placement not modelled.” The 13 mm visual outside diameter does not specify a clinical lumen or connector size.

### 7.4 Gas subsystem: C11–C14

Use a simple cylinder with rounded shoulders and a valve-protection outline. Keep the valve integral in C11’s accounting. Model C12 as open cradles and restraints, not a second solid cylinder.

C13 represents a supplier-selected gas-control/interface assembly. Show two mutually exclusive explanatory views: onboard cylinder gas supply, or external hospital blended gas. Do not suggest this baseline contains an onboard air supply or can set arbitrary gas oxygen fractions from a single oxygen bottle. Gas switching internals and compatibility are U; the model must not teach connection sequences.

Draw C14 to the oxygenator’s gas inlet and a separate outlet path. Gas never enters the patient blood line as injected bubbles. Do not model cylinder walls, pressure ratings or a fabricable regulator from these envelopes.

### 7.5 Thermal subsystem: C15–C16, part of C25

Draw C15 as a removable service block with an illustrative thermal-fluid reservoir region. Draw two C16 curves to C05’s heat-exchanger region. Clearly separate water, blood and gas paths. Use C25 to count 0.60 kg of thermal-fluid equivalent; do not add a second hidden reservoir mass. Thermal capacity, heat load and whether the proposed module can be this small are U.

### 7.6 Electrical and interface subsystem: C17–C21, C26

Create separate low-mounted battery, power and compute enclosures. C17 is one battery assembly, not a declared hot-swappable redundant system. Draw C18 isolation/charging as an abstract electrical block; do not produce a wiring schematic or claim compliance.

Use a recessed display with labelled tabs: system overview, component information, and illustrative signals. Route dry cables to sensors. C21 provides an indicator and audible-alarm animation. No “silence alarm” or “emergency stop” interaction should be presented as clinical operating instruction.

C26 includes vents, brackets, partitions and cables. Detailed airflow, heat rejection, liquid segregation, electrical insulation and oxygen-enrichment risks need separate engineering assessment.

### 7.7 Service and backup allowance: C24

Create an accessible kit proxy. State that contents depend on the chosen clinical system. Do not label the 0.80 kg allowance as a verified complete emergency kit, a spare full console, or guaranteed independent pump support.

## 8. Path overlays for the simulation

| Overlay | Route | Visual treatment |
| --- | --- | --- |
| Blood drainage | Mannequin → C23 → C06 → C05 | Dark red plus arrows and label |
| Blood return | C05 → C10/C22 → C23 → mannequin | Bright red plus arrows and label |
| Gas | C11 or external source → C13/C14 → C05 → gas outlet | Pale blue plus dashed arrows |
| Thermal water | C15 → C16 → C05 exchanger → C15 | Teal paired arrows |
| Electrical/data | C17/C18/C19 → drive, display and sensing | Amber fine lines, separate toggle |

The colours are instructional conventions, not evidence of measured oxygen saturation. Provide labels/patterns so the explanation does not rely on colour alone. Blood, gas and thermal flow must not visibly merge.

## 9. Interaction and animation requirements

- **Assembled view:** upright trolley, dimensions, total mass allocation and “concept” status.
- **Open-case view:** doors move away from the inspection bay; all parts remain anchored.
- **Exploded view:** move assemblies outward along predefined axes; leader lines retain ID and original position. Pausing/reset restores every transform.
- **Component selection:** show ID, purpose, material status, envelope, allocated mass and P/R/U label. The component register is the source of truth.
- **Subsystem filters:** isolate blood, gas, thermal, electrical and chassis layers.
- **Normal-flow animation:** arrows/particles explain routes; they are not simulated clinical blood cells.
- **Blocked-line illustration:** change synthetic flow/pressure traces without calculating or claiming a patient outcome. Show that multiple causes can produce similar observations.
- **Gas/power illustrations:** show dependencies and illustrative remaining-resource arithmetic, not “safe time left.”
- **Mobility view:** a staff-guided mannequin and upright trolley move together; visible slack is retained. No autonomous or unsupervised walking depiction.
- **Reset:** restore model, overlays and synthetic signals without reloading.

Only animate a physiological response if a separate documented model supports it. Do not infer patient oxygen saturation, survival, transplant eligibility or safe alarm limits from geometry.

## 10. Modelling pipeline and handoff

Use Blender for meshes/materials and optionally parametric CAD for the frame. Export glTF/GLB. A future web viewer can use Three.js or React Three Fiber, but this brief does not require creating a website now.

Recommended scene tree:

```text
StrideLung_Trolley_v01
├── Structure_C01_C04_C27
├── Disposable_BloodPath_C05_C06_C23
├── Reusable_Core_C07_C10
├── Gas_C11_C14
├── Thermal_C15_C16
├── Electrical_C17_C21
├── Interface_Service_C22_C24_C26
├── MassMetadata_C25
└── Overlays_Labels_Cameras
```

Name each selectable parent with its ID, for example `C05_Oxygenator_HX`. Decorative child geometry inherits its parent’s accounting; it does not create extra mass. Keep names/material metadata when exporting.

Use restrained opaque polymer and metal materials; transparency only for the inspection window or explanatory cutaways. A white/grey shell with one accent colour will keep attention on functional parts. These are rendering choices, not specified sterilisation or coating systems.

### Suggested work order

| Stage | Work | Reviewable output |
| --- | --- | --- |
| A | Freeze v0.1 envelope, exclusions and P/R/U status | Approved modelling brief; hardware feasibility still open |
| B | Build grey-box envelopes and routes | Fit-review scene before detailed art |
| C | Model named assemblies and cutaways | Explorable component model |
| D | Add labels, filters and deterministic animations | Complete explanatory interaction |
| E | Check dimensions, accounting and pitch claims | Reviewed scene and demonstration script |

## 11. Resource estimates: only illustrative arithmetic

Battery scenario: 200 Wh nominal energy × 0.80 usable/delivery factor ÷ 100 W assumed whole-system demand = **1.6 hours**. At 150 W it becomes approximately **1.07 hours**. These are examples, not runtime specifications; actual thermal duty, electronics, drive efficiency, reserve requirements and battery behaviour are U.

Gas scenario: assume **300 L usable gas** after all constraints, consumed at a **synthetic 5 L/min**. Arithmetic duration is **60 minutes**. This example is not a prescribed sweep setting or a duration claim for the BOC reference bottle. Its usable contents and delivery performance must come from the selected supplier/system.

The complete system’s independence is constrained by its most limiting required resource, not by the battery alone. Do not quote a two-hour system runtime based only on a battery calculation.

## 12. Acceptance checks

1. Overall stowed dimensions are 460 × 330 × 790 mm; handle/stabiliser extensions are separately visible.
2. All 27 IDs appear once in the component register. Repeated sensors/wheels and cutaway children do not inflate totals.
3. Major envelopes fit the nominated space without unintended intersections; frame, cables, vents, bend radii, service reach and tolerances still require full CAD review.
4. Membrane, blood, gas and water domains remain distinguishable.
5. Cylinder controls, display, line exit and inspection core are visible without dismantling unrelated assemblies.
6. Every dimension/mass/material tooltip carries its evidence status.
7. Synthetic traces and particles are labelled illustrative; no clinical performance or patient eligibility is inferred.
8. Replacement by supplier CAD forces a fit/mass recheck. Failure of fit means changing the case, not shrinking the imported part.
9. Scene reset, selected-part labels, keyboard-accessible component list and reduced-motion mode work.
10. Exported screenshots state “concept packaging — not a clinical device.”

## 13. Open engineering questions

Before presenting these as real specifications, obtain the selected component CAD and measured masses; confirm pump/membrane compatibility and clearance; establish thermal duty, gas consumption, electrical demand, oxygen-compatible compartment design, liquid/electrical separation, cleaning, loaded stability and line-force behaviour. Blood compatibility and performance require a separate specialist development programme. No actual medical manufacturing material grade has been selected by this document.

## Sources

Sources checked on 21 November 2026. Manufacturer examples describe particular products and markets; they are not procurement recommendations. Product compatibility, current safety notices, approval scope and instructions for use require supplier review before any hardware selection.

- **S1:** [Getinge — Cardiohelp system specifications](https://www.getinge.com/us/products/cardiohelp-system/).
- **S2:** [Getinge — HLS set instructions for use, US, January 2025](https://www.getinge.com/dam/hospital/documents/english/mcp-dms-_2014678-v6-ifu__hls_set_advanced__g-660__us-102001-en.pdf).
- **S3:** [LivaNova — EOS ECMO product/material information](https://www.livanova.com/cardiopulmonary/en-gb/oxygenators/eos-ecmo).
- **S4:** [BOC — Medical oxygen integral-valve cylinder leaflet](https://www.boconline.co.uk/en/images/Medical-Oxygen-Integral-Valve-Cylinders-leaflet_tcm410-671502.pdf). Reference values were available in the indexed supplier document; direct PDF retrieval returned an access error. Exact cylinder outline remains unverified.
- **S5:** [ELSO — Early rehabilitation/mobilisation guideline, published 2025](https://pubmed.ncbi.nlm.nih.gov/39883803/).
- **S6:** [Alfred — Mobilisation and physiotherapy](https://ecmo.icu/daily-care-organ-support-in-ecmo-mobilisation-physiotherapy/).
- **S7:** [Alfred — Circuit components](https://ecmo.icu/safety-essentials-circuit-components/).
- **S8:** [Alfred — Patient and ECMO monitoring](https://ecmo.icu/daily-care-nursing-routine-patient-and-ecmo-monitoring/).
- **S9:** [Alfred — Console, heater and blender](https://ecmo.icu/daily-care-nursing-routine-ecmo-console-heater-blender/).

**Internal baseline:** [How current ECMO works](../ECMO_ARTIFICIAL_LUNG_SYSTEM_EXPLAINED.md). This explains the conventional clinical system separately from the new packaging proposal.
