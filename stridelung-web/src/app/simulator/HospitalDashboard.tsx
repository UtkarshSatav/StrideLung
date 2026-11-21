"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { CommandPanel } from "./CommandPanel";
import { ALARMS, SUBSYSTEMS, tierRank, type Incident } from "./alerts";
import { createFleet, FLEET_ID, SAMPLE_MS, type Unit } from "./fleet";
import { deliveryLine, displayTime, escalationLine, eventSnapshot, eventState, teamFor, TIER_LABEL, unitLabel } from "./demo";

const VIEWS = ["Fleet overview", "Command panel", "Alert inbox", "Assignments", "Service & circuits", "Commercial scenario"] as const;
type View = typeof VIEWS[number];
const CASE_POOL = Array.from({ length: 10 }, (_, i) => `DEMO-${104 + i}`);

/** what the hospital can see: delivered incidents, as last received */
const visible = (e: Incident) => e.hospital !== null;
const isNew = (e: Incident) => visible(e) && !e.acknowledgedAt && !e.closedAt;
const tierOf = (e: Incident) => e.hospital?.tier ?? e.tier;

function UnitStatus({ unit, incidents, connected }: { unit: Unit; incidents: Incident[]; connected: boolean }) {
  if (!unit.caseId) return <span className="ops-chip">Not running</span>;
  if (!connected) return <span className="ops-chip urgent">No data</span>;
  const open = incidents.filter((e) => e.deviceId === unit.id && visible(e) && !e.closedAt && !e.hospital?.backInBand);
  if (open.length === 0) return <span className="ops-chip good">Reporting · no active alert</span>;
  const worst = open.reduce((a, b) => (tierRank(tierOf(b)) > tierRank(tierOf(a)) ? b : a));
  const tone = tierOf(worst) === "urgent" || tierOf(worst) === "unavailable" ? "urgent" : "routine";
  return <span className={`ops-chip ${tone}`}>{TIER_LABEL[tierOf(worst)]} · {SUBSYSTEMS[worst.subsystem].label}</span>;
}

function CommercialScenario() {
  const [units, setUnits] = useState("10");
  const [price, setPrice] = useState("250000");
  const [discount, setDiscount] = useState("10");
  const [manufacturing, setManufacturing] = useState("150000");
  const [deployment, setDeployment] = useState("20000");
  const quantity = Math.max(0, Math.trunc(Number(units)));
  const netPrice = Math.max(0, Number(price)) * (1 - Math.max(0, Math.min(100, Number(discount))) / 100);
  const directCost = Math.max(0, Number(manufacturing)) + Math.max(0, Number(deployment));
  const contribution = netPrice - directCost;
  const inr = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  return (
    <section className="ops-card">
      <h2>Commercial scenario</h2>
      <p>Planning assumptions for a hospital order.</p>
      <div className="ops-fields">
        <label>Units<input type="number" min="0" step="1" value={units} onChange={(e) => setUnits(e.target.value)} /></label>
        <label>List price per unit (₹)<input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
        <label>Institutional discount (%)<input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} /></label>
        <label>Manufacturing per unit (₹)<input type="number" min="0" value={manufacturing} onChange={(e) => setManufacturing(e.target.value)} /></label>
        <label>Installation and warranty per unit (₹)<input type="number" min="0" value={deployment} onChange={(e) => setDeployment(e.target.value)} /></label>
      </div>
      <dl className="ops-readings">
        <div><dt>Equipment revenue</dt><dd>{inr(netPrice * quantity)}</dd></div>
        <div><dt>Direct cost per unit</dt><dd>{inr(directCost)}</dd></div>
        <div><dt>Contribution per unit</dt><dd>{inr(contribution)}</dd></div>
        <div><dt>Order contribution</dt><dd>{inr(contribution * quantity)}</dd></div>
      </dl>
      <p>Contribution excludes operating expenses. Optional annual AMC of ₹20,000 per unit and the ₹12,000 annual portal subscription per hospital are billed separately. Hospital procedure charges belong to the hospital. Consumable pricing awaits a supplier quote.</p>
    </section>
  );
}

