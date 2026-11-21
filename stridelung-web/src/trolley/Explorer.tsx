// The full interactive explorer: figure card, controls, register panel and the component list.
import { TrolleyFigure } from "./TrolleyFigure";
import { Controls } from "./Controls";
import { InfoPanel } from "./InfoPanel";
import { PartList } from "./PartList";
import { scene } from "./generated";

export function Explorer() {
  return (
    <div className="sl-explorer">
      <div className="sl-explorer-main">
        <TrolleyFigure />
        <div className="sl-explorer-list">
          <PartList />
        </div>
      </div>
      <aside className="sl-explorer-side" aria-label="Controls and register entry">
        <Controls />
        <InfoPanel c23={scene.c23} />
      </aside>
    </div>
  );
}
