"use client";
// WaveformMonitor — exact visual replication of the attached medical ventilator console layout.
// Enclosed dark display with 3 waveforms on the left and 3 parameter blocks on the right.
import { useSim } from "./SimulatorContext";
import { WaveformCanvas } from "./WaveformCanvas";
import { formatMetricValue } from "./data/alwardtAdapter";

interface Props {
  timeWindow?: number;
  showAlveolar?: boolean;
}

function fmt(v: number, dp = 1): string {
  if (!isFinite(v)) return "---";
  return v.toFixed(dp);
}

export function WaveformMonitor({ timeWindow = 30 }: Props) {
  const { state, activePhase, clinicalObservations } = useSim();
  const { waveforms, outputs, inputs, paused } = state;

  const isClinical = activePhase !== "live" && clinicalObservations !== null;

  return (
    <div className="sim-monitor-enclosure">
      {isClinical && (
        <div className="sim-clinical-study-stripe">
          <span className="sys-dot" data-sys="blood" aria-hidden="true" />
          <span className="stripe-tag">ALWARDT ET AL. (2022)</span>
          <span className="stripe-text">
            <strong>{clinicalObservations.phaseName} Phase</strong> — Dynamic waveforms driven by published clinical observations (PMC9639688)
          </span>
        </div>
      )}
      <div className="sim-monitor-grid">
        {/* Left Side: 3 Stacked Waveforms */}
        <div className="sim-waveforms-column">
          {/* Row 1: Pressure Waveform (Yellow) */}
          <div className="sim-wave-row">
            <div className="sim-y-axis-labels">
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
              <span>-100</span>
            </div>
            <div className="sim-wave-canvas-box">
              <span className="sim-wave-tag-left">Pcirc</span>
              <span className="sim-wave-tag-right">mmHg</span>
              <WaveformCanvas
                lines={[
                  { data: waveforms.preOxyP, color: "#facc15" }, // Yellow
                  { data: waveforms.drainageP, color: "#d97706" }, // Amber/secondary
                ]}
                timeWindow={timeWindow}
                yMin={-100}
                yMax={300}
                paused={paused}
                showZeroLine={true}
              />
            </div>
          </div>

          {/* Row 2: Blood Circuit Flow (Green) */}
          <div className="sim-wave-row">
            <div className="sim-y-axis-labels">
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
              <span>-1</span>
            </div>
            <div className="sim-wave-canvas-box">
              <span className="sim-wave-tag-left">Flow</span>
              <span className="sim-wave-tag-right">l/min</span>
              <WaveformCanvas
                lines={[
                  { data: waveforms.flow, color: "#4ade80" }, // Bright green
                ]}
                timeWindow={timeWindow}
                yMin={-1}
                yMax={7}
                paused={paused}
                showZeroLine={true}
              />
            </div>
          </div>

          {/* Row 3: Oxygenator ΔP / Volume (White) */}
          <div className="sim-wave-row">
            <div className="sim-y-axis-labels">
              <span>120</span>
              <span>90</span>
              <span>60</span>
              <span>30</span>
              <span>0</span>
            </div>
            <div className="sim-wave-canvas-box">
              <span className="sim-wave-tag-left">ΔP</span>
              <span className="sim-wave-tag-right">mmHg</span>
              <WaveformCanvas
                lines={[
                  { data: waveforms.deltaP, color: "#ffffff" }, // White
                ]}
                timeWindow={timeWindow}
                yMin={0}
                yMax={130}
                paused={paused}
                showZeroLine={false}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Parameters Column (Inside the dark monitor) */}
        <div className="sim-params-column">
          {/* Block 1: Pressures (aligned with Pressure Waveform) */}
          <div className="sim-param-block">
            <div className="sim-param-line">
              <span className="sim-param-name">Ppre</span>
              <span className="sim-param-val">
                {isClinical
                  ? formatMetricValue(clinicalObservations.circuitMeasurements.preOxyPressure, 0)
                  : fmt(outputs.preOxyPressure, 0)}
              </span>
              <span className="sim-param-unit">mmHg</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">Ppost</span>
              <span className="sim-param-val">
                {isClinical
                  ? formatMetricValue(clinicalObservations.circuitMeasurements.postOxyPressure, 0)
                  : fmt(outputs.postOxyPressure, 0)}
              </span>
              <span className="sim-param-unit">mmHg</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">Pdrain</span>
              <span className="sim-param-val">
                {isClinical ? "---" : fmt(outputs.drainagePressure, 0)}
              </span>
              <span className="sim-param-unit">mmHg</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">ΔP</span>
              <span
                className="sim-param-val"
                style={{ color: !isClinical && outputs.deltaP > 80 ? "#f87171" : "#ffffff" }}
              >
                {isClinical
                  ? formatMetricValue(clinicalObservations.circuitMeasurements.transOxyPressure, 0)
                  : fmt(outputs.deltaP, 0)}
              </span>
              <span className="sim-param-unit">mmHg</span>
            </div>
          </div>

          {/* Block 2: Flow & Gas (aligned with Flow Waveform) */}
          <div className="sim-param-block">
            <div className="sim-param-line">
              <span className="sim-param-name">Flow</span>
              <span
                className="sim-param-val"
                style={{ color: !isClinical && outputs.bloodFlow < 1.5 ? "#f87171" : "#4ade80" }}
              >
                {isClinical
                  ? formatMetricValue(clinicalObservations.ecmoMachine.bloodFlow, 1)
                  : fmt(outputs.bloodFlow, 2)}
              </span>
              <span className="sim-param-unit">l/min</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">RPM</span>
              <span className="sim-param-val">
                {isClinical
                  ? formatMetricValue(clinicalObservations.ecmoMachine.pumpSpeed, 0)
                  : outputs.pumpRPMActual > 0
                  ? fmt(outputs.pumpRPMActual, 0)
                  : "---"}
              </span>
              <span className="sim-param-unit">RPM</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">FdO2</span>
              <span className="sim-param-val">
                {isClinical
                  ? formatMetricValue(clinicalObservations.ecmoMachine.ecmoFiO2, 0)
                  : fmt(outputs.fdO2Actual * 100, 0)}
              </span>
              <span className="sim-param-unit">%</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">Sweep</span>
              <span className="sim-param-val">
                {isClinical
                  ? formatMetricValue(clinicalObservations.ecmoMachine.sweepGasFlow, 1)
                  : fmt(outputs.sweepFlowActual, 1)}
              </span>
              <span className="sim-param-unit">l/min</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">CO2rem</span>
              <span className="sim-param-val">{fmt(outputs.co2RemovalIndex * 100, 0)}</span>
              <span className="sim-param-unit">%</span>
            </div>
          </div>

          {/* Block 3: Oxygenator / Thermal / System (aligned with ΔP Waveform) */}
          <div className="sim-param-block">
            <div className="sim-param-line">
              <span className="sim-param-name">Twater</span>
              <span className="sim-param-val">{fmt(outputs.waterTemp, 1)}</span>
              <span className="sim-param-unit">°C</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">Tblood</span>
              <span className="sim-param-val">
                {isClinical
                  ? formatMetricValue(clinicalObservations.circuitMeasurements.artBloodTemp, 1)
                  : fmt(outputs.bloodTempEstimate, 1)}
              </span>
              <span className="sim-param-unit">°C</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">O2trn</span>
              <span className="sim-param-val">{fmt(outputs.o2TransferIndex * 100, 0)}</span>
              <span className="sim-param-unit">%</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">Batt</span>
              <span className="sim-param-val">{fmt(outputs.batteryPct, 0)}</span>
              <span className="sim-param-unit">%</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">Mode</span>
              <span className="sim-param-val" style={{ fontSize: 11 }}>
                {isClinical ? "VV-ECMO" : inputs.ecmoMode}
              </span>
              <span className="sim-param-unit">ECMO</span>
            </div>
            <div className="sim-param-line">
              <span className="sim-param-name">Status</span>
              <span
                className="sim-param-val"
                style={{
                  fontSize: 11,
                  color: isClinical || outputs.oxygenatorStatus === "normal" ? "#4ade80" : "#f87171",
                }}
              >
                {isClinical ? "ALWARDT" : outputs.oxygenatorStatus.toUpperCase()}
              </span>
              <span className="sim-param-unit"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
