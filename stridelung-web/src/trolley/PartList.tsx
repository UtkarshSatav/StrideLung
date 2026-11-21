"use client";
// Keyboard-accessible list of all 27 components; hover previews, click pins (and un-pins).
import { useTrolley } from "./TrolleyProvider";
import { REGISTER } from "./register";

export function PartList() {
  const { state, actions } = useTrolley();
  return (
    <div className="sl-parts" role="list" aria-label="Components">
      {REGISTER.map((row) => (
        <span role="listitem" key={row.id}>
          <button
            type="button"
            className="sl-part"
            aria-pressed={state.selected === row.id}
            data-on={(state.selected || state.hovered) === row.id ? "" : undefined}
            onClick={() => actions.pick(state.selected === row.id ? null : row.id)}
            onPointerEnter={() => actions.hover(row.id)}
            onPointerLeave={() => actions.hover(null)}
            onFocus={() => actions.hover(row.id)}
            onBlur={() => actions.hover(null)}
          >
            <span className="sl-num">{row.id}</span>
            {row.name.split(";")[0]}
          </button>
        </span>
      ))}
    </div>
  );
}
