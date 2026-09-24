'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { corotatingPath, dateToJd, jdToDate, JUPITER_PERIOD_DAYS } from '@/lib/kepler';
import SimControls, { formatSimDate } from './SimControls';

/**
 * Kenlevin's motion seen from a frame that turns with Jupiter (Jupiter held fixed on the +x axis).
 * Positions come from solving Kepler's equation for both bodies (see src/lib/kepler.ts), so this
 * is a two-body sketch: it ignores Jupiter's pull, which in reality keeps the triangle from drifting.
 */

const JUPITER_ORBITS = 3;
const STEP_DAYS = 2;
const TRAIL_FADE_DAYS = 2 * JUPITER_PERIOD_DAYS; // older parts of the trail fade over two Jupiter orbits

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
  const [startJd, setStartJd] = useState(() => dateToJd(new Date()));
  const path = useMemo(() => corotatingPath(startJd, JUPITER_ORBITS * JUPITER_PERIOD_DAYS, STEP_DAYS), [startJd]);

  // With reduced motion, show the finished triangle and wait for the user to press play.
  const [progress, setProgress] = useState(() => (reducedMotion ? path.length - 1 : 0));
  const progressRef = useRef(progress);
  const [playing, setPlaying] = useState(!reducedMotion);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const draw = useCallback(
    (index: number) => {
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

      const current = path[index];
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
      const fadeSteps = TRAIL_FADE_DAYS / STEP_DAYS;
      const chunk = 20;
      for (let start = 0; start < index; start += chunk) {
        const end = Math.min(index, start + chunk);
        const age = index - end;
        const alpha = Math.max(0.45, 1 - age / fadeSteps);
        ctx.strokeStyle = `rgba(${COLORS.kenlevin}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(X(path[start].x), Y(path[start].y));
        for (let i = start + 1; i <= end; i++) ctx.lineTo(X(path[i].x), Y(path[i].y));
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
    },
    [path],
  );

  // Animation loop
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const stepsPerSecond = (SPEEDS[speedRef.current].yearsPerSecond * 365.25) / STEP_DAYS;
      const next = Math.min(path.length - 1, progressRef.current + stepsPerSecond * dt);
      progressRef.current = next;
      draw(Math.floor(next));
      if (next >= path.length - 1) {
        setProgress(next);
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setProgress(progressRef.current);
    };
  }, [playing, path, draw]);

  // Redraw when paused, and on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw(Math.floor(progressRef.current));
    const observer = new ResizeObserver(() => draw(Math.floor(progressRef.current)));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw, progress]);

  const togglePlay = useCallback(() => {
    if (!playing && progressRef.current >= path.length - 1) {
      progressRef.current = 0; // finished: play again from the start
    }
    setPlaying((p) => !p);
  }, [playing, path.length]);

  const restartFromToday = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setStartJd(dateToJd(new Date()));
    setPlaying(true);
  }, []);

  const years = Math.round((JUPITER_ORBITS * JUPITER_PERIOD_DAYS) / 365.25);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label={`Kenlevin's path over the next ${years} years, drawn with Jupiter held fixed on the right. The path forms a rounded triangle with corners near Jupiter's L3, L4 and L5 points.`}
        />
        <p className="pointer-events-none absolute left-3 top-2 right-3 text-[11px] text-space-400">
          Frame turning with Jupiter · next {years} years
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
        initialDate={formatSimDate(jdToDate(path[Math.floor(progress)].jd))}
      />
    </div>
  );
}
