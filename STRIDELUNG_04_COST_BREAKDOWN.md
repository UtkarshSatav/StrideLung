# StrideLung — component and cost breakdown

**Purpose:** Give the team a transparent cost picture for the proposed product, with a practical hackathon/showcase mock-up budget and a separate reference for buying an existing clinical ECMO system.

**Currency and date:** Indian rupees (INR), researched 21 November 2026.

**Important status:** StrideLung is a packaging/product visualization concept. It is not a built or clinically validated ECMO device. The mock-up budget below is for an inert, non-clinical showcase. It must not be used to source, assemble, modify, or price a patient-use ECMO system.

## 1. Read this first: there are three different costs

| Cost question | What this document can say |
| --- | --- |
| What might a visual / inert hackathon mock-up cost? | Preliminary planning range: **about ₹40,000–₹1,30,000**, including a broad assembly allowance and 15% contingency, before applicable tax and delivery. It contains no patient-use ECMO equipment. |
| What has an existing clinical ECMO package cost in a public Indian procurement record? | A Kerala government running-contract record listed a MAQUET ROTAFLOW II package at **₹60,60,810 including GST**, plus **₹4,46,984.74 KMSCL service charges**, for **₹65,07,794.74 total**. The contract was valid only through **10 June 2026**, so this is a historical benchmark, not a current quote. |
| What would a new StrideLung medical device cost to design, validate and manufacture? | **Not reliably estimable from the current concept.** The actual compatible pump/oxygenator, controls, sensors, power, thermal system, materials, testing, manufacturing process and regulatory pathway are not selected. A supplier and qualified engineering team would need to produce a priced design and validation plan. |

These three figures are not interchangeable. The mock-up is a visual demonstrator. The Kerala amount is for a bundled existing system. The cost of a new medical device includes development and verification work that neither figure captures.

## 2. Existing-system procurement benchmark

