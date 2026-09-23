'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { AstronomyImage } from '@/lib/types';
import { getObservatory } from '@/data/observatories';
import ObservatoryBadge from './ObservatoryBadge';
import CapturePanel from './CapturePanel';

/**
 * ImageModal Component
 *
 * Full-screen modal for viewing astronomy images.
 * Features:
 * - Large image display; click to zoom to full resolution and pan
 * - Capture details panel (exposure, instrument, coordinates)
 * - Keyboard navigation (arrows, escape) and swipe on touch screens
 * - Copy a direct link to the image
 */
interface ImageModalProps {
  image: AstronomyImage;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
}

export default function ImageModal({
  image,
  onClose,
  onPrevious,
  onNext,
  currentIndex,
  totalImages,
}: ImageModalProps) {
  const observatory = getObservatory(image.observatory);
  // Tracked per image id so both reset when navigating to another image
  const [zoomedId, setZoomedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const zoomed = zoomedId === image.id;
  const copied = copiedId === image.id;
  const setZoomed = (on: boolean) => setZoomedId(on ? image.id : null);
  const touchStartX = useRef<number | null>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const alt = `${image.designation}${image.name ? ` - ${image.name}` : ''}`;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        if (zoomed) setZoomedId(null);
        else onClose();
        break;
      case 'ArrowLeft':
        onPrevious();
        break;
      case 'ArrowRight':
        onNext();
        break;
    }
  }, [zoomed, onClose, onPrevious, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  // Zoom in around the clicked point
  const handleZoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomed) {
      setZoomed(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    setZoomed(true);
    requestAnimationFrame(() => {
      const el = zoomRef.current;
      if (!el) return;
      el.scrollLeft = fx * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = fy * el.scrollHeight - el.clientHeight / 2;
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoomed || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) (dx > 0 ? onPrevious : onNext)();
    touchStartX.current = null;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedId(image.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard unavailable; the address bar still has the link
    }
  };

  const iconButton = 'p-2 rounded-full bg-space-800/80 text-space-200 hover:text-white hover:bg-space-700 transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-space-950/98 backdrop-blur-heavy"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
        {/* Top-right actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <a
            href={image.imagePath}
            target="_blank"
            rel="noopener noreferrer"
            className={iconButton}
            aria-label="Open original image in a new tab"
            title="Open original"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button onClick={copyLink} className={iconButton} aria-label="Copy link to this image" title="Copy link">
            {copied ? (
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            )}
          </button>
          <button onClick={onClose} className={iconButton} aria-label="Close">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation counter */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-space-800/80 text-sm text-space-200 tabular-nums">
          {currentIndex + 1} / {totalImages}
        </div>

        {/* Image area */}
        <div
          className="flex-1 min-h-0 relative flex items-center justify-center p-4 pt-16 lg:p-8 lg:pt-16"
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={onPrevious}
            className={`absolute left-2 lg:left-4 z-20 ${iconButton}`}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {zoomed ? (
            <div ref={zoomRef} className="absolute inset-0 overflow-auto cursor-zoom-out" onClick={handleZoomClick}>
              {/* eslint-disable-next-line @next/next/no-img-element -- natural size for pixel-level inspection */}
              <img src={image.imagePath} alt={alt} className="max-w-none" />
            </div>
          ) : (
            <div
              className="relative w-full h-full max-w-5xl cursor-zoom-in"
              onClick={handleZoomClick}
              title="Click to zoom"
            >
              <Image
                key={image.id}
                src={image.imagePath}
                alt={alt}
                fill
                className="object-contain animate-fade-in"
                sizes="(max-width: 1024px) 100vw, 75vw"
                quality={90}
                priority
              />
            </div>
          )}

          <button
            onClick={onNext}
            className={`absolute right-2 lg:right-4 z-20 ${iconButton}`}
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Info panel */}
        <div className="max-h-[45vh] lg:max-h-none lg:w-80 xl:w-96 bg-space-800/60 border-t lg:border-t-0 lg:border-l border-space-700/50 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 id="modal-title" className="text-2xl font-bold text-space-50 mb-1">
              {image.designation}
            </h2>
            {image.name && (
              <p className="text-lg text-nebula-blue">{image.name}</p>
            )}
            {image.description && (
              <p className="text-sm text-space-300 leading-relaxed mt-3">{image.description}</p>
            )}
          </div>

          <div className="space-y-5">
            {image.observatory !== 'None' && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                Observatory
              </h3>
              <div className="flex items-center gap-2">
                <ObservatoryBadge code={image.observatory} size="md" />
                <span className="text-space-200">
                  {observatory?.fullName || image.observatory}
                </span>
              </div>
              {observatory && (
                <p className="text-sm text-space-400 mt-1">{observatory.location}</p>
              )}
            </div>
            )}

            {image.filters && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Filters
                </h3>
                <span className="inline-block px-3 py-1 bg-space-700 rounded text-space-100">
                  {image.filters}
                </span>
              </div>
            )}

            {image.capture && <CapturePanel capture={image.capture} />}

            {/* Free-text fields (used by images uploaded through the admin panel) */}
            {!image.capture?.date && image.dateCaptured && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Date Captured
                </h3>
                <p className="text-space-200">{image.dateCaptured}</p>
              </div>
            )}
            {!image.capture?.exposures && image.exposure && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Exposure
                </h3>
                <p className="text-space-200">{image.exposure}</p>
              </div>
            )}
            {image.technicalNotes && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Technical Notes
                </h3>
                <p className="text-sm text-space-400 leading-relaxed">{image.technicalNotes}</p>
              </div>
            )}
          </div>

          {/* Keyboard hints */}
          <div className="hidden lg:block mt-8 pt-6 border-t border-space-700/50">
            <p className="text-xs text-space-500 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-space-700 rounded text-space-300">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-space-700 rounded text-space-300">→</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-space-700 rounded text-space-300">Esc</kbd>
                Close
              </span>
              <span>Click image to zoom</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
