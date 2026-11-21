import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <div className="brand"><Logo /><span className="brand-name">StrideLung</span><span className="brand-tag">01 · concept v0.1</span></div>
          <p className="footer-note">Concept packaging — not a clinical device. A 3D explanation and non-clinical demonstration plan built from the StrideLung 01 component register. Nothing here establishes clinical performance, patient eligibility, safe alarm limits or remaining safe time.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <span className="eyebrow">Explore</span>
          <Link href="/#explore">Interactive trolley</Link>
          <Link href="/#subsystems">Subsystems</Link>
          <Link href="/#budget">Mass budget</Link>
          <Link href="/components">All 27 components</Link>
        </nav>
        <nav className="footer-links" aria-label="Evidence">
          <span className="eyebrow">Evidence</span>
          <Link href="/#evidence">Reference facts</Link>
          <Link href="/#limits">Limits and open questions</Link>
          <Link href="/#sources">Sources</Link>
        </nav>
      </div>
      <div className="wrap footer-base">
        <span>P proposed · R referenced · U unverified</span>
        <span>Spec revision v0.1 · 21 November 2026</span>
      </div>
    </footer>
  );
}
