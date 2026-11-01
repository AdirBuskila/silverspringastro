/**
 * Data Fetching Layer
 *
 * Combines static images (from original site) with dynamically uploaded images (from Supabase),
 * and applies the admin's hide/show and home page choices from the photo_settings table.
 *
 * If Supabase can't be reached the site still renders from the static data. Hidden built-in
 * photos would reappear during such an outage, so anything that must never be shown should
 * also be removed from the static data.
 */

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { images as staticImages } from '@/data/images';
import { travelPhotos as staticTravelPhotos } from '@/data/travel';
import { familyVideos as staticFamilyVideos, FamilyVideo } from '@/data/familyVideos';
import { recoveryNights } from '@/data/recoveryLog';
import { AstronomyImage, TravelPhoto, Category } from '@/lib/types';
import { isHidden, orderStarredPhotos, PhotoSetting, PhotoSettings, toPhotoSettings } from '@/lib/photoSettings';

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

// Each loader below runs once per page render, however many times it's called.

const getPhotoSettings = cache(async (): Promise<PhotoSettings> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('photo_settings').select('photo_id, hidden, featured');
    if (error) {
      console.error('Error fetching photo settings from Supabase:', error);
      return toPhotoSettings([]);
    }
    return toPhotoSettings(data as PhotoSetting[]);
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return toPhotoSettings([]);
  }
});

/** Every astronomy image, uploads first (newest first), before hide/show is applied. */
const getEveryImage = cache(async (): Promise<AstronomyImage[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images from Supabase:', error);
      return staticImages;
    }
    return [...(data || []).map(dbImageToAstronomyImage), ...staticImages];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return staticImages;
  }
});

/**
 * Fetch the visible images for a category (static + Supabase)
 */
export async function getImagesByCategory(category: string): Promise<AstronomyImage[]> {
  const [images, settings] = await Promise.all([getEveryImage(), getPhotoSettings()]);
  return images.filter((img) => img.category === category && !isHidden(img.id, settings));
}

/**
 * Fetch starred images in home page order (static + Supabase)
 */
export async function getFeaturedImages(): Promise<AstronomyImage[]> {
  const [images, settings] = await Promise.all([getEveryImage(), getPhotoSettings()]);
  return orderStarredPhotos(images, settings);
}

/**
 * Get a visible image by ID (checks both static and Supabase)
 */
export async function getImageById(id: string): Promise<AstronomyImage | null> {
  const [images, settings] = await Promise.all([getEveryImage(), getPhotoSettings()]);
  if (isHidden(id, settings)) return null;
  return images.find((img) => img.id === id) ?? null;
}

/**
 * Get category image counts (static + Supabase)
 */
export async function getCategoryImageCount(category: string): Promise<number> {
  const count = (await getImagesByCategory(category)).length;
  // Minor planet survey frames live in the recovery log rather than the image list
  if (category === 'minor-planets') {
    return count + recoveryNights.reduce((sum, night) => sum + night.frames.length, 0);
  }
  return count;
}

const getEveryTravelPhoto = cache(async (): Promise<TravelPhoto[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('travel_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching travel photos from Supabase:', error);
      return staticTravelPhotos;
    }
    return [...(data || []).map(dbTravelToTravelPhoto), ...staticTravelPhotos];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return staticTravelPhotos;
  }
});

/**
 * Fetch all visible travel photos (static + Supabase)
 */
export async function getAllTravelPhotos(): Promise<TravelPhoto[]> {
  const [photos, settings] = await Promise.all([getEveryTravelPhoto(), getPhotoSettings()]);
  return photos.filter((photo) => !isHidden(photo.id, settings));
}

/**
 * Fetch visible travel photos by album (static + Supabase)
 */
export async function getTravelPhotosByAlbum(album: string): Promise<TravelPhoto[]> {
  return (await getAllTravelPhotos()).filter((photo) => photo.album === album);
}

/**
 * Get all albums that have at least one visible photo
 */
export async function getTravelAlbums(): Promise<string[]> {
  const albums = (await getAllTravelPhotos()).map((photo) => photo.album).filter(Boolean) as string[];
  return Array.from(new Set(albums));
}

/**
 * Fetch the visible home movies
 */
export async function getFamilyVideos(): Promise<FamilyVideo[]> {
  const settings = await getPhotoSettings();
  return staticFamilyVideos.filter((video) => !isHidden(video.id, settings));
}
