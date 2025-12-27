'use client';

import Image from 'next/image';
import { AstronomyImage } from '@/lib/types';
import ObservatoryBadge from './ObservatoryBadge';

/**
 * ImageCard Component
 * 
 * Card component for displaying astronomy images in a grid.
 * Shows thumbnail with overlay information and click-to-expand functionality.
 */
interface ImageCardProps {
  image: AstronomyImage;
  onClick?: () => void;
  priority?: boolean;
}

export default function ImageCard({ image, onClick, priority = false }: ImageCardProps) {
  // For now, use a placeholder gradient since actual images need to be migrated
  const hasRealImage = true; // Images have been migrated from silverspringastro.com

  return (
    <article 
      className="group relative overflow-hidden rounded-lg bg-space-800 border border-space-700/50 card-hover cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`View ${image.name || image.designation}`}
    >
      {/* Image container with aspect ratio */}
      <div className="relative aspect-square overflow-hidden">
        {hasRealImage ? (
          <Image
            src={image.imagePath}
            alt={`${image.designation}${image.name ? ` - ${image.name}` : ''}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 image-zoom"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            quality={85}
          />
        ) : (
          /* Placeholder gradient representing deep space */
          <div className="absolute inset-0 bg-gradient-to-br from-space-700 via-space-800 to-space-900">
            {/* Simulated stars */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-white rounded-full" />
              <div className="absolute top-[40%] left-[60%] w-0.5 h-0.5 bg-white rounded-full" />
              <div className="absolute top-[60%] left-[20%] w-0.5 h-0.5 bg-white rounded-full" />
              <div className="absolute top-[30%] left-[80%] w-1 h-1 bg-nebula-blue rounded-full" />
              <div className="absolute top-[70%] left-[50%] w-0.5 h-0.5 bg-white rounded-full" />
              <div className="absolute top-[50%] left-[40%] w-1.5 h-1.5 bg-white/80 rounded-full blur-[1px]" />
            </div>
            {/* Central object glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-nebula-blue/20 rounded-full blur-xl" />
              <div className="absolute w-8 h-8 bg-nebula-purple/30 rounded-full blur-md" />
            </div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick info overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm text-space-200 line-clamp-2">
            {image.description || 'Click to view details'}
          </p>
        </div>
      </div>

      {/* Card content */}
      <div className="p-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-space-50 leading-tight">
            {image.designation}
          </h3>
          <ObservatoryBadge code={image.observatory} />
        </div>
        
        {/* Subtitle / common name */}
        {image.name && (
          <p className="text-sm text-space-300 mb-2 line-clamp-1">
            {image.name}
          </p>
        )}

        {/* Filter info */}
        {image.filters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-space-400 bg-space-700 px-2 py-0.5 rounded">
              {image.filters}
            </span>
          </div>
        )}
      </div>

      {/* Focus ring */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-nebula-blue ring-offset-2 ring-offset-space-900 opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none" />
    </article>
  );
}