export default function HospitalDashboard({ model }: { model: ReactNode }) {
  const [fleet] = useState(() => createFleet(Date.now()));
  const snapshot = useSyncExternalStore(fleet.subscribe, fleet.getSnapshot, fleet.getSnapshot);
  const [view, setView] = useState<View>("Fleet overview");
  const [deviceId, setDeviceId] = useState(snapshot.units[0].id);
  const [alertId, setAlertId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  // clock times differ between the prerendered page and the browser: show them only after hydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const timer = window.setInterval(() => fleet.step(Date.now()), SAMPLE_MS);
    return () => window.clearInterval(timer);
  }, [fleet]);

  const { units } = snapshot;
  const seen = snapshot.incidents.filter(visible);
  const openEvents = seen.filter((e) => !e.closedAt);
  const newEvents = seen.filter(isNew);
  const running = units.filter((u) => u.caseId).length;
  const incident = seen.find((e) => e.id === alertId) ?? openEvents[0] ?? seen[0];
  const deviceEvents = seen.filter((e) => e.deviceId === deviceId);
  const connected = (u: Unit) => snapshot.network && !u.sim.conditions.linkLost;

  function openDevice(id: string) {
    setDeviceId(id);
    setView("Command panel");
  }
  function openAlert(id: string) {
    setAlertId(id);
    setView("Alert inbox");
  }
  function acknowledge(event: Incident) {
    fleet.acknowledge(event.id);
    setMessage(`${event.id} acknowledged and assigned in the demo to ${teamFor(event)}.`);
  }
  function close(event: Incident) {
    fleet.close(event.id);
    setMessage(`${event.id} review closed.`);
  }
  function assign(id: string, caseId: string | null) {
    fleet.assign(id, caseId);
    setMessage(caseId ? `${caseId} assigned to ${id}. The unit is now running.` : `${id} returned to the equipment bay and stopped.`);
  }

  const newest = newEvents[0];

  return (
    <div className="ops">
      <header className="ops-header">
        <div className="ops-header-inner">
          <Link href="/" className="ops-brand"><span className="ops-mark" aria-hidden="true">S</span><span>StrideLung <small>Hospital operations</small></span></Link>
          <div className="ops-site"><b>St. Anne’s Medical Center</b><small>Fictional hospital workspace</small></div>
          <div className="ops-header-links"><span className="ops-chip routine">Simulation only</span><Link href="/">Product site</Link></div>
        </div>
        <nav className="ops-nav" aria-label="Hospital operations">
          {VIEWS.map((item) => <button key={item} type="button" aria-current={view === item ? "page" : undefined} onClick={() => setView(item)}>
            {item}{item === "Alert inbox" && newEvents.length > 0 && <span className="ops-count" aria-label={`${newEvents.length} new alerts`}>{newEvents.length}</span>}
          </button>)}
        </nav>
      </header>
      <div className="ops-shell">
        <div className="ops-main">
          <div className="ops-heading">
            <div><h1>{view}</h1><p>{view === "Command panel" ? "The trolley’s own display, mirrored to the hospital. Alerts come from the trolley’s checks, not from this screen." : "Simulated records and signals for the StrideLung trolley fleet."}</p></div>
            {view === "Command panel" && <label>Device<select value={deviceId} onChange={(event) => setDeviceId(event.target.value)}>
              {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.id} · {unit.caseId ?? "Not running"}</option>)}
            </select></label>}
            {view !== "Command panel" && <button className="ops-primary" onClick={() => setView("Command panel")}>Open command panel</button>}
          </div>
          <div className="ops-notification" aria-live="polite" role="status">
            {message && <span>{message}</span>}
            {newest && !(view === "Alert inbox" && incident?.id === newest.id) && <>
              <span className={`ops-chip ${tierOf(newest) === "urgent" ? "urgent" : "routine"}`}>New alert</span>
              <span>{unitLabel(newest.deviceId)} · {SUBSYSTEMS[newest.subsystem].label} · {TIER_LABEL[tierOf(newest)]}{newest.deviceId !== deviceId && view === "Command panel" ? " — from a unit you are not viewing" : ""}</span>
              <button onClick={() => openAlert(newest.id)}>Review</button>
            </>}
          </div>

          {view === "Fleet overview" && <>
            <div className="ops-stats">
              <div><span>Running units</span><b>{running}</b><small>{units.length - running} in equipment bay</small></div>
              <div><span>Open alerts</span><b>{openEvents.length}</b><small>{newEvents.length} awaiting acknowledgment</small></div>
              <div><span>Hospital network</span><b>{snapshot.network ? "Up" : "Down"}</b><small>{snapshot.network ? "Receiving trolley reports" : "No trolley data arriving"}</small></div>
            </div>
            <section className="ops-card">
              <h2>Device fleet</h2>
              <div className="ops-table-scroll"><table>
                <thead><tr><th>Device</th><th>Assignment</th><th>Status</th><th>Last report</th><th>Monitor</th></tr></thead>
                <tbody>{units.map((unit) => <tr key={unit.id}>
                  <th scope="row">{unit.id}</th><td>{unit.caseId ?? "Unassigned"}<small>{unit.location}</small></td>
                  <td><UnitStatus unit={unit} incidents={snapshot.incidents} connected={connected(unit)} /></td>
                  <td>{unit.caseId && hydrated ? displayTime(unit.lastReceivedAt) : "—"}</td>
                  <td><button aria-label={`Monitor ${unit.id}`} onClick={() => openDevice(unit.id)}>Monitor</button></td>
                </tr>)}</tbody>
              </table></div>
            </section>
          </>}

          {view === "Command panel" && <>
            <CommandPanel fleet={fleet} snapshot={snapshot} unitId={deviceId} model={model} />
            <section className="ops-card">
              <h2>Alerts received from {deviceId}</h2>
              {deviceEvents.length === 0 ? <p>No alert received. Trigger a scenario in the “At the trolley” strip; the trolley’s own checks decide whether an alert follows.</p> : <ul className="ops-events">
                {deviceEvents.map((event) => <li key={event.id}><button onClick={() => openAlert(event.id)}>
                  <span><b>{SUBSYSTEMS[event.subsystem].label} · {TIER_LABEL[tierOf(event)]}</b><small>{event.id} · {deliveryLine(event)}</small></span>
                  <span className="ops-chip">{eventState(event)}</span>
                </button></li>)}
              </ul>}
            </section>
          </>}

          {view === "Alert inbox" && <div className="ops-inbox">
            <section className="ops-card"><h2>Hospital alert queue</h2>
              {seen.length === 0 ? <p>No alerts yet. Alerts arrive automatically when a running trolley’s reading stays outside its demo limit.</p> : <ul className="ops-events">
                {seen.map((event) => <li key={event.id}>
                  <button aria-pressed={incident?.id === event.id} onClick={() => setAlertId(event.id)}>
                    <span><b>{SUBSYSTEMS[event.subsystem].label} · {unitLabel(event.deviceId)}</b><small>{TIER_LABEL[tierOf(event)]} · {displayTime(event.deliveredAt)}{event.late ? " · late" : ""}</small></span>
                    <span className={`ops-chip ${!event.closedAt && (tierOf(event) === "urgent" || tierOf(event) === "unavailable") ? "urgent" : ""}`}>{eventState(event)}</span>
                  </button>
                </li>)}
              </ul>}
            </section>
            {incident && incident.hospital && <section className="ops-card">
              <div className="ops-alert-title"><h2>{SUBSYSTEMS[incident.subsystem].label}</h2><span className={`ops-chip ${tierOf(incident) === "urgent" ? "urgent" : "routine"}`}>{TIER_LABEL[tierOf(incident)]}</span></div>
              <p>{incident.id} · {unitLabel(incident.deviceId)} · {incident.deviceId === FLEET_ID ? "Hospital network outage" : incident.caseId ?? "Unassigned"} · {incident.location}</p>
              <div className="ops-delivery">
                <span>{deliveryLine(incident)}</span>
                {incident.hospital.backInBand && <span className="ops-chip good">Signals back in band — review still open</span>}
              </div>
              <div className="ops-table-scroll"><table>
                <thead><tr><th>Signal</th><th>Reading</th><th>Demo limit</th><th>State</th></tr></thead>
                <tbody>{incident.hospital.signals.map((s) => <tr key={s.alarm}>
                  <th scope="row">{ALARMS[s.alarm].label}</th><td>{s.value}</td><td>{ALARMS[s.alarm].band}</td>
                  <td>{s.active ? `Out of band since ${displayTime(s.since)}` : `Back in band at ${displayTime(s.clearedAt)}`}</td>
                </tr>)}</tbody>
              </table></div>
              {/* The same generated image is used for the preview and the download. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ops-snapshot" width={560} height={330} alt={`Simulated ${SUBSYSTEMS[incident.subsystem].label.toLowerCase()} alert snapshot for ${unitLabel(incident.deviceId)}`}
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(eventSnapshot(incident))}`} />
              <div className="ops-next"><b>Next step</b><p>{incident.closedAt ? `Review closed at ${displayTime(incident.closedAt)}.` : incident.acknowledgedAt
                ? `Assigned to ${teamFor(incident)} at ${displayTime(incident.acknowledgedAt)}. Check the command panel before closing the demo review.`
                : `Acknowledge the alert and assign the demo review to ${teamFor(incident)}. Acknowledging here does not silence the trolley’s own alarm.`}</p>
                {escalationLine(incident) && <p className="ops-escalated">{escalationLine(incident)}</p>}
              </div>
              <div className="ops-actions">
                {!incident.acknowledgedAt && !incident.closedAt && <button className="ops-primary" onClick={() => acknowledge(incident)}>Acknowledge and assign</button>}
                {incident.acknowledgedAt && !incident.closedAt && <button className="ops-primary" onClick={() => close(incident)}>Close demo review</button>}
                {incident.deviceId !== FLEET_ID && <button onClick={() => openDevice(incident.deviceId)}>Open device panel</button>}
                <a className="ops-button" download={`${incident.id}-snapshot.svg`} href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(eventSnapshot(incident))}`}>Download snapshot</a>
              </div>
            </section>}
          </div>}

          {view === "Assignments" && <section className="ops-card">
            <h2>Fictional case assignments</h2>
            <p>Assigning a demo case starts a unit; returning it to the equipment bay stops it. Open alerts stay in the inbox for review.</p>
            <div className="ops-table-scroll"><table>
              <thead><tr><th>Device</th><th>Location</th><th>Case assignment</th></tr></thead>
              <tbody>{units.map((unit) => <tr key={unit.id}><th scope="row">{unit.id}</th><td>{unit.location}</td><td>
                <select aria-label={`Case for ${unit.id}`} value={unit.caseId ?? ""} onChange={(e) => assign(unit.id, e.target.value || null)}>
                  <option value="">Unassigned</option>
                  {CASE_POOL.filter((id) => id === unit.caseId || !units.some((entry) => entry.caseId === id)).map((id) => <option key={id}>{id}</option>)}
                </select>
              </td></tr>)}</tbody>
            </table></div>
          </section>}

          {view === "Service & circuits" && <section className="ops-card">
            <h2>Service and circuit review</h2>
            <p>Example inspection and inventory records. Circuit use limits require the validated instructions for the selected set.</p>
            <div className="ops-table-scroll"><table>
              <thead><tr><th>Device</th><th>Record</th><th>Team</th><th>Status</th></tr></thead>
              <tbody>
                <tr><th scope="row">SL-D-001</th><td>Equipment inspection</td><td>Biomedical engineering</td><td>Planned demo check</td></tr>
                <tr><th scope="row">SL-D-002</th><td>Circuit kit inventory</td><td>Supply team</td><td>Supplier quote pending</td></tr>
                {seen.filter((event) => event.subsystem === "service").map((event) => <tr key={event.id}>
                  <th scope="row">{event.deviceId}</th><td>Service review · {event.id}</td><td>{teamFor(event)}</td><td><button onClick={() => openAlert(event.id)}>{eventState(event)} · Open record</button></td>
                </tr>)}
              </tbody>
            </table></div>
          </section>}

          {view === "Commercial scenario" && <CommercialScenario />}
          <p className="ops-footer">Demo session · Simulated devices · Changes reset on reload · Notifications appear in this workspace only</p>
        </div>
      </div>
    </div>
  );
}
