import { CaptureDetails } from '@/lib/types';

/**
 * Helpers for presenting capture (acquisition) details.
 */

// Display color for each filter's share of the exposure bar
export const filterColors: Record<string, string> = {
  L: '#d4d8de',
  R: '#f87171',
  G: '#4ade80',
  B: '#60a5fa',
  Ha: '#e11d48',
  OIII: '#2dd4bf',
  SII: '#fb923c',
  V: '#a3e635',
};

export const filterNames: Record<string, string> = {
  L: 'Luminance',
  R: 'Red',
  G: 'Green',
  B: 'Blue',
  Ha: 'Hydrogen-alpha',
  OIII: 'Oxygen III',
  SII: 'Sulfur II',
  V: 'Visual',
};

export function totalMinutes(capture?: CaptureDetails): number {
  return capture?.exposures?.reduce((sum, e) => sum + e.minutes, 0) ?? 0;
}

// 468 -> "7h 48m", 45 -> "45m"
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// "2006-03-26" -> "March 26, 2006"
export function formatCaptureDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
