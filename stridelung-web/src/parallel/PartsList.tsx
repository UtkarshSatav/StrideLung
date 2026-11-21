"use client";
// Every visual part, grouped as the brief groups them. Hover previews, click pins (and un-pins). The isolation
// silhouettes are listed but cannot be picked.
import { useParallel } from "./ParallelProvider";
import { GROUPS, PARTS, type PartGroup } from "./model";

export function PartsList() {
  const { state, actions } = useParallel();
  return (
    <div className="pl-parts">
      {(Object.keys(GROUPS) as PartGroup[]).map((g) => (
        <div key={g}>
          <h3>{GROUPS[g]}</h3>
          <div className="sl-parts" role="list" aria-label={GROUPS[g]}>
            {PARTS.filter((p) => p.group === g).map((p) => (
              <span role="listitem" key={p.id}>
                <button
                  type="button"
                  className="sl-part"
                  disabled={!p.selectable}
                  title={p.selectable ? undefined : "Not selectable: isolation/switching approach not designed"}
                  aria-pressed={state.selectedPartId === p.id}
                  data-on={(state.selectedPartId || state.hoveredPartId) === p.id ? "" : undefined}
                  onClick={() => actions.pick(state.selectedPartId === p.id ? null : p.id)}
                  onPointerEnter={() => actions.hover(p.id)}
                  onPointerLeave={() => actions.hover(null)}
                  onFocus={() => actions.hover(p.id)}
                  onBlur={() => actions.hover(null)}
                >
                  {p.name}
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
