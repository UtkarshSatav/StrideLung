import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../lib/iso/iso.css";
import "../trolley/trolley.css";
import "../parallel/parallel.css";
import "./globals.css";
import { Header } from "@/site/Header";
import { Footer } from "@/site/Footer";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

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
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
