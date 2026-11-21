import Link from "next/link";
import { TrolleyFigure } from "@/trolley/TrolleyFigure";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-content">
        <div className="hero-copy">
          <p className="eyebrow">StrideLung 01 · Engineering concept</p>
          <h1 className="hero-h1">A compact ECMO trolley for <span className="hero-h1-accent">supervised mobility.</span></h1>
          <p className="hero-lead">
            One rolling enclosure for the proposed VV-ECMO circuit, gas, power, thermal support, and monitoring.
            Explore the packaging and see how a device event reaches the hospital team in the demo.
          </p>
          <div className="hero-cta">
            <Link className="btn primary hero-btn" href="/#explore">Explore the trolley</Link>
            <Link className="btn hero-btn" href="/simulator">Open hospital dashboard</Link>
          </div>
        </div>
        <TrolleyFigure hero />
      </div>
    </section>
  );
}
