'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  corotatingPath,
  corotatingSample,
  dateToJd,
  jdToDate,
  JUPITER_PERIOD_DAYS,
  type CorotatingSample,
} from '@/lib/kepler';
import SimControls, { formatSimDate } from './SimControls';

/**
 * Kenlevin's motion seen from a frame that turns with Jupiter (Jupiter held fixed on the +x axis).
 * Positions come from solving Kepler's equation for both bodies (see src/lib/kepler.ts), with
 * Kenlevin's mean motion locked to the 3:2 resonance so the triangle stays put, as it does in reality.
 * The animation runs endlessly: new points are computed as time advances and the trail keeps only
 * the last few Jupiter orbits, fading out its oldest part.
 */

const JUPITER_ORBITS = 3;
const STEP_DAYS = 2;
const TRAIL_DAYS = JUPITER_ORBITS * JUPITER_PERIOD_DAYS;

const SPEEDS = [
  { yearsPerSecond: 0.5, label: '6 months/s' },
  { yearsPerSecond: 1, label: '1 year/s' },
  { yearsPerSecond: 2, label: '2 years/s' },
  { yearsPerSecond: 4, label: '4 years/s' },
  { yearsPerSecond: 8, label: '8 years/s' },
];
const DEFAULT_SPEED = 2;

const COLORS = {
  kenlevin: '251, 191, 36', // --color-star-warm
  jupiter: '#a371f7', // --color-nebula-purple
  lagrange: '#56d4dd', // --color-nebula-cyan
  orbit: 'rgba(110, 118, 129, 0.45)', // --color-space-300
  text: '#c9d1d9', // --color-space-100
  muted: '#8b949e', // --color-space-200
};

interface JupiterFrameViewProps {
  reducedMotion: boolean;
}

