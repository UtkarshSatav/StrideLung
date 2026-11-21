# StrideLung safety monitor and help-alert concept

**Purpose:** Define a proposed subsystem that watches for ECMO equipment complications, makes the event understandable, and quickly alerts the responsible clinical team.

**Status:** Concept brief for a hackathon prototype and future feasibility work. It does not define clinical alarm limits, treatment actions, or a validated medical-device design. The hackathon demo must use synthetic signals or a non-clinical water-only rig.

**Related documents:** [Compact trolley/component specification](STRIDELUNG_01_3D_MODELLING_AND_COMPONENT_SPEC.md) · [Product anatomy model brief](STRIDELUNG_03_PRODUCT_ANATOMY_MODEL_BRIEF.md) · [Cost breakdown](STRIDELUNG_04_COST_BREAKDOWN.md)

## 1. Product idea

Call the concept **StrideGuard**: a read-only safety-monitoring and help-notification layer for the StrideLung trolley. It watches approved information from the ECMO system and selected trolley sensors, identifies a small set of equipment-risk conditions, raises a local alert, and notifies a configured hospital responder.

The user-facing promise is:

> **“When the trolley or its monitored ECMO system reports a concerning condition, StrideGuard clearly shows what was detected and alerts the designated care team.”**

The monitor supports staff awareness. It does not diagnose every patient complication, make a life-support decision, or operate the ECMO circuit.

## 2. Safety boundary: what it may and may not do

### It may

- Read alarms and measurements from the selected ECMO console through a documented, supplier-approved, electrically isolated, read-only interface.
- Monitor approved support-system status, such as power source state, battery status, gas-supply status, heater status and its own communications health.
- Monitor trolley-specific context, such as tilt/motion or force on a **trolley line-support bracket**, if designed and evaluated with clinical and human-factors experts.
- Explain which signal or source alarm caused the alert, when it began, whether data is stale, and whether communication succeeded.
- Sound and display a local alert, send a configured staff notification, and provide a clearly marked manual **Call clinical team** button.
- Keep a time-stamped event log for review, with access controls and only the minimum necessary patient information.

### It must not

- Connect directly to, interrupt, or modify the blood path or cannulas.
- Change pump speed, flow targets, gas settings, temperature settings, alarms, clamps, anticoagulation, ventilator settings, or treatment.
- Stop, restart, or automatically switch the ECMO pump or oxygen supply.
- Replace the primary ECMO console’s alarms or the bedside patient monitor.
- Claim it can detect every ECMO or patient emergency.
- Silence or suppress a primary device alarm. Acknowledging a StrideGuard notification does not acknowledge the source ECMO alarm.
- Call a public emergency number as a substitute for a configured hospital response pathway.
- Send patient-identifiable data to an unapproved cloud service or personal phone.

If StrideGuard loses power, its sensors, its ECMO data connection, or its network, the primary ECMO system must continue to function independently. The add-on may report **monitor unavailable**; it may never interfere with life support.

## 3. Complications the concept can watch for

These are **detection categories for requirements discussion**, not alarm thresholds or instructions for clinical response. An ECMO specialist team and selected equipment manufacturer must define which source signals are available, what they mean for that exact configuration, and what notification priority is appropriate.

