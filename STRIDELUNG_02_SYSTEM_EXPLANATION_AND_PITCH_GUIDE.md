# StrideLung 02 — System explanation and pitch preparation

**Revision:** Concept v0.1 · 21 November 2026  
**Purpose:** Understand the proposed system and explain it accurately.  
**Companion:** [3D modelling directions and component specification](STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md).

## 1. The idea in one paragraph

StrideLung is a proposed trolley-style packaging concept for a compact VV-ECMO support system. It brings the blood-processing core, gas supply, thermal support, power and circuit monitoring into an upright wheeled enclosure. The intended research focus is easier equipment handling and clearer line management during **supervised hospital mobility**. It is not yet a built or tested clinical device, and it does not make a patient eligible to walk without a clinical assessment.

This version puts the core on the trolley rather than on the patient. That is the current proposal; the earlier wearable-core version is a separate future option.

## How to read the specifications

- **R — Referenced:** a fact about an identified existing product or clinical practice, with a source.
- **P — Proposed:** a design decision or numerical allocation for this concept.
- **U — Unverified:** not selected, measured, or substantiated yet.

**All dimensions, coordinates, quantities, and mass allocations in the component register are P unless explicitly identified as R in the separate reference table.** They are exact inputs for a consistent 3D model, not measured medical-device specifications. Exact materials inside purchased blood-contacting, gas-pressure, sensor and electrical assemblies remain U where noted. A material name does not establish biocompatibility, oxygen compatibility, sterilisation compatibility or regulatory approval.

The present deliverable is a **3D explanation/packaging concept and a non-clinical demonstration plan**. It is not a fabrication drawing for an oxygenator, pump, pressure vessel, cannula or life-support controller.

## 2. The problem we are addressing

A blood-processing module is only part of an ECMO setup. Gas storage or hospital gas, electrical power, temperature control, sensor connections, external tubing and clinical observation must continue during movement. Our design question is whether arranging those dependencies in one inspectable trolley can improve the physical workflow.

Selected patients already mobilise on ECMO with trained teams. The proposal therefore concerns packaging, handling and line support; it should not be pitched as the invention of ambulatory ECMO. ELSO and established hospital guidance describe mobilisation as a clinical activity requiring assessment and coordination. [S5, S6]

## 3. What the machine does for the patient

In the reference VV configuration, blood is drained from a vein, moved through a pump and membrane oxygenator, and returned to venous circulation. The membrane adds oxygen and removes carbon dioxide. The patient’s native heart continues to pump to the body.

The oxygenator is the artificial lung. The trolley also contains the equipment needed to support that function. It does not cure lung disease, replace every function of the lungs, provide dialysis, or replace clinical staff. See the [current-system explanation](../ECMO_ARTIFICIAL_LUNG_SYSTEM_EXPLAINED.md) for the wider clinical background.

## 4. How we propose to make the package compact

The first strategy is **consolidation**, not assuming that the membrane or pump can simply be made smaller. We group related parts, remove duplicated outer housings where future engineering permits, use height for cylinder storage, place heavy support modules low, and create clear access routes.

There are two possible future hardware paths:

- **Packaging selected existing assemblies:** retain their actual dimensions, operating limits and accessories. The trolley may need to grow.
- **Developing a custom compact subsystem:** requires new engineering and verification. The small module envelopes in our model are allocations for this path, not established supplier products.

A 3D scene can demonstrate the organisation of a package. It cannot establish gas-transfer performance, blood compatibility, electrical safety or a real reduction in clinical workload.

## 5. Reference facts that keep the proposal grounded

| Verified reference fact | What it supports | What it does not establish |
| --- | --- | --- |
| Getinge lists one Cardiohelp console at 255 W × 315 H × 427 D mm and approximately 12 kg [S1] | Existing portable equipment has a substantial envelope | That the proposed smaller drive/electronics fit or perform equivalently |
| HLS documentation shows integrated oxygenator, heat exchanger and centrifugal pump functions [S2] | Functional integration already exists | That our custom cartridge geometry is validated |
| LivaNova EOS lists PMP membrane material and a stainless-steel heat exchanger [S3] | These are real material examples | A universal housing resin, steel grade, or a selected supplier for our concept |
| BOC lists a CD reference cylinder with 460 L nominal contents, 2 L water capacity and 3.5 kg nominal weight [S4] | Gas storage is a meaningful mass/space dependency | The duration or exact external dimensions of our CAD cylinder |
| ECMO mobilisation is addressed in ELSO guidance and existing clinical practice [S5, S6] | The clinical workflow already exists | That this case makes a patient eligible to mobilise |

