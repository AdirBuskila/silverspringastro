'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AstronomyImage } from '@/lib/types';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';

/**
 * FeaturedGallery Component
 * 
 * Displays featured astronomy images on the homepage.
 * Limited subset with "View All" link to full gallery.
 */
interface FeaturedGalleryProps {
  images: AstronomyImage[];
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
}

export default function FeaturedGallery({ 
  images, 
  title, 
  viewAllHref,
  viewAllLabel = 'View all'
}: FeaturedGalleryProps) {
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

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-space-50">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-2 text-sm font-medium text-nebula-blue hover:text-nebula-cyan transition-colors"
        >
          {viewAllLabel}
          <svg 
            className="w-4 h-4 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => handleImageClick(image, index)}
            priority={index < 4}
          />
        ))}
      </div>

      {/* Modal */}
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
    </section>
  );
}