| Condition category | Possible evidence available to the monitor | What StrideGuard can say | Important limit |
| --- | --- | --- | --- |
| Pump or circuit flow concern | Source console alarm; approved flow value/status; related pressure readings | “ECMO console reports a flow concern” or “Flow data unavailable” | A secondary monitor must not infer a diagnosis from one number or substitute for console interpretation. |
| Drainage-side restriction or line issue | Source alarm; approved pre-pump pressure/flow trend; optional force at trolley support | “Drainage-side signal changed; check source console” | A trolley bracket sensor detects support loading, not cannula position or blood-vessel condition. |
| Return-side obstruction or pressure concern | Source alarm; approved post-pump / return pressure and flow data | “Return-side pressure/flow alert reported” | Interpretation depends on circuit setup, cannulae, patient and source equipment. |
| Oxygenator/circuit performance concern | Manufacturer-supported pressure information and source alarm; clinician-entered/lab data only if approved | “Oxygenator/circuit alert from source system” | Blood-gas values may be intermittent and are not necessarily available to an accessory; no autonomous oxygenator-failure diagnosis. |
| Gas source or gas-delivery concern | Approved gas-blender status or source alarm; supply status if the selected platform exposes it | “Gas supply status alert” | Do not add an unapproved pressure device or open/change gas flow. |
| Temperature management concern | Heater status, temperature readings or source alarm through approved interface | “Temperature-management alert from source system” | No autonomous adjustment or clinical target setting. |
| Primary power or backup concern | Mains/battery state and source-console alarm | “Primary power changed” / “Backup status alert” | StrideGuard backup is for its own alerting only; it does not substitute for the ECMO console backup. |
| Sensor, data link or monitor fault | Missing/stale/out-of-range data status, connector state, self-test | “Monitoring data lost/stale; check primary console” | Missing data is not proof that the ECMO system has failed; uncertainty must be explicit. |
| Trolley movement or possible line pull | Trolley IMU plus load cell on a dedicated support bracket, if approved | “Unexpected trolley movement/support load detected” | Not a validated cannula-pull detector; never sense by squeezing or modifying the blood tubing. |
| Patient deterioration | Separate patient-monitor alert delivered through a hospital-approved interface, if available | “External patient-monitor alert received” | StrideGuard does not diagnose patient deterioration from ECMO circuit signals alone. Patient monitoring remains external. |
| Service or usage status | Authorized equipment runtime, circuit start time/ID, battery/service records and manufacturer schedule | “Circuit-use limit review due” / “Console inspection overdue” / “Status data incomplete” | Maintenance scheduling is distinct from a real-time ECMO emergency. Do not treat a predicted service date as permission to continue clinical use. |

