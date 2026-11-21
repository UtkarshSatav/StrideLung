"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      {/* Layer 1: 16-bit retro pixel art animated GIF */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-pixel.gif"
        alt="16-bit retro pixel art of patient walking with StrideLung ambulatory ECMO trolley"
        className="hero-pixel-bg"
      />

      {/* Layer 2: Cinematic vignette overlay for contrast and clarity */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Layer 3: CRT Scanlines texture */}
      <div className="hero-scanline" aria-hidden="true" />

      {/* Layer 4: Perfectly aligned, optically centered hero content */}
      <div className="wrap hero-content">
        <div className="hero-badge">
          <i className="badge-dot" aria-hidden="true" />
          <span>StrideLung · Ambulatory ECMO Concept</span>
        </div>

        <h1 className="hero-h1">
          <span>Your lungs are in</span>
          <span className="hero-h1-accent">good hands.</span>
        </h1>

        <p className="hero-lead">
          A compact, mobile respiratory trolley engineered to walk with patients.
          <span className="hero-lead-sep"> </span>
          Explore every component, circuit, and flow.
        </p>

        <div className="hero-cta">
          <Link className="btn primary hero-btn" href="/#explore">
            Explore the trolley →
          </Link>
          <Link className="btn ghost-white hero-btn" href="/components">
            Browse components
          </Link>
          <Link className="btn ghost-white hero-btn" href="/parallel-oxygenator">
            Parallel concept
          </Link>
        </div>
      </div>
    </section>
  );
}
