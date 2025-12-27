'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

/**
 * ImageComparison Component
 * 
 * NEW FEATURE: Interactive before/after image comparison slider.
 * Perfect for showing different filter combinations or processing stages.
 */
interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  designation: string;
  name?: string;
}

export default function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  designation,
  name,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  return (
    <div className="rounded-xl overflow-hidden bg-space-800 border border-space-700/50">
      {/* Header */}
      <div className="p-4 border-b border-space-700/50">
        <h3 className="font-bold text-space-50">{designation}</h3>
        {name && <p className="text-sm text-space-400">{name}</p>}
        <p className="text-xs text-nebula-blue mt-1">Drag slider to compare</p>
      </div>

      {/* Comparison container */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After image (full) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={`${designation} - ${afterLabel}`}
            fill
            className="object-cover"
            sizes="600px"
          />
          {/* After label */}
          <div className="absolute bottom-4 right-4 bg-space-900/80 backdrop-blur-sm px-3 py-1 rounded text-sm text-space-100">
            {afterLabel}
          </div>
        </div>

        {/* Before image (clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full" style={{ width: `${100 / sliderPosition * 100}%` }}>
            <Image
              src={beforeImage}
              alt={`${designation} - ${beforeLabel}`}
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
          {/* Before label */}
          <div className="absolute bottom-4 left-4 bg-space-900/80 backdrop-blur-sm px-3 py-1 rounded text-sm text-space-100">
            {beforeLabel}
          </div>
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-space-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