ELSO guidance describes ECMO circuits and the monitoring context as configuration-dependent. Published sources also describe source-console alarms, pressure/flow information and the need for trained staff to recognize and respond to complications. StrideGuard should therefore consume the selected system’s supported signals and preserve the clinical team as decision-maker. [ELSO circuit guideline](https://pubmed.ncbi.nlm.nih.gov/35089258/) · [ELSO adult VV ECMO guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC8315725/) · [Alfred ECMO emergency alarms](https://ecmo.icu/emergency-alarms/)

## 4. Proposed system architecture

```text
Selected ECMO console (primary system; keeps its own alarms and controls)
                 │
                 │ supplier-approved, isolated, read-only interface
                 ▼
        StrideGuard safety gateway ◄── trolley / support status sensors
                 │                  ◄── approved power / heater / gas status
                 │
        ┌────────┴────────┐
        ▼                 ▼
 Local display,        Hospital-approved alert path
 light and sound       nurse-call / pager / secure staff console
        │                 │
        └────────┬────────┘
                 ▼
       Local event log + staff acknowledgement
```

**Design principle:** the ECMO console is authoritative for ECMO alarms and controls. StrideGuard is a separate observer and notifier. The actual data connection and any isolation hardware must come from the selected manufacturer or an appropriately qualified integration design. Do not assume the ECMO console exposes CAN, USB, Ethernet, serial or any other interface until verified.

### Data flow

1. Read source-system alarm and selected telemetry through the approved interface.
2. Check data freshness, source identity, sensor/data quality and gateway self-health.
3. Apply a small, documented event-detection rule set. Start with source alarm forwarding and communications/power-health checks; add derived patterns only after clinical requirements and verification.
4. Present a plain event card: **what signal/alarm**, **source**, **time**, **current/cleared/stale**, and **notification status**.
5. Sound/display locally and send the agreed notification payload through an approved hospital endpoint.
6. Record sent, delivered, acknowledged, retrying or failed status. If the network fails, keep the local alert active and show that remote delivery failed.

## 5. Components required

### 5.1 Hardware

| ID | Component | Function | Product requirement / boundary |
| --- | --- | --- | --- |
| SG01 | Isolated read-only ECMO data gateway | Receives source alarms and approved telemetry | Must be compatible with a named ECMO model; no write/control path. Interface is TBD until manufacturer confirms it. |
| SG02 | Safety-monitor compute module | Runs monitor health checks and event rules | Watchdog, startup self-test, fault logging, bounded rule set; it must not control the pump. |
| SG03 | Source-data adapter | Converts supported manufacturer interface into named data fields | Model-specific, versioned and documented. Unknown fields remain unavailable, not guessed. |
| SG04 | Local status display | Shows active event, source, time, data freshness and call status | Readable from staff position; distinguish source-console alarms from StrideGuard notices. |
| SG05 | Audible alert transducer | Calls attention locally | Alarm behavior, priority and sound levels require human-factors and applicable standards review. |
| SG06 | Visual alert indicators | Shows priority and system/connection state | Use text/icon as well as color; do not rely on color alone. |
| SG07 | Manual “Call clinical team” control | Allows staff to send a help request quickly | Guard against accidental activation while remaining accessible; confirm destination and send result. |
| SG08 | Hospital alert interface | Sends event to nurse-call, pager, secure staff console or approved workflow | Integrate with hospital IT/clinical engineering; avoid personal messaging or unapproved cloud services. |
| SG09 | Network/notification status monitor | Detects lost network and tracks delivery/acknowledgement | Local alerts remain available during outage; show delivery failure plainly. |
| SG10 | Dedicated backup power for StrideGuard | Keeps its monitor and local alert active for its specified interval | Must be independent enough to avoid loading or impairing ECMO power. It is not ECMO backup power. |
| SG11 | Optional trolley IMU | Detects movement, tilt or handling event | Context only; no claim that it identifies patient/cannula danger. |
| SG12 | Optional line-support load sensor | Measures force on the trolley's own support bracket | Never attach a sensor that compresses, constricts or alters the blood tubing. Thresholds require validation; first demo should be illustrative. |
| SG13 | Optional enclosure/environment sensor | Detects internal temperature or moisture affecting monitor electronics | Reports monitor/environment status only; does not diagnose an ECMO circuit problem. |
| SG14 | Secure service port and identity label | Allows authorized maintenance and identifies trolley | Disabled/controlled during clinical use; no consumer USB access to patient data. |
| SG15 | Runtime and clock source | Records ECMO-run elapsed time and StrideGuard uptime | Use supported console runtime data or a verified staff-entered start event; show “unknown” if unavailable. Do not estimate ECMO runtime from trolley power-on time alone. |
| SG16 | Asset/circuit identification and service-record interface | Associates service schedule with console serial/model and disposable circuit ID | Read an authorized barcode/QR or maintenance-system record; require staff confirmation. Do not infer circuit expiry from an unreadable label. |
| SG17 | Maintenance-status software panel | Displays last/next service, battery-service/calibration date, circuit elapsed-use versus its model/region IFU limit, and data freshness | Use the selected manufacturer's current IFU/service plan and hospital asset system; no universal ECMO interval is hard-coded. |

### 5.2 Software and configuration

- **Signal dictionary:** a version-controlled list of source fields, units, validity flags, timestamps and meanings, confirmed for the selected model.
- **Event rules:** deterministic and explainable at first. Each rule lists required signals, missing-data behavior, event text, notification route, priority rationale, and verification cases.
- **Alert orchestrator:** handles local signals, remote messages, retries, acknowledgements, duplicate suppression and network outage state.
- **Event log:** time-stamped status transitions and delivery evidence. Store only what is needed for safety review; set access, retention and audit policies with the hospital.
- **Maintenance register:** authorized device model/serial, commissioning date, installed software/configuration, last and next scheduled inspection, battery maintenance dates, circuit identifier and recorded circuit start/use time. Record the source and last update for each field.
- **Configuration management:** system model/version, alert destinations, software release, clock status, test state and service history.
- **Access control and secure updates:** only authorized service personnel can change settings or software. Changes are auditable and tested before use.
- **Human-readable explanation:** every alert states what was detected and whether it came from the ECMO console, an accessory sensor, or a data-quality check.

## 6. Alert behavior and “call for help” workflow

### Alert lifecycle

1. **Detect:** receive a supported source alarm or a verified monitor-health/trolley event.
2. **Qualify:** confirm source/time/data quality; if evidence is missing or inconsistent, alert “data uncertain” instead of asserting a specific fault.
3. **Announce locally:** display a concise event and sound/light according to the clinically approved priority design.
4. **Notify staff:** send the event to the designated hospital endpoint. Include trolley/device ID, location if available, event/source, timestamp, and an acknowledgement link/action. Include patient identity only if the institution authorizes and needs it.
5. **Track delivery:** show queued, delivered, acknowledged or failed. Do not present “sent” as “help is coming.”
6. **Escalate per local policy:** if no acknowledgement arrives, route to the next configured staff endpoint. Timers and escalation order must be set with the hospital, not invented in the hackathon prototype.
7. **Close the event:** only clear the accessory event when the source clears or an authorized user confirms the relevant state according to the approved requirements. Clearing StrideGuard must not silence the source ECMO alarm.

### Alert tiers for concept discussion

Use descriptive labels such as **Urgent**, **Attention**, and **Monitor unavailable** only after a clinical risk analysis assigns each condition. This document does not specify physiological thresholds or time delays.

- **Urgent:** a source ECMO alarm or an approved condition requiring immediate staff attention; local alert plus the highest-priority configured staff notification.
- **Attention:** a trend, support-status change or non-immediate issue that needs staff review under the local workflow.
- **Monitor unavailable:** the gateway, signal link, power or remote delivery has failed; show that StrideGuard cannot currently observe or contact staff.

For the pitch prototype, use synthetic events and a visibly marked demo mode. A help request should go to a simulated dashboard or test phone endpoint controlled by the team, never a real hospital team.

## 7. What “directly call for help” should mean in this product

For the product concept, “call” means **send a verified alert into a hospital-approved clinical response workflow**, not automatically diagnose and call a public emergency number.

Possible destination hierarchy to discuss with a hospital:

1. Local call button/panel and audible/visual alert on the trolley.
2. Wired nurse-call or facility alarm interface, if supported and approved.
3. Authenticated hospital Wi-Fi/secure notification service to the assigned ECMO team console or pager.
4. Secondary configured staff destination if the primary endpoint fails or is not acknowledged.

An actual design needs a site-specific fallback for power or network loss. The monitor should be explicit about what it could not deliver. It should not silently queue an alert and imply someone has been notified.

## 8. Data and connectivity design

- Prefer **local processing** inside the trolley; send the smallest possible event payload to the hospital endpoint.
- Use a hospital-approved connection and identity management. Do not assume ordinary public Wi-Fi, Bluetooth, personal messaging apps or internet access are reliable clinical alert routes.
- Encrypt data in transit and at rest where applicable; authenticate devices; restrict who can see or change event records.
- Include device identity, software/configuration version, event timestamps and clock-sync status in logs.
- Define what happens when time is wrong, data is delayed, duplicated, missing, malformed or from the wrong console.
- Keep the system useful without a network: source ECMO alarms remain primary; local StrideGuard alert and manual staff-call control remain available if designed for it.
- Avoid storing continuous patient waveforms or identifiers unless necessary and approved. Define retention and deletion with the hospital.
- Never allow a remote message or app command to change ECMO operating settings.

## 9. Hackathon prototype: safe, demonstrable scope

Build a **simulation-only alarm-and-dispatch demo**, not a device attached to an ECMO system.

### Demo components

- Laptop or microcontroller with a simple event simulator.
- Small display or web dashboard with current status, event history and delivery state.
- LED and buzzer for local alert demonstration.
- Push button labeled **Call clinical team (demo)**.
- Optional IMU and load cell attached only to a mock trolley support, generating synthetic handling events.
- Mock hospital dashboard or second team device on the same local demo network.
- Scenario controller that injects labeled synthetic events: “source low-flow alarm,” “gas status alarm,” “battery status warning,” “circuit-use reminder,” “maintenance due,” “data link lost,” “support bracket movement,” and “network unavailable.”

### Demo sequence

1. Show normal state with all channels identified as simulated.
2. Inject one event and show which input raised it.
3. Make the local light/sound and on-screen explanation activate.
4. Show the staff alert arrive and record **delivered**; acknowledge it from the mock responder screen.
5. Repeat with the network disabled. Show local alert still operates and remote status changes to **delivery failed**.
6. Inject a circuit-use reminder and a maintenance-due record. Show them in the service/status view and route them as reminders, separate from an urgent equipment alarm.
7. Inject missing/stale data. Show “monitor unavailable/data uncertain,” not a fabricated fault diagnosis.
8. Show that no control output exists: the monitor cannot change pump, gas, heater or circuit settings.

### What the demo can claim

“We demonstrated a software prototype that recognizes injected test events, gives a local alert, and sends a simulated notification with delivery status.”

It cannot claim medical-grade fault detection, clinical alert reliability, reduction in response time, improved patient outcome, validated thresholds, or compatibility with any ECMO console.

## 10. Verification plan before any real integration

1. **Requirements review:** ECMO clinicians, perfusionists, clinical engineering, alarms/human-factors specialists, hospital IT and the selected OEM define use cases, risk controls, signals, priorities and escalation ownership.
2. **Interface review:** OEM documents data availability, semantics, permitted connection, electrical isolation and impact of connection failure.
3. **Hazard analysis:** analyze missed alerts, false alerts, wrong-device data, stale data, clock error, disconnected sensor, blocked speaker, dead battery, lost network, duplicate alerts, wrong recipient and confusing status.
4. **Bench simulation:** inject expected, missing, delayed, contradictory and malformed signals. Confirm the source ECMO system is unaffected.
5. **Notification testing:** test delivery, acknowledgement, retry, fallback, duplicate handling and outage behavior in a non-clinical network environment.
6. **Human-factors evaluation:** test whether intended staff can tell the source of the event, urgency, delivery status and required local workflow under realistic noise and interruption.
7. **Cybersecurity/privacy review:** review credentials, updates, device identity, logging, patient data, network segmentation and incident response.
8. **Risk-based verification and validation:** define acceptance criteria from intended use and applicable standards with qualified regulatory/quality professionals.
9. **Clinical evaluation:** only after appropriate approvals, qualified integration and a justified study protocol. A hackathon demo is not an early patient trial.

Potentially relevant references include the IEC medical alarm systems standard and FDA guidance on software that analyzes signals. Which requirements apply depends on product claims, intended users, jurisdiction and integration design; this document is not a regulatory determination. [IEC 60601-1-8 overview](https://webstore.iec.ch/en/publication/67388) · [FDA: software functions that analyze signals](https://www.fda.gov/medical-devices/digital-health-center-excellence/step-6-software-function-intended-provide-clinical-decision-support) · [FDA human-factors design guidance](https://www.fda.gov/medical-devices/human-factors-and-medical-devices/human-factors-premarket-information-device-design-and-documentation-processes)

## 11. Key risks and design responses

| Risk | Design response for this concept |
| --- | --- |
| False negative: complication is not detected | Forward native alarms; clearly bound supported signals; independent tests and clinical validation; never advertise complete coverage. |
| False positive / alarm fatigue | Start with few justified conditions, disclose signal/source, test nuisance alarms with real users, and tune only through controlled requirements management. |
| Accessory failure affects ECMO | Read-only isolated interface, no inline blood-path sensor, independent power, physical/electrical separation, fail-safe disconnection behavior. |
| Staff assumes notification means help arrived | Separate sent/delivered/acknowledged states; show timeout/failure; local alarm remains. |
| Network outage | Local alert, manual call path, configured backup route and visible unavailable state. |
| Trolley sensor mistaken for cannula or patient diagnosis | Label as contextual support-load/movement evidence only; never claim it detects displacement or injury. |
| Confusing source alarm with accessory alert | Show source system and source event prominently; never silence or overwrite primary alarm. |
| Patient information exposed | Minimum necessary data, local processing, approved endpoints, encryption, access control and audit logs. |
| AI makes opaque or unstable inference | Use transparent, validated rules first; no generative model or opaque classifier for first-response alarms. |

Alarm systems require careful design to make signals recognizable and actionable, while human-factors review is central to medical-device design. FDA materials also distinguish simple display/transfer software from functions that acquire, process or analyze medical signals. StrideGuard’s signal-analysis purpose therefore needs early regulatory and quality-system review. [IEC alarm systems standard](https://webstore.iec.ch/en/publication/67388) · [FDA signal-analysis software discussion](https://www.fda.gov/medical-devices/digital-health-center-excellence/step-6-software-function-intended-provide-clinical-decision-support) · [FDA human-factors guidance](https://www.fda.gov/medical-devices/human-factors-and-medical-devices/human-factors-premarket-information-device-design-and-documentation-processes)

## 12. Questions the team must answer before hardware selection

1. Which ECMO manufacturer/model is the reference platform, and does its manufacturer permit a read-only data interface?
2. Who exactly receives each alert at the hospital, and how is delivery/acknowledgement confirmed?
3. What is the local fallback when the network or the notification server is unavailable?
4. Which alerts are source-console alarms that should simply be forwarded, and which derived conditions are justified by a clinical risk analysis?
5. Which trolley sensors add useful information without touching or modifying the blood circuit?
6. What event data is necessary, who can see it, and how long should it be kept?
7. How is the add-on independently powered without reducing the ECMO system’s own battery reserve?
8. Who owns alarm configuration, service, training, software updates and incident review?
9. What intended-use claims and jurisdictions determine the regulatory and quality requirements?

Until those are answered, keep sensor types, interface, thresholds, timing and notification hierarchy as **TBD**.

## 13. Runtime, component use limits and maintenance status

There is no single number for “how long ECMO lasts.” Keep three clocks separate:

1. **Patient ECMO run:** for adult VV ECMO, ELSO notes that many published studies report support around 9–14 days, while some patients need four weeks or more. The individual patient's course and clinical team determine duration; a calendar counter alone cannot say when treatment should stop. [ELSO adult VV ECMO guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC8315725/)
2. **Disposable circuit/oxygenator use:** each exact circuit has its own instructions-for-use limit, approvals and clinical replacement criteria. Examples differ: Getinge lists up to 30 days for HLS Set Advanced in the CE region when paired with specified Bioline-coated HLS cannulae; LivaNova states EOS ECMO devices must be used for up to 5 days or less; Medtronic states its Nautilus oxygenator is for use up to 48 hours in its stated indication. These examples are not interchangeable and do not establish the allowed duration for StrideLung or for another country/model. [Getinge HLS Set Advanced](https://www.getinge.com/int/products/hls-set-advanced/) · [LivaNova EOS ECMO](https://www.livanova.com/cardiopulmonary/en-gb/oxygenators/eos-ecmo) · [Medtronic Nautilus ECMO oxygenator](https://www.medtronic.com/en-us/products/product.48145E.html)
3. **Reusable console service life and maintenance:** the machine does not have a universal “expires after X ECMO days” rule. Service intervals, battery replacement and supported service life are model-specific. For one example, the January 2025 Getinge CARDIOHELP US instructions call for battery calibration at least every 4 months, authorized inspection every 12 months, and battery change every 48 months. Those dates apply to that product documentation/configuration; the selected system's current regional instructions and service contract must govern. [Getinge CARDIOHELP System Instructions for Use](https://www.getinge.com/dam/hospital/documents/english/cardiohelp-system-ifu-2025-01-en-us.pdf)

### What StrideGuard should show

Add a persistent **System status** panel with these fields:

| Status field | Display behavior |
| --- | --- |
| ECMO system identity | Manufacturer/model, serial or asset ID, software/configuration version; show “not registered” if absent. |
| Current reported state | “No active source alarm reported” only when the source link is current; otherwise show “source status unavailable/stale.” Never display a blanket “safe” or “all clear.” |
| ECMO run elapsed | Elapsed time from a verified run-start event or supported console counter. Label its source and last update. Do not confuse it with console lifetime or remaining circuit time. |
| Circuit/oxygenator identity | Set/model and lot/serial when available, recorded in-service/start timestamp, and the use-duration limit copied from the applicable manufacturer IFU and configuration. |
| Circuit use status | Show elapsed time and the model-specific allowed-use limit as an administrative reminder. Escalate “approaching limit” or “limit reached” to the care team according to an approved workflow; never advise a circuit change or imply that the displayed limit alone decides clinical action. |
| Console maintenance | Last authorized inspection, next due date, overdue state, and source of schedule (manufacturer/service contract). |
| Battery service | Last calibration/test/service date and next due date only if provided by the selected manufacturer workflow. Distinguish current battery telemetry from a maintenance-calendar reminder. |
| Service life / support status | Manufacturer-supported service-life/end-of-support date if supplied for that serial/model. Otherwise show “service-life limit not provided—confirm with manufacturer/biomedical engineering,” not an invented countdown. |
| Data and notifications | ECMO link, monitor self-test, network/call-path state, last data timestamp, last notification delivery and acknowledgement. |

### Status labels and notification routing

- **Normal reporting:** “No active source alarm reported · data current · service schedule current.” This describes what the monitor knows; it does not certify clinical safety.
- **Review soon:** a service or circuit-use reminder is approaching per the imported manufacturer schedule, or a non-urgent status needs staff review. Route to the configured ECMO/biomedical team as a task or notice.
- **Overdue / limit reached:** the schedule says a service event is overdue or a recorded circuit-use limit has been reached. Make this prominent and notify the responsible team according to hospital policy. Do not turn a maintenance reminder into a false “machine failure” emergency call.
- **Urgent equipment alert:** forward an active source-system alarm through the urgent staff path while preserving the original source alarm.
- **Status unavailable:** identity, dates, counters, circuit start time, or the data connection is missing or stale. Show exactly which field is unknown; do not fill gaps with estimates.

The maintenance scheduler must be a **calendar and usage tracker, not predictive-maintenance AI**. It should not promise a component will last until a date, infer remaining safe life from average use, or reset due dates without an authorized service record. A service event is completed only when an authorized person records it.

The manufacturer instructions also distinguish operator checks from authorized service. In the CARDIOHELP instructions, weekly user checks and checking emergency-drive availability before an application appear separately from the annual authorized inspection. The status screen should therefore distinguish **pre-use/clinical checks**, **scheduled technical service**, and **circuit-use records**, rather than show one generic maintenance countdown. [CARDIOHELP Instructions for Use](https://www.getinge.com/dam/hospital/documents/english/mcp-dms-2183212-v12-ifu_-cardiohelp-i_-mcv-ga-10000724-en_-us-102002-en.pdf)

## 14. Short pitch

> “StrideGuard is a proposed read-only safety-monitoring layer for our ECMO trolley. It would surface supported equipment alarms, show what triggered them, track verified run and circuit-use time, display manufacturer-based service dates, and notify the designated hospital team with delivery status. It would show unknown or stale data instead of guessing, and it would not control the ECMO circuit or replace its alarms. At the hackathon, we can demonstrate the workflow using simulated faults and a mock responder dashboard; connection to clinical equipment would require manufacturer integration, clinical risk review and formal verification.”

## Sources

- [ELSO Guidelines for Adult and Pediatric ECMO Circuits](https://pubmed.ncbi.nlm.nih.gov/35089258/).
- [ELSO Guideline: Management of Adult Patients Supported with VV ECMO](https://pmc.ncbi.nlm.nih.gov/articles/PMC8315725/).
- [Alfred ECMO: Emergency alarms](https://ecmo.icu/emergency-alarms/).
- [IEC 60601-1-8 consolidated medical electrical equipment alarm standard](https://webstore.iec.ch/en/publication/67388).
- [FDA: When software functions analyze a signal](https://www.fda.gov/medical-devices/digital-health-center-excellence/step-6-software-function-intended-provide-clinical-decision-support).
- [FDA: Human-factors information for medical-device design](https://www.fda.gov/medical-devices/human-factors-and-medical-devices/human-factors-premarket-information-device-design-and-documentation-processes).
- [Getinge: HLS Set Advanced intended-use duration information](https://www.getinge.com/int/products/hls-set-advanced/).
- [Getinge: CARDIOHELP System Instructions for Use (US, January 2025)](https://www.getinge.com/dam/hospital/documents/english/cardiohelp-system-ifu-2025-01-en-us.pdf).
- [LivaNova: EOS ECMO product information and stated maximum use duration](https://www.livanova.com/cardiopulmonary/en-gb/oxygenators/eos-ecmo).
- [Medtronic: Nautilus ECMO oxygenator indication and stated use duration](https://www.medtronic.com/en-us/products/product.48145E.html).
- [ELSO adult VV ECMO guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC8315725/).
