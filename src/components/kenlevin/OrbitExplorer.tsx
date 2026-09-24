'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useState, useSyncExternalStore } from 'react';

/**
 * Kenlevin orbit explorer: a 3D solar system view (Spacekit/three.js) and a 2D
 * "Jupiter's view" of the Hilda triangle. Both are code-split and load only in the browser.
 */

function Loading({ label }: { label: string }) {
  return (
    <div className="h-full flex items-center justify-center text-sm text-space-300" role="status">
      <span className="inline-block w-4 h-4 mr-2 rounded-full border-2 border-space-500 border-t-star-warm animate-spin" aria-hidden />
      {label}
    </div>
  );
}

const SolarSystemView = dynamic(() => import('./SolarSystemView'), {
  ssr: false,
  loading: () => <Loading label="Loading 3D view…" />,
});

const JupiterFrameView = dynamic(() => import('./JupiterFrameView'), {
  ssr: false,
  loading: () => <Loading label="Loading Jupiter's view…" />,
});

let webglSupport: boolean | undefined;
function hasWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement('canvas');
      webglSupport = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noSubscribe = () => () => {};
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

type View = 'normal' | 'jupiter';

export default function OrbitExplorer() {
  const [view, setView] = useState<View>('normal');
  const [webglFailed, setWebglFailed] = useState(false);
  // null during server rendering and hydration; real values once in the browser.
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => null,
  );
  const handleWebglError = useCallback(() => setWebglFailed(true), []);


  return (
    <div className="rounded-xl border border-space-700 bg-space-950/80 overflow-hidden">
      <div className="flex items-center gap-1 p-1.5 border-b border-space-700 bg-space-900/60" role="tablist" aria-label="Orbit view">
        {(
          [
            { id: 'normal', label: 'Normal view' },
            { id: 'jupiter', label: "Jupiter's view" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={view === tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-1 h-10 px-3 rounded-md text-sm font-medium transition-colors ${
              view === tab.id
                ? 'bg-star-warm/15 text-star-warm border border-star-warm/40'
                : 'text-space-300 border border-transparent hover:text-space-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-[min(75vh,640px)] min-h-[440px]" role="tabpanel">
        {webgl === null || reducedMotion === null ? (
          <Loading label="Loading…" />
        ) : view === 'jupiter' ? (
          <JupiterFrameView reducedMotion={reducedMotion} />
        ) : webgl && !webglFailed ? (
          <SolarSystemView reducedMotion={reducedMotion} onError={handleWebglError} />
        ) : (
          <div className="h-full flex flex-col">
            <div className="relative flex-1 min-h-0">
              <Image
                src="/images/asteroids/kenlevin-orbit.svg"
                alt="Top-down diagram of the inner solar system: the orbits of Mercury through Saturn, with Kenlevin's orbit in amber between Mars and Jupiter."
                fill
                unoptimized
                className="object-contain p-3"
              />
            </div>
            <p className="px-4 py-3 text-sm text-space-300 border-t border-space-700">
              Your browser can&apos;t show the interactive 3D view (WebGL is unavailable), so here is a
              top-down diagram of Kenlevin&apos;s orbit instead. Jupiter&apos;s view still works.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
