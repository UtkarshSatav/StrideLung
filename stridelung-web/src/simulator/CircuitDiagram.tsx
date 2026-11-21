"use client";
// CircuitDiagram — SVG interactive schematic of the ECMO circuit.
// Styled to match the StrideLung design system and reference equipment console.
import { useState } from "react";
import { useSim } from "./SimulatorContext";

type ComponentInfo = {
  id: string;
  name: string;
  subsystem: string;
  description: string;
  reading?: string;
};

export function CircuitDiagram() {
  const { state } = useSim();
  const { outputs, inputs } = state;
  const [selected, setSelected] = useState<ComponentInfo | null>(null);

  const bloodFlow = outputs.bloodFlow.toFixed(2);
  const preOxy = outputs.preOxyPressure.toFixed(0);
  const postOxy = outputs.postOxyPressure.toFixed(0);
  const drainage = outputs.drainagePressure.toFixed(0);
  const waterTemp = outputs.waterTemp.toFixed(1);
  const sweep = outputs.sweepFlowActual.toFixed(1);

  const components: ComponentInfo[] = [
    {
      id: "patient",
      name: "Patient / Venous Circulation",
      subsystem: "Blood",
      description: "Symbolic representation of the patient's venous circulation. Blood is drained from venous circulation (VV ECMO) and returned to venous circulation.",
    },
    {
      id: "drain-cannula",
      name: "Drainage Cannula",
      subsystem: "Blood",
      description: "Specialised tube accessing venous blood. Cannula location and size affect drainage pressure and achievable flow.",
      reading: `Drainage P: ${drainage} mmHg`,
    },
    {
      id: "pump",
      name: "Blood Pump (Centrifugal)",
      subsystem: "Blood",
      description: "Centrifugal pump head converts motor rotation to blood flow. RPM drives the impeller; actual flow depends on circuit resistance.",
      reading: `RPM: ${inputs.pumpRPM} · Flow: ${bloodFlow} L/min`,
    },
    {
      id: "oxygenator",
      name: "Membrane Oxygenator",
      subsystem: "Blood/Gas",
      description: "Hollow-fibre membrane where O₂ transfers into blood and CO₂ leaves. PMP fibres maintain separation between blood and gas.",
      reading: `ΔP: ${outputs.deltaP.toFixed(0)} mmHg · Status: ${outputs.oxygenatorStatus}`,
    },
    {
      id: "return-cannula",
      name: "Return Cannula",
      subsystem: "Blood",
      description: "Delivers oxygenated blood back to venous circulation (VV) or arterial circulation (VA). Return site determines haemodynamic effects.",
      reading: `Post-oxy P: ${postOxy} mmHg`,
    },
    {
      id: "gas-source",
      name: "Gas Source / Control",
      subsystem: "Gas",
      description: "Gas supply for the oxygenator — onboard cylinder or external hospital gas. Supplies sweep gas flow and controls FdO₂.",
      reading: `Sweep: ${sweep} L/min · FdO₂: ${(inputs.fdO2 * 100).toFixed(0)}%`,
    },
    {
      id: "gas-outlet",
      name: "Gas Outlet",
      subsystem: "Gas",
      description: "Exhaust path for sweep gas and removed CO₂ exiting the oxygenator's gas compartment.",
    },
    {
      id: "heat-exchanger",
      name: "Heat Exchanger",
      subsystem: "Thermal",
      description: "Integrated within the oxygenator; transfers heat between water circuit and blood without fluid mixing.",
      reading: `Water: ${waterTemp}°C · Blood est.: ${outputs.bloodTempEstimate.toFixed(1)}°C`,
    },
    {
      id: "thermal-unit",
      name: "Thermal Control Unit",
      subsystem: "Thermal",
      description: "Pumps temperature-controlled water through the heat exchanger to maintain target blood temperature.",
      reading: `Target: ${inputs.thermalTarget}°C · State: ${inputs.thermalState}`,
    },
    {
      id: "sensors",
      name: "Pressure / Flow Sensors",
      subsystem: "Monitoring",
      description: "Measure blood flow, drainage pressure, pre-oxygenator and post-oxygenator pressures in real time.",
      reading: `Pre-oxy: ${preOxy} · Post-oxy: ${postOxy} mmHg`,
    },
  ];

  const getComp = (id: string) => components.find((c) => c.id === id)!;
  const click = (id: string) => {
    const c = getComp(id);
    setSelected(selected?.id === id ? null : c);
  };

  const BtnEl = ({
    id,
    x,
    y,
    w,
    h,
    label,
    fill,
  }: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    fill: string;
  }) => (
    <g
      style={{ cursor: "pointer" }}
      onClick={() => click(id)}
      role="button"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && click(id)}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={5}
        fill={fill}
        stroke={selected?.id === id ? "#111111" : "#d0d0ce"}
        strokeWidth={selected?.id === id ? 2 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={9}
        fontFamily="var(--font-mono), monospace"
        fill="#ffffff"
        fontWeight={600}
        letterSpacing="0.04em"
      >
        {label}
      </text>
    </g>
  );

  const bloodDrain = "var(--sys-blood, #e34948)";
  const bloodReturn = "#be123c";
  const gasColor = "var(--sys-gas, #2a78d6)";
  const waterColor = "var(--sys-thermal, #1baf7a)";
  const monitorColor = "var(--sys-chassis, #6250d6)";

  return (
    <div className="sim-card sim-circuit-container">
      <div className="sim-card-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span>ECMO Circuit Architecture & Fluid Pathways</span>
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--anatomy-muted)", fontWeight: "normal" }}>
          Click any component for live parameters
        </span>
      </div>

      <div className="sim-card-content">
        {/* Pathway Legend */}
        <div className="sim-circuit-legend">
          <div className="sim-circuit-legend-item">
            <span className="sim-circuit-legend-line" style={{ background: bloodDrain }} />
            <span>Drainage blood (venous)</span>
          </div>
          <div className="sim-circuit-legend-item">
            <span className="sim-circuit-legend-line" style={{ background: bloodReturn }} />
            <span>Return blood (oxygenated)</span>
          </div>
          <div className="sim-circuit-legend-item">
            <span className="sim-circuit-legend-line" style={{ background: gasColor }} />
            <span>Gas circuit (sweep)</span>
          </div>
          <div className="sim-circuit-legend-item">
            <span className="sim-circuit-legend-line" style={{ background: waterColor }} />
            <span>Water circuit (thermal)</span>
          </div>
          <div className="sim-circuit-legend-item">
            <span className="sim-circuit-legend-line" style={{ background: monitorColor }} />
            <span>Sensor & control</span>
          </div>
        </div>

        <div className="sim-circuit-box">
          <svg
            viewBox="0 0 760 330"
            style={{ width: "100%", maxWidth: 760, display: "block", margin: "0 auto" }}
            aria-label="ECMO circuit schematic"
          >
            {/* Blood Drainage path */}
            <path d="M 80 160 L 150 160" stroke={bloodDrain} strokeWidth={3} fill="none" markerEnd="url(#scArrowDrain)" />
            <path d="M 220 160 L 280 160" stroke={bloodDrain} strokeWidth={3} fill="none" markerEnd="url(#scArrowDrain)" />

            {/* Blood Return path */}
            <path d="M 360 160 L 420 160" stroke={bloodReturn} strokeWidth={3} fill="none" markerEnd="url(#scArrowReturn)" />
            <path d="M 540 160 L 600 160" stroke={bloodReturn} strokeWidth={3} fill="none" markerEnd="url(#scArrowReturn)" />
            <path d="M 670 160 Q 720 160 720 110 Q 720 50 400 50 Q 80 50 80 110 L 80 160" stroke={bloodReturn} strokeWidth={2} fill="none" strokeDasharray="5,4" opacity={0.6} />

            {/* Gas path */}
            <path d="M 480 280 L 480 230" stroke={gasColor} strokeWidth={2.5} fill="none" markerEnd="url(#scArrowGas)" />
            <path d="M 540 190 L 610 190 L 610 280 L 560 280" stroke={gasColor} strokeWidth={2} fill="none" strokeDasharray="4,3" opacity={0.7} markerEnd="url(#scArrowGas)" />

            {/* Thermal path */}
            <path d="M 390 280 L 440 280 L 440 230" stroke={waterColor} strokeWidth={2.5} fill="none" markerEnd="url(#scArrowWater)" />
            <path d="M 450 230 L 450 280 L 400 280" stroke={waterColor} strokeWidth={2} fill="none" strokeDasharray="4,3" opacity={0.6} markerEnd="url(#scArrowWater)" />

            {/* Sensor / Monitoring Data Lines */}
            <path d="M 300 140 L 300 90 L 675 90 L 675 125" stroke={monitorColor} strokeWidth={1.5} fill="none" strokeDasharray="3,3" opacity={0.5} />
            <path d="M 480 140 L 480 90" stroke={monitorColor} strokeWidth={1.5} fill="none" strokeDasharray="3,3" opacity={0.5} />

            {/* Components */}
            <BtnEl id="patient" x={10} y={135} w={70} h={50} label="PATIENT" fill="#581c87" />
            <BtnEl id="drain-cannula" x={150} y={135} w={70} h={50} label="DRAINAGE" fill={bloodDrain} />
            <BtnEl id="pump" x={280} y={135} w={80} h={50} label="PUMP HEAD" fill="#991b1b" />
            <BtnEl id="oxygenator" x={420} y={135} w={120} h={50} label="OXYGENATOR" fill="#0f766e" />
            <BtnEl id="return-cannula" x={600} y={135} w={70} h={50} label="RETURN" fill={bloodReturn} />
            <BtnEl id="gas-source" x={420} y={265} w={80} h={36} label="GAS SOURCE" fill={gasColor} />
            <BtnEl id="gas-outlet" x={560} y={265} w={70} h={36} label="GAS OUTLET" fill="#1d4ed8" />
            <BtnEl id="thermal-unit" x={310} y={265} w={80} h={36} label="THERMAL UNIT" fill={waterColor} />
            <BtnEl id="sensors" x={640} y={95} w={70} h={45} label="SENSORS" fill={monitorColor} />

            {/* Live Parameter Labels along paths */}
            <text x={240} y={178} textAnchor="middle" fontSize={8.5} fill="#6a6a6a" fontFamily="var(--font-mono), monospace">
              {drainage} mmHg
            </text>
            <text x={320} y={178} textAnchor="middle" fontSize={8.5} fill="#6a6a6a" fontFamily="var(--font-mono), monospace">
              {bloodFlow} L/min
            </text>
            <text x={480} y={178} textAnchor="middle" fontSize={8.5} fill="#6a6a6a" fontFamily="var(--font-mono), monospace">
              ΔP: {outputs.deltaP.toFixed(0)} mmHg
            </text>

            <defs>
              <marker id="scArrowDrain" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill={bloodDrain} />
              </marker>
              <marker id="scArrowReturn" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill={bloodReturn} />
              </marker>
              <marker id="scArrowGas" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill={gasColor} />
              </marker>
              <marker id="scArrowWater" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill={waterColor} />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Selected Component Inspector Card */}
        {selected && (
          <div className="sim-circuit-info">
            <div className="sim-circuit-info-name">{selected.name}</div>
            <span className="sim-circuit-info-sys">{selected.subsystem} Subsystem</span>
            <div className="sim-circuit-info-desc">{selected.description}</div>
            {selected.reading && <div className="sim-circuit-info-reading">Status / Reading: {selected.reading}</div>}
          </div>
        )}

        <div className="sim-circuit-hint">
          Educational circuit schematic. Physical component layouts, line routings, and sensor positions
          differ between clinical ECMO platforms.
        </div>
      </div>
    </div>
  );
}
