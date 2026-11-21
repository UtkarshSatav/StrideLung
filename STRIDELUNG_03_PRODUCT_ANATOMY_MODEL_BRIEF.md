# StrideLung product anatomy — 3D showcase brief

**Purpose:** Give a 3D modeller or coding agent a single build brief for an Anatomy-style, interactive product cutaway of the proposed StrideLung ECMO trolley.

**Status:** Product visualization concept. The envelope, internal packages, materials, line routes and mass allocations are proposed illustration inputs, not an engineered, tested, clinically deployable device. The visual must not imply that a new ECMO circuit has been built or validated.

**Related documents:** [Compact trolley and 3D component specification](STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md) · [System explanation and pitch guide](STRIDELUNG_02_SYSTEM_EXPLANATION_AND_PITCH_GUIDE.md) · [How conventional ECMO works](../ECMO_ARTIFICIAL_LUNG_SYSTEM_EXPLAINED.md)

## 1. The one-sentence idea

**StrideLung is a proposed upright trolley package that makes the ECMO support system visible as one coordinated product: blood travels through an external patient circuit and a pump–membrane-lung core, while gas, heat, power and monitoring follow their own separate routes inside the case.**

The drawing should make that sentence visible. The trolley is the object, the cutaway reveals its organization, and the moving paths explain how the subsystems relate. Do not make the main image a collection of labeled boxes or a free-floating schematic.

## 2. Build target and visual language

Make a **Hero-scale interactive isometric anatomy figure**: one complete product, a cutaway case, several dozen individually placed solids, four independent route overlays, component selection, and a short staged operating animation. The image should read as a polished medical-technology product render at first glance, then reward closer inspection.

- **Main object:** upright, suitcase-shaped clinical equipment trolley on four casters, with handle, corner protection, front display, inspection window, service doors and a restrained cylinder bay.
- **View:** orthographic isometric view from the front-right, looking slightly down. Keep parallel suitcase edges parallel; do not use dramatic perspective that hides the layout.
- **Rendering:** clean light neutral studio background, restrained graphite/white case, brushed-metal frame, softly tinted transparent cutaway panel and one accent colour on the currently explained component.
- **Product first:** use realistic seams, hinges, latches, wheel forks, fasteners, shelves, cable clips, tube guides, vents and mounting feet. Keep all components attached to a parent surface or chassis. Avoid floating text, leader lines, disconnected parts and decorative machinery with no role.
- **One highlight at a time:** only the active part or active flow segment gets a bright accent. Keep the rest in calm material tones.
- **Labels outside the object:** use a side panel/card with the selected part’s name, role, proposed size, candidate material and uncertainty status. Do not put a forest of labels over the trolley.
- **No simulated clinical data:** if a display is shown, label it “illustrative interface” and use clearly synthetic/demo values or neutral placeholders. Do not represent values as patient measurements.

Suggested color key for the model and accompanying legend: **blue = drainage blood path; red = return blood path; amber = oxygen-containing gas path; teal = thermal-water loop; violet = power/data wiring.** These are explanatory colors only. Distinguish blood from thermal water by a persistent legend and by physically separate tubes.

## 3. Product envelope and pack-out

Use the existing concept envelope for visual consistency. These are **P: proposed CAD values**, not verified device dimensions.

| Package feature | Model input | Presentation note |
| --- | --- | --- |
| Main case | 460 W × 330 D × 700 H mm | Rounded upright trolley body; hollow shell with internal chassis |
| Floor-to-case | 90 mm | Casters occupy the space below the body |
| Stowed rolling envelope | 460 W × 330 D × 790 H mm | Includes wheels; excludes deployed handle, stabilisers and patient lines |
| Handle top when deployed | z = 1050 mm | Twin rear rails and crossbar; retracts into back channels |
| Deployed stabiliser footprint | 620 W × 480 D mm | Show only in parked/support view; do not conceal footprint in size callout |
| Internal nominal envelope | 400 W × 270 D × 640 H mm | Rails, walls, service clearances and doors consume some space; a fit rendering is not a fit check |
| Visual shell wall | 3 mm | Rendering assumption only; not a structural wall calculation |

### Interior arrangement, viewed from the front

