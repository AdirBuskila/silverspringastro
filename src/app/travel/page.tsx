import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import TravelGallery from '@/components/TravelGallery';
import { getAllTravelPhotos, getTravelAlbums, getTravelPhotosByAlbum } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Travel Photos',
  description: 'Family travel photos from around the world including Israel, Puerto Rico, Vermont, and more.',
};

export const revalidate = 60;

/**
 * Travel Photos Page
 * 
 * Family travel and personal photography organized by album/location.
 * Combines static photos with dynamically uploaded photos from Supabase.
 */
export default async function TravelPage() {
  const allPhotos = await getAllTravelPhotos();
  const albums = await getTravelAlbums();
  
  // Define album display order and colors
  const albumConfig: Record<string, { color: string; description: string }> = {
    'Israel': {
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      description: 'Photos from trips to Israel including Jerusalem, Dead Sea, Negev Desert, and more.',
    },
    'Caribbean': {
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30',
      description: 'Vacation photos from Puerto Rico and the Bahamas.',
    },
    'Winter': {
      color: 'from-slate-500/20 to-blue-500/20 border-slate-500/30',
      description: 'Winter scenes and ski trips.',
    },
    'Family': {
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
      description: 'Family portraits and memories through the years.',
    },
    'Education': {
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      description: 'School and astronomy club photos.',
    },
    'Press': {
      color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
      description: 'Media coverage and publications.',
    },
  };

  // Order albums in preferred display order
  const orderedAlbums = ['Israel', 'Caribbean', 'Winter', 'Family', 'Education', 'Press'].filter(
    album => albums.includes(album)
  );

  // Pre-fetch photos for all albums
  const albumPhotos = await Promise.all(
    orderedAlbums.map(async (album) => ({
      album,
      photos: await getTravelPhotosByAlbum(album),
    }))
  );

  return (
    <Container className="py-8">
      <PageHeader
        title="Travel & Family Photos"
        description="A collection of travel photography and family memories from around the world."
        breadcrumbs={[{ label: 'Travel' }]}
      />

      {/* Quick Stats */}
      <section className="py-6">
        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-2 rounded-lg bg-space-800/50 border border-space-700">
            <span className="text-2xl font-bold text-space-100">{allPhotos.length}</span>
            <span className="text-space-400 ml-2">Photos</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-space-800/50 border border-space-700">
            <span className="text-2xl font-bold text-space-100">{albums.length}</span>
            <span className="text-space-400 ml-2">Albums</span>
          </div>
        </div>
      </section>

      {/* Albums by category */}
      <div className="space-y-12 py-8">
        {albumPhotos.map(({ album, photos }) => {
          const config = albumConfig[album] || {
            color: 'from-space-700/20 to-space-600/20 border-space-600/30',
            description: '',
          };

          return (
            <section key={album} id={album.toLowerCase().replace(/\s+/g, '-')}>
              <div className={`p-6 rounded-xl bg-gradient-to-br ${config.color} border mb-6`}>
                <h2 className="text-2xl font-bold text-space-50 mb-2">
                  {album}
                </h2>
                {config.description && (
                  <p className="text-space-300">{config.description}</p>
                )}
                <p className="text-sm text-space-400 mt-2">
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>
              <TravelGallery photos={photos} />
            </section>
          );
        })}
      </div>

      {/* All Photos Section (optional alternative view) */}
      <section className="py-8 border-t border-space-800">
        <h2 className="text-xl font-bold text-space-100 mb-6">All Photos</h2>
        <TravelGallery photos={allPhotos} />
      </section>
    </Container>
  );
}
