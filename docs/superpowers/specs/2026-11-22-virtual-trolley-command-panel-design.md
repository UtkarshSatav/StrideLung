# Virtual trolley and live command panel — design

**Date:** 22 November 2026 · **Scope:** `stridelung-web/src/app/simulator/` (the `/simulator` hospital dashboard)
**Status:** proposed, awaiting approval · builder check done (answers folded into §7.3–7.4)

## 1. Intent

The command panel should read as **the StrideLung trolley's own screen (C20), mirrored live to the hospital dashboard**. Every number on it is presented as coming from the trolley's sensors and on-board calculations. When a reading moves out of its normal band while the trolley is working, the hospital is alerted **automatically**, so staff hear about a problem early and risk is reduced.

Today the panel is a scripted sine-wave demo: only pump speed and "circuit load" move the traces, sweep gas / oxygen / water / power settings are cosmetic, faults are one-shot labels pushed by a button, the console never raises an alert by itself, and only the selected unit is "alive".

The user's decisions:

- **One screen.** The command panel is a single screen, explicitly framed as the same screen shown on the product and on the website. No side-by-side "trolley vs hospital" layout, no second device.
- **Data framing.** The website's values are presented as fetched from the product's calculations and sensors.
- **Approach A** (below): a new small virtual-trolley engine.
- **Same 3D model.** The virtual trolley in the panel uses the same isometric trolley model as the landing page.

## 2. Goals

1. A virtual trolley per fleet unit whose readings have causes: settings, faults and time all change them.
2. All 10 fleet units simulate continuously, so alerts fire for units nobody is watching.
3. Alerts are raised by the trolley's own alarm checks against visible **demo bands**, with a short persistence delay so normal wobble does not alarm.
4. The hospital sees each alert's tier, cause, delivery state, acknowledgement and escalation.
5. The landing-page isometric trolley appears in the panel and reflects the selected unit's live state: flows running or stopped, the affected component highlighted, the alarm light flashing.
6. Switching units in the panel does not reset their traces.

## 3. Non-goals

