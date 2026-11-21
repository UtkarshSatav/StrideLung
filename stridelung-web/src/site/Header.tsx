"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  ["/#explore", "Explore"],
  ["/#subsystems", "Subsystems"],
  ["/#budget", "Mass budget"],
  ["/#register", "Register"],
  ["/components", "Components"],
  ["/parallel-oxygenator", "Parallel concept"],
  ["/simulator", "Hospital dashboard"],
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header nav-scrolled">
      <div className="wrap header-row">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Logo size={26} />
          <span className="brand-name">StrideLung</span>
          <span className="brand-tag">01 · concept</span>
        </Link>

        <nav className={`nav${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map(([href, label]) => {
            const isAnchor = href.startsWith("/#");
            const isCurrent = !isAnchor && path?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="nav-link"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link href="/#explore" className="btn small nav-cta-btn" onClick={() => setOpen(false)}>
            Explore trolley
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
