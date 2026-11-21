"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { MASS } from "@/trolley/register";

export function Footer() {
  const [waveHovered, setWaveHovered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      {/* 1. Ambient Perfusion Wave Header */}
      <div
        className={`footer-wave-wrap ${waveHovered ? "is-hovered" : ""}`}
        onMouseEnter={() => setWaveHovered(true)}
        onMouseLeave={() => setWaveHovered(false)}
        aria-hidden="true"
      >
        <svg
          className="footer-wave-svg"
          viewBox="0 0 1440 84"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="waveGradOrange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B2B" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#FF6B2B" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#FF8C5A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF6B2B" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="waveGradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2B6FD4" stopOpacity="0.05" />
              <stop offset="40%" stopColor="#2B6FD4" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2B6FD4" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Venous Blood Path (Deoxygenated Inflow Wave) */}
          <path
            className="wave-path venous-wave"
            d="M0,48 C240,78 480,18 720,44 C960,70 1200,24 1440,52"
            stroke="url(#waveGradBlue)"
            strokeWidth="1.8"
            strokeDasharray="6 4"
          />

          {/* Arterial Blood Path (Oxygenated Return Wave) */}
          <path
            className="wave-path arterial-wave"
            d="M0,36 C220,12 500,64 740,32 C980,6 1220,58 1440,30"
            stroke="url(#waveGradOrange)"
            strokeWidth="2.2"
          />
        </svg>

        <div className="wave-meta">
          <span className="wave-tag venous">3.8 L/min Venous Drainage</span>
          <span className="wave-glow-dot" />
          <span className="wave-tag arterial">98% SaO₂ Arterial Return</span>
        </div>
      </div>

      <div className="wrap">
        {/* 2. Designer Editorial Header Strip */}
        <div className="footer-designer-hero">
          <div className="footer-hero-left">
            <div className="footer-pill-kicker">
              <span className="footer-live-beacon" />
              <span>CONCEPT SPECIFICATION · REVISION 0.1</span>
            </div>
            <h2 className="footer-hero-heading">
              Engineered for ambulation.<br />
              <span className="footer-hero-highlight">Designed to free critical care.</span>
            </h2>
            <p className="footer-hero-sub">
              Consolidating an ICU-grade VV ECMO circuit into a single patient-towable trolley under 28 kg — liberating bed-bound patients for safe hospital corridor mobilisation.
            </p>
          </div>

          <div className="footer-hero-cta-group">
            <Link href="/#explore" className="designer-btn primary">
              <span>Launch 3D Explorer</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
            <Link href="/components" className="designer-btn ghost">
              <span>27 Components BOM</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
            <Link href="/parallel-oxygenator" className="designer-btn ghost">
              <span>Parallel Concept</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 3. Architectural Telemetry Ribbon (Minimal Single-Row Instrument) */}
        <div className="footer-telemetry-ribbon" role="region" aria-label="Hardware telemetry summary">
          <div className="telemetry-item">
            <span className="telemetry-lbl">TOTAL ALL-UP DRY MASS</span>
            <div className="telemetry-val">
              <strong>{MASS.total.toFixed(2)}</strong>
              <small>kg (20% contingency)</small>
            </div>
          </div>
          <div className="telemetry-sep" aria-hidden="true" />

          <div className="telemetry-item">
            <span className="telemetry-lbl">ROLLING STOWED ENVELOPE</span>
            <div className="telemetry-val">
              <strong>460 × 330 × 790</strong>
              <small>mm (W × D × H)</small>
            </div>
          </div>
          <div className="telemetry-sep" aria-hidden="true" />

          <div className="telemetry-item">
            <span className="telemetry-lbl">MASS CEILING MARGIN</span>
            <div className="telemetry-val">
              <strong className="text-orange">+{MASS.margin.toFixed(2)}</strong>
              <small>kg under 28 kg target</small>
            </div>
          </div>
          <div className="telemetry-sep" aria-hidden="true" />

          <div className="telemetry-item">
            <span className="telemetry-lbl">INDEPENDENT SUPPORT</span>
            <div className="telemetry-val">
              <strong>200 Wh · 300 L</strong>
              <small>battery & O₂ sweep</small>
            </div>
          </div>
          <div className="telemetry-sep" aria-hidden="true" />

          <div className="telemetry-item">
            <span className="telemetry-lbl">SYSTEM ARCHITECTURE</span>
            <div className="telemetry-val">
              <strong>5 Layers · 27 Parts</strong>
              <small>isolated channels</small>
            </div>
          </div>
        </div>

        {/* 4. Minimalist Link Grid */}
        <div className="footer-links-grid">
          {/* Identity Column */}
          <div className="footer-col-brand">
            <Link href="/" className="footer-brand-title">
              <Logo size={26} />
              <span className="brand-text">StrideLung</span>
              <span className="brand-spec">01</span>
            </Link>
            <p className="footer-manifesto">
              An open-architecture packaging and mechanical integration study investigating ambulatory VV ECMO mobility for intensive care rehabilitation.
            </p>
            <div className="footer-compliance-tags">
              <span className="compliance-tag">ISO 13485 Framework</span>
              <span className="compliance-tag">ELSO 2025 Mobility</span>
              <span className="compliance-tag">CAD Spec v0.1</span>
            </div>
          </div>

          {/* Group 1: Hardware Architecture */}
          <div className="footer-col-nav">
            <span className="nav-kicker">01 / ARCHITECTURE</span>
            <ul className="footer-nav-list">
              <li><Link href="/#explore">3D Interactive Stage</Link></li>
              <li><Link href="/#subsystems">5 Subsystem Layers</Link></li>
              <li><Link href="/#budget">Mass Budget Telemetry</Link></li>
              <li><Link href="/#register">Hardware BOM Register</Link></li>
              <li><Link href="/components">All 27 Component Specs</Link></li>
              <li><Link href="/parallel-oxygenator">Dual-Cartridge Parallel Concept</Link></li>
            </ul>
          </div>

          {/* Group 2: Clinical Verification */}
          <div className="footer-col-nav">
            <span className="nav-kicker">02 / VERIFICATION</span>
            <ul className="footer-nav-list">
              <li><Link href="/#evidence">Epistemic Truth Ledger</Link></li>
              <li><Link href="/#plan">8 Packaging Trade-Offs</Link></li>
              <li><Link href="/#resources">Fluid & Gas Arithmetic</Link></li>
              <li><Link href="/#limits">Regulatory Demarcations</Link></li>
              <li><Link href="/#sources">Clinical Literature [S1–S9]</Link></li>
            </ul>
          </div>

          {/* Group 3: Accounting Taxonomy */}
          <div className="footer-col-nav">
            <span className="nav-kicker">03 / ACCOUNTING LEGEND</span>
            <ul className="footer-taxonomy-list">
              <li>
                <span className="tax-badge p">P</span>
                <div>
                  <strong>Proposed</strong>
                  <span>Calculated allocation target</span>
                </div>
              </li>
              <li>
                <span className="tax-badge r">R</span>
                <div>
                  <strong>Referenced</strong>
                  <span>Benchmarked to clinical spec</span>
                </div>
              </li>
              <li>
                <span className="tax-badge u">U</span>
                <div>
                  <strong>Unverified</strong>
                  <span>Requires bench testing</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 5. Grand Minimalist Architectural Graphic Wordmark */}
        <div className="footer-grand-wordmark" aria-hidden="true">
          <span className="wordmark-text">STRIDELUNG</span>
          <span className="wordmark-dot" />
        </div>

        {/* 6. Minimal Designer Demarcation Notice */}
        <div className="footer-demarcation-strip">
          <div className="demarcation-inner">
            <span className="demarcation-badge">DEMARCATION NOTICE</span>
            <p className="demarcation-text">
              StrideLung 01 is an industrial engineering and physical packaging study for concept demonstration only. It is not an approved medical device, has not undergone clinical trials, and is not certified for patient care, life support, or diagnostic use.
            </p>
          </div>
        </div>

        {/* 7. Bottom Minimal Utility Bar */}
        <div className="footer-bottom-bar">
          <div className="bottom-bar-left">
            <span>© 2026 StrideLung Initiative. Open Medical Hardware Concept.</span>
            <span className="bar-sep">·</span>
            <span>All rights reserved.</span>
          </div>

          <div className="bottom-bar-right">
            <div className="footer-engine-status">
              <span className="engine-dot" />
              <span>Three.js / Isometric Engine Online</span>
            </div>
            <button
              type="button"
              className="scroll-top-pill"
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
            >
              <span>Return to top</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
