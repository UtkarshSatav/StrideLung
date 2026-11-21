// Evidence-status chip: P proposed, R referenced, U unverified.
const TITLES: Record<string, string> = {
  P: "Proposed: a design decision or numerical allocation for this concept",
  R: "Referenced: a fact about an identified existing product or practice, with a source",
  U: "Unverified: not selected, measured or substantiated yet",
  "R/U": "A referenced example material; the actual grade is unselected",
};
export function Chip({ status }: { status: string }) {
  return (
    <span className="sl-chip" data-status={status} title={TITLES[status] ?? status}>
      <b>{status}</b>
    </span>
  );
}
