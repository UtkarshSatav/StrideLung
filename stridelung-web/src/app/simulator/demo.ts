// Display helpers and the downloadable alert snapshot for the hospital dashboard demo.
import { ALARMS, ESCALATION_TEAM, SUBSYSTEMS, type Incident, type Tier } from "./alerts";
import { FLEET_ID } from "./fleet";

export const unitLabel = (id: string) => (id === FLEET_ID ? "All units" : id);

export const displayTime = (time: number | null | undefined) =>
  time == null ? "—" : new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const TIER_LABEL: Record<Tier, string> = { urgent: "Urgent", attention: "Attention", unavailable: "Monitor unavailable", routine: "Routine" };

export const eventState = (event: Incident) =>
  event.closedAt ? "Closed" : event.acknowledgedAt ? "Acknowledged" : event.escalatedAt !== undefined ? "Escalated" : "New";

export const deliveryLine = (event: Incident) =>
  event.hospitalSide ? `Raised by the dashboard at ${displayTime(event.deliveredAt)}`
    : event.late ? `Delivered late at ${displayTime(event.deliveredAt)} · queued on the trolley from ${displayTime(event.createdAt)}`
    : `Delivered at ${displayTime(event.deliveredAt)}`;

export const teamFor = (event: Incident) => SUBSYSTEMS[event.subsystem].team;
export const escalationLine = (event: Incident) =>
  event.escalatedAt === undefined ? null : `Not acknowledged in time — escalated to ${ESCALATION_TEAM} at ${displayTime(event.escalatedAt)} (demo escalation timer — set by hospital policy in a real system).`;

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char] ?? char);
}

/** SVG snapshot of what the hospital received for this incident. */
export function eventSnapshot(event: Incident) {
  const view = event.hospital ?? { tier: event.tier, signals: event.signals, backInBand: event.backInBand, syncedAt: event.createdAt };
  const urgent = view.tier === "urgent";
  const color = urgent ? "#ff9869" : view.tier === "routine" ? "#aab9c4" : "#f8cf74";
  const rows = view.signals.slice(0, 4).map((s, i) => {
    const def = ALARMS[s.alarm];
    const y = 106 + i * 46;
    const state = s.active ? `out of band since ${displayTime(s.since)}` : `back in band at ${displayTime(s.clearedAt)}`;
    return `<rect x="26" y="${y}" width="508" height="38" rx="6" fill="#24323e" stroke="${s.active ? color : "#40515e"}"/>
      <text x="38" y="${y + 16}" fill="#e0e7ed" font-size="13">${escapeXml(def.label)}</text>
      <text x="522" y="${y + 16}" fill="${s.active ? color : "#aab9c4"}" font-size="12" text-anchor="end">${escapeXml(s.value)}</text>
      <text x="38" y="${y + 31}" fill="#aab9c4" font-size="11">Demo limit ${escapeXml(def.band)} · ${escapeXml(state)}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 330" width="560" height="330">
    <rect width="560" height="330" rx="16" fill="#16212a"/>
    <g font-family="system-ui, sans-serif">
      <text x="26" y="33" fill="#aab9c4" font-size="13">STRIDELUNG · SIMULATED DEVICE · ALERT SNAPSHOT</text>
      <text x="26" y="63" fill="#fff" font-size="21" font-weight="700">${escapeXml(SUBSYSTEMS[event.subsystem].label)} · ${escapeXml(TIER_LABEL[view.tier])}</text>
      <text x="26" y="86" fill="#cbd5dc" font-size="13">${escapeXml(unitLabel(event.deviceId))} · ${escapeXml(event.caseId ?? "—")} · ${escapeXml(event.location)}</text>
      ${rows}
      <text x="26" y="292" fill="${color}" font-size="12" font-weight="700">${escapeXml(event.id)} · ${view.backInBand ? "Signals back in band — review still open" : "Signals out of band"}</text>
      <text x="26" y="312" fill="#aab9c4" font-size="11">Demo limits, not clinical thresholds · Synthetic device record · ${escapeXml(new Date(event.deliveredAt ?? event.createdAt).toISOString())}</text>
    </g>
  </svg>`;
}