Existing products and their regulatory labels differ by market. Referencing a product is not recommending it or claiming its approvals transfer to StrideLung. We have no measured standard trolley against which to calculate a percentage improvement.

## 6. Proposed external size and weight

| Item | Current concept value |
| --- | --- |
| Case body, W × D × H | 460 × 330 × 700 mm |
| Total stowed height on wheels | 790 mm |
| Total stowed rolling envelope | 460 × 330 × 790 mm; excludes tubing to the patient |
| Handle top when extended | 1050 mm above floor |
| Stabiliser support footprint when deployed | 620 × 480 mm |
| Gross body bounding-box volume | 106.26 L; not free packing space |
| Row-level mass budget | 22.32 kg |
| Contingency | 20%, or 4.464 kg |
| Planning mass including contingency | 26.784 kg, approximately 26.78 kg |
| Planning ceiling | 28 kg; not an achieved or tested rating |

These figures describe a rollable concept, not a lightweight backpack or an airline cabin bag. The loaded design is not intended to be carried by the patient. The 20% allowance accounts for uncertainty; it does not prove the missing engineering will fit within it.

## 7. Complete component specification for reading

The register is identical to the modelling document so the same ID always means the same part. Every mass below is the **total allocation for that row**, including all stated items. All dimensions and masses are proposed CAD values unless separately referenced. The thermal module mass is dry; fluid is counted in C25. The cylinder valve is already counted in C11; the battery case and BMS are already counted in C17.

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

## 8. How the subsystems work together

### 8.1 Structure and mobility: C01–C04, C12, C22, C27

The shell gives the equipment one defined external shape. The internal aluminium-frame candidate supports the modules; the shell alone is not assumed to carry every load. The caster brakes and stabilisers are proposed handling features, not evidence that the system cannot tip.

The inspection window gives the team visual access to the core. Dedicated hatches separate cylinder and dry-electronics service areas. Tubing supports carry external line weight and preserve a visible route. Their effectiveness must be measured; a curved plastic support in a render is not a validated strain-relief system.

The handle is a staff push/positioning interface. Movement while connected is depicted upright. The case is not tipped onto two wheels like ordinary luggage.

### 8.2 Blood processing: C05–C08, C23

The pump head moves blood through the membrane lung. The reusable motor supplies energy to the disposable blood-contacting head. Separating those functions explains why an assembly can contain both reusable and single-use elements.

Inside the oxygenator, a membrane separates gas from blood. Our rendering uses representative hollow fibres. PMP is an example of an actual membrane material; it is not enough to specify fibre material alone and claim an effective new oxygenator. Surface area, flow distribution, pressure loss, blood compatibility and manufacturing consistency matter.

C05 includes the heat-exchanger region. These two functions can be integrated in a product while keeping the gas, blood and water paths separate. C23 connects the circuit to the mannequin in the demonstration. The clinical cannula, its placement and actual blood-line specification have not been selected. [S2, S3, S7]

### 8.3 Gas supply: C11–C14

The cylinder supplies oxygen-containing gas to the membrane system through a qualified flow/control path. The model also offers an alternative external hospital-gas connection. A single oxygen bottle does not supply both oxygen and medical air, so an arbitrary oxygen/air blending capability is not claimed onboard.

Gas passes through the oxygenator and leaves through a separate outlet, carrying removed carbon dioxide. The gas is not injected as bubbles into the patient’s blood. The cylinder must remain accessible, retained and separated appropriately from other equipment; exact compartment engineering is still open.

The reference bottle’s nominal 460 L gas contents describe an expanded gas quantity, not its external physical volume. Its supplier nominal weight is 3.5 kg. Our CAD envelope is independently proposed, not a verified scan of that bottle. [S4]

### 8.4 Temperature management: C05, C15–C16, C25

