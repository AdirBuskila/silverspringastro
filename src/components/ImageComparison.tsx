'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

/**
 * ImageComparison Component
 *
 * Before/after slider for two registered images of the same field,
 * e.g. two epochs of a supernova or two processing passes.
 * Drag, click, or use the arrow keys to move the divider.
 */
interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  designation: string;
  name?: string;
  // Width / height of the images, so nothing is cropped
  aspectRatio?: number;
  caption?: string;
}

export default function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  designation,
  name,
  aspectRatio = 4 / 3,
  caption,
}: ImageComparisonProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <figure className="rounded-xl overflow-hidden bg-space-800 border border-space-700/50">
      <div className="p-4 border-b border-space-700/50 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-bold text-space-50">{designation}</h3>
          {name && <p className="text-sm text-space-400">{name}</p>}
        </div>
        <p className="text-xs text-nebula-blue shrink-0">Drag to compare</p>
      </div>

      <div
        ref={containerRef}
        className="relative cursor-ew-resize select-none touch-pan-y"
        style={{ aspectRatio }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
        }}
      >
        <Image src={afterImage} alt={`${designation} - ${afterLabel}`} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 900px" />
        <Image
          src={beforeImage}
          alt={`${designation} - ${beforeLabel}`}
          fill
          className="object-contain"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          sizes="(max-width: 1024px) 100vw, 900px"
        />

        <span className="absolute bottom-3 left-3 bg-space-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-space-100">
          {beforeLabel}
        </span>
        <span className="absolute bottom-3 right-3 bg-space-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-space-100">
          {afterLabel}
        </span>

        {/* Divider */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white/90 pointer-events-none" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-space-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
            </svg>
          </div>
        </div>

        {/* Keyboard / screen-reader control */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
          className="sr-only"
        />
      </div>

      {caption && <figcaption className="p-4 text-sm text-space-300 leading-relaxed">{caption}</figcaption>}
    </figure>
  );
}
