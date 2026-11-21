// The drawing's conventions. Each is told apart by pattern and position as well as colour.
export function KeyPanel() {
  const rows = [
    ["in", "Blue — shared inlet and both branch paths"],
    ["out", "Red — merged outlet"],
    ["gas", "Amber dashed stub — gas side not designed"],
    ["hx", "Teal capped stub — thermal arrangement unresolved"],
    ["hatch", "Hatched face — schematic manifold / provisional packaging"],
    ["sil", "Muted silhouette — isolation/switching approach not designed"],
  ];
  return (
    <section className="pl-box" aria-label="Key">
      <span className="pl-kicker">Key</span>
      <ul className="pl-key">
        {rows.map(([sw, text]) => (
          <li key={sw}><i className="pl-sw" data-sw={sw} aria-hidden="true" />{text}</li>
        ))}
      </ul>
      <p className="muted small" style={{ marginTop: 10 }}>Moving highlights show conceptual direction only — no speed, pressure or flow.</p>
    </section>
  );
}
