/**
 * Observatory Data
 * 
 * Information about the observatories where images are captured.
 * Data extracted from the original Silver Spring Astro website.
 */

import { Observatory } from '@/lib/types';

export const observatories: Observatory[] = [
  {
    code: 'H85',
    name: 'Silver Spring',
    fullName: 'Silver Spring Observatory',
    location: 'Silver Spring, Maryland',
    description: 'The original home observatory established in Silver Spring, Maryland. Personal observatory used for CCD astro-imaging of deep sky objects.',
    active: false, // Now relocated to California
  },
  {
    code: 'BBO',
    name: 'Blackbird',
    fullName: 'Blackbird Observatory',
    location: 'Cloudcroft, New Mexico',
    description: 'Remote observatory located near Cloudcroft, New Mexico. Known for excellent dark skies and seeing conditions. Now relocated to Sierra Remote Observatories.',
    active: false, // Now at SRO
    url: 'https://www.sierra-remote.com/',
  },
  {
    code: 'SRO',
    name: 'Sierra Remote',
    fullName: 'Sierra Remote Observatories',
    location: 'Sierra Nevada, California',
    description: 'Current remote imaging location. Sierra Remote Observatories provides excellent dark sky conditions and professional-grade infrastructure for amateur astronomers.',
    active: true,
    url: 'https://www.sierra-remote.com/',
  },
  {
    code: 'G53',
    name: 'Alder Springs',
    fullName: 'Alder Springs Observatory',
    location: 'California',
    description: 'Alder Springs Observatory (G53) - an additional remote imaging location.',
    active: true,
  },
  {
    code: 'TAS',
    name: 'Texas Dark Site',
    fullName: 'Texas Astronomical Society Dark Site',
    location: 'Oklahoma',
    description: 'New observatory being built at the Texas Astronomical Society dark site in Oklahoma. Features the same telescope setup, providing access to pristine dark skies.',
    active: true,
    url: 'https://www.texasastro.org/',
  },
];

/**
 * Get observatory by code
 */
export function getObservatory(code: string): Observatory | undefined {
  return observatories.find(o => o.code === code);
}

/**
 * Format observatory display string
 * Returns a string like "from H85" or "from BBO (Blackbird Observatory)"
 */
export function formatObservatoryLabel(code: string, includeFullName = false): string {
  const obs = getObservatory(code);
  if (!obs) return `from ${code}`;
  
  if (includeFullName) {
    return `from ${obs.code} (${obs.fullName})`;
  }
  return `from ${obs.code}`;
}