Keep the packaging visually legible through four levels and two side zones:

1. **Upper front: operator interface.** Recess the touchscreen and alarm/status light into the front face. Keep screen text large enough to read at presentation scale.
2. **Upper centre/right: ECMO core bay.** Place the membrane oxygenator high enough to see through the inspection door. Place the pump head adjacent to it, with the reusable drive coupled behind the pump head. Put sensor pods at their indicated circuit positions. Use a removable service frame around this assembly.
3. **Left side/rear: gas bay.** Place the proposed oxygen cylinder upright in a visibly retained cradle behind a separate side hatch. Place the supplier-selected gas interface/control proxy toward the front of that bay. Keep the gas route short and visible to the membrane gas port. The cylinder is an illustration placeholder, not a chosen bottle or approved installation.
4. **Lower centre/right: thermal and service bay.** Put the dry thermal module low, with a separate paired thermal-water loop running to the oxygenator heat-exchanger ports. Place the service pouch in its own accessible pocket if the volume permits.
5. **Lowest front/centre: battery and power.** Put the battery cassette low. Place the power conversion/isolation proxy next to or immediately behind it in a dry partition. Route power wiring upward in a clipped cable channel, never as a fluid line.
6. **Front/side exit: patient lines.** Drainage and return blood lines leave the upper-right side through a smooth support panel. They remain external to the trolley, form broad supported curves, and continue to a mannequin at the edge of the scene. Do not coil them inside the bag.

Show the front service door and gas hatch as separate hinged panels. Show a cutaway/exploded presentation state in which panels move outward a short distance while the internal assemblies stay mounted to rails. Do not show the operating unit with blood lines disconnected.

## 4. The exact route layout to draw

The four routes below have distinct purposes and must never visually merge. Use separate tube geometry, separate colors and, where the cutaway overlaps, visibly different depth planes and clips.

### A. Blood circuit — patient to patient

Represent a conventional **VV ECMO** explanatory circuit. The patient is a mannequin; cannula details are symbolic. A VV illustration supports the lungs while the patient’s native heart continues to pump. It does not show a return line connected to the arterial circulation.

**Drainage direction:**

`mannequin venous drainage interface → blue drainage tube → trolley line-support bracket → drainage/pre-pump pressure point → centrifugal pump head → pre-oxygenator pressure point → oxygenator blood inlet`

**Return direction:**

`oxygenator blood outlet → post-oxygenator pressure/temperature point → flow/bubble sensor proxy on the return segment → red return tube → trolley line-support bracket → mannequin venous return interface`

**Product-render instructions:**

1. Draw a continuous blue tube from the mannequin’s symbolic drainage interface to the pump inlet. Let it pass the side support without a sharp bend or occlusion.
2. Draw the pump outlet directly into the oxygenator’s blood-side inlet. The pump pushes blood; it does not pump oxygen gas into blood.
3. Draw the oxygenator blood-side outlet to the red return tube and back to the mannequin. Use a visible port-to-tube junction at each connection.
4. Put three small sensor markers at drainage/pre-pump, pre-oxygenator and post-oxygenator positions. These are location cues only; do not invent invasive sensor hardware or connector standards.
5. Place the proposed flow/bubble sensor clip around the return tube as a dry external sensor representation. It must not appear to block or branch the tube.
6. Maintain generous visual spacing between the blue and red lines. Use different connectors and a flow-direction cue that resolves on the tubing surface or in the accompanying UI, not a long arrow floating across the figure.
7. Let the two patient lines travel through the side support as distinct lines. The support carries/organizes the line path conceptually; it must not look like a clamp that pinches the tubing.
8. End both lines at a mannequin connector/cannula illustration with a clear caption: **“Patient interface shown schematically; cannula choice and placement are not modeled.”**

The two blood lines should be the main moving subject during the operating animation. A small luminous marker or subtle moving highlight can travel along each tube in the correct direction. It is an explanation of direction, not a claim about a specific operating speed.

### B. Gas path — separate side of the membrane

**Gas direction:**

`oxygen cylinder or external hospital-gas option → gas interface/control proxy → amber gas supply tube → oxygenator gas inlet → membrane gas side → gas outlet/exhaust tube`

