import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  alt = false,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
  alt?: boolean;
}) {
  return (
    <section id={id} className={`section${alt ? " section-alt" : ""}${className ? ` ${className}` : ""}`}>
      <div className="wrap">
        <header className="section-head">
          <span className="eyebrow" aria-hidden="true">{eyebrow}</span>
          <h2>{title}</h2>
          {lead && <p className="lead">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
