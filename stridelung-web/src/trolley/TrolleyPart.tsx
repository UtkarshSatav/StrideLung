// Server component: one component drawn on its own, in the same camera and theme as the full figure,
// cropped to its bounds. Used by the per-component wrappers in ./components and the component pages.
import { partItems, scene } from "./generated";
import { itemMarkup } from "./TrolleyFigure";
import { BY_ID } from "./register";

let instance = 0;

export function TrolleyPart({ id, pad = 14, className, title }: { id: string; pad?: number; className?: string; title?: string }) {
  const row = BY_ID[id];
  // items drawn for this component, plus items that count toward it (C25's blood lines, for example)
  const own = Object.values(partItems).flat().filter((item) => item.c === id || (item.x ?? "").split(" ").includes(id));
  const items = own.sort((a, b) => a.i - b.i);
  const b = scene.bounds[id] ?? [0, 0, scene.W, scene.H];
  const x = b[0] - pad, y = b[1] - pad, w = b[2] - b[0] + pad * 2, h = b[3] - b[1] + pad * 2;
  const suffix = `-p${++instance}`;
  const markup = (id === "C04" ? `<defs><clipPath id="sl-handle-clip"><path d="${scene.handleClip}"/></clipPath></defs>` : "") + items.map(itemMarkup).join("");
  // keep clip ids unique when several parts share a page
  const unique = markup.replace(/id="(sl-[a-z-]+)"/g, `id="$1${suffix}"`).replace(/url\(#(sl-[a-z-]+)\)/g, `url(#$1${suffix})`);
  return (
    <div className={`sl-part-view${className ? ` ${className}` : ""}`} data-part-id={id}>
      {items.length ? (
        <svg className="iso-svg" viewBox={`${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`} role="img" aria-label={title ?? `${row.id} ${row.name}, drawn on its own`} dangerouslySetInnerHTML={{ __html: unique }} />
      ) : (
        <div className="sl-part-empty">
          <span className="sl-num">{row.id}</span>
          <p>Metadata only — no geometry of its own. {row.role}</p>
        </div>
      )}
    </div>
  );
}
