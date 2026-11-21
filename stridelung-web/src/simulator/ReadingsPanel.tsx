"use client";
// ReadingsPanel — right-side numerical measurement panel.
// Mirrors the right-side readings column in the reference ventilator screenshot.
// Fully integrated with Alwardt et al. (2022) published clinical study dataset.
import { useSim } from "./SimulatorContext";
import { formatMetricValue } from "./data/alwardtAdapter";

function fmt(v: number, dp = 1): string {
  if (!isFinite(v)) return "---";
  return v.toFixed(dp);
}

function Reading({
  label, value, unit, severity = "normal",
}: {
  label: string;
  value: string;
  unit?: string;
  severity?: "normal" | "warn" | "crit" | "ok";
}) {
  const cls = severity === "warn" ? "warn" : severity === "crit" ? "crit" : severity === "ok" ? "ok" : "";
  return (
    <div className="sim-reading-row">
      <span className="sim-reading-label">{label}</span>
      <span className={`sim-reading-value ${cls}`}>
        {value}
        {unit && <span className="unit">{unit}</span>}
      </span>
    </div>
  );
}

function StatusReading({
  label, status, text,
}: { label: string; status: "ok" | "warn" | "crit"; text: string }) {
  return (
    <div className="sim-reading-row">
      <span className="sim-reading-label">{label}</span>
      <span className={`sim-reading-value ${status}`}>
        <span className={`sim-status-dot ${status}`} />
        {text}
      </span>
    </div>
  );
}

