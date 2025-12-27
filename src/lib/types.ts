/**
 * Silver Spring Observatory - Type Definitions
 * 
 * Core data types for astronomical images, observatories, and site content.
 * These types preserve the original site's data structure while enabling
 * modern TypeScript features.
 */

// Image category types - matches original site navigation
export type Category = 
  | 'galaxies'
  | 'galaxy-clusters'
  | 'star-clusters'
  | 'nebulae'
  | 'supernovae'
  | 'asteroids'
  | 'exoplanets';

// Observatory codes used throughout the original site
export type ObservatoryCode = 'H85' | 'BBO' | 'SRO' | 'G53' | 'None';

/**
 * Astronomical Image
 * Represents a single astronomical photograph with all associated metadata.
 */
export interface AstronomyImage {
  id: string;
  // Object designation (e.g., "M51", "NGC 4565", "Abell 2151")
  designation: string;
  // Common name if applicable (e.g., "Whirlpool Galaxy", "Needle Galaxy")
  name?: string;
  // Category for grouping
  category: Category;
  // Observatory where image was captured
  observatory: ObservatoryCode;
  // Filter information (e.g., "LRGB", "LRGB+Ha", "Ha", "SII/Ha/OIII")
  filters?: string;
  // Additional capture details
  description?: string;
  // Path to full-resolution image
  imagePath: string;
  // Path to thumbnail for gallery views
  thumbnailPath: string;
  // Date captured (original format preserved)
  dateCaptured?: string;
  // Exposure time information
  exposure?: string;
  // Additional technical notes
  technicalNotes?: string;
  // Whether this is a featured image for the homepage
  featured?: boolean;
}

/**
 * Observatory
 * Information about each observatory location used for imaging.
 */
export interface Observatory {
  code: ObservatoryCode;
  name: string;
  fullName: string;
  location: string;
  description: string;
  // Current status
  active: boolean;
  // Link to more information if available
  url?: string;
}

/**
 * Navigation Item
 * Structure for site navigation links.
 */
export interface NavItem {
  label: string;
  href: string;
  // For dropdown menus
  children?: NavItem[];
}

/**
 * Category metadata for gallery pages
 */
export interface CategoryInfo {
  slug: Category;
  title: string;
  pluralTitle: string;
  description: string;
  // Hero image for the category page
  heroImage?: string;
}

/**
 * Travel Photo (for family travel section)
 */
export interface TravelPhoto {
  id: string;
  title: string;
  location: string;
  date?: string;
  imagePath: string;
  thumbnailPath: string;
  description?: string;
  // Grouping for travel albums
  album?: string;
}

/**
 * Equipment item
 */
export interface Equipment {
  id: string;
  name: string;
  type: 'telescope' | 'mount' | 'camera' | 'filter' | 'other';
  description: string;
  imagePath?: string;
  specifications?: Record<string, string>;
}

/**
 * Publication or work reference
 */
export interface Publication {
  id: string;
  title: string;
  type: 'article' | 'paper' | 'mention' | 'award';
  source?: string;
  date?: string;
  url?: string;
  description?: string;
}

