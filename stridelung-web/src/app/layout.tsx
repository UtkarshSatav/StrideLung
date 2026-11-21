import type { Metadata } from "next";
import localFont from "next/font/local";
import "../lib/iso/iso.css";
import "../trolley/trolley.css";
import "../parallel/parallel.css";
import "./globals.css";
import "./product.css";
import { SiteShell } from "@/site/SiteShell";

const sans = localFont({ src: "./fonts/inter-latin.woff2", weight: "100 900", variable: "--font-sans", display: "swap" });
const mono = localFont({ src: "./fonts/jetbrains-mono.woff2", weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "StrideLung 01 — ECMO support, packed to walk", template: "%s · StrideLung 01" },
  description: "An interactive packaging concept for supervised ECMO mobility: a 27-component trolley you can open, take apart and trace. Concept packaging — not a clinical device.",
};

// Applied before paint so a saved theme never flashes.
const THEME_SCRIPT = `try{var t=localStorage.getItem("sl-theme");if(t==="dark"||t==="light")document.body.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="iso" data-theme="light" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <a className="skip" href="#main">Skip to content</a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
