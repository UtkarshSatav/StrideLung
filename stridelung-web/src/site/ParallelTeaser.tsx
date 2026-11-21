import Link from "next/link";
import { BANNER, QUESTION, REVIEW } from "@/parallel/model";

// Home-page pointer to the parallel-oxygenator concept exploration (its own page, so this page stays light).
export function ParallelTeaser() {
  return (
    <div className="teaser">
      <div className="teaser-copy">
        <p className="pl-note" role="note"><b>{BANNER}.</b></p>
        <p className="lead">“{QUESTION}”</p>
        <p>A second interactive cutaway: the same StrideLung trolley, its bay visibly extended, with two matched cartridge mock-ups on one shared carrier between a schematic split and a schematic merge. Seven scenes — closed, cutaway, each branch, a topology review, a risk review and a single-versus-dual comparison — show the question and its open problems. They do not answer it.</p>
        <div className="hero-cta">
          <Link className="btn primary" href="/parallel-oxygenator">Open the parallel concept</Link>
          <Link className="btn" href="/parallel-oxygenator#review">Read the review questions</Link>
        </div>
      </div>
      <ul className="teaser-list">
        {REVIEW.map((r) => (
          <li key={r.question}><span>{r.question}</span><b>{r.caption}</b></li>
        ))}
      </ul>
    </div>
  );
}
