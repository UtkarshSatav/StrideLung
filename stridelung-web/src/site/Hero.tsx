import Link from "next/link";
import { MASS, REGISTER } from "@/trolley/register";

export function Hero() {
  const stats = [
    { label: "Stowed rolling envelope", value: "460 × 330 × 790", unit: "mm" },
    { label: "Planning mass incl. 20% contingency", value: MASS.total.toFixed(2), unit: "kg" },
    { label: "Under the 28 kg ceiling", value: MASS.margin.toFixed(2), unit: "kg" },
    { label: "Components in the register", value: String(REGISTER.length), unit: "" },
    { label: "Subsystem layers", value: "5", unit: "" },
  ];
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="badge"><i aria-hidden="true" />Concept v0.1 · not a clinical device</span>
          <h1>ECMO support, packed to walk beside the patient.</h1>
          <p className="hero-lead">
            StrideLung 01 is a packaging study: one rigid, trolley-shaped case that consolidates gas exchange, blood pumping, power,
            heat management and monitoring for supervised hospital mobility. Open it, take it apart and trace every flow —
            each of its 27 components is drawn from the register, and every number says whether it is proposed, referenced or unverified.
          </p>
          <div className="hero-cta">
            <Link className="btn primary" href="#explore">Explore the trolley</Link>
            <Link className="btn" href="/components">Browse the 27 components</Link>
            <Link className="btn" href="/parallel-oxygenator">Parallel-oxygenator concept</Link>
          </div>
        </div>
        <dl className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd><span className="stat-value">{s.value}</span>{s.unit && <span className="stat-unit">{s.unit}</span>}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
