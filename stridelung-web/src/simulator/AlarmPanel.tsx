"use client";
// AlarmPanel — alerts and system events log matching the StrideLung console style.
import { useSim } from "./SimulatorContext";
import type { AlarmEvent } from "./simulatorEngine";

function fmtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function AlarmRow({
  alarm,
  onAck,
}: {
  alarm: AlarmEvent;
  onAck: (id: string) => void;
}) {
  return (
    <div
      className={`sim-alarm-entry ${alarm.severity}`}
      style={{ opacity: alarm.acknowledged ? 0.5 : 1 }}
    >
      <div className={`sim-alarm-pip ${alarm.severity}`} />
      <div className="sim-alarm-content">
        <div className="sim-alarm-name">{alarm.name}</div>
        <div className="sim-alarm-desc">{alarm.description}</div>
        <div className="sim-alarm-meta">
          {alarm.subsystem} · {fmtTime(alarm.timestamp)}
          {alarm.acknowledged && " · ACKNOWLEDGED"}
        </div>
      </div>
      {!alarm.acknowledged ? (
        <button
          type="button"
          className="sim-btn small"
          onClick={() => onAck(alarm.id)}
          title="Acknowledge event"
        >
          Acknowledge
        </button>
      ) : (
        <span style={{ fontSize: "11px", color: "var(--anatomy-muted)" }}>Acked</span>
      )}
    </div>
  );
}

export function AlarmPanel() {
  const { state, actions } = useSim();
  const active = state.alarms.filter((a) => !a.acknowledged);
  const acked = state.alarms.filter((a) => a.acknowledged);
  const critCount = active.filter((a) => a.severity === "critical").length;
  const warnCount = active.filter((a) => a.severity === "warning").length;

  return (
    <div className="sim-card sim-alarm-card">
      <div className="sim-card-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span>Alarm & System Event Log</span>

        {critCount > 0 && (
          <span className="sim-alarm-count crit">{critCount} CRITICAL</span>
        )}
        {warnCount > 0 && (
          <span className="sim-alarm-count warn">{warnCount} WARNING</span>
        )}

        {acked.length > 0 && (
          <button
            type="button"
            className="sim-btn small"
            onClick={() => actions.clearAcknowledgedAlarms()}
            style={{ marginLeft: "auto" }}
          >
            Clear acknowledged ({acked.length})
          </button>
        )}
      </div>

      <div className="sim-card-content">
        <div className="sim-alarm-list">
          {state.alarms.length === 0 ? (
            <div className="sim-no-alarms">
              <span className="sim-no-alarms-dot" />
              <span>Normal operating state. All circuit and simulated physiological parameters are within baseline limits.</span>
            </div>
          ) : (
            <>
              {active.map((a) => (
                <AlarmRow key={a.id} alarm={a} onAck={actions.acknowledgeAlarm} />
              ))}
              {acked.length > 0 && (
                <details style={{ marginTop: "6px" }}>
                  <summary style={{ fontSize: "11.5px", color: "var(--anatomy-muted)", cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                    {acked.length} acknowledged event{acked.length !== 1 ? "s" : ""}
                  </summary>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                    {acked.map((a) => (
                      <AlarmRow key={a.id} alarm={a} onAck={actions.acknowledgeAlarm} />
                    ))}
                  </div>
                </details>
              )}
            </>
          )}
        </div>

        <div className="sim-alarm-disclaimer">
          NOTICE: Event thresholds are simplified demonstration triggers for software simulation only.
          Not clinically validated alarm limits.
        </div>
      </div>
    </div>
  );
}
