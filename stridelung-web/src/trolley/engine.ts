// The StrideLung figure's motion engine. Framework-free: it drives the server-rendered SVG imperatively
// (transforms, painter's re-sort, the hinged doors, the handle clip, the rotor, the machine's display) from one
// requestAnimationFrame loop, and reports state changes to React through onState. React never re-renders
// per frame. Under prefers-reduced-motion every move jumps to its target and nothing loops.
import { REGISTER, BY_ID, type ComponentRow } from "./register";
import type { DoorArt } from "./types";

export type View = "assembled" | "open" | "exploded" | "parked" | "transport";
export type FlowId = "blood" | "gas" | "water" | "electrical";
export type LayerId = "all" | "blood" | "gas" | "thermal" | "electrical" | "chassis";

export type EngineScene = {
  P: { origin: [number, number]; scale: number; azimuth: number; elevation: number };
  V: [number, number, number];
  EX: [number, number];
  EY: [number, number];
  EZ: [number, number];
  hinge: [number, number];
  doors: { main: DoorArt; hatch: DoorArt };
  explode: string[];
  spring: { stagger: number; stiffness: number; damping: number; substeps: number };
  mass: { total: number };
  subsystems: Record<string, string>;
};

export type EngineState = {
  view: View;
  flows: FlowId[];
  layer: LayerId;
  selected: string | null;
  hovered: string | null;
  gasExternal: boolean;
  blocked: boolean;
  touring: boolean;
  status: string;
};

export type Engine = {
  setView(v: View): void;
  setFlows(f: FlowId[]): void;
  toggleFlow(f: FlowId): void;
  setLayer(l: LayerId): void;
  pick(id: string | null): void;
  hover(id: string | null): void;
  setGasExternal(on: boolean): void;
  setBlocked(on: boolean): void;
  reset(): void;
  stopTour(): void;
  setAutoTour(on: boolean): void;
  destroy(): void;
  getState(): EngineState;
};

const FLOW_OF: Record<FlowId, string[]> = { blood: ["drain", "return"], gas: ["gas", "gasout", "ext"], water: ["water"], electrical: ["power", "data"] };
const OPEN_DEG = 108;
const DOOR_T = 3;
const TOUR = [
  { t: 0, view: "assembled" as View },
  { t: 1.6, view: "open" as View },
  { t: 3.6, flows: ["blood"] as FlowId[], layer: "blood" as LayerId },
  { t: 7.6, flows: ["gas"] as FlowId[], layer: "gas" as LayerId },
  { t: 11.0, flows: ["water"] as FlowId[], layer: "thermal" as LayerId },
  { t: 14.0, flows: ["electrical"] as FlowId[], layer: "electrical" as LayerId },
  { t: 17.4, flows: [] as FlowId[], layer: "all" as LayerId, view: "exploded" as View },
  { t: 23.0, view: "assembled" as View },
  { t: 27.0, loop: true },
];

type Spring = { x: number; v: number; target: number; pending: { value: number; at: number } | null };
type Node = { el: SVGGElement; ride: string; key: number; m: number[]; lift: number; shown: string };

