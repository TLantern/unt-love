"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import type { ISourceOptions, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { loadHeartShape } from "tsparticles-shape-heart";

const Particles = dynamic(() => import("react-tsparticles"), { ssr: false });

const OPTIONS: ISourceOptions = {
  fullScreen: { enable: true, zIndex: 0 },
  particles: {
    number: { value: 32, density: { enable: false } },
    shape: { type: "heart" },
    color: { value: ["#ff5c8d", "#ff8fb1"] },
    opacity: {
      value: { min: 0.3, max: 0.8 },
      animation: { enable: false },
    },
    size: {
      value: { min: 8, max: 18 },
      animation: { enable: false },
    },
    move: {
      enable: true,
      speed: { min: 1, max: 2 },
      direction: "top",
      outModes: { default: "out", top: "out", bottom: "out" },
    },
    links: { enable: false },
    interactivity: { detect_on: "canvas", events: { onHover: { enable: false }, onClick: { enable: false } }, modes: {} },
  },
  detectRetina: true,
};

export default function FloatingHeartsBackground() {
  const init = useCallback(async (engine: Engine) => {
    await loadFull(engine);
    await loadHeartShape(engine);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ zIndex: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <Particles
        id="floating-hearts"
        className="absolute inset-0"
        options={OPTIONS}
        init={init}
        style={{ pointerEvents: "none" }}
        width="100%"
        height="100%"
      />
    </div>
  );
}