The membrane separates the gas path from the blood path. In the cutaway, show the gas route entering a dedicated gas-side chamber and leaving through its own exhaust connection. Do not draw a gas tube into a blood port or depict bubbles crossing into the blood line.

Only show **one source configuration at a time**:

- **Onboard-gas view:** cylinder, protected valve silhouette, retention cradle, gas interface proxy, supply tubing and exhaust path.
- **Hospital-supply view:** an external utility hose entering a clearly marked side inlet; cylinder bay shown as unused/closed. This is a separate option view, not a second source connected simultaneously.

The cylinder dimensions and mass are illustrative placeholders. Do not add an onboard medical-air cylinder or imply that the single oxygen cylinder independently creates arbitrary blended gas. Mark the control assembly and all gas-path details **“supplier-selected / not specified.”**

### C. Thermal-water circuit — closed auxiliary loop

**Thermal direction:**

`thermal module outlet → teal supply hose → oxygenator heat-exchanger water port → separate heat-exchanger passage → teal return hose → thermal module inlet`

Draw this as a closed pair between the thermal module and the oxygenator’s heat-exchanger section. Keep it entirely separate from blood and gas paths. Show two distinct heat-exchanger interfaces. Never connect thermal water to the blood ports, mannequin, oxygen cylinder or exhaust. The diagram explains heat transfer through a wall, not fluid mixing.

The thermal module’s internal pump, reservoir and refrigeration/heater mechanism are not specified. Render the module as a closed equipment enclosure with two labeled hose ports; do not invent a detailed functional internal design.

### D. Electrical and data routes — dry side of the case

**Power route:**

`battery cassette → power conversion/isolation proxy → pump drive + thermal module + display/compute`

**Sensor/data route:**

`sensor location proxies → clipped signal wiring → compute / sensor-acquisition module → illustrative display and alarm indicator`

Use narrow violet cable bundles clipped to the chassis. Keep cables behind a visible partition/channel, separate from the oxygenator’s blood/gas/thermal interfaces and from all flexible external patient lines. Do not animate current as if it were a fluid. The screen is a presentation interface, not a substitute for a clinical monitor or safety system.

## 5. Component inventory for the anatomy figure

Build **at least 50 separate solids or clearly grouped solid subparts**. The list below gives the minimum visual inventory; tiny screws can be instanced, but major assemblies must remain selectable. The existing detailed register contains the concept size, candidate materials and mass allocations. Reuse its C-IDs; do not create a second contradictory set of dimensions.

| Group | Minimum visible pieces | Source IDs / notes |
| --- | --- | --- |
| Case and mobility | Outer shell, front door, inspection window, gas hatch, lower service hatch, door rims, four corner guards, four caster tires, four caster forks, four brake tabs, two handle rails, crossbar, two grip caps, two stabiliser arms, two feet | C01–C04, C27 |
| Internal structure | Two side rails, two uprights, three shelves/crossmembers, core cradle, cylinder lower cradle, cylinder upper strap, thermal shelf, battery tray, power partition, cable channel, patient-line support bracket | C02, C08, C12, C22, C26 |
| Blood core | Oxygenator housing, oxygenator service cap, representative fibre bundle group, heat exchanger block/plate group, blood inlet port, blood outlet port, pump head housing, schematic impeller, motor/drive housing, coupling cover | C05–C08; all internals explanatory only |
| Patient circuit | Blue drainage tube, red return tube, mannequin interface for drainage, mannequin interface for return, two symbolic connector ends, three pressure/temperature markers, return sensor clip, two line-support saddles | C09, C10, C22, C23 |
| Gas subsystem | Cylinder body, shoulder, protected valve cap, two cradle surfaces, two retention straps, gas interface enclosure, supply tube, exhaust tube, two oxygenator gas-port stubs | C11–C14 |
| Thermal subsystem | Thermal module shell, access panel, two hose ports, teal supply hose, teal return hose, two heat-exchanger water-port stubs | C15, C16, C25 |
| Electrical / interaction | Battery cassette, battery tray face, power module, compute module, display glass, display bezel, alarm window, buzzer grille, two cable bundles, three clip points | C17–C21, C26 |

