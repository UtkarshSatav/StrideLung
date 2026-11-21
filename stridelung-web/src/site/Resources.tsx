import { RESOURCES } from "@/trolley/register";

export function Resources() {
  const b = RESOURCES.battery;
  const g = RESOURCES.gas;
  return (
    <div className="res-grid">
      <article className="res-card">
        <span className="eyebrow">Battery scenario · C17</span>
        <p className="res-eq">{b.wh} Wh × {b.factor} ÷ {b.loads[0]} W = <b>{((b.wh * b.factor) / b.loads[0]).toFixed(1)} h</b></p>
        <p className="res-eq dim">at {b.loads[1]} W ≈ <b>{((b.wh * b.factor) / b.loads[1]).toFixed(2)} h</b></p>
        <p>A 200 Wh nominal pack with an assumed 0.80 usable/delivery factor. Thermal duty, electronics, drive efficiency, reserve requirements and battery behaviour are all unverified.</p>
      </article>
      <article className="res-card">
        <span className="eyebrow">Gas scenario · C11</span>
        <p className="res-eq">{g.usableL} L ÷ {g.lpm} L/min = <b>{g.usableL / g.lpm} min</b></p>
        <p className="res-eq dim">synthetic sweep, assumed usable volume</p>
        <p>Not a prescribed sweep setting and not a duration claim for the reference bottle. Usable contents and delivery performance must come from the selected supplier and system.</p>
      </article>
      <article className="res-card note">
        <span className="eyebrow">The limiting resource</span>
        <p>The whole system's independence is set by its most limiting required resource — not by the battery alone. These sums are illustrative arithmetic, never a “safe time left”.</p>
      </article>
    </div>
  );
}
