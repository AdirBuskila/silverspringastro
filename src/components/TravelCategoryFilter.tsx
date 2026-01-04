'use client';

import { useState } from 'react';
import TravelGallery from './TravelGallery';
import { TravelPhoto } from '@/lib/types';

interface AlbumData {
  album: string;
  photos: TravelPhoto[];
  config: {
    color: string;
    description: string;
  };
}

interface TravelCategoryFilterProps {
  albums: AlbumData[];
  allPhotos: TravelPhoto[];
}

/**
 * TravelCategoryFilter Component
 * 
 * Provides category filtering for travel photos.
 * Users can view all photos or filter by album/category.
 */
export default function TravelCategoryFilter({ albums, allPhotos }: TravelCategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get current photos based on selection
  const currentPhotos = selectedCategory === 'all'
    ? allPhotos
    : albums.find(a => a.album === selectedCategory)?.photos || [];

  const currentConfig = selectedCategory === 'all'
    ? null
    : albums.find(a => a.album === selectedCategory)?.config;

  return (
    <div className="space-y-8">
      {/* Category Filter Navigation */}
      <div className="sticky top-20 z-30 py-4 bg-space-950/80 backdrop-blur-lg border-b border-space-800">
        <div className="flex flex-wrap gap-2">
          {/* All Photos Button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedCategory === 'all'
                ? 'bg-nebula-blue text-white'
                : 'bg-space-800/50 text-space-300 hover:bg-space-700/50 hover:text-space-100 border border-space-700'
              }
            `}
          >
            All Photos
            <span className="ml-2 text-xs opacity-70">({allPhotos.length})</span>
          </button>

          {/* Album Buttons */}
          {albums.map(({ album, photos }) => (
            <button
              key={album}
              onClick={() => setSelectedCategory(album)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedCategory === album
                  ? 'bg-nebula-blue text-white'
                  : 'bg-space-800/50 text-space-300 hover:bg-space-700/50 hover:text-space-100 border border-space-700'
                }
              `}
            >
              {album}
              <span className="ml-2 text-xs opacity-70">({photos.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Header (when filtered) */}
      {selectedCategory !== 'all' && currentConfig && (
        <div className={`p-6 rounded-xl bg-gradient-to-br ${currentConfig.color} border`}>
          <h2 className="text-2xl font-bold text-space-50 mb-2">
            {selectedCategory}
          </h2>
          {currentConfig.description && (
            <p className="text-space-300">{currentConfig.description}</p>
          )}
          <p className="text-sm text-space-400 mt-2">
            {currentPhotos.length} {currentPhotos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
      )}

      {/* "All Photos" header when showing all */}
      {selectedCategory === 'all' && (
        <div className="p-6 rounded-xl bg-gradient-to-br from-space-700/20 to-space-600/20 border border-space-600/30">
          <h2 className="text-2xl font-bold text-space-50 mb-2">
            All Photos
          </h2>
          <p className="text-space-300">Browse all travel and family photos across all albums.</p>
          <p className="text-sm text-space-400 mt-2">
            {allPhotos.length} photos in {albums.length} albums
          </p>
        </div>
      )}

      {/* Photo Gallery */}
      <TravelGallery photos={currentPhotos} />
    </div>
  );
}





