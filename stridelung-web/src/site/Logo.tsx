// StrideLung 01 isometric cube logo: top face in primary orange, left in deep orange, right in light orange.
export function Logo({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`logo${className ? ` ${className}` : ""}`}>
      {/* Top face */}
      <path className="logo-top" d="M12 2.5 20 6.6 12 10.7 4 6.6Z" fill="var(--brand-orange, #FF6B2B)" />
      {/* Left face */}
      <path className="logo-left" d="M4 6.6 12 10.7V21.4L4 17.3Z" fill="var(--brand-orange-deep, #E05020)" />
      {/* Right face */}
      <path className="logo-right" d="M12 10.7 20 6.6V17.3L12 21.4Z" fill="var(--brand-orange-light, #FF8C5A)" />
      {/* Structural edges and trolley handle glyph */}
      <path
        className="logo-edge"
        d="M12 2.5 20 6.6V17.3L12 21.4 4 17.3V6.6ZM4 6.6 12 10.7 20 6.6M12 10.7V21.4M6.4 12.2l3.6 1.9M14 13.3l3.6-1.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
