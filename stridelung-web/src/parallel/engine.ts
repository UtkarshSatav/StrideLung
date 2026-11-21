// The parallel-oxygenator figure's engine. Framework-free: it drives the server-rendered SVG imperatively (the
// hinged door, the drawing layers each scene lights, ghosts or mutes, the direction highlights, the review
// sequences, the trolley's own display) from one requestAnimationFrame loop, and reports state to React through
// onState. React never re-renders per frame.
//
// Visual-only: a scene chooses drawing layers. Nothing here models a valve, a flow rate, a pressure, a timer or a
// changeover, and no cartridge is ever removed. Under prefers-reduced-motion the door jumps, the highlights stand
// still and review steps advance only when asked.
import { PART_BY_ID, SCENES, SCENE_BY_ID, SELECTABLE, SEQUENCES, BANNER, type ConceptFigureState, type Scene } from "./model";

export type EngineScene = {
  P: { origin: [number, number]; scale: number; azimuth: number; elevation: number };
  V: [number, number, number];
  hinge: [number, number];
  openDeg: number;
  door: { outer: string; inner: string; z0: number; z1: number; w: number };
};

export type ViewState = ConceptFigureState & {
  hoveredPartId: string | null;
  /** index of the highlighted step in a review sequence, or −1 */
  step: number;
  touring: boolean;
  reduced: boolean;
  door: "closed" | "opening" | "open" | "closing";
};

export type ParallelEngine = {
  setScene(s: Scene): void;
  pick(id: string | null): void;
  hover(id: string | null): void;
  setPaused(on: boolean): void;
  stepBy(n: number): void;
  setStep(i: number): void;
  startTour(): void;
  stopTour(): void;
  destroy(): void;
  getState(): ViewState;
};

const DOOR_T = 3;
const DWELL: Partial<Record<Scene, number>> = { "topology-review": 2.8, "risk-review": 3.6 };
const TOUR: { scene: Scene; hold: number }[] = [
  { scene: "closed", hold: 2.6 },
  { scene: "cutaway", hold: 4.2 },
  { scene: "branch-a", hold: 4.2 },
  { scene: "branch-b", hold: 4.2 },
  { scene: "topology-review", hold: 3 * 2.8 },
  { scene: "risk-review", hold: 4 * 3.6 },
  { scene: "baseline-compare", hold: 5.2 },
];

