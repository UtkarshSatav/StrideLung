import { SOURCES } from "@/trolley/register";

export function Sources() {
  return (
    <ol className="sources">
      {Object.entries(SOURCES).map(([id, s]) => (
        <li key={id}>
          <span className="mono">{id}</span>
          <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
        </li>
      ))}
      <li className="muted small">Sources checked on 21 November 2026. Manufacturer examples describe particular products and markets; they are not procurement recommendations.</li>
    </ol>
  );
}
