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
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Logo />
          <span className="brand-name">StrideLung</span>
          <span className="brand-tag">01 · concept</span>
        </Link>
        <nav className={`nav${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="nav-link" aria-current={href.startsWith("/#") ? undefined : path?.startsWith(href) ? "page" : undefined} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button type="button" className="menu-toggle" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
