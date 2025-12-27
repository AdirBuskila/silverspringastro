/**
 * Silver Spring Observatory - Category Data
 * 
 * Metadata for each image category/gallery section.
 */

import { CategoryInfo, Category } from '@/lib/types';
import { getCategoryImageCount } from './images';

export const categories: CategoryInfo[] = [
  {
    slug: 'galaxies',
    title: 'Galaxies',
    pluralTitle: 'Galaxies',
    description: 'Deep sky images of galaxies captured from Silver Spring Observatory and remote locations. Includes spiral galaxies, elliptical galaxies, interacting galaxy pairs, and more.',
    heroImage: '/images/galaxies/M51_LRGB_gradient_H85.jpg',
  },
  {
    slug: 'galaxy-clusters',
    title: 'Galaxy Clusters',
    pluralTitle: 'Galaxy Clusters',
    description: 'Images of galaxy clusters - gravitationally bound collections of hundreds to thousands of galaxies, representing some of the largest structures in the universe.',
    heroImage: '/images/galaxies/NGC7331_LRGB_H85.jpg',
  },
  {
    slug: 'star-clusters',
    title: 'Star Clusters',
    pluralTitle: 'Star Clusters',
    description: 'Open clusters and globular clusters captured through CCD imaging. These stellar groupings range from loose associations to dense spherical collections of ancient stars.',
  },
  {
    slug: 'nebulae',
    title: 'Nebulae',
    pluralTitle: 'Nebulae',
    description: 'Emission nebulae, planetary nebulae, reflection nebulae, and dark nebulae. Interstellar clouds of gas and dust that are stellar nurseries or remnants of dying stars.',
    heroImage: '/images/nebulae/M27_LRGB_H85.jpg',
  },
  {
    slug: 'supernovae',
    title: 'Supernovae',
    pluralTitle: 'Supernovae',
    description: 'Observations and images of supernovae - the explosive deaths of massive stars. These transient events can briefly outshine entire galaxies.',
    heroImage: '/images/supernovae/SN2004et_RGB_H85.jpg',
  },
  {
    slug: 'asteroids',
    title: 'Asteroids',
    pluralTitle: 'Asteroids',
    description: 'Asteroid observations and imaging, including the asteroid (99862) "Kenlevin" named for Ken Levin. Tracking observations showing asteroid motion against background stars.',
    heroImage: '/images/asteroids/astero2.gif',
  },
  {
    slug: 'exoplanets',
    title: 'Exoplanets',
    pluralTitle: 'Exoplanets',
    description: 'Exoplanet transit observations and related data. Detecting planets around other stars through photometric measurements.',
    heroImage: '/images/exoplanets/WASP1.jpg',
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find(c => c.slug === slug);
}

export function getCategoriesWithCounts(): (CategoryInfo & { imageCount: number })[] {
  return categories.map(cat => ({
    ...cat,
    imageCount: getCategoryImageCount(cat.slug),
  }));
}
