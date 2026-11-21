"use client";
// ControlPanels — exact alignment with the reference ventilator screenshot.
// Provides 3 structured panels: ECMO Settings, Patient/Model Settings, Display Settings.
import { useSim } from "./SimulatorContext";
import type { SimInputs } from "./simulatorEngine";

interface Props {
  showCircuit: boolean;
  setShowCircuit: (v: boolean) => void;
  showAlarms: boolean;
  setShowAlarms: (v: boolean) => void;
  showReadings: boolean;
  setShowReadings: (v: boolean) => void;
  timeWindow: number;
  setTimeWindow: (w: number) => void;
}

// Stepper component [ - ] [ value ] [ + ]
function Stepper({
  value,
  min,
  max,
  step = 1,
  dp = 0,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  dp?: number;
  onChange: (v: number) => void;
}) {
  const dec = () => {
    const next = Math.max(min, parseFloat((value - step).toFixed(dp + 1)));
    onChange(next);
  };
  const inc = () => {
    const next = Math.min(max, parseFloat((value + step).toFixed(dp + 1)));
    onChange(next);
  };

  return (
    <div className="sim-stepper-box">
      <button type="button" className="sim-step-btn" onClick={dec} aria-label="Decrease">
        −
      </button>
      <div className="sim-step-value">{value.toFixed(dp)}</div>
      <button type="button" className="sim-step-btn" onClick={inc} aria-label="Increase">
        +
      </button>
    </div>
  );
}

