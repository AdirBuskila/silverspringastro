'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Ephem, Simulation, SpaceObjectPresets } from 'spacekit.js';
import { KENLEVIN_ELEMENTS } from '@/data/kenlevin';
import SimControls, { formatSimDate } from './SimControls';

/**
 * 3D solar system view built on Spacekit (the engine behind spacereference.org).
 * Loaded only on the client through next/dynamic, so three.js never ships with the rest of the site.
 * Sprites and star data are self-hosted under /public/spacekit.
 */

const SPEEDS = [
  { daysPerSecond: 1, label: '1 day/s' },
  { daysPerSecond: 7, label: '1 week/s' },
  { daysPerSecond: 30, label: '1 month/s' },
  { daysPerSecond: 91, label: '3 months/s' },
  { daysPerSecond: 365, label: '1 year/s' },
];
const DEFAULT_SPEED = 2;

const COLORS = {
  kenlevin: 0xfbbf24, // --color-star-warm, the site's Kenlevin accent
  earth: 0x58a6ff, // --color-nebula-blue
  jupiter: 0xa371f7, // --color-nebula-purple
  otherPlanet: 0x8b949e, // --color-space-200
  otherOrbit: 0x484f58, // --color-space-400
};

/** Camera distance that keeps Jupiter's orbit in frame for the container's aspect ratio. */
function cameraPosition(width: number, height: number): [number, number, number] {
  const aspect = width / Math.max(height, 1);
  const portrait = aspect < 1;
  const fitRadius = portrait ? 5.8 : 6.2; // au, a little beyond Jupiter
  const halfFov = (50 / 2) * (Math.PI / 180);
  const distance = fitRadius / Math.tan(halfFov) / Math.min(1, aspect);
  // Look down at the ecliptic from the -y side; steeper on tall phone screens so the orbits fill the height.
  const elev = (portrait ? 60 : 35) * (Math.PI / 180);
  return [0, -distance * Math.cos(elev), distance * Math.sin(elev)];
}

interface SolarSystemViewProps {
  reducedMotion: boolean;
  onError: () => void;
}

export default function SolarSystemView({ reducedMotion, onError }: SolarSystemViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const simRef = useRef<Simulation | null>(null);
  const [playing, setPlaying] = useState(!reducedMotion);
  const playingRef = useRef(!reducedMotion);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let sim: Simulation;
    try {
      // Spacekit's types say HTMLCanvasElement, but it expects a container element and appends its own canvas.
      sim = new Simulation(container as unknown as HTMLCanvasElement, {
        basePath: '/spacekit',
        startDate: new Date(),
        jdPerSecond: SPEEDS[DEFAULT_SPEED].daysPerSecond,
        startPaused: reducedMotion,
        unitsPerAu: 1,
        camera: { initialPosition: cameraPosition(container.offsetWidth, container.offsetHeight) },
      });
    } catch {
      onError();
      return;
    }
    simRef.current = sim;
    playingRef.current = !reducedMotion;

    // Keep the Sun centred: rotate and zoom only, no panning.
    const controls = sim.getViewer().get3jsCameraControls();
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 60;

    sim.createStars({ minSize: 0.6 });
    sim.createObject('sun', { ...SpaceObjectPresets.SUN, scale: [0.6, 0.6, 0.6] });

    const planet = (id: string, preset: object, color: number, orbitColor: number, labelText?: string) =>
      sim.createObject(id, {
        ...preset,
        labelText,
        theme: { color, orbitColor },
      });
    planet('mercury', SpaceObjectPresets.MERCURY, COLORS.otherPlanet, COLORS.otherOrbit);
    planet('venus', SpaceObjectPresets.VENUS, COLORS.otherPlanet, COLORS.otherOrbit);
    planet('earth', SpaceObjectPresets.EARTH, COLORS.earth, 0x2f5f99, 'Earth');
    planet('mars', SpaceObjectPresets.MARS, COLORS.otherPlanet, COLORS.otherOrbit);
    planet('jupiter', SpaceObjectPresets.JUPITER, COLORS.jupiter, 0x6c4ba3, 'Jupiter');
    planet('saturn', SpaceObjectPresets.SATURN, COLORS.otherPlanet, COLORS.otherOrbit);

    const k = KENLEVIN_ELEMENTS;
    sim.createObject('kenlevin', {
      labelText: 'Kenlevin',
      particleSize: 14,
      ephem: new Ephem({ epoch: k.epoch, a: k.a, e: k.e, i: k.i, om: k.om, w: k.w, ma: k.ma }, 'deg'),
      theme: { color: COLORS.kenlevin, orbitColor: COLORS.kenlevin },
    });

    container.querySelectorAll<HTMLElement>('.spacekit__object-label').forEach((label) => {
      label.style.color = label.textContent === 'Kenlevin' ? 'var(--color-star-warm)' : 'var(--color-space-100)';
    });

    // Write the simulated date straight to the DOM a few times per second.
    let lastDateUpdate = 0;
    sim.onTick = () => {
      const now = performance.now();
      if (now - lastDateUpdate < 150 || !dateRef.current) return;
      lastDateUpdate = now;
      dateRef.current.textContent = formatSimDate(sim.getDate());
    };

    // Spacekit has no pause-rendering API; stop the render loop while the view is off-screen.
    const internals = sim as unknown as { renderEnabled: boolean; initialRenderComplete: boolean; animate: () => void };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !internals.renderEnabled) {
        internals.renderEnabled = true;
        internals.animate();
      } else if (!entry.isIntersecting) {
        internals.renderEnabled = false;
      }
    });
    observer.observe(container);

    const readyTimer = window.setTimeout(() => setReady(true), 0);

    return () => {
      window.clearTimeout(readyTimer);
      observer.disconnect();
      // Spacekit has no dispose(); stop its loop and free the WebGL context ourselves.
      internals.renderEnabled = false;
      internals.initialRenderComplete = true;
      sim.onTick = undefined;
      controls.dispose();
      const renderer = sim.getRenderer();
      renderer.dispose();
      renderer.forceContextLoss();
      container.replaceChildren();
      simRef.current = null;
    };
  }, [reducedMotion, onError]);

  const togglePlay = useCallback(() => {
    const sim = simRef.current;
    if (!sim) return;
    if (playingRef.current) sim.stop();
    else sim.start();
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  }, []);

  const changeSpeed = useCallback((delta: number) => {
    setSpeed((current) => {
      const next = Math.min(SPEEDS.length - 1, Math.max(0, current + delta));
      simRef.current?.setJdPerSecond(SPEEDS[next].daysPerSecond);
      return next;
    });
  }, []);

  const resetToToday = useCallback(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.setDate(new Date());
    if (dateRef.current) dateRef.current.textContent = formatSimDate(sim.getDate());
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-0">
        <div ref={containerRef} className="kenlevin-sim absolute inset-0" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-space-300">
            Loading 3D view…
          </div>
        )}
        <p className="pointer-events-none absolute left-3 bottom-2 text-[11px] text-space-400">
          Drag to rotate · pinch or scroll to zoom
        </p>
      </div>
      <SimControls
        playing={playing}
        onTogglePlay={togglePlay}
        onSlower={() => changeSpeed(-1)}
        onFaster={() => changeSpeed(1)}
        canSlower={speed > 0}
        canFaster={speed < SPEEDS.length - 1}
        speedLabel={SPEEDS[speed].label}
        onReset={resetToToday}
        resetLabel="Today"
        dateRef={dateRef}
        initialDate={formatSimDate(new Date())}
      />
    </div>
  );
}
