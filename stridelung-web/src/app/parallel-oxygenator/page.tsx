import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/site/Section";
import { ParallelExplorer } from "@/parallel/ParallelExplorer";
import { ParallelTopologyConsole } from "@/parallel/ParallelTopologyConsole";
import { BANNER, CHECKLIST, NOT_CLAIMED, PLACEMENT, QUESTION, REVIEW, TITLE } from "@/parallel/model";

export const metadata: Metadata = {
  title: "Parallel oxygenator — concept exploration",
  description: "An interactive, concept-only cutaway: two oxygenator cartridge mock-ups on parallel conceptual branches between a shared inlet and a shared outlet. Not a validated ECMO circuit; not for patient use.",
};

const TOPOLOGY = `Shared conceptual inlet
         │
   schematic split
      ┌──┴──┐
      │     │
  cartridge A   cartridge B
      │     │
      └──┬──┘
   schematic merge
         │
Shared conceptual outlet`;

export default function ParallelPage() {
  return (
    <>
      <section className="section page-top parallel-hero-section">
        <div className="wrap parallel-hero-grid">
          <header className="parallel-hero-copy">
            <span className="eyebrow">Concept exploration · 06</span>
            <h1 className="parallel-hero-title">{TITLE}</h1>
            <p className="parallel-hero-quote">“{QUESTION}”</p>
            <p className="lead">
              This exploration examines the architectural question and its unresolved engineering dilemmas. It does not answer “yes”, and it does not show an automatic changeover as a capability.
            </p>
            <div className="pl-note" role="note" style={{ maxWidth: 780 }}>
              <b>{BANNER}.</b> Concept visualisation only — not a circuit design, a valve design, a construction guide, or evidence that the arrangement can safely support a patient.
            </div>
          </header>

          <div className="parallel-hero-interactive">
            <ParallelTopologyConsole />
          </div>
        </div>
      </section>
      <Section id="figure" eyebrow="01 · Interactive cutaway" title="Two cartridges, one carrier, every join visible." lead="Seven scenes over one model, with the same part identities throughout. Pick a scene, step through a review, or hover any part to read what it is — and what it is not." className="explore">
        <ParallelExplorer />
      </Section>
      <Section id="review" eyebrow="02 · What reviewers should notice" title="Six open questions, and the cue the figure gives for each." lead="The figure makes the trade-offs visible instead of answering them.">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Review question</th><th>Visual cue</th><th>Caption</th></tr></thead>
            <tbody>
              {REVIEW.map((r) => (
                <tr key={r.question}><td><b>{r.question}</b></td><td>{r.cue}</td><td>{r.caption}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="topology" eyebrow="03 · Topology" title="What the image may communicate — and what it leaves open." lead="The blood-side concept is kept abstract and linear. The figure shows the common inlet and outlet as circuit interfaces outside the scope of this concept.">
        <div className="limits">
          <article>
            <h3>The topology</h3>
            <pre className="mono small" style={{ margin: 0, lineHeight: 1.45, overflowX: "auto" }}>{TOPOLOGY}</pre>
          </article>
          <article>
            <h3>Where things belong is not decided</h3>
            <p className="small" style={{ marginBottom: 10 }}>This sketch does not decide where any of these go, and the single-oxygenator layout is not assumed to carry over:</p>
            <ul>{PLACEMENT.map((p) => <li key={p}>{p}</li>)}</ul>
          </article>
        </div>
      </Section>
      <Section id="limits" eyebrow="04 · Limits" title="What this figure does not claim.">
        <div className="limits">
          <article>
            <h3>Not claimed</h3>
            <ul>{NOT_CLAIMED.map((t) => <li key={t}>{t}</li>)}</ul>
          </article>
          <article>
            <h3>Review checklist the figure was built against</h3>
            <ul>{CHECKLIST.map((t) => <li key={t}>{t}</li>)}</ul>
          </article>
          <article className="span">
            <h3>Scope</h3>
            <p>A topology exploration for product visualisation — not an engineering recommendation. A real parallel ECMO circuit would need a selected manufacturer and platform, clinical and perfusion engineering input, risk analysis, compatible components and extensive verification. For the single-cartridge packaging concept, see the <Link href="/#explore">StrideLung 01 trolley</Link>.</p>
          </article>
        </div>
      </Section>
    </>
  );
}