The visual model can subdivide larger solids to create a detailed product surface, but do not add dozens of arbitrary gears or valves simply to inflate the part count. Every part must have an obvious mounting point and a visual purpose.

## 6. Product states and user interaction

Create one figure with these named states. Keep the same geometry and IDs in every state; only doors, exploded offsets, highlights and flow animation change.

1. **Closed product:** all case panels shut, display and alarm visible, handle stowed. This is the hero opening image.
2. **Pack-out cutaway:** front inspection panel opens; internal chassis, four zones, cylinder restraint and components are revealed. Patient and external circuit remain in place.
3. **Blood path:** highlight drainage blue, pump, oxygenator blood side, return red and mannequin. Animate a marker around the closed route. Gas and thermal tubing remain visible but dimmed.
4. **Gas exchange:** reveal membrane/fibre group; highlight amber inlet and exhaust on the gas side. Keep blood in its own channel and explicitly show the membrane barrier.
5. **Thermal loop:** highlight the teal closed water pair and heat-exchanger interface; briefly show heat passing through a wall with a soft surface shimmer, never fluid crossing the barrier.
6. **Power and monitoring:** highlight the battery-to-drive/thermal/compute wiring. Sensor location markers light up and the illustrative screen updates from the same simple model state.
7. **Service exploded view:** front door, gas hatch and selected module carriers move outward a small distance along clear axes. Tubes stay anchored at connection points or are hidden for this service-only state with an explicit “illustrative service view” caption. No component floats without a visible parent mount.
8. **Parked/mobility view:** close the compartments, extend the handle and stabilisers, show the trolley upright beside a mannequin with staff supervision implied by context. The tubing stays supported and clear of wheels.

### Input and accessibility

- Pointer/touch: rotate only if the chosen Anatomy implementation supports true 3D; otherwise keep the isometric camera fixed and offer hover/tap selection. Do not promise an unsupported 3D camera.
- Keyboard: provide next/previous scene, open/close cutaway, and pause/play controls with visible focus.
- Reduced motion: stop all continuous flow and idle motion; retain a readable still frame and manual controls.
- Screen reader: announce the selected component name, purpose and proposed/unverified status; announce state changes without repeatedly reading decorative parts.
- Provide persistent legend and a concise text description of the active route.
- Pause when the figure is off-screen or inactive. Keep motion slow and purposeful.

## 7. Suggested underlying model for synchronized motion and readouts

Use one small **illustrative route/state model** as the source for visible highlights, selected route names, captions and readouts. Do not present it as an ECMO control algorithm or clinical simulator.

```ts
type Route = "blood-drainage" | "blood-return" | "gas" | "thermal" | "power-data";

type DemoState = {
  scene: "closed" | "cutaway" | "blood" | "gas" | "thermal" | "power" | "service" | "parked";
  activeRoute: Route | null;
  progress: number; // 0..1, visual marker position only
  selectedPartId: string | null;
  sourceView: "onboard-gas" | "hospital-gas";
  motionPaused: boolean;
};
```

Each route is a path through named attachment points, not an arbitrary curve. The blood route comprises connected nodes at the mannequin, side support, sensor positions, pump and oxygenator ports. The gas route has its own oxygenator-side ports. The thermal route closes back on the thermal module. The power/data route follows chassis cable clips. Interpolate marker progress only along that route’s centerline. Never reuse the same geometry object for two different fluids.

When the selected part changes, update the side card from a component data record: C-ID, name, subsystem, purpose, concept envelope, candidate material, proposed/unknown status, and connected neighbors. If the data is unavailable, say **“not specified yet”** rather than inventing a material or clinical number.

## 8. Component data to carry over

Use the exact current proposed envelope and mass inputs from the companion specification. The following examples clarify what the anatomy figure should and should not claim:

