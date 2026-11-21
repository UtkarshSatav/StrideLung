"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/simulator" || pathname === "/simulator/";

  if (isDashboard) {
    return <main id="main">{children}</main>;
  }

  return (
    <div className="product-site">
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
