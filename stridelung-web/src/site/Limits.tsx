export function Limits() {
  return (
    <div className="limits-charter">
      <div className="charter-columns">
        {/* Permitted Scope */}
        <div className="charter-card scope-card">
          <div className="charter-card-header">
            <span className="charter-icon positive" aria-hidden="true">✓</span>
            <div>
              <span className="eyebrow">Mechanical Architecture</span>
              <h3>What this study models</h3>
            </div>
          </div>
          <ul className="charter-list">
            <li>
              <b>Spatial packaging feasibility:</b> Demonstrates how an upright, luggage-format rigid case could physically hold an ECMO circuit core.
            </li>
            <li>
              <b>Consistent volumetric allocations:</b> Every dimension, millimeter coordinate, and mass is proposed (P) according to a single source of truth.
            </li>
            <li>
              <b>VV ECMO configuration baseline:</b> Native heart remains responsible for systemic circulation; ventilator and patient vitals stay external.
            </li>
            <li>
              <b>Supervised ambulation reference:</b> Luggage silhouette serves as an industrial ergonomic reference for trained clinical staff, never patient self-towing.
            </li>
          </ul>
        </div>

        {/* Excluded Claims */}
        <div className="charter-card boundary-card">
          <div className="charter-card-header">
            <span className="charter-icon warning" aria-hidden="true">✕</span>
            <div>
              <span className="eyebrow">Clinical Demarcations</span>
              <h3>What this does NOT establish</h3>
            </div>
          </div>
          <ul className="charter-list">
            <li>
              <b>Not a clinical or medical device:</b> Does not represent an approved or tested ECMO machine, pump, cannula, or console.
            </li>
            <li>
              <b>Not an engineered console:</b> The compact drive (C07) and compute (C19) are future custom allocations that require rigorous CAD verification.
            </li>
            <li>
              <b>No biomaterial validations:</b> Material names (polycarbonate, PMP, titanium) do not establish biocompatibility, hemocompatibility, or sterilization viability.
            </li>
            <li>
              <b>Zero runtime guarantees:</b> Does not claim safe remaining operating time, oxygen saturation outcomes, or patient mobility eligibility.
            </li>
          </ul>
        </div>
      </div>

      {/* Engineering Feasibility Gate */}
      <div className="charter-card feasibility-gate-card">
        <div className="gate-header">
          <div className="gate-tag-group">
            <span className="gate-badge mono">Feasibility Gate</span>
            <span className="gate-meta mono">Prerequisites Prior to Hardware Prototyping</span>
          </div>
          <h3 className="gate-title">Open Engineering & Clinical Questions</h3>
        </div>

        <p className="gate-body">
          Before freezing any tooling or making hardware claims, the development team must: procure supplier CAD and measured masses; verify pump/membrane hydraulic compatibility and clearance; quantify thermal duty under high-flow regimes; characterize oxygen consumption versus battery depletion rates; design liquid/electrical isolation bulkheads; and conduct loaded caster stability and patient-line strain relief tests.
        </p>

        <div className="gate-axioms-row">
          <div className="axiom-pill">
            <span className="axiom-label mono">Rule 01</span>
            <span className="axiom-text">If supplier components do not fit, the chassis grows — the clinical part is never shrunk.</span>
          </div>
          <div className="axiom-pill">
            <span className="axiom-label mono">Rule 02</span>
            <span className="axiom-text">Blood-contact fluidics require an independent clinical trial and regulatory approval program.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
