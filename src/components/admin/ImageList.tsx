'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface DBImage {
  id: string;
  designation: string;
  name: string | null;
  category: string;
  observatory: string;
  filters: string | null;
  description: string | null;
  image_path: string;
  featured: boolean;
  created_at: string;
}

export default function ImageList() {
  const supabase = createClient();
  const [images, setImages] = useState<DBImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchImages();
  }, [filter]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setImages(data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (image: DBImage) => {
    if (!confirm(`Are you sure you want to delete "${image.designation}"?`)) {
      return;
    }

    setDeleting(image.id);
    try {
      // Extract file path from URL for storage deletion
      const url = new URL(image.image_path);
      const pathParts = url.pathname.split('/storage/v1/object/public/images/');
      const filePath = pathParts[1];

      if (filePath) {
        // Delete from storage
        await supabase.storage.from('images').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      // Update local state
      setImages(prev => prev.filter(img => img.id !== image.id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
      alert(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  const toggleFeatured = async (image: DBImage) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({ featured: !image.featured })
        .eq('id', image.id);

      if (error) throw error;

      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, featured: !img.featured } : img
      ));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update image';
      alert(errorMessage);
    }
  };

  const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'galaxies', label: 'Galaxies' },
    { value: 'galaxy-clusters', label: 'Galaxy Clusters' },
    { value: 'star-clusters', label: 'Star Clusters' },
    { value: 'nebulae', label: 'Nebulae' },
    { value: 'supernovae', label: 'Supernovae' },
    { value: 'asteroids', label: 'Asteroids' },
    { value: 'exoplanets', label: 'Exoplanets' },
    { value: 'travel', label: 'Travel Photos' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nebula-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchImages}
          className="px-4 py-2 bg-space-700 text-space-200 rounded-lg hover:bg-space-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-space-50">Manage Images</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-space-900 border border-space-600 rounded-lg text-space-100 focus:outline-none focus:ring-2 focus:ring-nebula-blue"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 text-space-400">
          <p>No images found in this category.</p>
          <p className="text-sm mt-2">Upload your first image using the Upload tab.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {images.map((image) => (
            <div 
              key={image.id}
              className="flex items-center gap-4 p-4 bg-space-900/50 rounded-lg border border-space-700"
            >
              {/* Thumbnail */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-space-800">
                <Image
                  src={image.image_path}
                  alt={image.designation}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-space-100">{image.designation}</h3>
                  {image.name && (
                    <span className="text-space-400 text-sm">({image.name})</span>
                  )}
                  {image.featured && (
                    <span className="px-2 py-0.5 text-xs bg-star-warm/20 text-star-warm rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-space-400">
                  {image.category} • {image.observatory}
                  {image.filters && ` • ${image.filters}`}
                </p>
                <p className="text-xs text-space-500 mt-1">
                  Added {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(image)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    image.featured
                      ? 'bg-star-warm/20 text-star-warm hover:bg-star-warm/30'
                      : 'bg-space-700 text-space-300 hover:bg-space-600'
                  }`}
                >
                  {image.featured ? '★ Featured' : '☆ Feature'}
                </button>
                <button
                  onClick={() => handleDelete(image)}
                  disabled={deleting === image.id}
                  className="px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-sm hover:bg-red-900/50 transition-colors disabled:opacity-50"
                >
                  {deleting === image.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