| Part | Current concept envelope | Material wording for the UI | Status wording |
| --- | --- | --- | --- |
| Trolley case C01 | 460 × 330 × 700 mm | PC/ABS shell candidate; clear polycarbonate window candidate | Proposed CAD; material grade and cleaning suitability unverified |
| Internal frame C02 | 400 × 270 × 640 mm | 6061-T6 aluminium candidate | Proposed; section sizes and structural checks unverified |
| Oxygenator/heat exchanger C05 | 180 × 100 × 160 mm | PMP is a referenced membrane example; stainless heat-exchange material is a referenced example; housing unspecified | Reserved concept envelope; no new oxygenator design claimed |
| Pump head C06 | 70 × 50 × 70 mm | Blood-contact material not selected | Schematic disposable cartridge representation |
| Motor/drive C07 | 90 × 60 × 85 mm | Housing/winding material candidates only | Future subsystem envelope; compatible drive not selected |
| Oxygen cylinder C11 | 110 × 110 × 540 mm | Supplier cylinder material not selected; surface is illustrative | Reference-like placeholder; exact cylinder not selected |
| Thermal module C15 | 240 × 180 × 160 mm | Enclosure candidate; internal fluid-path materials unspecified | Dry mass allocation; capacity and power unverified |
| Battery C17 | 220 × 80 × 70 mm | LiFePO4 is a candidate chemistry | 200 Wh is a scenario only; pack not selected or tested |
| External blood lines C23 | 13 mm visual OD; 1.5 m per line | Medical tubing specification not selected | Visual path only; OD is not a clinical lumen/connector specification |

Show exact row masses only in detailed component mode with the label **“mass allocation, not measured part mass.”** The current allocation totals 22.32 kg and the 20% planning contingency yields 26.78 kg, but neither number is a weighed prototype result. Do not show an invented component mass if the register does not assign one.

## 9. Anatomy-style build sequence

1. **Set scope and budget.** Build the single trolley product cutaway as the Hero. If the full moving/rotatable model is too large for one pass, first deliver a fixed isometric cutaway with four selectable route states; add true rotation only after the fixed figure reads correctly.
2. **Lock the facts.** Import the concept envelope and C-IDs from the component register. Record which values are referenced, proposed or unverified. Do not invent patient physiology, treatment settings, oxygen-transfer performance or real-time alarm thresholds.
3. **Draw the object in blockout.** Build the case shell, wheels, handle and internal shelves; place simple component solids at the intended coordinates. Check the proportions from front, right and isometric views.
4. **Lay tubes before surface detail.** Route blue/red blood lines, amber gas supply/exhaust, teal thermal supply/return, and violet cable bundles. Ensure every end lands on the intended port or termination. Inspect in closed, cutaway and exploded states for intersections, unsupported ends, kinks, wheel collisions and accidental route merging.
5. **Build the cutaway product.** Add real-looking panel edges, hinges, latch forms, inspection window, restraint, brackets, cable clips and line saddles. Keep internal assemblies mounted to the frame.
6. **Add component detail.** Add the oxygenator shell and representative internal layers, pump housing, drive coupling, cylinder protection, battery/power enclosures, display/alarm details and sensor proxies. Make details reveal function, not decoration.
7. **Add route states.** Use the same model data to highlight route segments in sequence and move one subtle marker along the appropriate tube centerline. Keep each other route distinct and visible.
8. **Add product copy and component cards.** Keep the figure itself mostly free of text. Put the route legend, title, short state caption and selected-part details outside the machine.
9. **Review at presentation size and zoom.** At normal size the trolley silhouette and product zones should read immediately. At 4× zoom, check ports, tube-to-port attachment, mounts, brackets and panel boundaries.
10. **Audit the final figure.** Capture closed, cutaway, each route, exploded and parked states. Inspect the front, right side, top and isometric views. Check all geometry and route intersections at rest and across intermediate animation frames. Fix mis-ordering/occlusion and tubes that appear to pass through solid walls.

## 10. Acceptance checklist

### Product appearance

- [ ] The first frame looks like one coherent upright trolley product, not a block diagram.
- [ ] Shell, handle, casters, display, doors and internal chassis are recognizable and visibly connected.
- [ ] Heavy modules appear low and retained; the gas cylinder has a separate restrained bay.
- [ ] The cutaway explains the package without making the case look like a transparent toy.
- [ ] At least 50 meaningful solids or modeled subparts exist; each major part has a physical parent/mount.

### Pipe and cable topology

