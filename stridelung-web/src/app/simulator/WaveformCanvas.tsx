"use client";
// Canvas waveform renderer for the mirrored trolley display. NaN values break the line (no data received),
// and an optional demo band shades the out-of-band zones so viewers can see why an alarm fired.
import { useEffect, useRef } from "react";

export type WavePoint = { t: number; v: number };
type Line = { data: WavePoint[]; color: string };

export function WaveformCanvas({ lines, label, timeWindow, yMin, yMax, band, showZeroLine = false }: {
  lines: Line[];
  label: string;
  timeWindow: number;
  yMin: number;
  yMax: number;
  band?: { lo?: number; hi?: number };
  showZeroLine?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
    const range = yMax - yMin || 1;
    const yOf = (v: number) => H - Math.max(0, Math.min(1, (v - yMin) / range)) * H;

    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, W, H);

    // demo band: shade the zones outside it
    ctx.fillStyle = "rgba(255, 120, 80, 0.11)";
    if (band?.hi !== undefined && band.hi < yMax) ctx.fillRect(0, 0, W, yOf(band.hi));
    if (band?.lo !== undefined && band.lo > yMin) ctx.fillRect(0, yOf(band.lo), W, H - yOf(band.lo));
    ctx.strokeStyle = "rgba(255, 150, 110, 0.55)";
    ctx.setLineDash([4, 4]);
    for (const edge of [band?.hi, band?.lo]) {
      if (edge === undefined || edge <= yMin || edge >= yMax) continue;
      const y = Math.round(yOf(edge)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.strokeStyle = "#2d2d2d";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = Math.round((i / 4) * H) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    for (let j = 1; j < 8; j++) {
      const x = Math.round((j / 8) * W) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    if (showZeroLine && yMin < 0 && yMax > 0) {
      const zy = Math.round(yOf(0)) + 0.5;
      ctx.strokeStyle = "#404040";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, zy);
      ctx.lineTo(W, zy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const latest = lines.reduce((m, line) => Math.max(m, line.data.at(-1)?.t ?? 0), 0);
    const tMin = latest - timeWindow;
    for (const line of lines) {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      let pen = false;
      for (const p of line.data) {
        if (p.t < tMin) continue;
        if (!Number.isFinite(p.v)) {
          pen = false;
          continue;
        }
        const x = ((p.t - tMin) / timeWindow) * W;
        if (pen) ctx.lineTo(x, yOf(p.v));
        else ctx.moveTo(x, yOf(p.v));
        pen = true;
      }
      ctx.stroke();
    }
  });

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} role="img" aria-label={label} />;
}
