'use client';

import type { Ref } from 'react';

/**
 * Playback controls shared by both orbit views.
 * The date text is written through `dateRef` by the animation loop, so it can
 * update every frame without re-rendering React.
 */
interface SimControlsProps {
  playing: boolean;
  onTogglePlay: () => void;
  onSlower: () => void;
  onFaster: () => void;
  canSlower: boolean;
  canFaster: boolean;
  speedLabel: string;
  onReset: () => void;
  resetLabel: string;
  dateRef: Ref<HTMLSpanElement>;
  initialDate: string;
}

const buttonClass =
  'inline-flex items-center justify-center h-10 min-w-10 px-3 rounded-md border border-space-600 bg-space-800/80 text-space-100 text-sm hover:border-space-400 hover:text-space-50 disabled:opacity-40 disabled:hover:border-space-600 transition-colors';

export default function SimControls({
  playing,
  onTogglePlay,
  onSlower,
  onFaster,
  canSlower,
  canFaster,
  speedLabel,
  onReset,
  resetLabel,
  dateRef,
  initialDate,
}: SimControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-3 border-t border-space-700 bg-space-900/60">
      <button type="button" className={buttonClass} onClick={onTogglePlay} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <rect x="3" y="2" width="3.5" height="12" rx="1" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M4 2.5v11a.5.5 0 00.77.42l8.5-5.5a.5.5 0 000-.84l-8.5-5.5A.5.5 0 004 2.5z" />
          </svg>
        )}
      </button>

      <div className="flex items-center gap-1" role="group" aria-label="Simulation speed">
        <button type="button" className={buttonClass} onClick={onSlower} disabled={!canSlower} aria-label="Slower">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 3.5v9L2 8zM14 3.5v9L8 8z" />
          </svg>
        </button>
        <span className="w-24 text-center text-xs text-space-200 tabular-nums" aria-live="polite">
          {speedLabel}
        </span>
        <button type="button" className={buttonClass} onClick={onFaster} disabled={!canFaster} aria-label="Faster">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M2 3.5v9L8 8zM8 3.5v9L14 8z" />
          </svg>
        </button>
      </div>

      <button type="button" className={buttonClass} onClick={onReset}>
        {resetLabel}
      </button>

      <div className="ml-auto text-right">
        <div className="text-[10px] uppercase tracking-wider text-space-400">Simulated date</div>
        <span ref={dateRef} className="font-mono text-sm text-space-50 tabular-nums">
          {initialDate}
        </span>
      </div>
    </div>
  );
}

/** Formats a date as YYYY-MM-DD in UTC. */
export function formatSimDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
