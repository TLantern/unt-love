"use client";

import { useEffect, useRef } from "react";

type DottedGlowBackgroundProps = {
  className?: string;
  gap?: number;
  radius?: number;
  opacity?: number;
  color?: string;
  glowColor?: string;
  speedMin?: number;
  speedMax?: number;
  speedScale?: number;
};

const PROJECT_GLOW = "rgba(232, 90, 80, 0.85)"; // #E85A50

function setAlpha(rgba: string, a: number) {
  return rgba.replace(/[\d.]+\)$/, `${a})`);
}

export function DottedGlowBackground({
  className = "",
  gap = 10,
  radius = 1.8,
  opacity = 0.4,
  color = "rgba(0,0,0,0.4)",
  glowColor = PROJECT_GLOW,
  speedMin = 0.8,
  speedMax = 1.3,
  speedScale = 1,
}: DottedGlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<{ phase: number; speed: number }[]>([]);
  const initRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const cols = Math.ceil(w / gap) + 2;
      const rows = Math.ceil(h / gap) + 2;
      const n = cols * rows;

      if (!initRef.current || dotsRef.current.length !== n) {
        dotsRef.current = Array.from({ length: n }, () => ({
          phase: Math.random() * Math.PI * 2,
          speed: speedMin + Math.random() * (speedMax - speedMin),
        }));
        initRef.current = true;
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < n; i++) {
        const dot = dotsRef.current[i]!;
        dot.phase += dot.speed * speedScale * dt;

        const x = (i % cols) * gap;
        const y = Math.floor(i / cols) * gap;
        const t = (Math.sin(dot.phase) + 1) / 2;
        const isGlow = t > 0.5;
        const alpha = opacity * (0.3 + t * 0.7);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isGlow ? setAlpha(glowColor, alpha) : setAlpha(color, alpha * 0.6);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [gap, radius, opacity, color, glowColor, speedMin, speedMax, speedScale]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
