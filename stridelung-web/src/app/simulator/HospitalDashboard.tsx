"use client";

import Link from "next/link";
import { useState } from "react";
import { DeviceConsole } from "./DeviceConsole";
import { BASELINE_SETTINGS, type ConsoleSettings } from "./consoleModel";
import {
  displayTime, eventSnapshot, eventState, INITIAL_SESSION, receiveUpdate, SCENARIOS,
  type Device, type Incident, type Scenario,
} from "./demo";

const VIEWS = ["Fleet overview", "Command panel", "Alert inbox", "Assignments", "Service & circuits", "Commercial scenario"] as const;
type View = typeof VIEWS[number];
const CASE_POOL = INITIAL_SESSION.devices.flatMap((unit) => unit.caseId ? [unit.caseId] : []).concat(["DEMO-110", "DEMO-111", "DEMO-112", "DEMO-113"]);

function Signal({ signal }: { signal: Scenario }) {
  const tone = signal === "status" ? "good" : signal === "service" ? "routine" : "urgent";
  return <span className={`ops-chip ${tone}`}>{signal === "status" ? "Reporting" : SCENARIOS[signal].label}</span>;
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

export default function HospitalDashboard() {
  const [session, setSession] = useState(INITIAL_SESSION);
  const [view, setView] = useState<View>("Fleet overview");
  const [deviceId, setDeviceId] = useState(INITIAL_SESSION.devices[0].id);
  const [consoleSettings, setConsoleSettings] = useState<Record<string, ConsoleSettings>>({});
  const [alertId, setAlertId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const device: Device = session.devices.find((unit) => unit.id === deviceId) ?? session.devices[0];
  const openEvents = session.incidents.filter((event) => !event.closedAt);
  const newEvents = openEvents.filter((event) => !event.acknowledgedAt);
  const assigned = session.devices.filter((unit) => unit.caseId).length;
  const incident = session.incidents.find((event) => event.id === alertId) ?? openEvents[0] ?? session.incidents[0];
  const deviceEvents = session.incidents.filter((event) => event.deviceId === device.id);

  function notifyUpdate(nextScenario: Scenario) {
    const now = Date.now();
    const next = receiveUpdate(session, device.id, nextScenario, now);
    setSession(next);
    if (nextScenario === "status") {
      setMessage(`${device.id} reported normal demo status.`);
      return;
    }
    const event = next.incidents.find((entry) => entry.deviceId === device.id && entry.kind === nextScenario && !entry.closedAt);
    if (event) setAlertId(event.id);
    setMessage(`${device.id} · ${SCENARIOS[nextScenario].label}. ${next.nextId === session.nextId ? "The corresponding alert is already open." : "New alert in the hospital inbox."}`);
  }

  function openDevice(id: string) {
    setDeviceId(id);
    setView("Command panel");
  }

  function openAlert(id: string) {
    setAlertId(id);
    setView("Alert inbox");
  }

  function updateIncident(event: Incident, action: "acknowledge" | "close") {
    const now = Date.now();
    setSession((current) => ({
      ...current,
      incidents: current.incidents.map((entry) => {
        if (entry.id !== event.id || entry.closedAt) return entry;
        if (action === "acknowledge") return { ...entry, acknowledgedAt: entry.acknowledgedAt ?? now };
        return entry.acknowledgedAt ? { ...entry, closedAt: now } : entry;
      }),
    }));
    setMessage(action === "acknowledge" ? `${event.id} assigned in the demo to ${SCENARIOS[event.kind].team}.` : `${event.id} review closed.`);
  }

  function setAssignment(id: string, caseId: string | null) {
    setSession((current) => {
      if (caseId && current.devices.some((unit) => unit.id !== id && unit.caseId === caseId)) return current;
      return { ...current, devices: current.devices.map((unit) => unit.id === id ? {
        ...unit, caseId, location: caseId ? unit.caseId ? unit.location : "Staging · Demo ward" : "Equipment bay",
      } : unit) };
    });
    setMessage(caseId ? `${caseId} assigned to ${id}.` : `${id} returned to the equipment bay.`);
  }

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
            <div><h1>{view}</h1><p>{view === "Command panel" ? "Monitor and adjust a simulated device. No medical hardware is connected." : "Simulated records and signals for the StrideLung trolley."}</p></div>
            {view === "Command panel" && <label>Device<select value={device.id} onChange={(event) => setDeviceId(event.target.value)}>
              {session.devices.map((unit) => <option key={unit.id} value={unit.id}>{unit.id} · {unit.caseId ?? "Unassigned"}</option>)}
            </select></label>}
            {view !== "Command panel" && <button className="ops-primary" onClick={() => setView("Command panel")}>Open command panel</button>}
          </div>
          <div className="ops-notification" aria-live="polite" role="status">
            {message && <span>{message}</span>}
            {newEvents.length > 0 && view !== "Alert inbox" && <button onClick={() => openAlert(newEvents[0].id)}>Review newest alert</button>}
          </div>

          {view === "Fleet overview" && <>
            <div className="ops-stats">
              <div><span>Fleet units</span><b>{session.devices.length}</b><small>StrideLung 01 · Concept</small></div>
              <div><span>Assigned units</span><b>{assigned}</b><small>{session.devices.length - assigned} available</small></div>
              <div><span>Open alerts</span><b>{openEvents.length}</b><small>{newEvents.length} awaiting acknowledgment</small></div>
            </div>
            <section className="ops-card">
              <h2>Device fleet</h2>
              <div className="ops-table-scroll"><table>
                <thead><tr><th>Device</th><th>Assignment</th><th>Latest signal</th><th>Updated</th><th>Monitor</th></tr></thead>
                <tbody>{session.devices.map((unit) => <tr key={unit.id}>
                  <th scope="row">{unit.id}</th><td>{unit.caseId ?? "Unassigned"}<small>{unit.location}</small></td>
                  <td><Signal signal={unit.signal} /></td><td>{displayTime(unit.updatedAt)}</td>
                  <td><button aria-label={`Monitor ${unit.id}`} onClick={() => openDevice(unit.id)}>Monitor</button></td>
                </tr>)}</tbody>
              </table></div>
            </section>
          </>}

          {view === "Command panel" && <>
            <DeviceConsole
              key={device.id}
              device={device}
              settings={consoleSettings[device.id] ?? BASELINE_SETTINGS}
              onSettings={(settings) => setConsoleSettings((current) => ({ ...current, [device.id]: settings }))}
              onReport={notifyUpdate}
            />
            <section className="ops-card">
              <h2>Events for {device.id}</h2>
              {deviceEvents.length === 0 ? <p>Send a fault scenario to see the alert and snapshot appear here.</p> : <ul className="ops-events">
                {deviceEvents.map((event) => <li key={event.id}><button onClick={() => openAlert(event.id)}>
                  <span><b>{SCENARIOS[event.kind].label}</b><small>{event.id} · {displayTime(event.createdAt)}</small></span>
                  <span className="ops-chip">{eventState(event)}</span>
                </button></li>)}
              </ul>}
            </section>
          </>}

          {view === "Alert inbox" && <div className="ops-inbox">
            <section className="ops-card"><h2>Hospital alert queue</h2>
              {session.incidents.length === 0 ? <p>Run a fault scenario from the command panel to populate the inbox.</p> : <ul className="ops-events">
                {session.incidents.map((event) => <li key={event.id}>
                  <button aria-pressed={incident?.id === event.id} onClick={() => setAlertId(event.id)}>
                    <span><b>{SCENARIOS[event.kind].label}</b><small>{event.deviceId} · {displayTime(event.createdAt)}</small></span>
                    <span className={`ops-chip ${!event.closedAt && SCENARIOS[event.kind].priority === "High" ? "urgent" : ""}`}>{eventState(event)}</span>
                  </button>
                </li>)}
              </ul>}
            </section>
            {incident && <section className="ops-card">
              <div className="ops-alert-title"><h2>{SCENARIOS[incident.kind].label}</h2><span className="ops-chip routine">{SCENARIOS[incident.kind].priority} priority</span></div>
              <p>{incident.id} · {incident.deviceId} · {incident.caseId ?? "Unassigned"} · {incident.location}</p>
              {/* The same generated image is used for the preview and the download. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ops-snapshot" width={560} height={280} alt={`Simulated ${SCENARIOS[incident.kind].subsystem.toLowerCase()} alert snapshot for ${incident.deviceId}`}
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(eventSnapshot(incident))}`} />
              <div className="ops-next"><b>Next step</b><p>{incident.closedAt ? `Review closed at ${displayTime(incident.closedAt)}.` : incident.acknowledgedAt
                ? `Review assigned to ${SCENARIOS[incident.kind].team} at ${displayTime(incident.acknowledgedAt)}. Open the command panel before closing the demo review.`
                : `Acknowledge the report and assign the demo review to ${SCENARIOS[incident.kind].team}.`}</p></div>
              <div className="ops-actions">
                {!incident.acknowledgedAt && <button className="ops-primary" onClick={() => updateIncident(incident, "acknowledge")}>Acknowledge and assign</button>}
                {incident.acknowledgedAt && !incident.closedAt && <button className="ops-primary" onClick={() => updateIncident(incident, "close")}>Close demo review</button>}
                <button onClick={() => openDevice(incident.deviceId)}>Open device panel</button>
                <a className="ops-button" download={`${incident.id}-snapshot.svg`} href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(eventSnapshot(incident))}`}>Download snapshot</a>
              </div>
            </section>}
          </div>}

          {view === "Assignments" && <section className="ops-card">
            <h2>Fictional case assignments</h2>
            <p>Assign an available demo case or return a unit to the equipment bay.</p>
            <div className="ops-table-scroll"><table>
              <thead><tr><th>Device</th><th>Location</th><th>Case assignment</th></tr></thead>
              <tbody>{session.devices.map((unit) => <tr key={unit.id}><th scope="row">{unit.id}</th><td>{unit.location}</td><td>
                <select aria-label={`Case for ${unit.id}`} value={unit.caseId ?? ""} onChange={(e) => setAssignment(unit.id, e.target.value || null)}>
                  <option value="">Unassigned</option>
                  {CASE_POOL.filter((id) => id === unit.caseId || !session.devices.some((entry) => entry.caseId === id)).map((id) => <option key={id}>{id}</option>)}
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
                {session.incidents.filter((event) => event.kind === "service").map((event) => <tr key={event.id}>
                  <th scope="row">{event.deviceId}</th><td>Service review · {event.id}</td><td>Biomedical engineering</td><td><button onClick={() => openAlert(event.id)}>{eventState(event)} · Open record</button></td>
                </tr>)}
              </tbody>
            </table></div>
          </section>}

          {view === "Commercial scenario" && <CommercialScenario />}
          <p className="ops-footer">Demo session · Changes reset on reload · Notifications appear in this workspace</p>
        </div>
      </div>
    </div>
  );
}