The thermal unit exchanges heat with the blood through the cartridge’s heat exchanger. Thermal water follows a separate path and does not mix with blood. The proposed 2.40 kg dry unit and 0.60 kg thermal-fluid allowance reserve space and mass; neither establishes sufficient heating/cooling capacity.

An excessively optimistic thermal assumption can undermine an otherwise attractive compact design. The final power budget must include the thermal duty rather than treat the pump as the only energy consumer. [S9]

### 8.5 Power, electronics and display: C17–C21, C26

The proposed battery, power assembly and electronics supply the drive, collect circuit readings and present information. LiFePO4 is a candidate chemistry, not a selected medical battery system. The 200 Wh scenario is an energy assumption; no actual pack has been chosen or tested.

The display explains flow, pressure, gas and power dependencies. It does not turn synthetic readings into patient observations. C21 represents alarm indicators. Alarm behaviour and independent protective functions would require specialist requirements and verification, not just a working interface.

### 8.6 Circuit monitoring: C08–C10

Flow and pump speed are different quantities. Pressure measurements at known circuit locations add context to changes in flow. A pressure difference across the membrane depends on flow as well as resistance. A single abnormal-looking reading does not uniquely identify a fault.

Our proposed sensor representations demonstrate where information could come from. Sensor selection, calibration, accuracy, response time and blood-interface details remain unverified. Separate bedside patient monitoring is not eliminated by adding a screen to the trolley. [S8]

### 8.7 Backup and service equipment: C24

The kit space is an allowance for compatible emergency/service items once a real platform is selected. It is not proof that every required backup item fits or that the trolley has a redundant complete ECMO system.

## 9. Materials: what we know and what remains a proposal

| Material/category | Proposed role | What we can honestly say |
| --- | --- | --- |
| PC/ABS | External shell | Candidate balance of manufacturability and enclosure form; exact grade, cleaning and fire behaviour unverified |
| Clear polycarbonate | Inspection window | Candidate transparent panel; the window is not a blood-contact component |
| 6061-T6 aluminium | Frame, brackets, rails | Candidate structural material; section sizes, joints, fatigue and corrosion treatment unverified |
| Polyurethane/TPE/elastomer | Wheels, grips, pads | Candidates for floor contact and handling surfaces; grades unselected |
| PMP | Membrane illustration | Used in referenced oxygenator technology; membrane design is not established by material name |
| Stainless steel | Heat-exchanger illustration | Reference material example; no universal grade or geometry claimed |
| Blood-contact polymers/coatings | Pump, tubing and connectors | Supplier-specific; unknown in this concept until a compatible clinical set is selected |
| Oxygen-compatible gas-path materials | Gas control and tubing | Must be supplier qualified; no proposed consumer material substitution |
| LiFePO4 | Battery chemistry | Candidate only; package, energy delivery and protective functions require development |
| PCB/copper/insulation | Electrical assemblies | Generic categories, not a complete electrical specification |

A mesh can be transparent to make the explanation visible even when the real part’s housing material is unknown. Therefore **a shader is not a material certificate**. Likewise, a 3D-printed visual demonstrator can use inert display materials without implying those materials belong in a clinical blood or gas path.

## 10. What the 3D demonstration should teach

A viewer should first see a closed upright trolley, then open the inspection view and select any component. Each selection reveals its purpose, candidate material, proposed size, allocated mass and uncertainty status.

Subsystem overlays then show blood, gas, thermal and electrical routes. An exploded view helps explain serviceability without pretending the device operates with its circuit disconnected. A mobility view shows a mannequin and staff-guided trolley moving together.

The key learning is that compact ECMO is a **whole-system packaging challenge**. A small oxygenator does not make gas, power, heat management, securement or clinical support disappear.

## 11. How long could it run away from bedside services?

We cannot claim a real duration yet. Both electrical and gas demands constrain independence.

The modelling example assumes 200 Wh nominal battery energy, a 0.80 usable/delivery factor and a 100 W whole-system demand. That arithmetic gives 1.6 hours. At 150 W, it gives approximately 1.07 hours. Those are hypothetical loads and an unselected battery, not measured results.

A separate synthetic gas example assumes 300 L usable gas and consumption of 5 L/min, giving 60 minutes. It is not a clinical sweep prescription and is not the promised duration of the reference cylinder.