- [ ] Drainage path is continuous from mannequin interface to pump inlet.
- [ ] Pump outlet connects to the oxygenator blood inlet.
- [ ] Oxygenator blood outlet connects to return tube and mannequin interface.
- [ ] Gas supply enters only the gas side; gas exhaust leaves only the gas side.
- [ ] Thermal water makes a closed pair between thermal module and heat exchanger.
- [ ] Blood, gas and thermal paths are physically distinct and do not merge or cross through a shared port.
- [ ] Electrical/data wiring follows dry chassis channels and terminates at the depicted modules/sensors.
- [ ] Each tube has visible ends, port junctions, clips/supports and plausible broad curves; none ends in empty space.
- [ ] No line clips through shell, frame, cylinder, wheel, another solid tube, or door in any displayed state.

### Truth and presentation

- [ ] Proposed dimensions, candidate materials, and mass allocations are labeled as such.
- [ ] No product rendering implies actual patient use, validated miniaturization, runtime, safety, efficacy, portability advantage or regulatory approval.
- [ ] The mannequin/cannula interface is labeled schematic.
- [ ] Display values, if present, are synthetic and clearly identified as illustrative.
- [ ] Reduced motion, keyboard selection and an accessible route description are provided.

## 11. Ready-to-use prompt for an Anatomy-style coding agent

> Build an interactive Anatomy-style product figure titled **“StrideLung: inside a proposed ECMO mobility trolley.”** The object should be a recognizable upright suitcase-shaped medical equipment trolley with case panels, handle, four casters, front display, inspection door and a restrained side gas bay. Use an orthographic isometric product view. The object itself must explain the system; do not make floating boxes, a flowchart or a pile of labeled components.
>
> Use the proposed 460 × 330 × 700 mm case from the supplied product brief, with components placed in the upper core bay, left gas bay and lower thermal/battery/power bays. Keep the patient-facing blood lines outside the case and supported at the side exit. Use component IDs C01–C27 and the supplied component register for dimensions and candidate materials. Treat every custom dimension, material selection and mass as proposed or unverified unless the register marks it referenced.
>
> Model and visually separate four routes: (1) VV blood drainage from a schematic mannequin interface through the drainage tube, pump head and oxygenator blood side, then through the return tube back to the mannequin; (2) oxygen-containing gas from one selected source option through the oxygenator gas side and out a separate exhaust; (3) a closed thermal-water supply/return pair between the thermal module and oxygenator heat exchanger; and (4) dry power/data cables between battery, power module, drive, thermal module, sensors and display. The membrane separates blood and gas; the heat-exchanger wall separates thermal water and blood. Never connect the routes to each other. Do not draw bubbles into blood.
>
> Make selectable states for closed product, cutaway pack-out, blood route, gas route, thermal loop, power/data, service exploded view and parked trolley. Use the same model data for components, highlights, route animation and selected-part cards. Provide a legend, keyboard/touch interaction, reduced-motion behavior and synthetic-only screen labels. No clinical control behavior or patient values.
>
> Use at least 50 meaningful attached solid parts, grouped as case/mobility, frame, pump–membrane core, patient circuit, gas supply, thermal loop, battery/electronics and display. Add believable clips, brackets, ports, hinges and service seams. Keep the hero figure clean: no balloons, leader lines or dense text on the object; put explanation in the side UI.
>
> Before finishing, inspect every route in every displayed state. Confirm each tube terminates at the correct port, remains supported, and does not intersect another tube, a solid panel, the wheels, the frame or an unrelated component. Check all animation frames, not just endpoints. State clearly in the UI that this is a product visualization and packaging proposal, not a working or clinically validated ECMO device.

## 12. Scope note

This brief borrows the Anatomy skill’s object-first, solid-part, interactive-explanation approach. The referenced skill describes figures with an isometric object, many attached solids, clear component hierarchy, restrained labels, interaction and visual audits. The proposed ECMO product itself remains this project’s concept; the skill is a visualization method, not an engineering or clinical design authority. [Anatomy skill overview](https://skills.wheresryan.sh/anatomy)

The visual system layout follows the project’s ECMO component explainer and its cited sources. Conventional component function does not validate the compact packaging proposal. Any real hardware design, clinical evaluation, gas integration, electrical safety, blood compatibility, control behavior, or movement workflow requires qualified engineering and clinical review.
