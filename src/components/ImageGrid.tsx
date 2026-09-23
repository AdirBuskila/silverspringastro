'use client';

import { useEffect, useState } from 'react';
import { AstronomyImage } from '@/lib/types';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';

/**
 * ImageGrid Component
 * 
 * Responsive grid layout for astronomy images.
 * Handles image selection and modal display. The open image is reflected in the
 * URL (?image=<id>) so a specific image can be shared and opened directly.
 */
interface ImageGridProps {
  images: AstronomyImage[];
  columns?: 2 | 3 | 4;
}

export default function ImageGrid({ images, columns = 3 }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedImage = selectedIndex === null ? null : images[selectedIndex];

  // Open the image named in the URL, if any
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('image');
    const index = id ? images.findIndex(img => img.id === id) : -1;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after hydration
    if (index >= 0) setSelectedIndex(index);
  }, [images]);

  const select = (index: number | null) => {
    setSelectedIndex(index);
    const url = new URL(window.location.href);
    if (index === null) url.searchParams.delete('image');
    else url.searchParams.set('image', images[index].id);
    window.history.replaceState(null, '', url);
  };

  const handlePrevious = () => {
    if (selectedIndex !== null) select(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    if (selectedIndex !== null) select(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
  };

  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-space-800 mb-4">
          <svg
            className="w-8 h-8 text-space-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-space-200 mb-1">No images yet</h3>
        <p className="text-space-400">Images for this category are coming soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${gridClasses[columns]} gap-4 sm:gap-6`}>
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => select(index)}
            priority={index < 6}
          />
        ))}
      </div>

      {/* Modal for expanded view */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => select(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          currentIndex={selectedIndex!}
          totalImages={images.length}
        />
      )}
    </>
  );
}

