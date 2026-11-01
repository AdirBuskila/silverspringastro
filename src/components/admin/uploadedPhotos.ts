import type { SupabaseClient } from '@supabase/supabase-js';
import { astronomySectionLabel, familySection, ManagedPhoto } from '@/lib/photoCatalog';

interface ImageRow {
  id: string;
  designation: string;
  name: string | null;
  category: string;
  image_path: string;
  thumbnail_path: string | null;
  featured: boolean;
}

interface TravelRow {
  id: string;
  title: string;
  location: string | null;
  date: string | null;
  album: string | null;
  image_path: string;
  thumbnail_path: string | null;
}

/** Uploaded astronomy images and family photos, newest first, in the admin's common shape. */
export async function fetchUploadedPhotos(supabase: SupabaseClient): Promise<ManagedPhoto[]> {
  const [images, travel] = await Promise.all([
    supabase.from('images').select('*').order('created_at', { ascending: false }),
    supabase.from('travel_photos').select('*').order('created_at', { ascending: false }),
  ]);
  if (images.error) throw images.error;
  if (travel.error) throw travel.error;

  const fileUrls = (row: { image_path: string; thumbnail_path: string | null }) =>
    Array.from(new Set([row.image_path, row.thumbnail_path].filter(Boolean) as string[]));

  return [
    ...(images.data as ImageRow[]).map((row): ManagedPhoto => ({
      id: `db-${row.id}`,
      title: row.designation,
      subtitle: row.name ?? undefined,
      section: astronomySectionLabel(row.category),
      thumbnail: row.thumbnail_path ?? row.image_path,
      canStar: true,
      featured: row.featured,
      upload: { table: 'images', rowId: row.id, fileUrls: fileUrls(row) },
    })),
    ...(travel.data as TravelRow[]).map((row): ManagedPhoto => ({
      id: `db-${row.id}`,
      title: row.title,
      subtitle: [row.location, row.date].filter(Boolean).join(', '),
      section: familySection(row.album ?? 'Other'),
      thumbnail: row.thumbnail_path ?? row.image_path,
      canStar: false,
      upload: { table: 'travel_photos', rowId: row.id, fileUrls: fileUrls(row) },
    })),
  ];
}
