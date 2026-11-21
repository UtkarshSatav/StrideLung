# StrideLung

StrideLung is a proposed compact, suitcase-style ECMO trolley concept, accompanied by interactive product visualizations, a research-inspired simulator, and a synthetic hospital portal demo. The project is for hackathon and design exploration; it is not a working or clinically validated medical device.

## Interactive web experience

The Next.js application is in [`stridelung-web/`](stridelung-web/README.md). It includes:

- `/` — product overview, interactive trolley model, component register, packaging/mass assumptions, evidence and limitations.
- `/components` and `/components/[slug]` — searchable component register and individual component pages.
- `/parallel-oxygenator` — concept-only visual exploration of two cartridges on parallel branches, with unresolved engineering questions.
- `/simulator` — the hospital dashboard with a fictional fleet, an interactive simulation console, and an alert inbox with downloadable snapshots.

The pitch uses the website’s all-in-one trolley architecture. The proposed loaded design target is **28 kg**. The component register keeps a separate modeled allocation with contingency.

## Project documents

- [Compact trolley and 3D component specification](STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md) — proposed enclosure, component register, dimensions, material candidates, mass allocations and modelling directions.
- [System explanation and pitch guide](STRIDELUNG_02_SYSTEM_EXPLANATION_AND_PITCH_GUIDE.md) — ECMO background, package organization, pitch wording and judge questions.
- [Product anatomy model brief](STRIDELUNG_03_PRODUCT_ANATOMY_MODEL_BRIEF.md) — cutaway layout, separate blood/gas/thermal/electrical routes and modelling prompt.
- [Component cost breakdown](STRIDELUNG_04_COST_BREAKDOWN.md) — preliminary planning estimates and cost caveats.
- [Safety monitor and help-alert concept](STRIDELUNG_05_SAFETY_MONITOR_AND_HELP_ALERT_CONCEPT.md) — proposed read-only monitoring architecture, alert workflow and verification needs.
- [Parallel oxygenator Anatomy concept](STRIDELUNG_06_PARALLEL_OXYGENATOR_ANATOMY_CONCEPT.md) — visual-only brief for a dual-cartridge concept.
- [Feasibility and verification matrix](STRIDELUNG_07_FEASIBILITY_AND_VERIFICATION_MATRIX.md) — evidence gates for packaging, pump, monitoring and the optional parallel-oxygenator concept.
- [Hackathon submission deck](StrideLung%20Hackathon%20Submission.pptx)
- [Earlier wearable concept video](StrideLung%20Technical%20Concept.mp4) — archived presentation of the earlier architecture.

## Hospital portal prototype

Open **Hospital dashboard** from the website, then select **Command panel**: the trolley's own display, mirrored to the hospital, with the same trolley model as the landing page. Use the **At the trolley (demo)** strip to trigger a scenario such as **Drainage line restriction**; the simulated trolley's own checks raise the alert automatically when a reading stays outside its demo limit. Open the alert to see what was received, its delivery state and snapshot, then acknowledge it. Turn the hospital network off to show the display going stale and the alert being delivered late. The dashboard also includes assignments, service records, and a commercial scenario calculator. The [standalone prototype](index.html) is the earlier browser demo.

The portal is a front-end demonstration only. Demo limits are not clinical thresholds. It has no device connection, clinical monitoring, real patient records, authentication, database, or external notifications. All interactions are local to the browser session. The 14-day consumable interval and commercial figures are unvalidated planning assumptions; service schedules must follow validated manufacturer instructions and hospital policy. Hospital procedure charges are not StrideLung company revenue.

## Design and safety status

Component dimensions, materials, masses, layout and costs are proposals unless specifically identified as sourced reference information. The project does not claim that a smaller pump, portable gas supply, thermal system, battery runtime, parallel oxygenator arrangement or full assembly has been selected, built, verified or clinically qualified. Visual models and simulated readings are not evidence of physical or clinical feasibility.