- No real device, network, backend, database, authentication or notification. Everything runs in the browser and resets on reload.
- No patient physiology: no SpO₂, blood gases, haemoglobin, cardiac output, oxygen-transfer index or patient deterioration detection.
- No runtime or "time remaining" estimate for battery or gas (the project's claims rules forbid a runtime claim).
- No changes to Fleet overview layout beyond live values, and none to Assignments, Service & circuits or Commercial scenario views except where new event kinds must appear.
- No change to how the trolley model looks or behaves on the landing page.

## 4. Anti-goals (would make this a failure even if it works)

- Implying the website shows a real sensor feed, or that StrideLung is a working or validated device.
- The hospital view being able to change trolley settings (doc 05: remote commands must never change operating settings).
- Alarm fatigue: alerts firing on ordinary signal wobble.
- "Sent" being presented as "help is coming", or missing data being presented as a device fault.
- A demo that breaks or stalls on stage (must work offline, on one laptop, from a static build).

## 5. Constraints

- Next.js 16.4 / React 19.3, static build (`next build` prerenders `/simulator`). `stridelung-web/AGENTS.md`: read `node_modules/next/dist/docs/` before using framework APIs.
- The trolley figure is a **server component** (`src/trolley/TrolleyFigure.tsx`) that ships finished SVG markup; the dashboard is a client component. The figure must be rendered in the server `page.tsx` and passed into the dashboard as a prop/children.
- The trolley engine (`src/trolley/engine.ts`) is framework-free and drives the SVG imperatively. Changes to it must be additive; existing behaviour on `/` and `/components` must be unchanged.
- Claims discipline (`STRIDELUNG_02` §14, `STRIDELUNG_05` §2, §6, §9, `STRIDELUNG_07` §11): every value labelled simulated; demo limits labelled as demo limits ("not clinical thresholds — set by the ECMO team in a real system"); the monitor never says "safe" or "all clear".
- No test framework exists. Node 24 runs `.ts` directly (the repo already uses `node scripts/*.ts`), so `node --test` is available with no new dependency.

## 6. Approaches considered

| | Approach | Trade-off | Verdict |
|---|---|---|---|
| **A** | New small **virtual-trolley engine** (pure TS), one instance per unit, causal signal model + alarm checks; borrow thermal lag and battery drain ideas from the old engine | Most new code, but each reading has a cause and the scope is exactly equipment-level signals | **Chosen** by the user |
| B | Revive `src/simulator/simulatorEngine.ts` | Much already written, but single-device singleton and emits patient-level outputs (O₂ transfer, Hb, runtime estimate) that conflict with the claims rules; stripping it costs about as much as A | Rejected |
| C | Scripted story (timed sequences played on cue) | Most stage-reliable, but knobs would not change anything — contradicts "data comes from the product's calculations" | Rejected |

## 7. Design

### 7.1 The data path, as presented

A thin strip at the top of the command panel shows the path the data takes in the product:

```
Trolley sensors → Trolley computer (C19) → Hospital network → This dashboard      [Simulated device]
```

Each hop shows live state (e.g. "Hospital network · connected / down"). The tag makes clear that in this demo the trolley is simulated in the browser. Wording proposal: *"Mirrored from the trolley display. In the product these values come from the trolley's sensors and computer; in this demo the trolley is simulated."*

### 7.2 Command panel layout (single screen)

```
┌ Data path strip ─────────────────────────────────────────────────────── [Simulated device] ┐
├───────────────────────────────┬────────────────────────────────────────────────────────────┤
│  Isometric trolley (same      │  TROLLEY DISPLAY · MIRRORED                                 │
│  model as landing page),      │  Waveforms: circuit pressure (pre/post/drain), flow, ΔP     │
│  case open, live flows,       │  — demo bands drawn as shaded zones on each trace           │
│  affected part highlighted,   │  Readout tiles (value + band; tile turns amber/red when out │
│  alarm light flashing         │  of band): pressures, flow, pump speed, sweep gas delivered, │
│                               │  cylinder contents %, water temperature, battery %, source  │
│  Active alarms on the trolley │  Read-only settings line: "Set at trolley: 3000 rpm · …"    │
├───────────────────────────────┴────────────────────────────────────────────────────────────┤
│ AT THE TROLLEY (DEMO) — stands in for staff at the bedside                                  │
│  Settings steppers (pump, sweep, O₂ %, water setpoint, drive, power)  ·  Scenario buttons   │
│  Demo speed 1× / 10×                                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

The mirrored display itself has **no controls**. Settings and scenario buttons live only in the visually separate "At the trolley (demo)" strip. The existing freeze / 15-30-60 s window controls stay (they are viewing controls, not device controls).

### 7.3 Virtual trolley engine

A pure TypeScript module (no React, no DOM), e.g. `src/app/simulator/trolleySim.ts`.

**State per unit:** settings (as today's `ConsoleSettings`), active physical conditions (from scenarios), slow state variables (water temperature, battery %, cylinder contents %, oxygenator resistance), link/network state, alarm trackers, history buffer.

**Signals (equipment-level only):**

| Signal | Driven by |
|---|---|
| Pump speed (rpm) | Setting; 0 in standby |
| Circuit flow (L/min) | Pump speed ÷ total circuit resistance (base + drainage restriction + oxygenator resistance) |
| Drainage pressure (mmHg, negative) | Pump speed and drainage restriction (restriction makes it more negative while flow falls) |
| Pre- / post-oxygenator pressure, ΔP | Flow × oxygenator resistance; ΔP rises as oxygenator resistance creeps |
| Sweep gas delivered (L/min) | Sweep setpoint, falls to 0 when cylinder empties or gas fault active |
| Cylinder contents (%) | Depletes in proportion to delivered sweep (demo rate), unless external gas |
| Water temperature (°C) | First-order lag toward setpoint (idea from old `stepWaterTemp`); drifts toward room temperature during a thermal fault |
| Battery (%) | Holds on mains; drains on battery at a demo rate scaled by pump speed (idea from old engine); no runtime shown |
| Power source | Setting, or forced to battery by "mains unplugged" |

Small deterministic noise (seeded per unit) on fast signals so traces look alive. Sample step stays 125 ms; 60 s history per unit (≈481 samples) kept for all units so switching does not reset.

**Unit activity (builder-check call).** Units with a case assigned are **running**; unassigned units in the equipment bay are **idle**: no simulation of circuit signals, no alarms, shown as "In equipment bay · not running". Assigning a case starts a unit at baseline settings; unassigning stops it and closes nothing automatically.

**Steady by default (builder-check call).** A running unit at the bedside defaults to **mains power and external hospital gas**, so nothing depletes and normal settings sit steadily in band; background units never drift out of band on their own. Battery and cylinder only deplete after the **"Start mobility session"** action switches the selected unit to onboard battery and cylinder gas — which matches the product story (supervised walking). "End mobility session" switches back.

**No unprompted faults (user decision).** Nothing goes wrong on any unit unless the presenter triggers it from the "At the trolley (demo)" strip; there is no background scheduler and no randomness in fault timing. Goal 2 is shown by the presenter: start a slow fault (e.g. "Oxygenator resistance rising") on SL-D-003, switch to SL-D-001, and the SL-D-003 alert arrives in the inbox and notification bar while another unit is on screen. Scenarios therefore persist per unit when the presenter switches away.

**Demo speed (builder-check call).** One global 1× / 10× toggle, labelled "Demo time ×10". It multiplies only the slow variables (battery, cylinder, water temperature, oxygenator creep). Alarm persistence (3 s), stale timeout (5 s), simulated delivery (~1 s) and escalation (30 s) always run on **wall-clock time** and never scale, so speeding up a demo never weakens the anti-wobble rule.

**Scenarios ("At the trolley") — these change physical conditions, not alerts.** The alarm checks decide whether an alert follows.

| Scenario | Physical effect | Model reaction (3D) |
|---|---|---|
| Drainage line restriction | Adds drainage resistance → drain pressure more negative, flow falls | Blood flow overlay in "blocked" mode, C23 highlighted |
| Oxygenator resistance rising | Oxygenator resistance creeps up over ~60 s (demo time) → ΔP climbs | C05 highlighted |
| Gas supply interrupted | Delivered sweep → 0 | Gas flow overlay stops, C13 highlighted |
| Start / end mobility session | Switches to onboard battery + cylinder gas (and back) | Gas and electrical overlays on; C11/C17 briefly highlighted |
| Mains unplugged | Power source → battery, battery drains | C17 highlighted, electrical overlay on |
| Thermal module fault | Water temperature drifts away from setpoint | Water overlay stops, C15 highlighted |
| Pump to standby | Speed and flow → 0 | Blood overlay stops, C06/C07 highlighted |
| Telemetry link lost (this unit) | Trolley keeps running and alarming locally; hospital stops receiving from this unit | Model shows last-known state, greyed, "data stale" |
| Hospital network down (**whole fleet**, global toggle) | No unit's data or alerts reach the dashboard | Same as link lost, for every running unit |
| Service reminder | Routine review item | None |
| Restore normal | Clears all conditions, refills nothing automatically (cylinder/battery stay as they are; a separate "Swap cylinder / plug in" action restores them) | Overlays back to normal |

### 7.4 Alarm checks (on the trolley)

- Each monitored signal has a **demo band** (low/high). Bands are shown as shaded zones on the waveforms and as limits on the readout tiles, labelled "Demo limits — not clinical thresholds."
- An alarm **activates** after the signal stays out of band for a persistence delay (default 3 s of demo time) and **returns to band** after it has been back in band for the same delay. This is the anti-wobble rule.
- Tiers (doc 05 §6): **Urgent** (flow, drainage pressure, pump stopped, gas delivered zero), **Attention** (ΔP rising, water temperature off setpoint, on battery / battery low, cylinder low), **Monitor unavailable** (link lost — raised hospital-side when no report has arrived for the stale timeout, default 5 s), **Routine** (service reminder).
- Active trolley alarms flash the model's alarm light (C21) and list on the panel.

**One incident per cause (builder-check call).** Alarms are grouped by **subsystem**: Blood circuit (flow, drainage pressure, pump stopped), Oxygenator (ΔP), Gas (delivered sweep, cylinder), Power (on battery, battery low), Thermal (water temperature), Link (monitor unavailable), Service. The incident key is unit + subsystem; every alarm in that subsystem attaches to the open incident as a signal entry (name, value, band, time out of band), and the incident's tier is the highest tier among its active signals (a later "battery low" upgrades the open Power incident rather than opening a second one). The model `pick`s the component behind the most severe active incident.

**Lost connection, on one screen (builder-check call).**
- When data stops reaching the dashboard (link lost or network down), the **mirrored display goes stale**: waveforms stop at the last received sample, readouts show the last value greyed with "No data since 12:03:41", and the model greys. It never shows live values the hospital couldn't have received. After the 5 s stale timeout a **Monitor unavailable** incident opens (if the network is down, it is shown on the dashboard but marked as raised hospital-side).
- What the trolley is doing meanwhile is shown in the **"At the trolley (demo)" strip**, which stands for the bedside: "Trolley alarming locally: Blood circuit — low flow" and "Trolley outbox: 2 alerts waiting to send". The strip is explicitly not part of the mirrored screen.
- When the connection returns, the gap in the traces is **left as a gap** (honest about the missing data), queued alerts are delivered and marked "Delivered late (queued 12:03:44)", and the stale state clears.

### 7.5 Hospital alert workflow

- An alarm activation creates an incident (or, if one of the same subsystem is already open for that unit, updates it — same de-duplication principle as today's `receiveUpdate`).
- **Delivery state:** Queued → Delivered (simulated ~1 s) → Acknowledged → Closed. With the network down the incident stays **Delivery failed / queued**, the trolley still alarms locally, and delivery completes when the network returns. The UI never says help is coming.
- **Return to band** marks the incident "Signal back in band" but does **not** close it; a person must acknowledge and close it (doc 05 §6 step 7).
- **Escalation:** if not acknowledged within a demo timer (default 30 s), the incident is escalated to a secondary team, shown in the inbox. Labelled "Demo escalation timer — set by hospital policy in a real system."
- Snapshot: the existing SVG snapshot gains the triggering signal, its value, the band and the time out of band.
- Fleet overview, nav badge and notification bar update live from the same incidents. The manual "Send simulated update" button goes away (alerts now come from the trolley); the "Restore demo signal" role moves to the scenario strip's "Restore normal".

### 7.6 The 3D model in the panel

- `page.tsx` (server) renders the trolley figure and passes it into `HospitalDashboard` as a prop; the command panel mounts it in its own stage.
- A new panel-specific stage component (alongside `TrolleyStage` / `HeroTrolleyStage`) creates the engine with the case **open**, no auto-tour, keyboard shortcuts limited so they don't fight the dashboard.
- The panel maps live state → engine calls each time the selected unit's state changes (not every sample): `setFlows([...])` for whichever circuits are running, `setBlocked()` for drainage restriction, `pick(id)` for the component behind the most severe active alarm, `setGasExternal()` if external gas is chosen.
- Additive engine changes:
  - `setAlarm(on)` to flash the C21 alarm light independently of `blocked`.
  - `setTelemetry(values | null)` so the model's own small screen (C20) shows the same live flow/pressure values instead of its synthetic ones when the panel supplies them — reinforcing "this is the same screen as the product". When not called (landing page) behaviour is unchanged.
  - A stale/greyed attribute for "data stale".

### 7.7 Cleanup

`src/simulator/*` is leftover from the replaced simulator; only `WaveformCanvas.tsx` is used (and it imports a type from `simulatorEngine.ts`). Move `WaveformCanvas` next to the dashboard, inline its type, extend it to draw demo bands, and delete the rest of `src/simulator/` (including `simulator.css` and the Alwardt data). Update the READMEs' dashboard sections.

## 8. Testing

- Engine and alarm logic are pure functions → unit tests with `node --test` (no new dependency): flow falls with restriction; ΔP rises with oxygenator creep; battery holds on mains and drains on battery; persistence delay ignores short excursions; return-to-band does not close an incident; de-duplication; network-down delivery; escalation timer.
- `next build` passes; manual walk-through of each scenario on `/simulator`; landing-page explorer unchanged (open/explode/flows/blocked/tour).

## 9. Left to the builder

- Exact demo band values, demo rates and signal formulas, as long as normal settings sit comfortably in band and each scenario visibly crosses a band within ~10 s at 10× (slow faults) or ~5 s (fast faults).
- Visual styling within the existing `ops-*` / `console-*` design language and colour tokens.
- How the model stage is sized/cropped in the panel and responsive behaviour below tablet width.
- File split inside `src/app/simulator/`.
