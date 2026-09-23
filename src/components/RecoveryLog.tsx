'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RecoveryNight } from '@/data/recoveryLog';

/**
 * RecoveryLog Component
 *
 * Night-by-night browser for the 2005-2006 faint-asteroid recovery frames:
 * pick a night to see each target's stack plus that night's sky-quality plots.
 */
interface RecoveryLogProps {
  nights: RecoveryNight[];
}

const ARCHIVE = '/images/asteroids/archive';

function formatNight(date: string, month: 'short' | 'long' = 'short') {
  const d = new Date(Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8)));
  return d.toLocaleDateString('en-US', { month, day: 'numeric', year: month === 'long' ? 'numeric' : undefined, timeZone: 'UTC' });
}

function frameLabel(frame: string) {
  const n = Number(frame.slice(-1)) + 1;
  return frame.startsWith('Moving') ? `Target ${n} · motion-aligned` : `Target ${n}`;
}

export default function RecoveryLog({ nights }: RecoveryLogProps) {
  const [selected, setSelected] = useState(nights.length - 1);
  const night = nights[selected];
  const totalFrames = nights.reduce((sum, n) => sum + n.frames.length, 0);

  // Group the night chips by month
  const months = nights.reduce<{ label: string; items: number[] }[]>((acc, n, i) => {
    const label = new Date(Date.UTC(+n.date.slice(0, 4), +n.date.slice(4, 6) - 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    if (acc.at(-1)?.label !== label) acc.push({ label, items: [] });
    acc.at(-1)!.items.push(i);
    return acc;
  }, []);

  return (
    <div className="rounded-xl bg-space-800/50 border border-space-700/50 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-space-700/50">
        <p className="text-sm text-space-300">
          {totalFrames} recovery images from {nights.length} nights at Silver Spring Observatory (H85).
          Each frame is centered on a faint target; the circle marks the asteroid.
        </p>
        <div className="mt-4 space-y-2">
          {months.map((month) => (
            <div key={month.label} className="flex flex-wrap items-center gap-1.5">
              <span className="w-20 shrink-0 text-xs font-medium text-space-500">{month.label}</span>
              {month.items.map((i) => (
                <button
                  key={nights[i].date}
                  onClick={() => setSelected(i)}
                  aria-pressed={i === selected}
                  className={`px-2 py-0.5 rounded text-xs tabular-nums transition-colors ${
                    i === selected
                      ? 'bg-nebula-blue text-space-900 font-semibold'
                      : 'bg-space-700 text-space-300 hover:bg-space-600 hover:text-space-100'
                  }`}
                >
                  {+nights[i].date.slice(6, 8)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-space-100 mb-3">
          {formatNight(night.date, 'long')}
          <span className="ml-2 text-sm font-normal text-space-400">
            {night.frames.length} {night.frames.length === 1 ? 'frame' : 'frames'}
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {night.frames.map((frame) => {
            const src = `${ARCHIVE}/${night.date}_${frame}a.jpg`;
            return (
              <a key={frame} href={src} target="_blank" rel="noopener noreferrer" className="group">
                <div className="relative aspect-square rounded-md overflow-hidden bg-black border border-space-700/50">
                  <Image src={src} alt={`${formatNight(night.date)} ${frameLabel(frame)}`} fill sizes="200px" className="object-cover" />
                </div>
                <p className="mt-1 text-xs text-space-400 group-hover:text-space-200">{frameLabel(frame)}</p>
              </a>
            );
          })}
        </div>

        {night.plots && (
          <details className="mt-5 group">
            <summary className="cursor-pointer text-sm text-nebula-blue hover:text-nebula-cyan">
              Sky conditions that night (air mass, extinction, sky background)
            </summary>
            <div className="mt-3 space-y-2">
              {['AirMass', 'Extinct', 'SkyBackGround'].map((plot) => (
                <div key={plot} className="relative w-full rounded bg-white" style={{ aspectRatio: 788 / 167 }}>
                  <Image src={`${ARCHIVE}/${plot}_${night.date}.jpg`} alt={`${plot} plot, ${formatNight(night.date)}`} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-contain" />
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
