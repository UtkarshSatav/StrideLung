// alwardtAdapter.ts — Adapter layer translating the published Alwardt et al. (2022) clinical dataset
// (PMC9639688) into structured representations for the StrideLung dashboard.
// Strictly preserves ranges as ranges and point values as points (no midpoint calculation).

import rawData from "./alwardt2022.json";

export type ClinicalPhaseKey = "intraoperative" | "icu_arrival" | "postoperative";
export type SimViewMode = "live" | ClinicalPhaseKey;

export type PointMetric = {
  value: number;
  unit: string;
};

export type RangeMetric = {
  min: number;
  max: number;
  unit: string;
};

export type ClinicalMetric = PointMetric | RangeMetric;

export function isRangeMetric(m: ClinicalMetric): m is RangeMetric {
  return "min" in m && "max" in m;
}

export function formatMetricValue(m: ClinicalMetric, dp?: number): string {
  if (isRangeMetric(m)) {
    const minStr = dp !== undefined ? m.min.toFixed(dp) : m.min.toString();
    const maxStr = dp !== undefined ? m.max.toFixed(dp) : m.max.toString();
    return `${minStr} – ${maxStr}`;
  }
  return dp !== undefined ? m.value.toFixed(dp) : m.value.toString();
}

export interface PhaseObservations {
  phaseName: string;
  reportingType: "range" | "point";
  ecmoMachine: {
    bloodFlow: ClinicalMetric;
    pumpSpeed: ClinicalMetric;
    sweepGasFlow: ClinicalMetric;
    ecmoFiO2: ClinicalMetric;
  };
  circuitMeasurements: {
    preOxyPressure: ClinicalMetric;
    postOxyPressure: ClinicalMetric;
    transOxyPressure: ClinicalMetric;
    artBloodTemp: ClinicalMetric;
  };
  patientMeasurements: {
    pao2: ClinicalMetric;
    paco2: ClinicalMetric;
    ph: ClinicalMetric;
  };
  laboratoryMeasurements: {
    act: ClinicalMetric;
    haemoglobin: ClinicalMetric;
    lactate: ClinicalMetric;
  };
}

export const STUDY_METADATA = rawData.study;

export function getPhaseObservations(phase: ClinicalPhaseKey): PhaseObservations {
  const p = rawData.phases[phase];
  return {
    phaseName: p.phase_name,
    reportingType: p.reporting_type as "range" | "point",
    ecmoMachine: {
      bloodFlow: p.ecmo_machine.blood_flow,
      pumpSpeed: p.ecmo_machine.pump_speed,
      sweepGasFlow: p.ecmo_machine.sweep_gas_flow,
      ecmoFiO2: p.ecmo_machine.ecmo_fio2,
    },
    circuitMeasurements: {
      preOxyPressure: p.circuit_measurements.pre_oxy_pressure,
      postOxyPressure: p.circuit_measurements.post_oxy_pressure,
      transOxyPressure: p.circuit_measurements.trans_oxy_pressure,
      artBloodTemp: p.circuit_measurements.art_blood_temp,
    },
    patientMeasurements: {
      pao2: p.patient_measurements.pao2,
      paco2: p.patient_measurements.paco2,
      ph: p.patient_measurements.ph,
    },
    laboratoryMeasurements: {
      act: p.laboratory_measurements.act,
      haemoglobin: p.laboratory_measurements.haemoglobin,
      lactate: p.laboratory_measurements.lactate,
    },
  };
}

