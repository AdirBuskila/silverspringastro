/**
 * Rules for the admin's per-photo choices (hide/show, home page star).
 *
 * Used by both the public site and the admin page, so the "On home page" badge
 * in the admin always matches what visitors see.
 */

export interface PhotoSetting {
  photo_id: string;
  hidden: boolean;
  featured: boolean | null;
}

export type PhotoSettings = Map<string, PhotoSetting>;

/** How many starred photos the home page shows. */
export const HOME_PHOTO_COUNT = 5;

export function toPhotoSettings(rows: PhotoSetting[] | null | undefined): PhotoSettings {
  return new Map((rows ?? []).map((row) => [row.photo_id, row]));
}

export function isHidden(id: string, settings: PhotoSettings): boolean {
  return settings.get(id)?.hidden ?? false;
}

export function isStarred(photo: { id: string; featured?: boolean }, settings: PhotoSettings): boolean {
  return settings.get(photo.id)?.featured ?? photo.featured ?? false;
}

/**
 * Visible starred photos in home page order. Photos the admin starred come first,
 * so a new star shows up right away rather than queueing behind the default favorites.
 */
export function orderStarredPhotos<T extends { id: string; featured?: boolean }>(
  photos: T[],
  settings: PhotoSettings,
): T[] {
  const starred = photos.filter((p) => !isHidden(p.id, settings) && isStarred(p, settings));
  const chosen = starred.filter((p) => settings.get(p.id)?.featured === true);
  const defaults = starred.filter((p) => settings.get(p.id)?.featured !== true);
  return [...chosen, ...defaults];
}