export function createEngine(root: HTMLElement, scene: EngineScene, opts: { onState: (s: EngineState) => void; autoTour?: boolean }): Engine {
  const svg = root.querySelector("svg") as SVGSVGElement;
  const itemsG = svg.querySelector(".sl-items") as SVGGElement;
  const doorsBack = svg.querySelector(".sl-doors-back") as SVGGElement;
  const doorsFront = svg.querySelector(".sl-doors-front") as SVGGElement;
  const gasHatch = svg.querySelector(".sl-gashatch") as SVGGElement;
  const holdClip = svg.querySelector("[data-handle-clip]") as SVGPathElement | null;
  // root is the .sl-stage; the card's readout and the live region sit in its figure
  const card = (root.closest(".sl") as HTMLElement | null) ?? root;
  const readout = card.querySelector("[data-readout]") as HTMLElement | null;
  const liveRegion = card.querySelector("[data-live]") as HTMLElement | null;
  const screen = svg.querySelector('[data-part="screen"]') as SVGGElement | null;
  const rotorG = svg.querySelector('[data-part="rotor"]') as SVGGElement | null;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const { P, V, EX, EY, EZ, spring: SPR } = scene;

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

  // ── items and springs ──
  const nodes: Node[] = [...itemsG.children].map((el) => {
    const g = el as SVGGElement;
    const m = (g.dataset.m ?? "0,0,0").split(",").map(Number);
    return { el: g, ride: g.dataset.ride || g.dataset.piece || "stand", key: Number(g.dataset.k), m, lift: m[0] * V[0] + m[1] * V[1] + m[2] * V[2], shown: "" };
  });
  let order = nodes.map((_, i) => i);
  const ids = new Set([...nodes.map((n) => n.ride), ...scene.explode, "handle", "stab", "brake", "gashatch"]);
  const piece: Record<string, Spring> = Object.fromEntries([...ids].map((id) => [id, { x: 0, v: 0, target: 0, pending: null }]));
  const doors: Record<"main" | "hatch", Spring> = { main: { x: 0, v: 0, target: 0, pending: null }, hatch: { x: 0, v: 0, target: 0, pending: null } };

  const state: EngineState = { view: "assembled", flows: [], layer: "all", selected: null, hovered: null, gasExternal: false, blocked: false, touring: false, status: "" };
  let clock = 0, apart = false, frame = 0, last = 0, visible = false, rotor = 0, flowT = 0, wasMoving = false;
  let tourClock = 0, tourStep = -1, idleTimer = 0 as unknown as ReturnType<typeof setTimeout>;
  let autoTour = opts.autoTour !== false;
  let lastEmit = "";

  const emit = () => {
    state.status = stateWord();
    const text = JSON.stringify(state);
    if (text === lastEmit) return;
    lastEmit = text;
    opts.onState({ ...state, flows: [...state.flows] });
  };
  const announce = (text: string) => {
    if (liveRegion) liveRegion.textContent = text;
  };

  function stepSpring(s: Spring, dt: number, calm: boolean, stiffness = SPR.stiffness, damping = SPR.damping) {
    if (s.pending && clock >= s.pending.at) {
      s.target = s.pending.value;
      s.pending = null;
    }
    if (calm) {
      s.x = s.target;
      s.v = 0;
      return s.pending !== null;
    }
    for (let i = 0; i < SPR.substeps; i++) {
      const h = dt / SPR.substeps;
      s.v += ((s.target - s.x) * stiffness - s.v * damping) * h;
      s.x += s.v * h;
    }
    if (Math.abs(s.target - s.x) < 2e-4 && Math.abs(s.v) < 2e-4) {
      s.x = s.target;
      s.v = 0;
      return s.pending !== null;
    }
    return true;
  }
  function setApart(on: boolean) {
    if (apart === on) return;
    apart = on;
    const goal = on ? 1 : 0;
    let index = 0;
    for (const id of on ? scene.explode : [...scene.explode].reverse()) {
      const s = piece[id];
      if (s.target === goal) {
        s.pending = null;
        continue;
      }
      s.pending = { value: goal, at: clock + (still.matches ? 0 : index++ * SPR.stagger) };
    }
  }
  const anyApart = () => scene.explode.some((id) => piece[id].x > 0.002 || piece[id].target > 0 || (piece[id].pending?.value ?? 0) > 0);

  function place() {
    for (const node of nodes) {
      const share = piece[node.ride]?.x ?? 0;
      const tx = (EX[0] * node.m[0] + EY[0] * node.m[1] + EZ[0] * node.m[2]) * share;
      const ty = (EX[1] * node.m[0] + EY[1] * node.m[1] + EZ[1] * node.m[2]) * share;
      const text = share === 0 || (Math.abs(tx) < 0.005 && Math.abs(ty) < 0.005) ? "" : `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`;
      if (text !== node.shown) {
        node.shown = text;
        if (text) node.el.setAttribute("transform", text);
        else node.el.removeAttribute("transform");
      }
    }
    const h = piece.handle.x;
    holdClip?.setAttribute("transform", h ? `translate(${(-EZ[0] * 260 * h).toFixed(2)} ${(-EZ[1] * 260 * h).toFixed(2)})` : "");
    const gh = piece.gashatch.x;
    gasHatch?.setAttribute("transform", gh ? `translate(${(EX[0] * -150 * gh).toFixed(2)} ${(EX[1] * -150 * gh).toFixed(2)})` : "");
    const keyOf = (i: number) => nodes[i].key + nodes[i].lift * (piece[nodes[i].ride]?.x ?? 0);
    const next = order.slice().sort((a, b) => keyOf(a) - keyOf(b));
    if (next.some((v, i) => v !== order[i])) {
      const fragment = document.createDocumentFragment();
      for (const i of next) fragment.appendChild(nodes[i].el);
      itemsG.appendChild(fragment);
      order = next;
    }
  }

  // ── hinged doors ──
  const doorEls: Record<string, any> = {};
  for (const id of ["main", "hatch"] as const) {
    const g = svg.querySelector(`.sl-door[data-door="${id}"]`) as SVGGElement;
    const art = scene.doors[id];
    g.innerHTML = `<path class="iso-fill sl-door-fill"/><path class="iso-shade sl-edge-free"/><path class="iso-top sl-edge-top"/><path class="iso-shade sl-edge-hinge"/><g class="sl-face-out">${art.outer}</g><g class="sl-face-in">${art.inner}</g><path class="iso-line sl-edge-line" data-tone="hi"/>`;
    doorEls[id] = { g, art, fill: g.querySelector(".sl-door-fill"), free: g.querySelector(".sl-edge-free"), top: g.querySelector(".sl-edge-top"), hinge: g.querySelector(".sl-edge-hinge"), out: g.querySelector(".sl-face-out"), inn: g.querySelector(".sl-face-in"), line: g.querySelector(".sl-edge-line"), shown: -1 };
  }
  function drawDoor(id: "main" | "hatch") {
    const e = doorEls[id];
    const share = doors[id].x;
    if (Math.abs(share - e.shown) < 1e-4) return;
    e.shown = share;
    const th = (share * OPEN_DEG * Math.PI) / 180;
    const d = [Math.cos(th), -Math.sin(th), 0];
    const n = [-Math.sin(th), -Math.cos(th), 0];
    const o = [scene.hinge[0], scene.hinge[1], 0];
    const p = (u: number, z: number, depth = 0) => [o[0] + u * d[0] - depth * n[0], o[1] + u * d[1] - depth * n[1], z];
    const { w, z0, z1 } = e.art as DoorArt;
    const outerSeen = facing(n);
    const off = outerSeen ? 0 : DOOR_T;
    (outerSeen ? e.out : e.inn).setAttribute("transform", planeMatrix(p(0, 0, off), d, [0, 0, -1]));
    e.out.style.display = outerSeen ? "" : "none";
    e.inn.style.display = outerSeen ? "none" : "";
    const quad = (pts: number[][]) => "M" + pts.map((q) => at(q).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";
    const free = [p(w, z0), p(w, z1), p(w, z1, DOOR_T), p(w, z0, DOOR_T)];
    const top = [p(0, z1), p(w, z1), p(w, z1, DOOR_T), p(0, z1, DOOR_T)];
    const hingeQ = [p(0, z0), p(0, z1), p(0, z1, DOOR_T), p(0, z0, DOOR_T)];
    const freeSeen = facing(d);
    const hingeSeen = facing([-d[0], -d[1], 0]);
    e.free.setAttribute("d", freeSeen ? quad(free) : "");
    e.free.setAttribute("data-shade", String(shadeOf(d)));
    e.hinge.setAttribute("d", hingeSeen ? quad(hingeQ) : "");
    e.hinge.setAttribute("data-shade", String(shadeOf([-d[0], -d[1], 0])));
    e.top.setAttribute("d", quad(top));
    e.fill.setAttribute("d", quad([p(0, z0, off), p(w, z0, off), p(w, z1, off), p(0, z1, off)]) + (freeSeen ? quad(free) : "") + quad(top));
    e.line.setAttribute("d", (freeSeen ? quad(free) : "") + quad(top) + (hingeSeen ? quad(hingeQ) : ""));
    e.g.setAttribute("data-shade", String(shadeOf(outerSeen ? n : [-n[0], -n[1], 0])));
    // a door swung past 90° lies entirely left of everything else, so it is drawn behind it all
    const host = share * OPEN_DEG >= 90 ? doorsBack : doorsFront;
    if (e.g.parentNode !== host) host.appendChild(e.g);
  }

  // ── rotor (illustrative) ──
  const rotorInner = rotorG?.firstElementChild as SVGGElement | null;
  if (rotorG) rotorG.setAttribute("transform", rotorG.getAttribute("data-plane") ?? "");
  const drawRotor = () => rotorInner?.setAttribute("transform", `rotate(${(rotor % 360).toFixed(1)})`);

  // ── the machine's own display (C20) ──
  const traces: Record<string, number[]> = { flow: [], pin: [], pout: [] };
  let traceClock = 0;
  let tab = "overview";
  const synthetic = (t: number) => {
    const b = state.blocked ? 1 : 0;
    const wob = Math.sin(t * 2.1) * 0.03 + Math.sin(t * 5.3 + 1) * 0.015;
    return { flow: 0.78 - b * 0.34 + wob, pin: 0.62 - b * 0.38 + wob * 0.8, pout: 0.7 - b * 0.22 + wob * 0.6 } as Record<string, number>;
  };
  function sampleTraces(dt: number) {
    traceClock += dt;
    if (!traces.flow.length) for (let i = 0; i < 60; i++) for (const id of Object.keys(traces)) traces[id].push(synthetic(-(60 - i) * 0.12)[id]);
    while (traceClock > 0.12) {
      traceClock -= 0.12;
      const s = synthetic(clock);
      for (const id of Object.keys(traces)) {
        const prev = traces[id][traces[id].length - 1];
        traces[id].push(prev + (s[id] - prev) * 0.25);
        traces[id].shift();
      }
    }
  }
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  function drawScreen() {
    if (!screen) return;
    const sel = state.selected || state.hovered;
    tab = sel ? "part" : state.flows.length || state.blocked ? "signals" : "overview";
    let s = "";
    [["overview", "SYSTEM"], ["part", "COMPONENT"], ["signals", "SIGNALS"]].forEach(([id, label], i) => {
      const x = 9 + i * 58;
      s += `<rect class="sl-tab${tab === id ? " on" : ""}" x="${x}" y="9" width="56" height="11" rx="2"/><text class="sl-scr" x="${x + 28}" y="17" font-size="5.4" text-anchor="middle">${label}</text>`;
    });
    if (tab === "part" && sel) {
      const row = BY_ID[sel];
      s += `<text class="sl-scr hi" x="11" y="33" font-size="8">${row.id}</text><text class="sl-scr" x="30" y="33" font-size="5.2">${esc(row.name.slice(0, 34).toUpperCase())}</text>`;
      s += `<text class="sl-scr" x="11" y="45" font-size="5.2">${esc(row.envelope.toUpperCase().slice(0, 36))}</text>`;
      s += `<text class="sl-scr" x="11" y="55" font-size="5.2">${row.mass.toFixed(2)} KG ALLOCATED · P</text>`;
      s += `<text class="sl-scr" x="11" y="65" font-size="5.2">MATERIAL ${row.matStatus}</text>`;
      s += `<text class="sl-scr dim" x="11" y="77" font-size="4.6">CONCEPT · NOT A CLINICAL DEVICE</text>`;
    } else if (tab === "signals") {
      [["flow", "FLOW"], ["pin", "P DRAINAGE"], ["pout", "P POST-OXY"]].forEach(([id, label], i) => {
        const y0 = 25 + i * 17;
        const pts = traces[id].map((v, j) => `${j ? "L" : "M"}${(56 + j * 2).toFixed(1)} ${(y0 + 14 - v * 13).toFixed(1)}`).join("");
        s += `<text class="sl-scr" x="11" y="${y0 + 9}" font-size="4.8">${label}</text><path class="sl-trace${state.blocked && id !== "pout" ? " warn" : ""}" d="${pts}"/>`;
      });
      s += `<text class="sl-scr dim" x="11" y="79" font-size="4.4">SYNTHETIC · ILLUSTRATIVE · ${state.blocked ? "BLOCKED-LINE DEMO" : "NORMAL-FLOW DEMO"}</text>`;
    } else {
      s += `<text class="sl-scr hi" x="11" y="34" font-size="6.2">VV CONFIGURATION · CONCEPT v0.1</text>`;
      s += `<text class="sl-scr" x="11" y="46" font-size="5.2">GAS: ${state.gasExternal ? "EXTERNAL BLENDED SUPPLY" : "ONBOARD CYLINDER"}</text>`;
      s += `<text class="sl-scr" x="11" y="56" font-size="5.2">OVERLAY: ${state.flows.length ? state.flows.join(" + ").toUpperCase() : "OFF"}</text>`;
      s += `<text class="sl-scr" x="11" y="66" font-size="5.2">MASS PLAN ${scene.mass.total.toFixed(2)} / 28.00 KG</text>`;
      s += `<text class="sl-scr dim" x="11" y="78" font-size="4.6">NOT AN OPERATING INSTRUCTION</text>`;
    }
    if (screen.innerHTML !== s) screen.innerHTML = s;
  }

  // ── selection, x-ray, flows ──
  let lit: Element[] = [];
  const extraEls = [gasHatch, ...svg.querySelectorAll(".sl-door")].filter(Boolean) as Element[];
  function highlight(id: string | null) {
    for (const el of lit) el.removeAttribute("data-on");
    lit = [];
    if (id) {
      lit = [...svg.querySelectorAll(`[data-c="${id}"], [data-x~="${id}"]`)];
      for (const el of lit) el.setAttribute("data-on", "");
      root.setAttribute("data-focus", "");
    } else root.removeAttribute("data-focus");
  }
  function xray(match: string | null) {
    for (const el of [...itemsG.children, ...extraEls]) {
      el.classList.remove("sl-ghost", "sl-holds");
      if (!match || el.matches(match)) continue;
      el.classList.add(el.querySelector(match) ? "sl-holds" : "sl-ghost");
    }
  }
  function applyXray() {
    if (state.selected) xray(`[data-c="${state.selected}"], [data-x~="${state.selected}"]`);
    else if (state.layer !== "all") xray(`[data-s="${state.layer}"]`);
    else xray(null);
  }
  function applyFlows() {
    root.setAttribute("data-flows", state.flows.flatMap((f) => FLOW_OF[f]).join(" "));
  }

  // ── readout ──
  function stateWord() {
    const moving = scene.explode.some((id) => Math.abs(piece[id].x - piece[id].target) > 0.01 || piece[id].pending);
    if (state.view === "exploded") return moving || doors.main.x < 0.97 ? "taking apart" : `exploded · ${scene.explode.length} modules out`;
    if (anyApart()) return "putting back";
    if (doors.main.x > 0.02 && doors.main.x < 0.98) return doors.main.target ? "opening" : "closing";
    if (state.view === "open") return state.gasExternal ? "open · external gas" : "open case";
    if (state.view === "parked") return "parked · stabilisers 620 × 480 mm";
    if (state.view === "transport") return `transport · handle ${Math.round(790 + 260 * piece.handle.x)} mm`;
    return "assembled · 460 × 330 × 790 mm";
  }
  function say() {
    const id = state.selected || state.hovered;
    let text: string;
    if (id) {
      const row: ComponentRow = BY_ID[id];
      text = `${row.id} · ${row.mass.toFixed(2)} kg${row.massNote ? " (all)" : ""} · ${row.envelope}`;
    } else text = `${stateWord()} · ${scene.mass.total.toFixed(2)} kg plan`;
    if (readout && readout.textContent !== text) readout.textContent = text;
  }

  // ── tour ──
  function tourTick(dt: number) {
    tourClock += dt;
    const index = TOUR.findIndex((s, i) => tourClock >= s.t && (i === TOUR.length - 1 || tourClock < TOUR[i + 1].t));
    if (index < 0) return;
    const step = TOUR[index] as any;
    if (step.loop) {
      tourClock = 0;
      tourStep = -1;
      return;
    }
    if (index === tourStep) return;
    tourStep = index;
    if (step.view) setView(step.view, true);
    if (step.flows) setFlows(step.flows);
    if (step.layer) setLayer(step.layer, true);
  }
  function stopTour() {
    if (state.touring) {
      state.touring = false;
      setLayer("all", true);
    }
    scheduleTour(9000);
    emit();
  }
  function scheduleTour(delay: number) {
    clearTimeout(idleTimer);
    if (still.matches || !autoTour) return;
    idleTimer = setTimeout(() => {
      if (state.selected || state.flows.length || state.layer !== "all" || state.view !== "assembled" || state.blocked || state.gasExternal) return;
      state.touring = true;
      tourClock = 0;
      tourStep = -1;
      emit();
      run();
    }, delay);
  }

  // ── loop ──
  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    clock += dt;
    const calm = still.matches;
    if (state.touring) tourTick(dt);
    const wantOpen = state.view === "open" || state.view === "exploded" || state.gasExternal;
    const open = wantOpen || anyApart();
    doors.main.target = doors.hatch.target = open ? 1 : 0;
    piece.gashatch.target = open ? 1 : 0;
    if (state.view === "exploded" && doors.main.x > 0.96 && doors.hatch.x > 0.96 && piece.stab.x < 0.02) setApart(true);
    if (state.view !== "exploded") setApart(false);
    let moving = false;
    for (const id of Object.keys(piece)) if (stepSpring(piece[id], dt, calm)) moving = true;
    for (const id of ["main", "hatch"] as const) if (stepSpring(doors[id], dt, calm, 30, 11)) moving = true;
    if (state.flows.includes("blood") && !calm) rotor += dt * 220;
    if (state.flows.length && !calm) {
      flowT += dt * (state.blocked ? 9 : 22);
      root.style.setProperty("--t", flowT.toFixed(1));
    }
    if (state.flows.length || state.blocked) {
      sampleTraces(dt);
      if (tab === "signals") drawScreen();
    }
    place();
    drawDoor("main");
    drawDoor("hatch");
    drawRotor();
    say();
    if (wasMoving !== moving) emit();
    wasMoving = moving;
    const keep = moving || state.touring || (state.flows.length > 0 && !calm) || state.blocked;
    frame = visible && keep ? requestAnimationFrame(tick) : 0;
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
  function setView(v: View, quiet = false) {
    state.view = v;
    piece.handle.target = v === "transport" ? 1 : 0;
    piece.stab.target = v === "parked" ? 1 : 0;
    piece.brake.target = v === "parked" ? 1 : 0;
    if (v === "exploded" && state.gasExternal) setGasExternal(false);
    if (!quiet) announce({ assembled: "Assembled, case closed", open: "Case open", exploded: "Taking apart", parked: "Parked, brakes on, stabilisers out", transport: "Transport, handle raised" }[v]);
    emit();
    run();
  }
  function setFlows(f: FlowId[]) {
    state.flows = [...f];
    applyFlows();
    drawScreen();
    emit();
    run();
  }
  function setLayer(l: LayerId, quiet = false) {
    state.layer = l;
    if (l === "all") root.removeAttribute("data-filter");
    else root.setAttribute("data-filter", l);
    applyXray();
    if (!quiet) announce(l === "all" ? "All layers" : `${scene.subsystems[l]} layer`);
    emit();
  }
  function pick(id: string | null) {
    state.selected = id;
    state.hovered = null;
    highlight(id);
    applyXray();
    drawScreen();
    say();
    if (id) announce(`${id}, ${BY_ID[id].name}`);
    emit();
  }
  function hover(id: string | null) {
    if (state.hovered === id) return;
    state.hovered = id;
    highlight(state.selected || id);
    drawScreen();
    say();
    emit();
  }
  function setGasExternal(on: boolean) {
    state.gasExternal = on;
    root.setAttribute("data-gas", on ? "ext" : "cyl");
    if (on && state.view === "exploded") state.view = "open";
    if (on && state.view === "assembled") state.view = "open";
    if (on && !state.flows.includes("gas")) setFlows([...state.flows, "gas"]);
    drawScreen();
    emit();
    run();
  }
  function setBlocked(on: boolean) {
    state.blocked = on;
    root.toggleAttribute("data-blocked", on);
    if (on && !state.flows.includes("blood")) setFlows([...state.flows, "blood"]);
    drawScreen();
    emit();
    run();
  }
  function reset() {
    state.touring = false;
    clearTimeout(idleTimer);
    setFlows([]);
    setLayer("all", true);
    setBlocked(false);
    setGasExternal(false);
    pick(null);
    setView("assembled", true);
    announce("Reset to assembled");
    scheduleTour(9000);
  }

  // ── pointer: hover and tap pick the innermost tagged part ──
  const idAt = (event: PointerEvent | MouseEvent) => {
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    const el = hit?.closest?.("[data-c]") as HTMLElement | null;
    return el && root.contains(el) ? el.dataset.c ?? null : null;
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (state.touring) stopTour();
    hover(idAt(event));
  };
  const onLeave = () => hover(null);
  const onClick = (event: MouseEvent) => {
    stopTour();
    const id = idAt(event);
    pick(id && id !== state.selected ? id : null);
  };
  const onKey = (event: KeyboardEvent) => {
    const list = REGISTER.map((r) => r.id);
    const index = state.selected ? list.indexOf(state.selected) : -1;
    let next: string | null = null;
    const key = event.key;
    if (key === "ArrowRight" || key === "ArrowDown") next = list[Math.min(list.length - 1, index + 1)];
    else if (key === "ArrowLeft" || key === "ArrowUp") next = list[Math.max(0, index - 1)];
    else if (key === "Home") next = list[0];
    else if (key === "End") next = list[list.length - 1];
    else if (key === " ") {
      event.preventDefault();
      stopTour();
      setView(state.view === "assembled" ? "open" : "assembled");
      return;
    } else if (key === "e" || key === "E") {
      stopTour();
      setView(state.view === "exploded" ? "open" : "exploded");
      return;
    } else if (key === "f" || key === "F") {
      stopTour();
      const cycle: FlowId[][] = [[], ["blood"], ["gas"], ["water"], ["electrical"], ["blood", "gas", "water", "electrical"]];
      const now = [...state.flows].sort().join();
      const at2 = cycle.findIndex((c) => c.slice().sort().join() === now);
      setFlows(cycle[(at2 + 1) % cycle.length]);
      return;
    } else if (key === "p" || key === "P") {
      stopTour();
      setView(state.view === "parked" ? "assembled" : "parked");
      return;
    } else if (key === "t" || key === "T") {
      stopTour();
      setView(state.view === "transport" ? "assembled" : "transport");
      return;
    } else if (key === "Escape") {
      event.preventDefault();
      reset();
      return;
    }
    if (next === null) return;
    event.preventDefault();
    stopTour();
    pick(next);
  };
  const stage = root;
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  stage.addEventListener("click", onClick);
  stage.addEventListener("keydown", onKey);

  // ── first frame ──
  root.setAttribute("data-gas", "cyl");
  applyFlows();
  drawScreen();
  place();
  drawDoor("main");
  drawDoor("hatch");
  drawRotor();
  say();
  emit();
  if (autoTour) scheduleTour(2500);

  return {
    setView: (v) => {
      stopTour();
      setView(v);
    },
    setFlows: (f) => {
      stopTour();
      setFlows(f);
    },
    toggleFlow: (f) => {
      stopTour();
      setFlows(state.flows.includes(f) ? state.flows.filter((x) => x !== f) : [...state.flows, f]);
    },
    setLayer: (l) => {
      stopTour();
      setLayer(l);
    },
    pick: (id) => {
      stopTour();
      pick(id);
    },
    hover,
    setGasExternal: (on) => {
      stopTour();
      setGasExternal(on);
    },
    setBlocked: (on) => {
      stopTour();
      setBlocked(on);
    },
    reset,
    stopTour,
    setAutoTour(on) {
      autoTour = on;
      reset();
      if (on) scheduleTour(100);
    },
    destroy() {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      io.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("click", onClick);
      stage.removeEventListener("keydown", onKey);
    },
    getState: () => ({ ...state, flows: [...state.flows] }),
  };
}