export function createParallelEngine(root: HTMLElement, scene: EngineScene, opts: { onState: (s: ViewState) => void; autoTour?: boolean }): ParallelEngine {
  const svg = root.querySelector("svg.pl-main") as SVGSVGElement;
  const itemsG = svg.querySelector(".pl-items") as SVGGElement;
  const doorG = svg.querySelector(".pl-door") as SVGGElement;
  const card = (root.closest(".pl") as HTMLElement | null) ?? root;
  const readout = card.querySelector("[data-readout]") as HTMLElement | null;
  const liveRegion = card.querySelector("[data-live]") as HTMLElement | null;
  const screen = svg.querySelector('[data-part="screen"]') as SVGGElement | null;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const { P, V } = scene;

  // ── projection (the kit's iso, spec frame flipped into the kit's) ──
  const rad = Math.PI / 180;
  const cam = { sinA: Math.sin(P.azimuth * rad), cosA: Math.cos(P.azimuth * rad), sinE: Math.sin(P.elevation * rad), cosE: Math.cos(P.elevation * rad), k: P.scale * Math.sqrt(1.6) };
  const at = ([x, y0, z]: number[]): [number, number] => {
    const y = -y0;
    return [P.origin[0] + (x * cam.sinA - y * cam.cosA) * cam.k, P.origin[1] + ((x * cam.cosA + y * cam.sinA) * cam.sinE - z * cam.cosE) * cam.k];
  };
  const facing = (n: number[]) => n[0] * V[0] - n[1] * V[1] + n[2] * V[2] > 0;
  const LIGHT = [-cam.sinA, cam.cosA];
  const shadeOf = (n: number[]) => Math.min(3, Math.max(0, Math.floor(((n[0] * LIGHT[0] - n[1] * LIGHT[1] + 1) / 2) * 4)));
  const planeMatrix = (o: number[], ex: number[], ey: number[]) => {
    const p0 = at(o), px = at([o[0] + ex[0], o[1] + ex[1], o[2] + ex[2]]), py = at([o[0] + ey[0], o[1] + ey[1], o[2] + ey[2]]);
    return `matrix(${(px[0] - p0[0]).toFixed(4)} ${(px[1] - p0[1]).toFixed(4)} ${(py[0] - p0[0]).toFixed(4)} ${(py[1] - p0[1]).toFixed(4)} ${p0[0].toFixed(2)} ${p0[1].toFixed(2)})`;
  };

  const state: ViewState = { scene: "closed", selectedPartId: null, conceptOnly: true, motionPaused: false, hoveredPartId: null, step: -1, touring: false, reduced: still.matches, door: "closed" };
  const door = { x: 0, v: 0, target: 0 };
  let clock = 0, last = 0, frame = 0, visible = false, flowT = 0, stepClock = 0, wasMoving = false;
  let tourIndex = 0, tourClock = 0;
  let idleTimer = 0 as unknown as ReturnType<typeof setTimeout>;
  let lastEmit = "";

  const emit = () => {
    state.reduced = still.matches;
    state.door = door.target ? (door.x > 0.995 ? "open" : "opening") : door.x < 0.005 ? "closed" : "closing";
    root.setAttribute("data-door", state.door);
    const text = JSON.stringify(state);
    if (text === lastEmit) return;
    lastEmit = text;
    opts.onState({ ...state });
  };
  const announce = (text: string) => {
    if (liveRegion) liveRegion.textContent = text;
  };
  const animating = () => !state.motionPaused && !still.matches;

  // ── the door ──
  const art = scene.door;
  doorG.innerHTML = `<path class="iso-fill sl-door-fill"/><path class="iso-shade sl-edge-free"/><path class="iso-top sl-edge-top"/><path class="iso-shade sl-edge-hinge"/><g class="sl-face-out">${art.outer}</g><g class="sl-face-in">${art.inner}</g><path class="iso-line sl-edge-line" data-tone="hi"/>`;
  const dEl = {
    fill: doorG.querySelector(".sl-door-fill")!, free: doorG.querySelector(".sl-edge-free")!, top: doorG.querySelector(".sl-edge-top")!, hinge: doorG.querySelector(".sl-edge-hinge")!,
    out: doorG.querySelector(".sl-face-out") as SVGGElement, inn: doorG.querySelector(".sl-face-in") as SVGGElement, line: doorG.querySelector(".sl-edge-line")!,
  };
  let doorShown = -1;
  function drawDoor() {
    const share = door.x;
    if (Math.abs(share - doorShown) < 1e-4) return;
    doorShown = share;
    const th = share * scene.openDeg * rad;
    const d = [Math.cos(th), -Math.sin(th), 0];
    const n = [-Math.sin(th), -Math.cos(th), 0];
    const o = [scene.hinge[0], scene.hinge[1], 0];
    const p = (u: number, z: number, depth = 0) => [o[0] + u * d[0] - depth * n[0], o[1] + u * d[1] - depth * n[1], z];
    const { w, z0, z1 } = art;
    const outerSeen = facing(n);
    const off = outerSeen ? 0 : DOOR_T;
    (outerSeen ? dEl.out : dEl.inn).setAttribute("transform", planeMatrix(p(0, 0, off), d, [0, 0, -1]));
    dEl.out.style.display = outerSeen ? "" : "none";
    dEl.inn.style.display = outerSeen ? "none" : "";
    const quad = (pts: number[][]) => "M" + pts.map((q) => at(q).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";
    const free = [p(w, z0), p(w, z1), p(w, z1, DOOR_T), p(w, z0, DOOR_T)];
    const top = [p(0, z1), p(w, z1), p(w, z1, DOOR_T), p(0, z1, DOOR_T)];
    const hingeQ = [p(0, z0), p(0, z1), p(0, z1, DOOR_T), p(0, z0, DOOR_T)];
    const freeSeen = facing(d);
    const hingeSeen = facing([-d[0], -d[1], 0]);
    dEl.free.setAttribute("d", freeSeen ? quad(free) : "");
    dEl.free.setAttribute("data-shade", String(shadeOf(d)));
    dEl.hinge.setAttribute("d", hingeSeen ? quad(hingeQ) : "");
    dEl.hinge.setAttribute("data-shade", String(shadeOf([-d[0], -d[1], 0])));
    dEl.top.setAttribute("d", quad(top));
    dEl.fill.setAttribute("d", quad([p(0, z0, off), p(w, z0, off), p(w, z1, off), p(0, z1, off)]) + (freeSeen ? quad(free) : "") + quad(top));
    dEl.line.setAttribute("d", (freeSeen ? quad(free) : "") + quad(top) + (hingeSeen ? quad(hingeQ) : ""));
    doorG.setAttribute("data-shade", String(shadeOf(outerSeen ? n : [-n[0], -n[1], 0])));
  }

  // ── drawing layers ──
  const tops = [...itemsG.children, doorG] as SVGGElement[];
  const has = (el: Element, id: string) => {
    const g = el as HTMLElement;
    return g.dataset.c === id || (g.dataset.x ?? "").split(" ").includes(id) || g.dataset.sub === id;
  };
  let lit: Element[] = [];
  function light(ids: string[]) {
    for (const el of lit) el.removeAttribute("data-on");
    lit = ids.length ? [...svg.querySelectorAll(ids.map((id) => `[data-c="${id}"], [data-x~="${id}"], [data-sub="${id}"]`).join(", "))] : [];
    for (const el of lit) el.setAttribute("data-on", "");
  }
  function layers() {
    const def = SCENE_BY_ID[state.scene];
    const seq = SEQUENCES[state.scene];
    const stepDef = seq && state.step >= 0 ? seq[state.step] : null;
    let litIds = def.layers.lit, ghost = def.layers.ghost, mute = def.layers.mute;
    if (stepDef) litIds = stepDef.lit;
    if (state.selectedPartId) {
      litIds = [state.selectedPartId];
      mute = true;
    }
    const holds = (el: Element) => litIds.some((id) => el.querySelector(`[data-sub="${id}"], [data-c="${id}"], [data-x~="${id}"]`));
    for (const el of tops) {
      el.classList.remove("pl-ghost", "pl-mute", "pl-dim");
      if (litIds.some((id) => has(el, id))) continue;
      if (ghost.some((id) => has(el, id))) el.classList.add("pl-ghost");
      else if (mute) el.classList.add("pl-mute", ...(litIds.length && !holds(el) ? ["pl-dim"] : []));
    }
    const hovered = state.hoveredPartId && state.hoveredPartId !== state.selectedPartId ? [state.hoveredPartId] : [];
    light([...litIds, ...hovered]);
    root.toggleAttribute("data-focus", litIds.length > 0 || hovered.length > 0);
    root.setAttribute("data-scene", state.scene);
    root.setAttribute("data-callout", stepDef?.callout ?? "");
    root.setAttribute("data-flows", state.selectedPartId ? "" : def.layers.flows.join(" "));
  }

  // ── the trolley's display: banner and scene name only ──
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  function drawScreen() {
    if (!screen) return;
    const def = SCENE_BY_ID[state.scene];
    const seq = SEQUENCES[state.scene];
    const sub = state.selectedPartId ? PART_BY_ID[state.selectedPartId].name : seq && state.step >= 0 ? seq[state.step].title : "Concept exploration";
    const [b1, b2] = [BANNER.split(" · ")[0], BANNER.split(" · ").slice(1).join(" · ")];
    const s =
      `<rect class="sl-tab on" x="10" y="10" width="64" height="10" rx="2"/><text class="sl-scr hi" x="42" y="17.4" font-size="5.2" text-anchor="middle">${esc(b1)}</text>` +
      `<text class="sl-scr" x="80" y="17.4" font-size="4.6">PARALLEL OXYGENATOR</text>` +
      `<text class="sl-scr hi" x="12" y="32" font-size="7.2">${esc(def.label.toUpperCase())}</text>` +
      `<text class="sl-scr" x="12" y="42" font-size="5">${esc(sub.toUpperCase().slice(0, 40))}</text>` +
      `<text class="sl-scr dim" x="12" y="50" font-size="4.2">${esc(b2.slice(0, 54))}</text>`;
    if (screen.innerHTML !== s) screen.innerHTML = s;
  }

  // ── readout ──
  function say() {
    const def = SCENE_BY_ID[state.scene];
    const seq = SEQUENCES[state.scene];
    const id = state.selectedPartId || state.hoveredPartId;
    let text: string;
    if (id) text = `${PART_BY_ID[id].name} · concept only`;
    else if (seq && state.step >= 0) text = `${def.label} · ${state.step + 1}/${seq.length} ${seq[state.step].title}`;
    else if (state.door === "opening" || state.door === "closing") text = state.door === "opening" ? "opening the door" : "closing the door";
    else text = `${def.label} · concept only`;
    if (readout && readout.textContent !== text) readout.textContent = text;
  }

  // ── loop ──
  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    clock += dt;
    let moving = false;
    if (state.touring) {
      tourClock += dt;
      if (tourClock >= TOUR[tourIndex].hold) {
        tourClock = 0;
        tourIndex = (tourIndex + 1) % TOUR.length;
        setScene(TOUR[tourIndex].scene, true);
      }
    }
    // door spring
    if (still.matches) {
      door.x = door.target;
      door.v = 0;
    } else {
      for (let i = 0; i < 4; i++) {
        const h = dt / 4;
        door.v += ((door.target - door.x) * 30 - door.v * 11) * h;
        door.x += door.v * h;
      }
      if (Math.abs(door.target - door.x) < 2e-4 && Math.abs(door.v) < 2e-4) {
        door.x = door.target;
        door.v = 0;
      } else moving = true;
    }
    drawDoor();
    // review steps advance on their own only while motion is allowed
    const dwell = DWELL[state.scene];
    if (dwell && animating() && !state.selectedPartId) {
      stepClock += dt;
      if (stepClock >= dwell) {
        stepClock = 0;
        const n = SEQUENCES[state.scene]!.length;
        state.step = (state.step + 1) % n;
        layers();
        drawScreen();
      }
    }
    // direction highlights drift only while motion is allowed
    const flowing = (root.getAttribute("data-flows") ?? "") !== "";
    if (flowing && animating()) {
      flowT += dt * 18;
      root.style.setProperty("--t", flowT.toFixed(1));
    }
    say();
    if (wasMoving !== moving) emit();
    wasMoving = moving;
    const keep = moving || state.touring || (flowing && animating()) || (Boolean(dwell) && animating());
    frame = visible && keep ? requestAnimationFrame(tick) : 0;
    if (!frame) emit();
  }
  function run() {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }
  const io = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) run();
  }, { rootMargin: "120px 0px" });
  io.observe(root);

  // ── actions ──
  function setScene(s: Scene, quiet = false) {
    const def = SCENE_BY_ID[s];
    state.scene = s;
    state.step = SEQUENCES[s] ? 0 : -1;
    stepClock = 0;
    door.target = def.door === "open" ? 1 : 0;
    layers();
    drawScreen();
    say();
    if (!quiet) announce(def.description);
    emit();
    run();
  }
  function pick(id: string | null) {
    if (id && !PART_BY_ID[id]?.selectable) id = null;
    state.selectedPartId = id;
    state.hoveredPartId = null;
    // a closed door hides the bay; picking an inner part opens it (a viewing state, not a procedure)
    if (id && state.scene === "closed" && !["shell", "back-shell", "extension", "door", "hinges", "window", "wheels", "handle", "display"].includes(id)) setScene("cutaway", true);
    layers();
    drawScreen();
    say();
    if (id) announce(`${PART_BY_ID[id].name}. ${PART_BY_ID[id].caption} Concept only.`);
    emit();
    run();
  }
  function hover(id: string | null) {
    if (id && !PART_BY_ID[id]?.selectable) id = null;
    if (state.hoveredPartId === id) return;
    state.hoveredPartId = id;
    layers();
    say();
    emit();
  }
  function setPaused(on: boolean) {
    state.motionPaused = on;
    if (on) stopTour(true);
    root.toggleAttribute("data-paused", on);
    announce(on ? "Motion paused" : "Motion resumed");
    emit();
    run();
  }
  function setStep(i: number) {
    const seq = SEQUENCES[state.scene];
    if (!seq) return;
    state.step = ((i % seq.length) + seq.length) % seq.length;
    stepClock = 0;
    layers();
    drawScreen();
    say();
    announce(`${seq[state.step].title}. ${seq[state.step].caption}`);
    emit();
  }
  function startTour() {
    if (still.matches) return;
    state.motionPaused = false;
    root.removeAttribute("data-paused");
    state.touring = true;
    state.selectedPartId = null;
    tourIndex = Math.max(0, TOUR.findIndex((t) => t.scene === state.scene));
    tourClock = 0;
    setScene(TOUR[tourIndex].scene, true);
    emit();
    run();
  }
  function stopTour(quiet = false) {
    clearTimeout(idleTimer);
    if (!state.touring) return;
    state.touring = false;
    if (!quiet) emit();
  }
  const user = <A extends any[]>(fn: (...args: A) => void) => (...args: A) => {
    stopTour();
    fn(...args);
  };

  // ── pointer and keyboard: pick the innermost tagged part ──
  const idAt = (event: PointerEvent | MouseEvent) => {
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    const el = hit?.closest?.("[data-sub], [data-c]") as HTMLElement | null;
    if (!el || !root.contains(el) || el.closest("[data-nonselect]")) return null;
    const id = el.dataset.sub ?? el.dataset.c ?? null;
    return id && PART_BY_ID[id]?.selectable ? id : null;
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hover(idAt(event));
  };
  const onLeave = () => hover(null);
  const onClick = (event: MouseEvent) => {
    stopTour();
    const id = idAt(event);
    pick(id && id !== state.selectedPartId ? id : null);
  };
  const onKey = (event: KeyboardEvent) => {
    const key = event.key;
    const sceneKey = SCENES.find((s) => s.key === key);
    if (sceneKey) {
      event.preventDefault();
      stopTour();
      setScene(sceneKey.id);
      return;
    }
    if (key === " ") {
      event.preventDefault();
      setPaused(!state.motionPaused);
      return;
    }
    if (key === "Escape") {
      event.preventDefault();
      stopTour();
      if (state.selectedPartId) pick(null);
      else setScene("cutaway");
      return;
    }
    if ((key === "n" || key === "N" || key === "]") && SEQUENCES[state.scene]) {
      stopTour();
      setStep(state.step + 1);
      return;
    }
    if ((key === "p" || key === "P" || key === "[") && SEQUENCES[state.scene]) {
      stopTour();
      setStep(state.step - 1);
      return;
    }
    const index = state.selectedPartId ? SELECTABLE.indexOf(state.selectedPartId) : -1;
    let next: string | null = null;
    if (key === "ArrowRight" || key === "ArrowDown") next = SELECTABLE[Math.min(SELECTABLE.length - 1, index + 1)];
    else if (key === "ArrowLeft" || key === "ArrowUp") next = SELECTABLE[Math.max(0, index - 1)];
    else if (key === "Home") next = SELECTABLE[0];
    else if (key === "End") next = SELECTABLE[SELECTABLE.length - 1];
    if (next === null) return;
    event.preventDefault();
    stopTour();
    pick(next);
  };
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKey);
  const onMotion = () => {
    if (still.matches) stopTour();
    emit();
    run();
  };
  still.addEventListener("change", onMotion);

  // ── first frame ──
  setScene("closed", true);
  drawDoor();
  if (opts.autoTour !== false && !still.matches) {
    idleTimer = setTimeout(() => {
      if (state.scene !== "closed" || state.selectedPartId || state.motionPaused) return;
      startTour();
    }, 2200);
  }

  return {
    setScene: user((s: Scene) => setScene(s)),
    pick: user((id: string | null) => pick(id)),
    hover,
    setPaused,
    stepBy: user((n: number) => setStep(state.step + n)),
    setStep: user((i: number) => setStep(i)),
    startTour,
    stopTour: () => stopTour(),
    destroy() {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      io.disconnect();
      still.removeEventListener("change", onMotion);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    },
    getState: () => ({ ...state }),
  };
}
