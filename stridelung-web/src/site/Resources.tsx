import { RESOURCES } from "@/trolley/register";

export function Resources() {
  const b = RESOURCES.battery;
  const g = RESOURCES.gas;
  return (
    <div className="res-grid">
      <article className="res-card">
        <span className="eyebrow">Battery scenario · C17</span>
        <p className="res-eq">
          {b.wh} Wh × {b.factor} ÷ {b.loads[0]} W = <b className="highlight-val">{((b.wh * b.factor) / b.loads[0]).toFixed(1)} h</b>
        </p>
        <p className="res-eq dim">
          at {b.loads[1]} W ≈ <b>{((b.wh * b.factor) / b.loads[1]).toFixed(2)} h</b>
        </p>
        <p className="res-desc">
          A 200 Wh nominal pack with an assumed 0.80 usable/delivery factor. Thermal duty, electronics, drive efficiency, reserve requirements and battery behaviour are all unverified.
        </p>
      </article>

      <article className="res-card">
        <span className="eyebrow">Gas scenario · C11</span>
        <p className="res-eq">
          {g.usableL} L ÷ {g.lpm} L/min = <b className="highlight-val">{g.usableL / g.lpm} min</b>
        </p>
        <p className="res-eq dim">synthetic sweep, assumed usable volume</p>
        <p className="res-desc">
          Not a prescribed sweep setting and not a duration claim for the reference bottle. Usable contents and delivery performance must come from the selected supplier and system.
        </p>
      </article>

      <article className="res-card res-card-limiting">
        <span className="eyebrow">The limiting resource</span>
        <h3 className="res-limiting-title">Whole-system constraint</h3>
        <p className="res-desc">
          The whole system&apos;s mobility independence is set by its most limiting required resource — not by the battery alone. If oxygen or thermal fluid runs out before the battery discharges, the operation terminates. These sums are illustrative arithmetic, never a &ldquo;safe time left&rdquo;.
        </p>
      </article>
    </div>
  );
}