Kerala Medical Services Corporation (KMSCL) published a running contract for **five ROTAFLOW II ECMO systems**. The listed equipment price was ₹60,60,810 including GST. KMSCL service charges were ₹4,46,984.74, bringing that procurement line to ₹65,07,794.74. It listed three years of warranty, 95% uptime, four preventive-maintenance visits per year, and an eight-week delivery/installation period. The published contract expired on 10 June 2026. The specification describes a complete package, including console, centrifugal/diagonal pump, oxygenator, heater, gas blender, sensors, battery backup, cylinder storage and cart features. The same record says recurring ECMO consumables are to be quoted separately. [KMSCL running contract and specifications](https://kmscl.kerala.gov.in/KMSCL/uploads/contract/8456be3e-RCDetails_ecmo_compressed.pdf)

### What that benchmark does and does not tell us

- It is a **bundled procurement price**, not a list price for a new StrideLung design.
- It does **not** provide separate prices for the console, pump drive, oxygenator, heater, gas blender, sensors, battery, cart, cylinder bay or service package.
- It is for a particular model, supplier, contract, quantity and date. Today’s supplier quote, tax treatment, installation, warranty, service and availability can differ.
- It does not show that the same components can fit the proposed 460 × 330 × 700 mm case.
- The proposed StrideLung small motor, power controller and thermal unit are not selected compatible products. Do not scale the commercial machine’s components down in CAD and assume equivalent performance.

Another official KMSCL contract from an earlier period listed a different ECMO model (ROTAFLOW PLS) at ₹28,56,000 plus service charges, demonstrating that model, scope and contract period materially change the amount. It is older and should not be treated as a current price. [Earlier KMSCL ECMO contract](https://kmscl.kerala.gov.in/KMSCL/uploads/contract/9a1413a3-ECMO.pdf)

The University of Mumbai/BMC tender for seven **heart-lung machines with integrated ECMO**, standard accessories, three-year warranty and seven-year comprehensive maintenance listed an estimated tender value of ₹13.23 crore. That is a broader package and a tender estimate, not a confirmed award price for a standalone ECMO trolley, so it should not be divided and presented as the price of our product. [BMC tender document](https://www.mcgm.gov.in/irj/go/km/docs/documents/Tenders/ETH/ETH_8000058673_261223.pdf)

## 3. Clinical system components and quotation status

The table shows what an actual ECMO product needs at a high level. **“Bundled benchmark” means included in the reference KMSCL package but not separately priced there.** “Quote required” means the team should request a current supplier quote rather than invent a line-item price.

| System component | Role in the product | Price status for a real clinical system | Needed for inert showcase? |
| --- | --- | --- | --- |
| ECMO console / controller | Runs the selected ECMO system and presents operating information | Bundled in benchmark; separate price not published | No. Use a visual enclosure or screen mock-up. |
| Centrifugal pump drive / motor | Drives the pump head | Bundled; do not infer its individual value | No. A static replica is sufficient. |
| Blood pump head | Moves blood through the circuit | Included in a supplier-compatible disposable set; quote required per compatible set | Static replica only. Do not use a clinical blood pump. |
| Membrane oxygenator | Transfers oxygen and carbon dioxide across a membrane | Bundled for system package; disposable replacement-set price requires supplier quote | Static cutaway replica only. Do not manufacture an oxygenator. |
| Heat exchanger | Transfers heat between separate thermal-water and blood paths | Package describes heating unit/oxygenator; individual price unknown | Static replica or separate clear water-loop demonstration part. |
| Heater / thermal control unit | Controls the heat-exchanger water loop | Bundled; individual price not available | No clinical heater. An unheated water loop or static prop is enough for a visual demo. |
| Gas blender / gas interface | Supplies or blends gas as supported by a selected system | Bundled in the reference package; individual price unknown | Static panel only. Do not connect pressurized gas for the mock-up. |
| Oxygen cylinder and restraint | Gas source and secure storage | Cylinder/contents and restraint scope must be quoted for an actual selected configuration | Use an inert, non-pressurized prop only. |
| Flow, pressure, temperature, bubble/level sensors | Monitor circuit/system conditions | Bundled sensor set in reference; separate sensor prices and compatibility unknown | Low-voltage demonstration sensors may be used only for non-clinical demo values. |
| Battery and emergency drive | Backup operation and emergency capability | Included/required in reference spec; exact pack, runtime and price depend on the supplier model | No clinical backup system. A USB power bank can power lights/UI only. |
| Adult ECMO disposable circuit | Patient-specific tubing, pump head, oxygenator and related consumables | Separate supplier quote required; compatibility is system-specific | No. Use visually distinct inert tubing. |
| Cannulas and connectors | Connect the circuit to the patient | Separate supplier quote required; selection is clinical and patient-specific | No patient cannulas. Use oversized symbolic mannequin fittings. |
| Alarm, display and system software | Operator interface and alarm functions | Usually bundled with selected system; not individually priced in cited record | UI mock-up, LEDs and buzzer can be simulated. |
| Cart, cylinder holder, adjustable arm and accessories | Supports and transports the commercial system | Bundled in system package; individual price unknown | Yes, the proposed trolley and mounts are the main mock-up. |
| Installation, training, warranty and service | Deployment and lifecycle support | Included or specified by contract; package-specific | Not applicable to a non-clinical model. |

The KMSCL specification explicitly calls for a console, centrifugal/diagonal pump, oxygenator, heating unit, gas blender, sensors, emergency drive, battery backup, trolley and cylinder storage. It lists oxygenator, coated tubing, pump head, heat exchanger and other accessories as recurring consumables to be separately quoted. [KMSCL specifications](https://kmscl.kerala.gov.in/KMSCL/uploads/contract/8456be3e-RCDetails_ecmo_compressed.pdf)

## 4. Preliminary cost plan for a non-clinical showcase mock-up

This is a **planning allowance**, not a supplier quotation. It assumes one visually finished trolley with static replica ECMO components, color-coded flexible tubing, a simple illustrative screen, optional low-voltage lights/sensors, and no functional blood/gas circuit. The casters use a publicly listed 75 mm PU medical-trolley wheel at ₹350 each as a single retail reference; verify its plate dimensions and load ratings before buying, because that listing may not match our proposed mounting geometry. [Example 75 mm caster listing](https://www.tradeindia.com/products/caster-wheel-for-medical-c2222465.html)

All other ranges below are **rough local workshop/material allowances**, not live quotations. Request actual quotes for the selected city, finish, fabrication method and quantities. If there is an existing laptop/tablet, use it for the display and omit that purchase.

| Project component / IDs | Showcase implementation | Low (₹) | High (₹) | Basis / caveat |
| --- | --- | ---: | ---: | --- |
| C01 Outer case, service doors, clear window | Modified hard-shell case or fabricated shell with transparent cutaway panel | 8,000 | 18,000 | Fabrication allowance; structural rating not implied |
| C02 Internal chassis, rails, shelves | Aluminium angle/extrusion or simple fabricated frame | 3,000 | 8,000 | Estimate; section and fixing design are visual-only |
| C03 Casters (four) | Four swivel/braked casters | 1,400 | 2,000 | Four at about ₹350 each at low end; listing/spec must be confirmed |
| C04 Handle and lift grips | Trolley handle assembly and grips | 800 | 2,500 | Estimate; use staff-pushed prop only |
| C05 Oxygenator replica | Printed/acrylic housing and cutaway fibre insert | 2,000 | 6,000 | Inert visual replica; no membrane function |
| C06 Pump-head replica | Printed round housing/rotor | 1,000 | 3,000 | Static visual component |
| C07 Drive/motor replica | Enclosure and symbolic coupling | 1,000 | 4,000 | Static visual component; no ECMO drive function |
| C08 Core carrier | Small brackets and sensor bridge | 500 | 2,000 | Estimate |
| C09 Sensor location pods | Nonclinical pressure/temperature housings or dummy markers | 1,000 | 3,000 | Can use labels instead of live sensors |
| C10 Flow/bubble sensor proxy | Clip-on shell and optional low-voltage demo sensor | 300 | 1,500 | Must not be used on a clinical circuit |
| C11 Oxygen cylinder visual prop | Inert, non-pressurized cylinder-shaped prop | 500 | 2,000 | Do not refill or pressurize the mock-up prop |
| C12 Cylinder cradle and straps | Simple cradle, retaining bands and pads | 500 | 2,000 | Not a certified cylinder restraint |
| C13 Gas interface prop | Static control-panel enclosure and port shapes | 500 | 2,000 | No gas supply, regulator or pressure connection |
| C14 Gas-route tube | Amber visual line | 400 | 1,500 | Color-coded display tubing only |
| C15 Thermal module prop | Enclosure with two clearly separated ports | 2,000 | 6,000 | No clinical temperature-control function |
| C16 Thermal hoses | Teal supply/return pair | 300 | 1,000 | May be used with a small, isolated water demo loop only |
| C17 Demo battery / power bank | Powers LEDs and interface only | 2,000 | 5,000 | Not an ECMO backup battery |
| C18 Power conversion prop | Static low-voltage enclosure or safe USB power distribution | 1,000 | 3,000 | No patient-connected electronics |
| C19 Compute / sensor demo | Low-cost microcontroller and basic nonclinical sensor board | 1,000 | 3,000 | Optional; synthetic/demo readings only |
| C20 Display | Existing tablet/laptop: ₹0; small dedicated display: allowance | 0 | 8,000 | Do not buy if the team already has a screen |
| C21 Alarm/light prop | LED, buzzer and switch for interaction | 200 | 800 | Presentation effect only, not a medical alarm |
| C22 Patient-line support bracket | Rounded support and two saddles | 500 | 1,500 | Must not pinch tubing; mock-up only |
| C23 Blood-line visual pair | Blue/red flexible tubing and mannequin-side props | 500 | 2,000 | Inert tubing; no cannulas or blood path |
| C24 Service pouch | Small pouch or drawer prop | 300 | 1,000 | No emergency clinical supplies implied |
| C25 Demonstration fluid | Water for a closed water-only demo, if used | 100 | 300 | Not a blood prime or clinical fluid specification |
| C26 Cables, vents, fasteners, paint, labels | Finishing and distributed hardware | 500 | 1,500 | Allowance; select non-sharp demo materials |
| C27 Stabilisers | Two fold-out arms/feet | 500 | 2,000 | Mock-up handling feature; not tested for anti-tip performance |
| **Parts subtotal** |  | **29,800** | **92,600** | Arithmetic sum of the ranges above |
| Assembly/fabrication allowance | Workshop time, fitting, painting and wiring | 5,000 | 20,000 | Highly location/time dependent; obtain a fabricator quote |
| Subtotal before contingency |  | **34,800** | **112,600** | Parts plus assembly allowance |
| 15% contingency | Rework, small parts and price variation | 5,220 | 16,890 | Applied to subtotal before contingency |
| **Planning total** | **One non-clinical showcase mock-up** | **40,020** | **129,490** | Round to **₹40,000–₹1,30,000**, before applicable tax and delivery |

### What this mock-up budget excludes

- Any real ECMO console, centrifugal pump/drive, oxygenator, gas blender, heater, clinical sensor package or backup system.
- Patient-use tubing, pump heads, oxygenators, heat exchangers, cannulas and other sterile/clinical disposables.
- Medical oxygen cylinders, regulators, gas connections or pressurized demonstration gas.
- Blood, patient connection or any animal/human testing.
- Medical-device engineering, clinical validation, regulatory submissions, quality-system implementation, manufacturing tooling, insurance or commercial service network.
- Dedicated interactive software development beyond a simple screen/UI demo.
- GST, delivery and travel where not included in the chosen supplier quote.

The cost table's demo parts are props and educational hardware. The safe demonstration option is a dry cutaway or a closed, low-pressure **water-only** loop that has no connection to a person, clinical ECMO component, gas supply or patient circuit.

## 5. Prototype stage-gate budgets

| Stage | Deliverable | Cost planning approach |
| --- | --- | --- |
| 1. Digital anatomy figure | Isometric product, selectable parts, colored routes and component cards | Use the modeling brief and existing laptop; incremental cash spend can be near ₹0 if built by the team. |
| 2. Static physical mock-up | Suitcase shell, interior layout, replica parts, inert tubing and labels | Use the detailed **₹40,000–₹1,30,000** allowance above. Lower end assumes simplified fabrication, reused screen and student assembly. |
| 3. Water-only handling demonstrator | Closed clear-water loop, hobby/demo pump, nonclinical flow sensor and repeatable trolley movement | Price separately after selecting a safe demonstrator pump/tubing/sensor. Keep it physically and visibly distinct from any ECMO blood circuit. This document does not treat hobby-pump hardware as an ECMO subsystem. |
| 4. Clinical product feasibility study | Supplier-compatible package, requirements, hazard analysis, packaging, power/gas/thermal budgets, test plan and regulatory strategy | Cannot be priced from current CAD. Obtain written quotations from ECMO system suppliers and a qualified medical-device engineering/regulatory team. |
| 5. Clinical-grade device development | Verified design, validated manufacturing, quality system, approvals, clinical evidence and lifecycle service | Separate funded medical-device program; no credible total can be inferred from a mock-up BOM or one system purchase price. |

## 6. Lifecycle costs the team should request from a supplier

For a real selected ECMO platform, request one written quote that itemizes or explicitly bundles:

1. Console, pump drive/head interface, mounting arm and emergency drive.
2. Oxygenator/heat exchanger and adult-compatible disposable circuit, with per-kit replacement rate.
3. Cannulas and connectors by model/size as optional line items; clinical team determines selection.
4. Heater unit, compatible thermal-water set and replacement/service costs.
5. Gas blender, oxygen connection, approved cylinder holder and gas consumption constraints.
6. Sensors, alarms, display, software, battery, backup runtime and replacement battery price.
7. Trolley/cart, brakes, accessories and any additional stability or mounting requirements.
8. Delivery, installation, user training, warranty, preventive maintenance and response-time commitments.
9. Annual service after warranty and expected spares/consumables over the planned lifecycle.
10. Taxes, import duties, exchange-rate validity, quote expiration and what is explicitly excluded.

The KMSCL historical reference listed three warranty years and annual comprehensive-maintenance charges beginning in year four (₹1,93,750 for year four, before tax, under that contract). These are contract-specific historical values, not today’s service quote. [KMSCL running contract](https://kmscl.kerala.gov.in/KMSCL/uploads/contract/8456be3e-RCDetails_ecmo_compressed.pdf)

## 7. Cost statement for a hackathon pitch

Use this wording:

> “Our current StrideLung is a packaging and product-visualization concept, not a finished ECMO device. An inert physical showcase mock-up is budgeted at roughly ₹40,000 to ₹1.3 lakh, depending on fabrication and reused equipment. For context, a Kerala government contract published a bundled ROTAFLOW II ECMO procurement at about ₹65.1 lakh including its listed service charge, but that contract expired in June 2026 and does not provide separate component prices. We need current supplier quotations and feasibility work before estimating a clinical StrideLung product.”

Avoid saying:

- “The real StrideLung costs ₹40,000–₹1.3 lakh.” (That is only the inert mock-up.)
- “Our product costs ₹65 lakh.” (That is a historical price for a different bundled ECMO system.)
- “Each oxygenator/pump/heater costs ₹X” unless a current vendor quote explicitly prices that exact compatible item.
- “The prototype can support a patient” or “the tubing is medical grade” based on a visual model or hobby parts.

## 8. Sources and pricing notes

- [Kerala Medical Services Corporation — ECMO ROTAFLOW II running contract, valid to 10 June 2026](https://kmscl.kerala.gov.in/KMSCL/uploads/contract/8456be3e-RCDetails_ecmo_compressed.pdf): official public price, contract scope, support terms, and technical specification.
- [Kerala Medical Services Corporation — earlier ECMO ROTAFLOW PLS running contract](https://kmscl.kerala.gov.in/KMSCL/uploads/contract/9a1413a3-ECMO.pdf): earlier bundled contract price; useful only to show historical variation.
- [BMC — 2023–24 tender for seven heart-lung machines with integrated ECMO](https://www.mcgm.gov.in/irj/go/km/docs/documents/Tenders/ETH/ETH_8000058673_261223.pdf): broader tender scope and estimated value; not a comparable stand-alone ECMO trolley award.
- [TradeIndia — example 75 mm medical trolley caster listing](https://www.tradeindia.com/products/caster-wheel-for-medical-c2222465.html): ₹350 single listing at time accessed; seller specs/mounting need verification.
- [IISc tender specification template for ECMO](https://iisc.ac.in/wp-content/uploads/2025/11/G-14-ECMO-Extended-Respiratory-Support-ApparatusOxygenator-Adult-Pediatric.pdf): shows how console, consumable starter kits and unspecified “complete system” items are procured together; the document is a price schedule, not a public per-part price list.

Prices were checked on 21 November 2026. The official ROTAFLOW II contract expiry date precedes the research date. Mock-up line items are allowances, not supplier-confirmed prices; obtain quotes before purchase.
