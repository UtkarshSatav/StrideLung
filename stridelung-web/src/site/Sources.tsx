import { SOURCES } from "@/trolley/register";

export function Sources() {
  return (
    <ol className="sources">
      {Object.entries(SOURCES).map(([id, s]) => (
        <li key={id} className="source-item">
          <span className="source-id mono">{id}</span>
          <a href={s.url} target="_blank" rel="noreferrer" className="source-link">
            <span>{s.title}</span>
            <span className="source-ext" aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
      <li className="sources-disclaimer muted small">
        Sources checked on 21 November 2026. Manufacturer examples describe particular products and clinical markets; they are not procurement recommendations or clinical device approvals.
      </li>
    </ol>
  );
}
