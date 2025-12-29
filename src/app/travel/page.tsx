import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Travel Photos',
  description: 'Family travel photos from around the world.',
};

/**
 * Travel Photos Page
 * 
 * Placeholder page - photos will be added via admin panel later.
 */
export default function TravelPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Travel Photos"
        description="Family travel photography from various destinations around the world."
        breadcrumbs={[{ label: 'Travel' }]}
      />

      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-space-800 mb-6">
          <svg className="w-10 h-10 text-space-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-semibold text-space-100 mb-4">
          Coming Soon
        </h2>
        
        <p className="text-space-400 max-w-md mx-auto mb-8">
          Travel photos will be added here soon. Check back later for photos from 
          Israel, Australia, Vermont, Puerto Rico, and more.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-space-800 text-space-200 rounded-lg hover:bg-space-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gallery
        </Link>
      </div>
    </Container>
  );
}
