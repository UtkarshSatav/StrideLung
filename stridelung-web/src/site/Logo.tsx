// A small isometric case glyph: the trolley seen from the front right.
export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="logo">
      <path className="logo-top" d="M12 2.5 20 6.6 12 10.7 4 6.6Z" />
      <path className="logo-left" d="M4 6.6 12 10.7V21.4L4 17.3Z" />
      <path className="logo-right" d="M12 10.7 20 6.6V17.3L12 21.4Z" />
      <path className="logo-edge" d="M12 2.5 20 6.6V17.3L12 21.4 4 17.3V6.6ZM4 6.6 12 10.7 20 6.6M12 10.7V21.4M6.4 12.2l3.6 1.9M14 13.3l3.6-1.9" />
    </svg>
  );
}
