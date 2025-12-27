import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Travel Photos',
  description: 'Family travel photos from Israel, Australia, and other destinations.',
};

/**
 * Travel Photos Page
 * 
 * Family travel photography section.
 * This mirrors the original site's family/travel section.
 */
export default function TravelPage() {
  // Travel albums based on original site content
  const albums = [
    {
      title: 'Israel',
      locations: ['Jerusalem', 'Eilat', 'Negev Desert', 'Tel Aviv'],
      years: ['2003', '2009'],
    },
    {
      title: 'Australia',
      locations: ['Sydney', 'Great Barrier Reef', 'Outback'],
      years: [],
    },
    {
      title: 'Vermont',
      subtitle: 'Ski trips',
      locations: ['Stowe', 'Sugarbush'],
      years: ['1997', '2005'],
    },
    {
      title: 'Puerto Rico',
      locations: [],
      years: [],
    },
    {
      title: 'Star Parties',
      subtitle: 'Astronomy gatherings',
      locations: [],
      years: [],
    },
  ];

  return (
    <Container className="py-8">
      <PageHeader
        title="Travel Photos"
        description="Family travel photography from various destinations around the world."
        breadcrumbs={[{ label: 'Travel' }]}
      />

      <div className="py-8">
        {/* Notice */}
        <div className="mb-8 p-4 rounded-lg bg-space-800/50 border border-space-700/50">
          <p className="text-space-300 text-sm">
            📷 Travel photo galleries are being migrated from the original site. 
            Check back soon for the full collection.
          </p>
        </div>

        {/* Album Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div 
              key={album.title}
              className="p-6 rounded-xl bg-space-800/50 border border-space-700/50 hover:border-space-600/50 transition-colors"
            >
              {/* Album placeholder image */}
              <div className="aspect-video rounded-lg bg-gradient-to-br from-space-700 via-space-800 to-space-900 mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-space-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Album info */}
              <h3 className="font-semibold text-space-50 mb-1">
                {album.title}
              </h3>
              {album.subtitle && (
                <p className="text-sm text-space-400 mb-2">
                  {album.subtitle}
                </p>
              )}
              {album.locations.length > 0 && (
                <p className="text-sm text-space-300 mb-2">
                  {album.locations.join(' • ')}
                </p>
              )}
              {album.years.length > 0 && (
                <p className="text-xs text-space-500">
                  {album.years.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Levin Family Travel Pictures heading - matching original */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-space-200 mb-2">
            Levin Family Travel Pictures
          </h2>
          <p className="text-space-400">
            More photos coming soon from the original archive.
          </p>
        </div>
      </div>
    </Container>
  );
}

