import { Chip } from "@/trolley/Chip";

const EVIDENCE_ROWS = [
  {
    fact: "Getinge lists one Cardiohelp console at 255 W × 315 H × 427 D mm and approximately 12 kg.",
    src: "S1",
    tag: "Physical Consolidation Baseline",
    supports: "Existing clinical mobile ECMO consoles have substantial volumetric footprints and real structural mass burdens.",
    notClaimed: "Does not establish that our proposed miniaturized drive (C07) and electronics will fit into the allocated volume without real CAD feasibility testing.",
  },
  {
    fact: "HLS documentation demonstrates integrated oxygenator, heat exchanger, and centrifugal pump head functions.",
    src: "S2",
    tag: "Functional Integration Precedent",
    supports: "The principle of grouping oxygenator hollow fibers, thermal exchange plates, and centrifugal impeller into one shared disposable cassette is clinically proven.",
    notClaimed: "Does not validate StrideLung's specific concept cartridge geometry, hydraulic flow dynamics, or blood compatibility.",
  },
  {
    fact: "LivaNova EOS lists polymethylpentene (PMP) diffusion membrane fibers and a stainless-steel heat exchanger.",
    src: "S3",
    tag: "Biocompatible Material Standards",
    supports: "Real-world medical device evidence that PMP hollow fibers and stainless-steel water jackets are successful material selections.",
    notClaimed: "Does not establish supplier procurement, injection molding resin grades, or sterilization compatibility for StrideLung's housing.",
  },
  {
    fact: "BOC lists a CD medical oxygen cylinder with 460 L nominal gas capacity, 2 L water capacity, and 3.5 kg weight.",
    src: "S4",
    tag: "Pneumatic Storage Dependency",
    supports: "Compressed gas is a hard physical payload dependency that cannot be miniaturized below gas-law constraints.",
    notClaimed: "Does not guarantee runtimes or physical valve dimensions without direct supplier specification of the integrated regulator.",
  },
  {
    fact: "Supervised ECMO mobilisation is formally codified in ELSO guidelines and established ICU clinical practice.",
    src: "S5, S6",
    tag: "Clinical Ambulation Protocols",
    supports: "Supervised patient walking while connected to an extracorporeal circuit is an established clinical goal with clear medical protocols.",
    notClaimed: "Does not claim that this trolley design makes any specific patient safe or eligible to ambulate without expert clinical supervision.",
  },
];

export function Evidence() {
  return (
    <div className="evidence-dossier">
      <div className="dossier-intro-banner">
        <div className="intro-badge">
          <span className="mono bold">Epistemic Transparency</span>
        </div>
        <p className="intro-text">
          Existing commercial devices are cited strictly as reality checks against imaginary engineering. StrideLung uses these references to bound realistic dimensions and masses, not to claim pre-validated status.
        </p>
      </div>

      <div className="evidence-cards-list">
        {EVIDENCE_ROWS.map((row) => (
          <div key={row.src} className="evidence-card">
            <div className="evidence-card-header">
              <div className="header-meta-group">
                <Chip status="R" />
                <span className="source-pill mono">[{row.src}]</span>
                <span className="tag-label mono">{row.tag}</span>
              </div>
            </div>

            <div className="evidence-statement">
              <span className="quote-mark" aria-hidden="true">&ldquo;</span>
              <p className="statement-text">{row.fact}</p>
            </div>

            <div className="evidence-dual-grid">
              <div className="epistemic-col supports">
                <div className="col-header">
                  <span className="col-icon" aria-hidden="true">✓</span>
                  <span className="col-label mono">What this validates</span>
                </div>
                <p className="col-body">{row.supports}</p>
              </div>

              <div className="epistemic-col boundary">
                <div className="col-header">
                  <span className="col-icon" aria-hidden="true">✕</span>
                  <span className="col-label mono">What this does NOT claim</span>
                </div>
                <p className="col-body">{row.notClaimed}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dossier-footer-note">
        <p>
          <b>Zero Reduction Claims:</b> There is no single incumbent commercial trolley used as a universal baseline; therefore, no percentage size, weight, or cost reduction claims are made.
        </p>
      </div>
    </div>
  );
}