A complete runtime claim would require the selected hardware, actual duty cycles, gas-delivery constraints and reserves. The limiting required resource matters even if another subsystem could continue longer. Do not pitch the battery arithmetic alone as the system’s operating duration.

## 12. What we can demonstrate and measure first

Start with a 3D packaging explanation and a weighted inert mock-up. A mannequin and closed water loop can compare two line-support/layout variants under the same repeatable movements.

Possible engineering measurements include assembled envelope, mock-up mass, connector force, flow change during movement, pressure drop in the water loop, access visibility and time to identify a component. Define the movement sequence and baseline before comparing results.

These checks can support a claim about the tested mock-up. They cannot establish oxygen transfer in blood, haemolysis, clotting, clinical reliability, safe mobilisation, fewer staff or improved transplantation outcomes.

## 13. Evidence needed to progress beyond a concept

1. **Selected parts:** actual supplier CAD, mass, instructions, accessory requirements and compatibility.
2. **Packaging proof:** full fit, tolerances, tubing bends, visibility, access, cleanability and serviceability.
3. **Mechanical proof:** loaded stability, retention, handling and measured line-force behaviour.
4. **Resource proof:** complete gas, thermal and electrical demand under defined conditions.
5. **Device development:** blood compatibility, performance, sensing, alarms and other specialist verification appropriate to the eventual intended use.
6. **Clinical pathway:** expert collaboration, relevant approvals and properly designed evaluation before patient use.

The proposed case can change when these checks reveal a problem. Freezing a beautiful silhouette is less useful than preserving the actual system requirements.

## 14. Pitch wording

### One sentence

“StrideLung is a trolley-style ECMO packaging concept that brings the blood-processing core and its support equipment into one inspectable layout for research into easier supervised hospital mobility.”

### Approximately 60 seconds

“ECMO supports patients by processing blood outside the body, but moving with it involves much more than an oxygenator. Gas, power, temperature control, monitoring and external tubing all have to be managed together.

StrideLung explores a compact trolley arrangement for those dependencies. Our proposed case keeps the core visible, places heavier equipment lower down and provides a defined route for supported patient lines.

We are starting with a 3D explanatory model and a non-clinical mock-up. We will compare layouts using measured connector forces, water-loop flow behaviour and access visibility.

The dimensions and weight are current design allocations, not a finished medical-device specification. Our research question is whether a better equipment layout improves the tested handling workflow while preserving the requirements of the actual support system.”

### Claims to avoid

| Avoid saying | Say instead |
| --- | --- |
| “We built a new artificial lung.” | “We have specified a packaging concept and a 3D/non-clinical demonstration.” |
| “It weighs 22.32 kg.” | “The current row-level mass allocation totals 22.32 kg; the contingency planning total is about 26.78 kg.” |
| “It runs for 90 minutes / two hours.” | “Runtime is unverified; our document contains explicit illustrative calculations.” |
| “It is smaller than existing ECMO by X%.” | “We have not measured a comparable complete incumbent setup.” |
| “The patient can walk independently.” | “The intended context is clinically selected, staff-supervised hospital mobility.” |
| “These materials are medically approved.” | “Some are reference materials; most grades and assemblies remain unselected.” |
| “All equipment is inside the bag.” | “Listed support modules are modelled onboard; patient monitoring, staff and any ventilator remain external.” |

## 15. Questions judges may ask

**Is portable ECMO already available?** Yes. Our proposed contribution is the package/workflow and its measured handling behaviour, not portability as a new category.

**Why a trolley rather than a backpack?** This version keeps equipment mass off the patient and provides a defined equipment support footprint. Whether this arrangement is better still needs testing.

**Does the CAD prove everything fits?** It proves only that proposed envelopes can be arranged. Real supplier parts, connectors, tubing, access and clearances can change the result.

**Are the tiny pump and controller already available?** No specific compatible subsystem has been selected to meet those proposed envelopes. That is a major feasibility question.

**What is novel about the membrane?** No new validated membrane design is claimed in this version.

**Could the oxygenator or case fail during movement?** Patient-connected reliability has not been demonstrated. Our first tests are confined to inert mock-ups and a non-clinical loop.

**What is the next defensible milestone?** Complete the 3D explanation, obtain component information, build a weighted mock-up, and compare two documented handling layouts using repeatable measurements.

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
