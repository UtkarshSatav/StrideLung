"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.body.dataset.theme === "dark"), []);
  const flip = () => {
    const next = dark ? "light" : "dark";
    document.body.dataset.theme = next;
    try {
      localStorage.setItem("sl-theme", next);
    } catch {}
    setDark(!dark);
  };
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-pressed={dark} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        {dark ? <path d="M10 3.2a6.8 6.8 0 1 0 6.8 6.8A5.3 5.3 0 0 1 10 3.2Z" /> : <><circle cx="10" cy="10" r="3.6" /><path d="M10 1.8v2.2M10 16v2.2M1.8 10H4M16 10h2.2M4.2 4.2l1.6 1.6M14.2 14.2l1.6 1.6M4.2 15.8l1.6-1.6M14.2 5.8l1.6-1.6" /></>}
      </svg>
    </button>
  );
}
