'use client';

import { useState } from 'react';
import { AstronomyImage } from '@/lib/types';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';

/**
 * ImageGrid Component
 * 
 * Responsive grid layout for astronomy images.
 * Handles image selection and modal display.
 */
interface ImageGridProps {
  images: AstronomyImage[];
  columns?: 2 | 3 | 4;
}

export default function ImageGrid({ images, columns = 3 }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<AstronomyImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleImageClick = (image: AstronomyImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    setSelectedIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedImage(images[newIndex]);
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
            onClick={() => handleImageClick(image, index)}
            priority={index < 6}
          />
        ))}
      </div>

      {/* Modal for expanded view */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseModal}
          onPrevious={handlePrevious}
          onNext={handleNext}
          currentIndex={selectedIndex}
          totalImages={images.length}
        />
      )}
    </>
  );
}

