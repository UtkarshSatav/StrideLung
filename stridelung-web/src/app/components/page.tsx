import Link from "next/link";
import type { Metadata } from "next";
import { REGISTER, SUBSYSTEMS } from "@/trolley/register";
import { COMPONENT_VIEWS } from "@/trolley/components";
import { ComponentFilter } from "@/site/ComponentFilter";
import { Chip } from "@/trolley/Chip";

export const metadata: Metadata = { title: "Components", description: "All 27 StrideLung 01 components, each drawn on its own with its register entry." };

export default function ComponentsPage() {
  return (
    <section className="section page-top">
      <div className="wrap">
        <header className="section-head">
          <span className="eyebrow">Component register · 27 rows</span>
          <h1>Every component, on its own.</h1>
          <p className="lead">Each card is drawn from the same geometry as the full trolley, in the same camera, cropped to that part. Open one for its full register entry, its source file and where it sits in the case.</p>
        </header>
        <ComponentFilter>
          {REGISTER.map((r) => {
            const View = COMPONENT_VIEWS[r.id as keyof typeof COMPONENT_VIEWS];
            return (
              <Link key={r.id} href={`/components/${r.slug}`} className="card" data-card data-sys={r.sys} data-search={`${r.id} ${r.name} ${r.material}`.toLowerCase()}>
                <div className="card-art"><View pad={10} /></div>
                <div className="card-body">
                  <span className="card-id"><span className="mono">{r.id}</span><span className="sys-tag"><i className="sys-dot" data-sys={r.sys} aria-hidden="true" />{SUBSYSTEMS[r.sys]}</span></span>
                  <h2>{r.name}</h2>
                  <p className="card-meta"><span className="mono">{r.envelope}</span> · <span className="mono">{r.mass.toFixed(2)} kg</span> <Chip status="P" /></p>
                </div>
              </Link>
            );
          })}
        </ComponentFilter>
      </div>
    </section>
  );
}
