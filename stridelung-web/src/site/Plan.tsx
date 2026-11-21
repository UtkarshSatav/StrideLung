// Section 2 of the spec: the plan for making it compact, and the evidence each step still needs.
const PLAN = [
  ["Select a compatible clinical pump/oxygenator family before freezing a real enclosure", "Avoids designing a shell around imaginary parts", "Supplier CAD, weight, approved accessory interfaces and operating clearances"],
  ["Group the pump head, oxygenator, thermal interface and nearby sensing into one accessible core bay", "Reduces scattered mounts and crossing routes", "Compatible assembly, access and performance review"],
  ["Put gas storage vertically on the left and battery/thermal support low in the case", "Uses height and limits bulky equipment at the top", "Loaded stability and impact/retention tests"],
  ["Use one display and a shared dry electronics zone", "Avoids duplicated housings in the concept", "Full control, alarm and independence requirements"],
  ["Use defined routing channels and a supported patient-line exit", "Makes the layout understandable and inspectable", "Acceptable line loads, bend behaviour and clinical usability"],
  ["Use removable service doors rather than opening the whole enclosure", "Separates routine access from internal equipment", "Cleaning, liquid ingress, oxygen/thermal separation and service review"],
  ["Keep supplier-qualified blood/gas assemblies intact", "Avoids pretending smaller geometry proves a new device", "Product compatibility and verification"],
  ["Iterate enclosure size when selected parts do not fit", "Preserves the actual functional requirements", "Updated fit, mass, runtime and access budgets"],
];

export function Plan() {
  return (
    <ol className="plan">
      {PLAN.map(([decision, why, evidence], i) => (
        <li key={i} className="plan-step">
          <span className="plan-num">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>{decision}</h3>
            <p><span className="k">Why it helps</span>{why}</p>
            <p><span className="k">Evidence needed first</span>{evidence}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
