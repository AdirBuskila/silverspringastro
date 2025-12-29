/**
 * Data Fetching Layer
 * 
 * Combines static images (from original site) with dynamically uploaded images (from Supabase).
 * This allows the site to show both legacy content and new uploads from the admin panel.
 */

import { createClient } from '@/lib/supabase/server';
import { images as staticImages } from '@/data/images';
import { travelPhotos as staticTravelPhotos } from '@/data/travel';
import { AstronomyImage, TravelPhoto, Category } from '@/lib/types';

// Database types (matching Supabase schema)
interface DBImage {
  id: string;
  designation: string;
  name: string | null;
  category: string;
  observatory: string;
  filters: string | null;
  description: string | null;
  image_path: string;
  thumbnail_path: string | null;
  date_captured: string | null;
  exposure: string | null;
  technical_notes: string | null;
  featured: boolean;
  created_at: string;
}

interface DBTravelPhoto {
  id: string;
  title: string;
  location: string;
  date: string | null;
  image_path: string;
  thumbnail_path: string | null;
  description: string | null;
  album: string | null;
  created_at: string;
}

// Convert Supabase image to AstronomyImage format
function dbImageToAstronomyImage(dbImage: DBImage): AstronomyImage {
  return {
    id: `db-${dbImage.id}`,
    designation: dbImage.designation,
    name: dbImage.name || undefined,
    category: dbImage.category as Category,
    observatory: dbImage.observatory as AstronomyImage['observatory'],
    filters: dbImage.filters || undefined,
    description: dbImage.description || undefined,
    imagePath: dbImage.image_path,
    thumbnailPath: dbImage.thumbnail_path || dbImage.image_path,
    dateCaptured: dbImage.date_captured || undefined,
    exposure: dbImage.exposure || undefined,
    technicalNotes: dbImage.technical_notes || undefined,
    featured: dbImage.featured,
  };
}

// Convert Supabase travel photo to TravelPhoto format
function dbTravelToTravelPhoto(dbPhoto: DBTravelPhoto): TravelPhoto {
  return {
    id: `db-${dbPhoto.id}`,
    title: dbPhoto.title,
    location: dbPhoto.location,
    date: dbPhoto.date || undefined,
    imagePath: dbPhoto.image_path,
    thumbnailPath: dbPhoto.thumbnail_path || dbPhoto.image_path,
    description: dbPhoto.description || undefined,
    album: dbPhoto.album || undefined,
  };
}

/**
 * Fetch all images for a category (static + Supabase)
 */
export async function getImagesByCategory(category: string): Promise<AstronomyImage[]> {
  // Get static images for this category
  const staticCategoryImages = staticImages.filter(img => img.category === category);
  
  // Try to fetch from Supabase
  try {
    const supabase = await createClient();
    const { data: dbImages, error } = await supabase
      .from('images')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images from Supabase:', error);
      return staticCategoryImages;
    }

    // Convert DB images to AstronomyImage format
    const supabaseImages = (dbImages || []).map(dbImageToAstronomyImage);
    
    // Combine: Supabase images first (newest), then static
    return [...supabaseImages, ...staticCategoryImages];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return staticCategoryImages;
  }
}

/**
 * Fetch featured images (static + Supabase)
 */
export async function getFeaturedImages(): Promise<AstronomyImage[]> {
  // Get static featured images
  const staticFeatured = staticImages.filter(img => img.featured);
  
  // Try to fetch from Supabase
  try {
    const supabase = await createClient();
    const { data: dbImages, error } = await supabase
      .from('images')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured images from Supabase:', error);
      return staticFeatured;
    }

    // Convert DB images to AstronomyImage format
    const supabaseFeatured = (dbImages || []).map(dbImageToAstronomyImage);
    
    // Combine: Supabase images first (newest), then static
    return [...supabaseFeatured, ...staticFeatured];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return staticFeatured;
  }
}

/**
 * Get image by ID (checks both static and Supabase)
 */
export async function getImageById(id: string): Promise<AstronomyImage | null> {
  // Check if it's a Supabase image (prefixed with 'db-')
  if (id.startsWith('db-')) {
    const dbId = id.replace('db-', '');
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('id', dbId)
        .single();

      if (error || !data) return null;
      return dbImageToAstronomyImage(data);
    } catch {
      return null;
    }
  }

  // Check static images
  const staticImage = staticImages.find(img => img.id === id);
  return staticImage || null;
}

/**
 * Get category image counts (static + Supabase)
 */
export async function getCategoryImageCount(category: string): Promise<number> {
  const staticCount = staticImages.filter(img => img.category === category).length;
  
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);

    if (error) {
      return staticCount;
    }

    return staticCount + (count || 0);
  } catch {
    return staticCount;
  }
}

/**
 * Fetch all travel photos (static + Supabase)
 */
export async function getAllTravelPhotos(): Promise<TravelPhoto[]> {
  // Try to fetch from Supabase
  try {
    const supabase = await createClient();
    const { data: dbPhotos, error } = await supabase
      .from('travel_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching travel photos from Supabase:', error);
      return staticTravelPhotos;
    }

    // Convert DB photos to TravelPhoto format
    const supabasePhotos = (dbPhotos || []).map(dbTravelToTravelPhoto);
    
    // Combine: Supabase photos first (newest), then static
    return [...supabasePhotos, ...staticTravelPhotos];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return staticTravelPhotos;
  }
}

/**
 * Fetch travel photos by album (static + Supabase)
 */
export async function getTravelPhotosByAlbum(album: string): Promise<TravelPhoto[]> {
  const staticAlbumPhotos = staticTravelPhotos.filter(p => p.album === album);
  
  try {
    const supabase = await createClient();
    const { data: dbPhotos, error } = await supabase
      .from('travel_photos')
      .select('*')
      .eq('album', album)
      .order('created_at', { ascending: false });

    if (error) {
      return staticAlbumPhotos;
    }

    const supabasePhotos = (dbPhotos || []).map(dbTravelToTravelPhoto);
    return [...supabasePhotos, ...staticAlbumPhotos];
  } catch {
    return staticAlbumPhotos;
  }
}

/**
 * Get all unique albums from travel photos
 */
export async function getTravelAlbums(): Promise<string[]> {
  const staticAlbums = new Set(staticTravelPhotos.map(p => p.album).filter(Boolean) as string[]);
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('travel_photos')
      .select('album')
      .not('album', 'is', null);

    if (error) {
      return Array.from(staticAlbums);
    }

    // Add Supabase albums
    data?.forEach(row => {
      if (row.album) staticAlbums.add(row.album);
    });

    return Array.from(staticAlbums);
  } catch {
    return Array.from(staticAlbums);
  }
}




