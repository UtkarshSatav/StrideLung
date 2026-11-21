import Link from "next/link";
import { BANNER, QUESTION, REVIEW } from "@/parallel/model";

export function ParallelTeaser() {
  return (
    <div className="parallel-dossier">
      <div className="dossier-card hypothesis-card">
        <div className="dossier-card-header">
          <span className="hypothesis-badge mono">R&D Hypothesis · Concept v0.2</span>
          <span className="hypothesis-status mono">Non-Clinical Packaging Exploration</span>
        </div>

        <h3 className="hypothesis-question">&ldquo;{QUESTION}&rdquo;</h3>

        <p className="hypothesis-lead">
          <b>{BANNER}.</b> A second interactive cutaway exploration evaluates packaging two matched cartridge mock-ups on one shared carrier between a schematic hydraulic split and merge.
        </p>

        <p className="hypothesis-body">
          Seven dedicated scenes — closed bay, dual cutaway, branch A vs branch B isolation, hydraulic resistance topology, thrombosis failure mode review, and single-versus-dual mass comparison — systematically expose the unsolved physics and packaging dilemmas without pretending a clinical device has been built.
        </p>

        <div className="hypothesis-actions">
          <Link className="btn primary" href="/parallel-oxygenator">
            Launch Dual-Cartridge 3D Lab →
          </Link>
          <Link className="btn" href="/parallel-oxygenator#review">
            Read Engineering Review (7 Dilemmas)
          </Link>
        </div>
      </div>

      <div className="dossier-card review-card">
        <div className="review-card-header">
          <span className="review-label eyebrow">Critical Review Dilemmas</span>
          <span className="review-count mono">4 Core Vulnerabilities</span>
        </div>

        <div className="review-dilemmas-list">
          {REVIEW.slice(0, 4).map((r, i) => (
            <div key={r.question} className="dilemma-item">
              <div className="dilemma-index mono">0{i + 1}</div>
              <div className="dilemma-content">
                <h4 className="dilemma-q">{r.question}</h4>
                <p className="dilemma-caption">{r.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="review-card-footer">
          <span className="mono small text-muted">
            Conclusion: Parallel geometry raises fluid stasis and prime-volume penalties that single-lung cartridges avoid.
          </span>
        </div>
      </div>
    </div>
  );
}
