import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REGISTER, BY_SLUG, SUBSYSTEMS, RESOURCES } from "@/trolley/register";
import { COMPONENT_VIEWS } from "@/trolley/components";
import { Chip } from "@/trolley/Chip";
import { scene } from "@/trolley/generated";

const GEOMETRY: Record<string, string> = {
  C01: "C01-case", C02: "C02-chassis", C03: "C03-casters", C04: "C04-push-handle", C05: "C05-oxygenator", C06: "C06-pump-head", C07: "C07-pump-drive", C08: "C08-sensor-interface", C09: "C09-sensor-pods", C10: "C10-flow-bubble-sensor", C11: "C11-oxygen-cylinder", C12: "C12-cylinder-restraint", C13: "C13-gas-control", C14: "C14-gas-lines", C15: "C15-thermal-module", C16: "C16-thermal-hoses", C17: "C17-battery", C18: "C18-power-conversion", C19: "C19-compute", C20: "C20-display", C21: "C21-alarm", C22: "C22-line-panel", C23: "C23-blood-lines", C24: "C24-service-kit", C25: "C25-fluid-allowance", C26: "C26-cables-hardware", C27: "C27-stabilisers",
};

export function generateStaticParams() {
  return REGISTER.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = BY_SLUG[slug];
  return r ? { title: `${r.id} ${r.name}`, description: r.role } : {};
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = BY_SLUG[slug];
  if (!r) notFound();
  const index = REGISTER.findIndex((row) => row.id === r.id);
  const prev = REGISTER[(index + REGISTER.length - 1) % REGISTER.length];
  const next = REGISTER[(index + 1) % REGISTER.length];
  const View = COMPONENT_VIEWS[r.id as keyof typeof COMPONENT_VIEWS];
  const siblings = REGISTER.filter((row) => row.sys === r.sys && row.id !== r.id);
  const b = RESOURCES.battery;
  const g = RESOURCES.gas;
  return (
    <section className="section page-top">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/components">Components</Link><span aria-hidden="true">/</span><span>{r.id}</span></nav>
        <div className="detail">
          <div className="detail-art">
            <figure className="iso-figure sl detail-plate">
              <div className="iso-plate">
                <div className="iso-plate-corners" aria-hidden="true">
                  <span className="iso-plate-corner" data-corner="fig">{r.id}</span>
                  <span className="iso-plate-corner" data-corner="title">{SUBSYSTEMS[r.sys]}</span>
                  <span className="iso-plate-corner" data-corner="hint">Drawn alone · trolley camera</span>
                  <span className="iso-plate-corner" data-corner="readout">{r.mass.toFixed(2)} kg · P</span>
                </div>
                <View pad={18} className="detail-view" />
              </div>
            </figure>
          </div>
          <div className="detail-copy">
            <span className="eyebrow">{r.id} · {SUBSYSTEMS[r.sys]}</span>
            <h1>{r.name}</h1>
            <p className="lead">{r.role}</p>
            <dl className="sl-dl detail-dl">
              <dt>Shape</dt><dd>{r.shape}</dd>
              <dt>CAD envelope (W × D × H, mm)</dt><dd>{r.envelope} <Chip status="P" /></dd>
              <dt>Mass allocation</dt><dd>{r.mass.toFixed(2)} kg{r.massNote ? ` (${r.massNote})` : ""} <Chip status="P" /></dd>
              <dt>Position (x, y, z mm)</dt><dd>{r.position} <Chip status="P" /></dd>
              <dt>Material</dt><dd>{r.material} <Chip status={r.matStatus} /></dd>
              <dt>Geometry file</dt><dd className="mono small">src/trolley/geometry/parts/{GEOMETRY[r.id]}.ts</dd>
            </dl>
            {(r.id === "C17" || r.id === "C18") && <p className="sl-calc">Illustrative arithmetic: {b.wh} Wh × {b.factor} ÷ {b.loads[0]} W = <b>{((b.wh * b.factor) / b.loads[0]).toFixed(2)} h</b>; at {b.loads[1]} W ≈ <b>{((b.wh * b.factor) / b.loads[1]).toFixed(2)} h</b>. Not a runtime specification.</p>}
            {(r.id === "C11" || r.id === "C13" || r.id === "C14") && <p className="sl-calc">Illustrative arithmetic: {g.usableL} L assumed usable ÷ synthetic {g.lpm} L/min = <b>{g.usableL / g.lpm} min</b>. Not a prescribed sweep or a duration claim.</p>}
            {r.id === "C23" && <p className="sl-calc">Modelled path lengths: drainage {scene.c23.drain} mm, return {scene.c23.ret} mm (allocation 1.5 m per line). Clinical cannula selection and placement are not modelled.</p>}
            <div className="hero-cta">
              <Link className="btn primary" href={`/?part=${r.id}#explore`}>Show it in the trolley</Link>
              <Link className="btn" href="/#register">Full register</Link>
            </div>
          </div>
        </div>
        {siblings.length > 0 && (
          <div className="related">
            <h2 className="h3">Also in {SUBSYSTEMS[r.sys]}</h2>
            <div className="card-grid small">
              {siblings.map((s) => {
                const SView = COMPONENT_VIEWS[s.id as keyof typeof COMPONENT_VIEWS];
                return (
                  <Link key={s.id} href={`/components/${s.slug}`} className="card">
                    <div className="card-art"><SView pad={10} /></div>
                    <div className="card-body"><span className="card-id"><span className="mono">{s.id}</span></span><h3>{s.name}</h3></div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        <nav className="pager" aria-label="Component pages">
          <Link href={`/components/${prev.slug}`} rel="prev"><span className="muted">← {prev.id}</span>{prev.name}</Link>
          <Link href={`/components/${next.slug}`} rel="next"><span className="muted">{next.id} →</span>{next.name}</Link>
        </nav>
      </div>
    </section>
  );
}
