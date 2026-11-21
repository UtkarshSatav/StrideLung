"use client";
// WaveformCanvas — Canvas-based medical equipment waveform renderer.
// Renders clean, crisp medical traces with subtle background gridlines.
import { useEffect, useRef } from "react";
import type { WaveformBuffer } from "./simulatorEngine";

interface WaveformLine {
  data: WaveformBuffer;
  color: string;
}

interface Props {
  lines: WaveformLine[];
  timeWindow?: number;
  yMin?: number;
  yMax?: number;
  paused?: boolean;
  showZeroLine?: boolean;
}

export function WaveformCanvas({
  lines,
  timeWindow = 30,
  yMin,
  yMax,
  paused = false,
  showZeroLine = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina / HiDPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    // Clear background
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, W, H);

    // Subtle technical gridlines matching the screenshot
    ctx.strokeStyle = "#2d2d2d";
    ctx.lineWidth = 1;

    // 4 horizontal grid intervals
    const numRows = 4;
    for (let i = 1; i < numRows; i++) {
      const y = Math.round((i / numRows) * H) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Vertical grid intervals
    const numCols = 8;
    for (let j = 1; j < numCols; j++) {
      const x = Math.round((j / numCols) * W) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Value scaling
    const allVals = lines.flatMap((l) => l.data.map((p) => p.v)).filter(isFinite);
    const dataMin = yMin !== undefined ? yMin : (allVals.length > 0 ? Math.min(...allVals) : 0);
    const dataMax = yMax !== undefined ? yMax : (allVals.length > 0 ? Math.max(...allVals) : 100);
    const vRange = dataMax - dataMin || 1;

    // Zero-line if requested and within range
    if (showZeroLine && dataMin < 0 && dataMax > 0) {
      const zy = Math.round(H - ((0 - dataMin) / vRange) * H) + 0.5;
      ctx.strokeStyle = "#404040";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, zy);
      ctx.lineTo(W, zy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Determine time range (latest time window)
    const latestT = lines.flatMap((l) => l.data).reduce((m, p) => Math.max(m, p.t), 0);
    const tMin = latestT - timeWindow;

    // Draw waveform traces
    for (const line of lines) {
      const filtered = line.data.filter((p) => p.t >= tMin);
      if (filtered.length < 2) continue;

      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();

      let first = true;
      for (const pt of filtered) {
        const x = ((pt.t - tMin) / timeWindow) * W;
        const normY = Math.max(0, Math.min(1, (pt.v - dataMin) / vRange));
        const y = H - normY * H;
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Paused banner indicator inside canvas if frozen
    if (paused) {
      ctx.fillStyle = "rgba(32, 32, 32, 0.4)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#a0a0a0";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("FREEZE", W / 2, H / 2);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-label="Medical Waveform Monitor"
    />
  );
}
