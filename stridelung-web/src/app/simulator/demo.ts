export const SCENARIOS = {
  status: { label: "Normal status update", subsystem: "Console" },
  link: { label: "Telemetry interrupted", subsystem: "Connection", priority: "High", team: "Hospital IT / Biomed" },
  power: { label: "Battery reserve reported", subsystem: "Power", priority: "High", team: "Biomedical engineering" },
  circuit: { label: "Circuit status flagged", subsystem: "Circuit", priority: "High", team: "ECMO response team" },
  service: { label: "Service review requested", subsystem: "Service", priority: "Routine", team: "Biomedical engineering" },
} as const;

export type Scenario = keyof typeof SCENARIOS;
export type Fault = Exclude<Scenario, "status">;
export type Device = {
  id: string;
  caseId: string | null;
  location: string;
  signal: Scenario;
  updatedAt: number | null;
};
export type Incident = {
  id: string;
  deviceId: string;
  caseId: string | null;
  location: string;
  kind: Fault;
  createdAt: number;
  acknowledgedAt?: number;
  closedAt?: number;
};
export type Session = { devices: Device[]; incidents: Incident[]; nextId: number };

export const INITIAL_SESSION: Session = {
  devices: Array.from({ length: 10 }, (_, i) => ({
    id: `SL-D-${String(i + 1).padStart(3, "0")}`,
    caseId: i < 6 ? `DEMO-${104 + i}` : null,
    location: i < 6 ? `ICU · Bay ${i + 1}` : "Equipment bay",
    signal: "status",
    updatedAt: null,
  })),
  incidents: [],
  nextId: 1,
};

export function receiveUpdate(session: Session, deviceId: string, scenario: Scenario, now: number): Session {
  const device = session.devices.find((unit) => unit.id === deviceId);
  if (!device) return session;
  const devices = session.devices.map((unit) =>
    unit.id === deviceId ? { ...unit, signal: scenario, updatedAt: now } : unit,
  );
  if (scenario === "status" || session.incidents.some(
    (event) => event.deviceId === deviceId && event.kind === scenario && !event.closedAt,
  )) return { ...session, devices };

  return {
    devices,
    nextId: session.nextId + 1,
    incidents: [{
      id: `EVT-${String(session.nextId).padStart(3, "0")}`,
      deviceId,
      caseId: device.caseId,
      location: device.location,
      kind: scenario,
      createdAt: now,
    }, ...session.incidents],
  };
}

export const displayTime = (time: number | null | undefined) =>
  time == null ? "Demo baseline" : new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const eventState = (event: Incident) =>
  event.closedAt ? "Closed" : event.acknowledgedAt ? "Acknowledged" : "New";

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char] ?? char);
}

export function eventSnapshot(event: Incident) {
  const report = SCENARIOS[event.kind];
  const color = report.priority === "High" ? "#ff9869" : "#f8cf74";
  const zones = ["Connection", "Power", "Circuit", "Service"];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 280" width="560" height="280">
    <rect width="560" height="280" rx="16" fill="#16212a"/>
    <g font-family="system-ui, sans-serif">
      <text x="26" y="33" fill="#aab9c4" font-size="13">STRIDELUNG · SIMULATED EVENT SNAPSHOT</text>
      <text x="26" y="65" fill="#fff" font-size="22" font-weight="700">${escapeXml(report.label)}</text>
      <text x="26" y="89" fill="#cbd5dc" font-size="13">${escapeXml(event.deviceId)} · ${escapeXml(event.caseId ?? "Unassigned")} · ${escapeXml(event.location)}</text>
      ${zones.map((zone, i) => {
        const x = 26 + i * 130;
        const active = zone === report.subsystem;
        return `<rect x="${x}" y="116" width="118" height="76" rx="9" fill="#24323e" stroke="${active ? color : "#40515e"}" stroke-width="${active ? 2 : 1}"/>
          <text x="${x + 12}" y="144" fill="#e0e7ed" font-size="13">${zone}</text>
          <text x="${x + 12}" y="171" fill="${active ? color : "#aab9c4"}" font-size="12">${active ? "Reported event" : "No event shown"}</text>`;
      }).join("")}
      <text x="26" y="226" fill="${color}" font-size="13" font-weight="700">${report.priority} priority · ${escapeXml(event.id)}</text>
      <text x="26" y="251" fill="#aab9c4" font-size="12">${escapeXml(new Date(event.createdAt).toISOString())} · Synthetic device record</text>
    </g>
  </svg>`;
}
