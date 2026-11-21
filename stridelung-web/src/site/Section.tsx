import type { ReactNode } from "react";

export function Section({ id, eyebrow, title, lead, children, className }: { id?: string; eyebrow: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`section${className ? ` ${className}` : ""}`}>
      <div className="wrap">
        <header className="section-head">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          {lead && <p className="lead">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
