'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AstronomyImage } from '@/lib/types';
import { getObservatory } from '@/data/observatories';
import ObservatoryBadge from './ObservatoryBadge';

/**
 * ImageModal Component
 * 
 * Full-screen modal for viewing astronomy images.
 * Features:
 * - Large image display with zoom capability
 * - Detailed metadata panel
 * - Keyboard navigation (arrows, escape)
 * - Previous/Next navigation
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
  const hasRealImage = true; // Images have been migrated from silverspringastro.com

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onPrevious();
        break;
      case 'ArrowRight':
        onNext();
        break;
    }
  }, [onClose, onPrevious, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-space-900/95 backdrop-blur-heavy"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-space-800/80 text-space-200 hover:text-white hover:bg-space-700 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation counter */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-space-800/80 text-sm text-space-200">
          {currentIndex + 1} / {totalImages}
        </div>

        {/* Image area */}
        <div className="flex-1 relative flex items-center justify-center p-4 lg:p-8">
          {/* Previous button */}
          <button
            onClick={onPrevious}
            className="absolute left-2 lg:left-4 z-20 p-2 rounded-full bg-space-800/80 text-space-200 hover:text-white hover:bg-space-700 transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main image */}
          <div className="relative w-full h-full max-w-4xl max-h-[70vh] lg:max-h-[80vh]">
            {hasRealImage ? (
              <Image
                src={image.imagePath}
                alt={`${image.designation}${image.name ? ` - ${image.name}` : ''}`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority
              />
            ) : (
              /* Larger placeholder for modal */
              <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-space-700 via-space-800 to-space-900 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Simulated nebula/galaxy */}
                  <div className="absolute inset-0 bg-nebula-blue/10 rounded-full blur-3xl" />
                  <div className="absolute inset-8 bg-nebula-purple/20 rounded-full blur-2xl" />
                  <div className="absolute inset-16 bg-nebula-pink/10 rounded-full blur-xl" />
                  {/* Stars */}
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-0.5 bg-white rounded-full"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.7 + 0.3,
                      }}
                    />
                  ))}
                </div>
                <p className="absolute bottom-8 text-space-400 text-sm">
                  Full image coming soon
                </p>
              </div>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={onNext}
            className="absolute right-2 lg:right-4 z-20 p-2 rounded-full bg-space-800/80 text-space-200 hover:text-white hover:bg-space-700 transition-colors"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Info panel */}
        <div className="lg:w-80 xl:w-96 bg-space-800/50 border-t lg:border-t-0 lg:border-l border-space-700/50 p-6 overflow-y-auto">
          {/* Title */}
          <div className="mb-6">
            <h2 id="modal-title" className="text-2xl font-bold text-space-50 mb-1">
              {image.designation}
            </h2>
            {image.name && (
              <p className="text-lg text-nebula-blue">
                {image.name}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            {/* Observatory */}
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
                <p className="text-sm text-space-400 mt-1">
                  {observatory.location}
                </p>
              )}
            </div>

            {/* Filters */}
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

            {/* Date */}
            {image.dateCaptured && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Date Captured
                </h3>
                <p className="text-space-200">{image.dateCaptured}</p>
              </div>
            )}

            {/* Exposure */}
            {image.exposure && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Exposure
                </h3>
                <p className="text-space-200">{image.exposure}</p>
              </div>
            )}

            {/* Description */}
            {image.description && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Description
                </h3>
                <p className="text-space-300 leading-relaxed">
                  {image.description}
                </p>
              </div>
            )}

            {/* Technical notes */}
            {image.technicalNotes && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
                  Technical Notes
                </h3>
                <p className="text-sm text-space-400 leading-relaxed">
                  {image.technicalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Keyboard hints */}
          <div className="mt-8 pt-6 border-t border-space-700/50">
            <p className="text-xs text-space-500 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-space-700 rounded text-space-300">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-space-700 rounded text-space-300">→</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-space-700 rounded text-space-300">Esc</kbd>
                Close
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

