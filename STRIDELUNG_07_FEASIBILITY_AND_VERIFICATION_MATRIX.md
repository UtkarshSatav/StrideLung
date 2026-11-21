# StrideLung — feasibility and verification matrix

**Purpose:** Turn the current compact ECMO trolley concept into a traceable set of questions, evidence gates, and component-by-component feasibility checks.

**Status:** Early feasibility plan. This document does not establish that StrideLung is a working ECMO device. The dimensions and masses in the earlier CAD specification are placeholders until compatible supplier components and measured packaging data replace them.

**Scope:** Baseline trolley C01–C27; optional StrideGuard monitor SG01–SG17; experimental dual-oxygenator variant PX01–PX06. These are separate scopes and must not be combined into one claimed working system without separate evidence.

## 1. Current feasibility verdict

**The product has not yet been shown to fit or perform in its proposed size.** The current 460 × 330 × 700 mm case, 22.32 kg row-level mass allocation and 28 kg planning ceiling are CAD assumptions. The proposed pump-drive envelope (C07: 90 × 60 × 85 mm, 0.80 kg allocation) is not tied to a selected, compatible ECMO pump. That is the largest open feasibility issue.

A compact pump is acceptable only if the **selected complete pump system** has supplier-supported performance and the required use approvals for the intended application. A smaller motor, a working hobby pump, or a pump that moves water at one point does not prove it can replace a clinical blood pump. Pump flow depends on the pump and the resistance/pressure conditions of the complete circuit; oxygenator, cannulae, tubing and patient-side conditions matter together. [ELSO circuit guideline](https://pubmed.ncbi.nlm.nih.gov/35089258/) · [ELSO adult VV ECMO guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC8315725/)

**Do not make the case smaller by shrinking life-support components in CAD.** Select compatible, qualified components first, import their exact supplier CAD and service clearances, then package them. If they do not fit, the current envelope fails and must change. A case that fits the concept boxes but not the real components is not feasible.

## 2. What “prove feasibility” means

Use four separate claims. Evidence for one does not prove the next.

| Claim | What it means | Minimum evidence |
| --- | --- | --- |
| A. Geometric packaging | Actual selected components can physically occupy the trolley, including connections, doors, cable routes, gas cylinder, service access and clearances. | Supplier CAD and measured parts; checked assembly CAD; tolerance/clearance review; weighed mock-up. |
| B. Component performance | Each selected pump, oxygenator, heater, power system, sensor and gas component meets its own applicable requirements. | Manufacturer data and instructions; compatibility evidence; qualified component test reports. |
| C. Integrated system performance | The chosen parts work together across the defined operating envelope without unacceptable degradation or unsafe interactions. | System requirements, risk analysis, verified bench tests, electrical/thermal/gas/power integration evidence, alarm and fault tests. |
| D. Intended-use validation | The final device supports intended users and clinical workflow safely and effectively. | Formal usability, regulatory, clinical and manufacturing validation by qualified teams. A hackathon prototype cannot establish this. |

The FDA distinguishes design **verification** (outputs meet requirements) from design **validation** (the finished device meets user needs and intended use). Apply the same traceability principle here: every important claim needs a measurable requirement, an evidence method, an owner and a recorded result. [FDA design verification/validation guidance](https://www.fda.gov/media/90612/download?attachment=)

### Status key used below

- **RED — unproven / blocks product feasibility:** no selected compatible component, no adequate evidence, or a critical fit/performance assumption remains.
- **AMBER — concept defined, evidence pending:** visual package or proposed requirement exists; supplier data or test evidence is still needed.
- **GREEN — evidence accepted for that gate only:** objective evidence has been reviewed against an approved requirement. Green for packaging does not mean clinically safe or cleared.
- **N/A — concept-only / optional:** not part of the current baseline or not included in the hackathon build.

All rows are currently **RED or AMBER**. No component or subsystem has a GREEN feasibility result yet.

## 3. Gate plan: from small CAD to credible feasibility evidence

| Gate | What the team does | Evidence to save | Pass condition | What a pass does not prove |
| --- | --- | --- | --- | --- |
| G0 — Define intended concept | Decide patient population/use context for study, VV or VA reference, who operates it, supervised mobility context, external dependencies, and comparison platform. Clinical advisers define requirements. | Approved use statement; requirement register; named reference system and region/configuration. | The team can state exactly what use case it is evaluating and what is outside scope. | Device safety, performance or regulatory acceptability. |
| G1 — Select the real component family | Obtain supplier part/model, exact weight/envelope, interfaces, approved accessories, operating limitations, service access, use limits and documentation. Prioritize pump/drive, oxygenator/set, heater, gas interface and power. | Dated datasheets/IFUs; supplier CAD; written compatibility confirmation; quote/configuration record. | Every life-support function has an identified compatible source or is explicitly marked as unresolved. | That the pieces work together in this new package. |
| G2 — CAD pack-out | Replace every proxy block with supplier CAD; include connectors, cable bends, ventilation, doors, access, removal and actual gas cylinder. Calculate mass from selected data, not allocations. | Versioned CAD, interference report, parts list, mass/balance worksheet and clearance review. | No unreviewed intersections; access and service paths exist; loaded size/weight/stability budget is plausible. If not, enlarge/rework. | Structural strength, performance, runtime or patient safety. |
| G3 — Inert physical mock-up | Build weighted non-clinical replicas; check handling, wheel/handle behavior, access, visibility, packaging and line-support layout with dummy tubing. | Photos/video; measured dimensions/mass; repeatable handling checklist and results. | The mock-up matches the measured CAD envelope and reveals packaging/workflow problems. | Pump adequacy, blood compatibility, gas exchange, alarms or clinical mobility safety. |
| G4 — Non-clinical subsystem bench evidence | Only under an appropriate engineering plan, test non-patient-connected components and interfaces. A water loop or simulated inputs can illustrate basic behavior. Clinical modules remain supplier-qualified; do not improvise a blood path. | Calibrated equipment records; test procedure approved by qualified engineers; raw results; deviations and review. | Results satisfy pre-written engineering requirements for that bench setup. | Blood damage/hemolysis, clotting, oxygen transfer, clinical reliability or device approval. |
| G5 — Integrated verification | Qualified medical-device team verifies performance, electrical safety, gas/power/thermal operation, alarms, failure cases, software, usability and risk controls for the selected final configuration. | Design traceability matrix, hazard file, test protocols/reports, software/human-factors records and change history. | All approved requirements are verified with no unresolved unacceptable risks. | Clinical benefit or safe use in intended patients. |
| G6 — Validation and authorization | Complete required quality-system, regulatory, usability, manufacturing and clinical-evaluation work for the jurisdiction and intended use. | Regulatory/quality records, validation reports, approvals/authorizations and manufacturing controls. | Responsible regulatory and clinical authorities accept the evidence for the claimed use. | Anything outside the approved indication/configuration. |

Risk management should span design and the device lifecycle; ISO 14971 describes that process for medical devices, including software. Applicable electrical and alarm standards depend on the final device classification, market and architecture. [ISO 14971 overview](https://www.iso.org/standard/72704.html) · [IEC 60601-1 overview](https://webstore.iec.ch/en/publication/67497)

## 4. Critical pump feasibility matrix — the compactness question

Do not compare pumps by dimensions, weight, RPM or nominal free-flow alone. Start from the reference system’s intended requirements and the target use case, then compare the **complete pump/circuit performance**.

| Pump question | Evidence required from selected supplier / engineering team | Safe early-stage evidence | Gate / present status |
| --- | --- | --- | --- |
| Exact device and intended use | Manufacturer, model, configuration, market/region approval, compatible disposable set and stated application. | Public product documents plus written supplier confirmation. | **RED:** no compact pump/drive selected. |
| Pressure–flow capability | Manufacturer pressure–flow curves and allowed operating envelope for the actual compatible pump head and circuit. Requirements must be set by ECMO specialists for the intended use; compare the whole curve, not a single point. | Review published data; do not invent a target from the illustrative CAD. | **RED:** no curve or clinical target requirement attached to C07. |
| Circuit compatibility | Compatibility with the specific oxygenator, tubing, connectors, sensor system, cannula family and configuration. | Supplier-confirmed combination and exact CAD/interfaces. | **RED:** current design combines generic, unselected parts. |
| Performance across conditions | Evidence that intended flow is maintained over the defined circuit resistance/preload/afterload conditions, within supplier limits. | Qualified nonclinical bench assessment using approved test methods; simulation may help explore but is not proof. | **RED:** no integrated circuit model or test results. |
| Blood-contact performance | Qualified blood-contacting materials and performance evidence, including blood damage/hemolysis and thrombosis-related evaluation appropriate to the design. | Cannot be proved with a water demo. Specialist laboratory and validated methods required. | **RED:** no selected pump head or blood path. |
| Control and monitoring | Supported flow/pressure/speed sensing, alarm behavior, accuracy/limits and communication interface. | Supplier documentation and interface review. | **RED:** C09/C10 are placeholders. |
| Power and heat | Power demand over defined use, peak/transient demand, heat output, backup behavior and battery compatibility. | Bench power/thermal characterization on selected equipment, done by qualified engineers. | **RED:** 200 Wh and small drive are unverified allocations. |
| Emergency operation and failure states | Approved backup/emergency-drive features, failure response, alarms and service workflow from the selected manufacturer. | Requirements mapping; no improvised emergency-drive build. | **RED:** C24 is only a service-kit placeholder. |
| Physical envelope and mass | Supplier CAD and measured product mass, including mounts, cables, operating clearances and service/removal envelope. | Fit check in a full-scale physical buck. | **RED:** C07’s 90 × 60 × 85 mm and 0.80 kg are not verified product specs. |
| Service and support | Maintenance interval, consumables, supported service life, authorized service and supply continuity. | Current regional IFU/contract and written supplier plan. | **RED:** no pump selected. |

**Decision rule:** If no supported pump system matches the requirement inside the package, the package grows or the concept changes. Do not remove required features or lower performance needs merely to preserve a suitcase silhouette.

## 5. Baseline component verification matrix (C01–C27)

The “current size/mass” column repeats the project’s **proposed CAD input**, not a measured specification. “Proof needed” describes how to establish the relevant feasibility claim. Any claim about blood, oxygen, clinical use or safety requires qualified medical-device evidence beyond the hackathon prototype.

| ID / component | Current concept input | Feasibility question | Evidence required to pass the relevant gate | Current status |
| --- | --- | --- | --- | --- |
| C01 Outer case, doors, inspection window | 460 × 330 × 700 mm; 2.00 kg | Does the actual internal pack fit, remain inspectable and permit service access? | G1 supplier envelopes + G2 collision/clearance CAD + G3 full-scale enclosure mock-up; materials/cleaning review later. | **AMBER:** silhouette only; internal usable volume not proven. |
| C02 Chassis/shelves | 400 × 270 × 640 mm; 1.80 kg | Can it carry selected modules and withstand handling without blocking vents/access? | Selected part loads; structural analysis and engineer-approved load/handling test; verify deflection and mounting. | **RED:** candidate extrusion and mass only. |
| C03 Four casters/brakes | 75 × 60 × 90 mm each; 1.00 kg total | Correct wheel/plate geometry, load rating, braking and maneuverability for complete loaded trolley? | Supplier drawing/rating; check mounting pattern; loaded rolling/brake/stability evaluation on defined floor surfaces. | **RED:** catalogue-size idea, not selected. |
| C04 Handle/grips | 300 × 45 × 350 mm deployed; 0.55 kg | Can staff maneuver it without unstable handling or line interference? | Actual component CAD; attachment/load evaluation; ergonomics review; G3 dummy-tube handling study. | **AMBER:** visual layout only. |
| C05 Oxygenator + heat exchanger | 180 × 100 × 160 mm; 1.10 kg | Is a real compatible oxygenator available in this envelope and with required performance/use indication? | Supplier model/IFU/CAD/mass, compatibility statement, performance and service documentation; qualified testing for any changed configuration. Do not design PMP fibers as a DIY component. | **RED — critical:** no oxygenator selected; no new fiber cartridge proven. |
| C06 Disposable pump head | 70 × 50 × 70 mm; 0.18 kg | Is the head matched to the selected drive, circuit and oxygenator? | Exact supplier set and compatibility evidence; packaging and access review. | **RED:** illustrative geometry only. |
| C07 Reusable pump drive/motor | 90 × 60 × 85 mm; 0.80 kg | Can a smaller drive deliver required pressure–flow performance with compatible control, monitoring, backup and thermal behavior? | Full pump matrix in Section 4; manufacturer performance curves, use approvals, supplier CAD/mass and integrated evidence. | **RED — blocking:** unselected and likely the core feasibility risk. |
| C08 Core carrier/sensor interface | 60 × 40 × 35 mm; 0.20 kg | Does the mount secure actual core parts without affecting their operation or maintenance? | Supplier mounting instructions; tolerance/retention analysis; service-access review. | **AMBER:** placeholder carrier. |
| C09 Pressure/temperature sensors | 3 pods, 35 × 25 × 25 mm each; 0.12 kg total | Are sensors approved/compatible, accurate, correctly placed and supported by the console? | Selected OEM sensor set, signal definition, calibration/accuracy evidence, interface/placement review. | **RED:** pod shapes do not establish sensor function. |
| C10 Flow/bubble sensor | 65 × 50 × 35 mm; 0.22 kg | Is this the selected platform’s approved sensor and does it work with the exact tubing? | OEM compatibility and interface; performance evidence; no added restriction or interference. | **RED:** concept clip only. |
| C11 Oxygen cylinder/valve | 110 × 110 × 540 mm; 3.50 kg | Does an approved cylinder fit and provide the required supply for the defined mobility scenario? | Selected regional cylinder drawing, mass/full state, approved regulator/interfaces, gas demand/reserve analysis by supplier/clinical engineering. | **RED:** illustrative cylinder; no gas duration proven. |
| C12 Cylinder retention/bay | 120 × 140 × 560 mm; 0.45 kg | Is the actual cylinder securely retained and isolated within the enclosure? | Cylinder and restraint supplier data; engineered load/retention, access and applicable gas safety review. | **RED:** CAD straps are not certified retention. |
| C13 Gas interface/control | 80 × 90 × 150 mm; 0.50 kg | Does the selected system’s gas interface/blender fit and support the intended supply configuration? | OEM-approved interface, gas requirements, exact part CAD and safety review. No DIY manifold. | **RED:** proxy block only. |
| C14 Gas tubing/outlet guards | 6 mm visual OD; 1.6 m route; 0.10 kg | Correct material, connection, length and routing for approved system? | Supplier-approved oxygen-compatible tubing/accessories; routing, exhaust and separation review. | **RED:** visual OD is not a specification. |
| C15 Thermal module | 240 × 180 × 160 mm; 2.40 kg dry | Can a compatible heater/cooler fit and satisfy thermal duty, monitoring, water volume and power needs? | Selected OEM unit specifications, mass, power/thermal data, interface and integration review. | **RED:** enclosure allocation only. |
| C16 Thermal-water hoses | 10 mm visual OD; 1.6 m route; 0.15 kg | Do selected hoses connect to the heater/oxygenator, route safely and preserve separate fluid paths? | OEM-approved hose set, interface drawings, materials and fit/leak validation by qualified team. | **RED:** visual curves only. |
| C17 Battery pack/BMS | 220 × 80 × 70 mm; 1.80 kg; 200 Wh scenario | Can a selected battery support the complete system for the requirement while meeting safety and service needs? | Actual supplier battery spec, complete load/power profile, reserve policy, thermal/electrical safety and runtime verification. | **RED:** energy value is an assumption. |
| C18 Power conversion/isolation | 180 × 80 × 45 mm; 0.65 kg | Can it supply the selected equipment with required isolation, EMC, charging and backup behavior? | Qualified electrical architecture, load measurements, supplier component specs and applicable safety/EMC verification. | **RED:** proxy box only. |
| C19 Compute/sensor acquisition/I/O | 230 × 50 × 60 mm; 0.50 kg | Does it reliably acquire data without controlling or interfering with life support? | Named processor/interface, isolation, software requirements, cybersecurity and verification. | **RED:** generic PCB allocation. |
| C20 Display | 190 × 18 × 90 mm; 0.40 kg | Can operators see status/alarms and distinguish source data from synthetic/unknown data? | Display spec and usability evaluation; clinically relevant device requires formal human-factors work. | **AMBER:** interface concept only. |
| C21 Alarm indicator | 70 × 40 × 25 mm; 0.10 kg | Is alarm audibility/visibility, priority, acknowledgment and failure monitoring adequate? | Alarm requirements, human-factors review and applicable alarm/electrical standards verification. | **RED:** light/buzzer shape proves nothing. |
| C22 Patient-line support/interface | 20 × 120 × 70 mm; 0.35 kg | Does it support tubing without pinching or transferring unsafe force to cannulas? | Clinical/human-factors requirements; dummy-tube handling and force evaluation; no patient claim from mock-up. | **RED:** bracket proposal only. |
| C23 Blood lines/mannequin interface | 13 mm visual OD; 1.5 m each; 0.35 kg | Is a compatible sterile circuit selected and can the external line route be supported? | OEM circuit/cannula compatibility and fit; for G3 use inert tubing/mannequin only. | **RED:** visual OD is not clinical tubing size. |
| C24 Backup/service-kit allowance | 140 × 60 × 70 mm; 0.80 kg | What exact OEM-approved emergency/service items are required and do they fit? | Supplier/clinical program inventory; actual package dimensions/masses; controlled accessibility review. | **RED:** generic pouch allowance. |
| C25 Fluid-mass allowance | 0.60 kg thermal + 0.45 kg circuit; 1.05 kg | Are actual circuit priming and thermal fluid volumes represented accurately? | Use selected supplier documentation and measured loaded configuration. No clinical priming prescription in this concept. | **RED:** water-equivalent estimate only. |
| C26 Cables/vents/partitions/hardware | 0.60 kg distributed | Are thermal, gas, electrical and blood routes separated, ventilated, strain-relieved and serviceable? | Exact cable/tube CAD, thermal/gas/electrical review, assembly fit and service-access inspection. | **AMBER:** allocated mass; routing unresolved. |
| C27 Stabilizers | 620 × 480 mm deployed; 0.65 kg | Does the loaded trolley remain stable during intended stationary/handling conditions? | Complete mass/center-of-gravity model; engineer-defined stability and handling assessment with weighted nonclinical mock-up. | **RED:** concept footprint only. |

## 6. Optional StrideGuard feasibility matrix (SG01–SG17)

StrideGuard is an accessory notification/status concept, not a replacement for the ECMO console. Read-only integration must be manufacturer-approved. A simulated demo can prove the user interface and message workflow, not clinical alarm detection.

| ID / component | Feasibility question | Evidence required | Hackathon evidence possible? | Current status |
| --- | --- | --- | --- | --- |
| SG01 Isolated ECMO gateway | Is there an approved read-only data interface for the selected console? | OEM interface documentation, electrical isolation and failure-impact review. | Mock connector/data simulator only. | **RED:** console not selected. |
| SG02 Monitor compute | Can monitor faults be detected without affecting ECMO operation? | Architecture, watchdog, fault injection and independent power/isolation verification. | Synthetic event tests. | **AMBER:** software concept only. |
| SG03 Source-data adapter | Are fields, units, timestamps and alarm meanings exact for this model/version? | OEM signal dictionary, interface test and version control. | Simulated data schema. | **RED:** source unknown. |
| SG04 Local status display | Is status readable and does it show source/freshness/unknowns? | Usability testing with realistic mock workflow. | Yes, with synthetic values clearly labeled. | **AMBER:** design can be demoed. |
| SG05 Audible alert | Is sound appropriate, distinguishable and detectable in target environment? | Human-factors and applicable alarm verification. | Demonstrate a buzzer only; no clinical adequacy claim. | **RED:** requirement not defined. |
| SG06 Visual indicators | Are alerts distinguishable without color alone? | Human-factors review and display/alarm verification. | UI usability feedback. | **AMBER:** mock display possible. |
| SG07 Call button | Does staff call action route to the correct approved endpoint and show result? | Workflow, interface and failure testing with a hospital partner. | Simulated endpoint/test phone only. | **AMBER:** mock workflow possible. |
| SG08 Hospital alert interface | Can it use approved nurse-call/pager/IT workflow? | Hospital IT/biomedical integration and cybersecurity approval. | Mock dashboard only. | **RED:** no site/interface. |
| SG09 Network/notification monitor | Does it accurately show queued/delivered/acknowledged/failed? | End-to-end fault and outage testing. | Yes, with local demo server. | **AMBER:** mock workflow possible. |
| SG10 Monitor backup power | Does independent power preserve monitor alerting without loading ECMO power? | Separate load budget, battery safety and runtime verification. | Can demonstrate LEDs/UI on a separate low-voltage supply. | **RED:** no pack selected. |
| SG11 Trolley IMU | Does movement context add useful information without mislabeling a patient risk? | Sensor calibration, false-event review and human-factors assessment. | Synthetic inert trolley motion only. | **AMBER:** concept sensor. |
| SG12 Support-bracket load sensor | Can support force be measured without modifying/compressing the blood line? | Mechanical design review and calibrated dummy-tube force testing. | Dummy support bracket only. | **RED:** not validated as a cannula warning. |
| SG13 Enclosure sensor | Does it report monitor enclosure/environment status reliably? | Sensor choice, calibration, fault reporting and environmental verification. | Simulated environmental events. | **AMBER:** optional. |
| SG14 Secure service/identity | Can authorized changes/repairs be tied to the correct asset? | Identity/access-control and audit design. | Fake asset records. | **RED:** no asset-management integration. |
| SG15 Runtime/clock | Is run-time source valid and time synchronized? | Supported console counter or verified operator start event; clock/uptime validation. | Simulated timestamps. | **RED:** ECMO interface unknown. |
| SG16 Asset/circuit ID | Can exact circuit and machine identity be captured and checked? | OEM identifier and hospital asset process; wrong/missing ID tests. | Mock QR labels and synthetic data. | **AMBER:** interface prototype only. |
| SG17 Maintenance status | Are due dates drawn from correct current model/region IFU and service record? | Controlled manufacturer schedule, authorized service record and stale-data handling. | Simulated schedule only. | **RED:** no selected system/service contract. |

## 7. Experimental parallel-oxygenator variant (PX01–PX06)

This variant is **not part of the baseline feasibility claim**. Keep it separate from the single-oxygenator packaging design. A 3D depiction cannot prove that split/merge topology, two cartridges, gas distribution or changeover works.

| ID / concept element | What would need proof | Evidence needed before any performance claim | Current status |
| --- | --- | --- | --- |
| PX01 Two compatible oxygenator modules | Each is approved/qualified for the exact intended configuration and duration. | OEM compatibility/approval for use in this arrangement; specialist engineering review. | **RED / research question only.** |
| PX02 Common inlet and split manifold | Branches distribute flow within an acceptable, verified range without creating unsafe conditions. | Whole-circuit modeling and qualified bench verification using requirements from the OEM/clinical team. | **RED / schematic only.** |
| PX03 Common merge and outlet manifold | Recombined circuit meets defined performance and sensing requirements. | Integrated pressure/flow and risk evidence for exact configuration. | **RED / schematic only.** |
| PX04 Isolation/switching components | Any proposed isolation/changeover configuration is permitted and validated for the complete set. | Manufacturer-designed and verified configuration, risk analysis, usability and failure testing. | **RED / no switching design.** |
| PX05 Gas and thermal support for two modules | Each oxygenator receives approved gas and thermal conditions without compromising either branch. | OEM-specified plumbing/integration and verified subsystem performance. | **RED / interfaces intentionally unresolved.** |
| PX06 Extra volume, weight and trolley fit | Two modules plus interfaces, service clearances and support fit and remain stable. | Real supplier CAD, revised mass/center of gravity, interference and weighted mock-up. | **RED / must recalculate from scratch.** |

No dual-oxygenator branch should be represented as automatically doubling blood support, oxygenation, cartridge life or patient runtime.

## 8. Whole-product integration matrix

| Integrated claim | How to evaluate it | Evidence artifact | Current status |
| --- | --- | --- | --- |
| “It fits in the suitcase” | Supplier CAD/measurements, tolerance-aware assembly, installed tubes/cables, opening and removal paths. | Released CAD + interference/clearance report + actual fit photos. | **RED:** proxy envelopes only. |
| “It is compact” | Compare complete systems with same function/scope and include cart, gas, thermal, backup, cables, service clearances and patient interface. | Apples-to-apples comparison table with cited sources and exclusions. | **RED:** no defined complete baseline. |
| “It is lighter” | Weigh selected parts and loaded configuration; include full gas cylinder, battery and fluids. | Calibrated component/loaded mass sheet. | **RED:** 22.32 kg is allocation sum, not weighed device. |
| “Smaller pump works” | Verify complete pump pressure–flow envelope, compatible circuit and system requirements from qualified evidence. | Supplier performance map + requirements trace + system test report. | **RED:** no selected pump. |
| “It can run away from bedside power/gas” | Measure actual complete-system power/gas demand and reserves for named configuration and operating scenario. | Vendor-confirmed power/gas budgets and verified runtime evidence. | **RED:** 200 Wh and cylinder assumptions are not validated. |
| “It can be moved with tubing secured” | Test trolley stability, handling path, mock line routing, access and support loads on mannequin/dummy circuit. | Repeatable nonclinical mobility protocol/video and measurements. | **AMBER:** concept only. |
| “It detects faults and calls help” | Verify signals, false/missed alert behavior, local fallback, remote delivery, acknowledgment and alarm usability. | Gateway/OEM evidence, risk analysis, simulated fault report, human-factors records. | **AMBER for mock software only; RED for clinical integration.** |
| “It is safe/usable as a clinical device” | Formal risk management, verification, validation, applicable standards and clinical/regulatory evaluation. | Approved technical file and quality/regulatory evidence. | **RED:** outside hackathon proof. |

## 9. Pump and fit proof sequence for the team

1. **Freeze a reference use case with an ECMO specialist.** Specify what support configuration and population the project is discussing. Do not choose pump performance numbers from the model envelope.
2. **Request actual supplier data.** For a real compatible system ask for the pump/drive, pump head, oxygenator/circuit, sensors, gas and heater interface drawings, weights, approved configurations, pressure–flow performance documentation, electrical demand, operating limits and maintenance/service data.
3. **Replace C05–C10 with real supplier CAD/data.** Keep the existing blocks only as visual placeholders until then. Do not draw C07 as a miniature working pump based on assumed dimensions.
4. **Assemble real envelopes and service clearances in CAD.** Include handles, mounts, connectors, cables, approved gas components, battery, heat-management needs and removal paths. If it collides, increase the case or revise the system choice.
5. **Recalculate total mass and balance.** Use supplier masses and the actual gas-cylinder state and required fluid configuration. Recompute wheel loads, center of gravity and stabilizer needs.
6. **Build a weighted inert packaging buck.** Use dummy modules and nonclinical tubing to test access, trolley handling, visibility and route support. This is evidence for packaging only.
7. **Maintain a separate performance gate.** Qualified engineers and manufacturers define bench verification for the selected pump/system. A water loop may demonstrate only a simple fluid path in a nonclinical rig; it cannot establish blood compatibility, gas transfer, clinical flow adequacy, hemolysis safety or ECMO readiness.
8. **Only then consider system-level development.** Use a formal risk-management, design-verification, design-validation, regulatory and clinical pathway. The required program depends on final intended use and jurisdiction.

### What would make the pump claim credible?

The team should be able to show all of the following before saying a smaller pump design is feasible:

- A named commercially supported or purpose-designed pump/drive, not a motor placeholder.
- Documented pressure–flow performance across the relevant system requirements, not just a nominal RPM or one free-flow reading.
- Compatibility evidence for the exact pump head, oxygenator, circuit, sensors and control unit.
- Verified power, heat, backup, alarm and failure behavior in the complete selected configuration.
- Blood-contact and durability evidence from qualified development/testing appropriate to the device.
- Real CAD and mass showing the module fits while preserving connection, ventilation and service access.

If any item is missing, describe the pump as **unselected/unverified**. Do not claim “same performance in a smaller size.”

## 10. Feasibility evidence board template

Use one row per claim and keep links to the underlying file or test record.

| Requirement ID | Component(s) | Requirement and source | Evidence method | Evidence file/version | Result | Reviewer/date | Open issue / next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-001 | C05–C07 | TBD — set by selected platform/clinical adviser | Supplier documents + qualified test | TBD | Not tested | TBD | Select compatible pump/oxygenator package |
| FR-002 | C01–C27 | Proposed overall size to be checked against actual component envelopes | CAD fit + physical buck | TBD | Not tested | TBD | Replace proxy solids with exact CAD |
| FR-003 | SG01–SG17 | Read-only alert workflow for specified synthetic events | Demo fault injection | TBD | Not tested | TBD | Build simulated dashboard, no patient interface |
| FR-004 | PX01–PX06 | Parallel module concept only | CAD illustration / specialist review | TBD | Not established | TBD | Keep out of baseline product claim |

## 11. Hackathon claims the current evidence can support

**Supportable now:** “We have a dimensioned concept package and a verification plan. We are checking whether selected qualified components can fit before making a compactness or performance claim.”

**Supportable after a mock-up:** “This weighted inert mock-up fit within the measured envelope and passed the listed access/handling checks.” State the exact mock-up configuration and results.

**Not supportable from CAD, a pitch deck, an Anatomy model, or a water-loop demo:** “The smaller pump works like a clinical ECMO pump,” “the oxygenator is validated,” “the device is safe for patients,” “we doubled runtime,” or “the complete ECMO fits at 28 kg.”

## Sources and standards context

- [ELSO Guidelines for Adult and Pediatric ECMO Circuits](https://pubmed.ncbi.nlm.nih.gov/35089258/) — circuit components and monitoring context.
- [ELSO guideline for adult VV ECMO](https://pmc.ncbi.nlm.nih.gov/articles/PMC8315725/) — clinical support depends on circuit flow and configuration; use clinical requirements set by specialists.
- [Getinge Cardiohelp System](https://www.getinge.com/us/products/cardiohelp-system/) — example of a complete commercial platform; supplier example, not a selected StrideLung component.
- [FDA: design verification and validation](https://www.fda.gov/media/90612/download?attachment=) — distinction between proving design outputs meet inputs and validating intended user needs.
- [ISO 14971:2019 overview](https://www.iso.org/standard/72704.html) — medical-device lifecycle risk-management framework.
- [IEC 60601-1 overview](https://webstore.iec.ch/en/publication/67497) — general requirements for basic safety and essential performance of medical electrical equipment; applicability and current editions require regulatory review.

The final standards, tests and approvals depend on product claims, configuration, jurisdiction and intended users. Have qualified medical-device regulatory and clinical-engineering specialists determine the applicable requirements; this matrix is a planning artifact, not a compliance assessment.
