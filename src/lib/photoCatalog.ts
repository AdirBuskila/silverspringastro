/**
 * The admin page's single list of everything it can manage: built-in astronomy images,
 * family photos, and home movies, plus uploaded photos from Supabase.
 */

import { images } from '@/data/images';
import { travelPhotos } from '@/data/travel';
import { familyVideos } from '@/data/familyVideos';

export const HOME_MOVIES_SECTION = 'Home Movies';
export const familySection = (album: string) => `Family: ${album}`;

export const ASTRONOMY_SECTIONS = [
  { value: 'galaxies', label: 'Galaxies' },
  { value: 'galaxy-clusters', label: 'Galaxy Clusters' },
  { value: 'star-clusters', label: 'Star Clusters' },
  { value: 'nebulae', label: 'Nebulae' },
  { value: 'supernovae', label: 'Supernovae' },
  { value: 'asteroids', label: 'Asteroids' },
  { value: 'minor-planets', label: 'Minor Planets' },
  { value: 'exoplanets', label: 'Exoplanets' },
];

export function astronomySectionLabel(category: string): string {
  return ASTRONOMY_SECTIONS.find((s) => s.value === category)?.label ?? category;
}

export interface ManagedPhoto {
  id: string;
  title: string;
  subtitle?: string;
  section: string;
  thumbnail: string;
  /** Home page stars apply only to astronomy images. */
  canStar: boolean;
  /** Default star state. Named to match what the home page ordering expects. */
  featured?: boolean;
  /** Present on uploads, which alone can be permanently deleted. */
  upload?: {
    table: 'images' | 'travel_photos';
    rowId: string;
    fileUrls: string[];
  };
}

export function getBuiltInPhotos(): ManagedPhoto[] {
  return [
    ...images.map((image) => ({
      id: image.id,
      title: image.designation,
      subtitle: image.name,
      section: astronomySectionLabel(image.category),
      // The public gallery shows imagePath too; most astronomy thumbnailPath files don't exist.
      thumbnail: image.imagePath,
      canStar: true,
      featured: image.featured,
    })),
    ...travelPhotos.map((photo) => ({
      id: photo.id,
      title: photo.title,
      subtitle: [photo.location, photo.date].filter(Boolean).join(', '),
      section: familySection(photo.album ?? 'Other'),
      thumbnail: photo.thumbnailPath,
      canStar: false,
    })),
    ...familyVideos.map((video) => ({
      id: video.id,
      title: video.title,
      subtitle: [video.location, video.date].filter(Boolean).join(', '),
      section: HOME_MOVIES_SECTION,
      thumbnail: video.poster,
      canStar: false,
    })),
  ];
}
