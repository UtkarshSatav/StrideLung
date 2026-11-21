// The full concept explorer: figure card, scene controls and panels, and the parts list.
import { ParallelProvider } from "./ParallelProvider";
import { ParallelFigure } from "./ParallelFigure";
import { SceneControls } from "./SceneControls";
import { ScenePanel } from "./ScenePanel";
import { KeyPanel } from "./KeyPanel";
import { PartsList } from "./PartsList";

export function ParallelExplorer() {
  return (
    <ParallelProvider>
      <div className="pl-explorer">
        <div className="pl-explorer-main">
          <ParallelFigure />
          <div className="pl-explorer-list">
            <PartsList />
          </div>
        </div>
        <aside className="pl-side" aria-label="Scenes, captions and the selected part">
          <SceneControls />
          <ScenePanel />
          <KeyPanel />
        </aside>
      </div>
    </ParallelProvider>
  );
}
