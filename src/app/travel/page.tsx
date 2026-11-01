import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import TravelCategoryFilter from '@/components/TravelCategoryFilter';
import FamilyVideos from '@/components/FamilyVideos';
import { getAllTravelPhotos, getFamilyVideos, getTravelAlbums, getTravelPhotosByAlbum } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Family & Travel Photos',
  description: 'Family photos, high school and Cornell memories, home movies, and travel photos from Israel, Australia, Europe, and more.',
};

export const revalidate = 60;

/**
 * Travel Photos Page
 * 
 * Family travel and personal photography organized by album/location, plus home movies.
 * Combines static photos with dynamically uploaded photos from Supabase.
 */
export default async function TravelPage() {
  const allPhotos = await getAllTravelPhotos();
  const albums = await getTravelAlbums();
  const familyVideos = await getFamilyVideos();

  // Define album display order and colors
  const albumConfig: Record<string, { color: string; description: string }> = {
    'High School': {
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      description: 'Springbrook High School, Silver Spring, MD (1968-1971) - yearbook pictures, clubs, and more.',
    },
    'Cornell': {
      color: 'from-red-500/20 to-rose-500/20 border-red-500/30',
      description: 'Cornell University, Ithaca, NY (1971-1979).',
    },
    'Australia': {
      color: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
      description: 'Trip to Australia, 1991 - the Great Barrier Reef, Queensland rainforest, Sydney, and more.',
    },
    'Europe & More': {
      color: 'from-indigo-500/20 to-sky-500/20 border-indigo-500/30',
      description: 'Belgium, France, the Swiss Alps, and closer to home.',
    },
    'Star Parties': {
      color: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30',
      description: 'Winter Star Party in the Florida Keys and the Mason-Dixon Star Party in York, PA.',
    },
    'Israel': {
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      description: 'Photos from trips to Israel including Jerusalem, Dead Sea, Negev Desert, Wise Observatory, and more.',
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

  // Order albums in preferred display order; albums added from the admin page go last
  const preferredOrder = [
    'Family', 'High School', 'Cornell', 'Israel', 'Australia', 'Europe & More',
    'Caribbean', 'Winter', 'Star Parties', 'Education', 'Press',
  ];
  const orderedAlbums = [
    ...preferredOrder.filter(album => albums.includes(album)),
    ...albums.filter(album => !preferredOrder.includes(album)),
  ];

  // Pre-fetch photos for all albums with their configs
  const albumData = await Promise.all(
    orderedAlbums.map(async (album) => ({
      album,
      photos: await getTravelPhotosByAlbum(album),
      config: albumConfig[album] || {
        color: 'from-space-700/20 to-space-600/20 border-space-600/30',
        description: '',
      },
    }))
  );

  return (
    <Container className="py-8">
      <PageHeader
        title="Family & Travel Photos"
        description="Family memories, high school and Cornell, home movies, and travel photography from around the world."
        breadcrumbs={[{ label: 'Family & Travel' }]}
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
          <a
            href="#home-movies"
            className="px-4 py-2 rounded-lg bg-space-800/50 border border-space-700 hover:border-nebula-blue/60 transition-colors"
          >
            <span className="text-2xl font-bold text-space-100">{familyVideos.length}</span>
            <span className="text-space-400 ml-2">Home Movies &darr;</span>
          </a>
        </div>
      </section>

      {/* Category Filter and Gallery */}
      <TravelCategoryFilter albums={albumData} allPhotos={allPhotos} />

      {/* Home Movies */}
      <section id="home-movies" className="pt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-space-50 mb-2">Home Movies</h2>
        <p className="text-space-400 mb-6">Family videos from Israel, Puerto Rico, Vermont, New Hampshire, and home.</p>
        <FamilyVideos videos={familyVideos} />
      </section>
    </Container>
  );
}