export default function JupiterFrameView({ reducedMotion }: JupiterFrameViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  // Trail samples, oldest first; the last one is Kenlevin's current position.
  // With reduced motion, start paused on the past few Jupiter orbits so the full triangle is visible.
  const trailRef = useRef<CorotatingSample[] | null>(null);
  if (trailRef.current === null) {
    const now = dateToJd(new Date());
    trailRef.current = reducedMotion ? corotatingPath(now - TRAIL_DAYS, TRAIL_DAYS, STEP_DAYS) : [corotatingSample(now)];
  }
  const [playing, setPlaying] = useState(!reducedMotion);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const draw = useCallback(() => {
    const trail = trailRef.current!;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = (Math.min(w, h) / 2 - 22) / 5.7; // px per au; fits Jupiter's orbit plus labels
    const X = (x: number) => cx + x * scale;
    const Y = (y: number) => cy - y * scale; // north ecliptic up, so motion runs counter-clockwise
    const fontSize = w < 420 ? 11 : 12;
    ctx.font = `${fontSize}px var(--font-geist-sans), system-ui, sans-serif`;
    ctx.textBaseline = 'middle';

    const current = trail[trail.length - 1];
    const jupiterR = current.jupiterR;

    // Jupiter's orbit
    ctx.strokeStyle = COLORS.orbit;
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, jupiterR * scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lagrange regions L3, L4, L5 on Jupiter's orbit
    const lagrange = [
      { name: 'L4', angle: 60 },
      { name: 'L5', angle: -60 },
      { name: 'L3', angle: 180 },
    ];
    ctx.fillStyle = COLORS.lagrange;
    ctx.strokeStyle = COLORS.lagrange;
    for (const l of lagrange) {
      const a = (l.angle * Math.PI) / 180;
      const px = X(jupiterR * Math.cos(a));
      const py = Y(jupiterR * Math.sin(a));
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.stroke();
      const lx = X((jupiterR + 0.45) * Math.cos(a));
      const ly = Y((jupiterR + 0.45) * Math.sin(a));
      ctx.textAlign = 'center';
      ctx.fillText(l.name, lx, ly);
    }

    // Kenlevin's trail, fading with age
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    const last = trail.length - 1;
    const chunk = 20;
    for (let start = 0; start < last; start += chunk) {
      const end = Math.min(last, start + chunk);
      const age = (current.jd - trail[end].jd) / TRAIL_DAYS; // 0 = now, 1 = about to be dropped
      const alpha = Math.pow(Math.max(0, 1 - age), 0.6);
      if (alpha <= 0.01) continue;
      ctx.strokeStyle = `rgba(${COLORS.kenlevin}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(X(trail[start].x), Y(trail[start].y));
      for (let i = start + 1; i <= end; i++) ctx.lineTo(X(trail[i].x), Y(trail[i].y));
      ctx.stroke();
    }

    // Sun
    const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
    sunGlow.addColorStop(0, 'rgba(255, 244, 214, 1)');
    sunGlow.addColorStop(0.35, 'rgba(251, 191, 36, 0.6)');
    sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = COLORS.muted;
    ctx.textAlign = 'center';
    ctx.fillText('Sun', cx, cy + 20);

    // Jupiter, fixed on the right
    const jx = X(jupiterR);
    ctx.fillStyle = COLORS.jupiter;
    ctx.beginPath();
    ctx.arc(jx, cy, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = 'right';
    ctx.fillText('Jupiter', jx - 12, cy);

    // Kenlevin now
    const kx = X(current.x);
    const ky = Y(current.y);
    ctx.fillStyle = `rgb(${COLORS.kenlevin})`;
    ctx.beginPath();
    ctx.arc(kx, ky, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.textAlign = kx > cx ? 'right' : 'left';
    ctx.fillText('Kenlevin', kx + (kx > cx ? -10 : 10), ky - 12);

    if (dateRef.current) dateRef.current.textContent = formatSimDate(jdToDate(current.jd));
  }, []);

  // Animation loop: runs until paused, never ends on its own
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    let simJd = trailRef.current![trailRef.current!.length - 1].jd;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      simJd += SPEEDS[speedRef.current].yearsPerSecond * 365.25 * dt;
      const trail = trailRef.current!;
      while (trail[trail.length - 1].jd + STEP_DAYS <= simJd) {
        trail.push(corotatingSample(trail[trail.length - 1].jd + STEP_DAYS));
      }
      // Drop samples older than the trail window (in batches, to avoid shifting the array every frame).
      const cutoff = simJd - TRAIL_DAYS;
      if (trail.length > 200 && trail[199].jd < cutoff) {
        let n = 0;
        while (trail[n].jd < cutoff) n++;
        trail.splice(0, n);
      }
      draw();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, draw]);

  // Draw once when paused, and on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw();
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  const restartFromToday = useCallback(() => {
    trailRef.current = [corotatingSample(dateToJd(new Date()))];
    draw();
    setPlaying(true);
  }, [draw]);

  const years = Math.round(TRAIL_DAYS / 365.25);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label={`Kenlevin's path, with the last ${years} years shown as a fading trail, drawn with Jupiter held fixed on the right. The path forms a rounded triangle with corners near Jupiter's L3, L4 and L5 points.`}
        />
        <p className="pointer-events-none absolute left-3 top-2 right-3 text-[11px] text-space-400">
          Frame turning with Jupiter · trail shows the last {years} years
        </p>
      </div>
      <SimControls
        playing={playing}
        onTogglePlay={togglePlay}
        onSlower={() => setSpeed((s) => Math.max(0, s - 1))}
        onFaster={() => setSpeed((s) => Math.min(SPEEDS.length - 1, s + 1))}
        canSlower={speed > 0}
        canFaster={speed < SPEEDS.length - 1}
        speedLabel={SPEEDS[speed].label}
        onReset={restartFromToday}
        resetLabel="Today"
        dateRef={dateRef}
        initialDate={formatSimDate(new Date())}
      />
    </div>
  );
}