function GroupHeader({
  label,
  sys,
}: {
  label: string;
  sys: "blood" | "gas" | "thermal" | "electrical" | "chassis";
}) {
  return (
    <div className="sim-readings-group-header">
      <span className="sys-dot" data-sys={sys} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ReadingsPanel() {
  const { state, activePhase, clinicalObservations } = useSim();
  const { outputs, inputs } = state;

  const isClinical = activePhase !== "live" && clinicalObservations !== null;

  const flowSev: "normal" | "warn" | "crit" =
    isClinical ? "normal" : outputs.bloodFlow < 1.5 ? "crit" : outputs.bloodFlow < 2.5 ? "warn" : "normal";
  const deltaSev: "normal" | "warn" | "crit" =
    isClinical ? "normal" : outputs.deltaP > 120 ? "crit" : outputs.deltaP > 80 ? "warn" : "normal";
  const batSev = outputs.batteryPct < 10 ? "crit" : outputs.batteryPct < 20 ? "warn" : "normal";
  const oxyOk = outputs.oxygenatorStatus === "normal" ? "ok" : outputs.oxygenatorStatus === "degraded" ? "warn" : "crit";
  const tempDiff = Math.abs(outputs.waterTemp - inputs.thermalTarget);
  const tempSev = tempDiff > 4 ? "warn" : "normal";

  // Simulated estimates for Live mode patient blood gas & laboratory
  const livePaO2 = Math.min(300, Math.max(60, 95 + (inputs.fdO2 - 0.21) * 120));
  const livePaCO2 = Math.max(25, 45 - (inputs.sweepGasFlow - 2.0) * 4);
  const livePH = 7.40 + (40 - livePaCO2) * 0.008;

  return (
    <div className="sim-readings-panel">
      {/* Blood Circuit */}
      <div className="sim-readings-group">
        <GroupHeader label="Blood Circuit" sys="blood" />
        <Reading
          label="Blood flow"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.ecmoMachine.bloodFlow, 1)
              : fmt(outputs.bloodFlow, 2)
          }
          unit="L/min"
          severity={isClinical ? "normal" : flowSev}
        />
        <Reading
          label="Pump speed"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.ecmoMachine.pumpSpeed, 0)
              : outputs.pumpRPMActual > 0
              ? fmt(outputs.pumpRPMActual, 0)
              : "---"
          }
          unit="RPM"
        />
        <Reading
          label="Drainage pressure"
          value={isClinical ? "---" : fmt(outputs.drainagePressure, 0)}
          unit="mmHg"
          severity={!isClinical && outputs.drainagePressure < -180 ? "warn" : "normal"}
        />
        <Reading
          label="Pre-oxygenator"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.circuitMeasurements.preOxyPressure, 0)
              : fmt(outputs.preOxyPressure, 0)
          }
          unit="mmHg"
        />
        <Reading
          label="Post-oxygenator"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.circuitMeasurements.postOxyPressure, 0)
              : fmt(outputs.postOxyPressure, 0)
          }
          unit="mmHg"
        />
        <Reading
          label="Oxygenator ΔP"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.circuitMeasurements.transOxyPressure, 0)
              : fmt(outputs.deltaP, 0)
          }
          unit="mmHg"
          severity={isClinical ? "normal" : deltaSev}
        />
      </div>

      {/* Gas Circuit */}
      <div className="sim-readings-group">
        <GroupHeader label="Gas Circuit" sys="gas" />
        <Reading
          label="Sweep gas flow"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.ecmoMachine.sweepGasFlow, 1)
              : fmt(outputs.sweepFlowActual, 1)
          }
          unit="L/min"
        />
        <Reading
          label="ECMO FiO₂"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.ecmoMachine.ecmoFiO2, 0)
              : fmt(outputs.fdO2Actual * 100, 0)
          }
          unit="%"
        />
        <StatusReading
          label="Gas supply"
          status={inputs.gasSupplyState === "online" ? "ok" : inputs.gasSupplyState === "external" ? "ok" : "crit"}
          text={inputs.gasSupplyState === "online" ? "ONLINE" : inputs.gasSupplyState === "external" ? "EXTERNAL" : "OFFLINE"}
        />
        <StatusReading
          label="Gas outlet"
          status={inputs.gasSupplyState !== "offline" ? "ok" : "crit"}
          text={inputs.gasSupplyState !== "offline" ? "OPEN" : "BLOCKED"}
        />
      </div>

      {/* Patient Arterial Blood Gas (ABG) */}
      <div className="sim-readings-group">
        <GroupHeader label="Patient Blood Gas (ABG)" sys="blood" />
        <Reading
          label="PaO₂"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.patientMeasurements.pao2, 0)
              : fmt(livePaO2, 0)
          }
          unit="mmHg"
        />
        <Reading
          label="PaCO₂"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.patientMeasurements.paco2, 1)
              : fmt(livePaCO2, 1)
          }
          unit="mmHg"
        />
        <Reading
          label="Arterial pH"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.patientMeasurements.ph, 2)
              : fmt(livePH, 2)
          }
        />
      </div>

      {/* Laboratory Measurements */}
      <div className="sim-readings-group">
        <GroupHeader label="Laboratory" sys="electrical" />
        <Reading
          label="Activated clotting (ACT)"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.laboratoryMeasurements.act, 0)
              : "180"
          }
          unit="s"
        />
        <Reading
          label="Haemoglobin (Hb)"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.laboratoryMeasurements.haemoglobin, 1)
              : fmt(inputs.haemoglobin, 1)
          }
          unit="g/dL"
        />
        <Reading
          label="Lactate"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.laboratoryMeasurements.lactate, 2)
              : "1.20"
          }
          unit="mmol/L"
        />
      </div>

      {/* Thermal Circuit */}
      <div className="sim-readings-group">
        <GroupHeader label="Thermal Circuit" sys="thermal" />
        <Reading label="Water circuit temp" value={fmt(outputs.waterTemp, 1)} unit="°C" severity={tempSev} />
        <Reading
          label="Arterial blood temp"
          value={
            isClinical
              ? formatMetricValue(clinicalObservations.circuitMeasurements.artBloodTemp, 1)
              : fmt(outputs.bloodTempEstimate, 1)
          }
          unit="°C"
        />
        <StatusReading
          label="Thermal unit"
          status={inputs.thermalState === "off" ? "warn" : "ok"}
          text={inputs.thermalState.toUpperCase()}
        />
      </div>

      {/* Oxygenator Performance */}
      <div className="sim-readings-group">
        <GroupHeader label="Membrane Oxygenator" sys="gas" />
        <StatusReading label="Status" status={oxyOk} text={outputs.oxygenatorStatus.toUpperCase()} />
        <Reading label="O₂ transfer index" value={fmt(outputs.o2TransferIndex * 100, 0)} unit="%" />
        <Reading label="CO₂ removal index" value={fmt(outputs.co2RemovalIndex * 100, 0)} unit="%" />
        <Reading label="Membrane perf." value={fmt(outputs.membranePerformance * 100, 0)} unit="%" />
      </div>

      {/* Power */}
      <div className="sim-readings-group">
        <GroupHeader label="Electrical & Power" sys="electrical" />
        <StatusReading
          label="Power source"
          status={outputs.powerSource === "mains" ? "ok" : "warn"}
          text={outputs.powerSource === "mains" ? "MAINS AC" : "BATTERY"}
        />
        <Reading label="Battery" value={fmt(outputs.batteryPct, 0)} unit="%" severity={batSev} />
        <Reading
          label="Est. runtime"
          value={outputs.powerSource === "mains" ? "∞" : fmt(outputs.estimatedRuntime, 0)}
          unit={outputs.powerSource === "battery" ? "min" : ""}
        />
      </div>

      {/* Sim Model Telemetry */}
      <div className="sim-readings-group">
        <GroupHeader label="System Telemetry" sys="chassis" />
        <Reading label="O₂ delivery (est.)" value={fmt(outputs.systolicO2Delivery, 0)} unit="mL/min" />
        <Reading label="Recirculation" value={fmt(outputs.recircFraction * 100, 0)} unit="%" />
        <Reading label="ECMO mode" value={isClinical ? "VV-ECMO" : inputs.ecmoMode} />
        <StatusReading
          label="Pump state"
          status={inputs.pumpState === "running" ? "ok" : inputs.pumpState === "standby" ? "warn" : "crit"}
          text={inputs.pumpState.toUpperCase()}
        />
      </div>
    </div>
  );
}

