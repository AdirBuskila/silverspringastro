/**
 * Navigation Data
 * 
 * Site navigation structure matching the original website.
 */

import { NavItem } from '@/lib/types';

export const mainNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Galaxies', href: '/galaxies' },
  { label: 'Galaxy Clusters', href: '/galaxy-clusters' },
  { label: 'Star Clusters', href: '/star-clusters' },
  { label: 'Nebulae', href: '/nebulae' },
  { label: 'Supernovae', href: '/supernovae' },
  { label: 'Asteroids', href: '/asteroids' },
  { label: 'Exoplanets', href: '/exoplanets' },
];

export const secondaryNavigation: NavItem[] = [
  { label: 'Equipment', href: '/equipment' },
  { label: 'About', href: '/about' },
  { label: 'Travel', href: '/travel' },
];

export const allNavigation: NavItem[] = [
  ...mainNavigation,
  ...secondaryNavigation,
];