export function ControlPanels({
  showCircuit,
  setShowCircuit,
  showAlarms,
  setShowAlarms,
  showReadings,
  setShowReadings,
  timeWindow,
  setTimeWindow,
}: Props) {
  const { state, actions } = useSim();
  const { inputs } = state;

  const set = <K extends keyof SimInputs>(k: K, v: SimInputs[K]) => actions.setInput(k, v);

  return (
    <div className="sim-panel-group">
      {/* ── Section 1: ECMO / StrideLung Settings ── */}
      <div className="sim-card">
        <div className="sim-card-header" data-sys="gas">
          <span className="sys-dot" data-sys="gas" aria-hidden="true" />
          <span>ECMO Settings</span>
        </div>

        <div className="sim-card-content">
          {/* Row 1 */}
          <div className="sim-control-grid" style={{ marginBottom: "12px" }}>
            <div className="sim-control-item">
              <label className="sim-item-label" htmlFor="ecmo-mode">Mode</label>
              <select
                id="ecmo-mode"
                className="sim-mode-select"
                value={inputs.ecmoMode}
                onChange={(e) => set("ecmoMode", e.target.value as "VV" | "VA")}
              >
                <option value="VV">VV ECMO</option>
                <option value="VA">VA ECMO</option>
              </select>
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">FdO2 [%]</span>
              <Stepper
                value={inputs.fdO2 * 100}
                min={21}
                max={100}
                step={5}
                dp={0}
                onChange={(v) => set("fdO2", v / 100)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Pump Speed [RPM]</span>
              <Stepper
                value={inputs.pumpRPM}
                min={0}
                max={5000}
                step={100}
                dp={0}
                onChange={(v) => set("pumpRPM", v)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Sweep Gas [l/min]</span>
              <Stepper
                value={inputs.sweepGasFlow}
                min={0}
                max={10}
                step={0.5}
                dp={1}
                onChange={(v) => set("sweepGasFlow", v)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Water Temp [°C]</span>
              <Stepper
                value={inputs.thermalTarget}
                min={32}
                max={40}
                step={0.5}
                dp={1}
                onChange={(v) => set("thermalTarget", v)}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="sim-control-grid">
            <div className="sim-control-item">
              <label className="sim-item-label" htmlFor="gas-supply-mode">Gas Supply</label>
              <select
                id="gas-supply-mode"
                className="sim-mode-select"
                value={inputs.gasSupplyState}
                onChange={(e) => set("gasSupplyState", e.target.value as any)}
              >
                <option value="online">Online (Cylinder)</option>
                <option value="external">External Supply</option>
                <option value="offline">Offline (Alert)</option>
              </select>
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Circuit Res. [×]</span>
              <Stepper
                value={inputs.circuitResistance}
                min={0.5}
                max={3.0}
                step={0.1}
                dp={1}
                onChange={(v) => set("circuitResistance", v)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Oxy Res. [×]</span>
              <Stepper
                value={inputs.oxygenatorResistance}
                min={1.0}
                max={5.0}
                step={0.2}
                dp={1}
                onChange={(v) => set("oxygenatorResistance", v)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Recirc [%]</span>
              <Stepper
                value={inputs.recirculationFraction * 100}
                min={0}
                max={50}
                step={5}
                dp={0}
                onChange={(v) => set("recirculationFraction", v / 100)}
              />
            </div>

            <div className="sim-control-item">
              <label className="sim-item-label" htmlFor="pump-drive-state">Pump Drive</label>
              <select
                id="pump-drive-state"
                className="sim-mode-select"
                value={inputs.pumpState}
                onChange={(e) => set("pumpState", e.target.value as any)}
              >
                <option value="running">Active / Running</option>
                <option value="standby">Standby</option>
                <option value="stopped">Stopped</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Patient / Circuit Model Settings ── */}
      <div className="sim-card">
        <div className="sim-card-header" data-sys="blood">
          <span className="sys-dot" data-sys="blood" aria-hidden="true" />
          <span>Patient Model Settings</span>
        </div>

        <div className="sim-card-content">
          <div className="sim-control-grid">
            <div className="sim-control-item">
              <span className="sim-item-label">Cardiac Output [l/min]</span>
              <Stepper
                value={inputs.nativeCardiacOutput}
                min={0}
                max={5}
                step={0.5}
                dp={1}
                onChange={(v) => set("nativeCardiacOutput", v)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Haemoglobin [g/dL]</span>
              <Stepper
                value={inputs.haemoglobin}
                min={6}
                max={16}
                step={0.5}
                dp={1}
                onChange={(v) => set("haemoglobin", v)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">O2 Demand [ml/min]</span>
              <Stepper
                value={inputs.oxygenDemand}
                min={50}
                max={400}
                step={25}
                dp={0}
                onChange={(v) => set("oxygenDemand", v)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Native Lung [%]</span>
              <Stepper
                value={inputs.nativeLungContrib * 100}
                min={0}
                max={100}
                step={5}
                dp={0}
                onChange={(v) => set("nativeLungContrib", v / 100)}
              />
            </div>

            <div className="sim-control-item">
              <span className="sim-item-label">Battery Mode</span>
              <button
                type="button"
                className={`sim-btn small ${state.outputs.powerSource === "battery" ? "active" : ""}`}
                onClick={() => actions.setPowerSource(state.outputs.powerSource === "battery" ? "mains" : "battery")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {state.outputs.powerSource === "battery" ? "On Battery (Drain)" : "Mains Powered"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Display Settings ── */}
      <div className="sim-card">
        <div className="sim-card-header" data-sys="chassis">
          <span className="sys-dot" data-sys="chassis" aria-hidden="true" />
          <span>Display Settings</span>
        </div>

        <div className="sim-card-content">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
            {/* Scale / Time Window Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className={`sim-btn small ${timeWindow === 15 ? "active" : ""}`}
                onClick={() => setTimeWindow(15)}
              >
                Pcirc 15s
              </button>

              <button
                type="button"
                className={`sim-btn small ${timeWindow === 30 ? "active" : ""}`}
                onClick={() => setTimeWindow(30)}
              >
                Flow 30s
              </button>

              <button
                type="button"
                className={`sim-btn small ${timeWindow === 60 ? "active" : ""}`}
                onClick={() => setTimeWindow(60)}
              >
                ΔP 60s
              </button>
            </div>
            <div style={{ display: "flex", gap: "20px", marginLeft: "auto", flexWrap: "wrap" }}>
              <label className="sim-checkbox-label">
                <input
                  type="checkbox"
                  checked={showReadings}
                  onChange={(e) => setShowReadings(e.target.checked)}
                />
                <span>Show clinical telemetry matrix</span>
              </label>

              <label className="sim-checkbox-label">
                <input
                  type="checkbox"
                  checked={showCircuit}
                  onChange={(e) => setShowCircuit(e.target.checked)}
                />
                <span>Show circuit schematic</span>
              </label>

              <label className="sim-checkbox-label">
                <input
                  type="checkbox"
                  checked={showAlarms}
                  onChange={(e) => setShowAlarms(e.target.checked)}
                />
                <span>Show alarms and event log</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
