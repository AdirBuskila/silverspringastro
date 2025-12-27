import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import { getImagesByCategory } from '@/data/images';
import { getCategoryBySlug } from '@/data/categories';

const category = getCategoryBySlug('asteroids')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

/**
 * Asteroids Gallery Page
 * 
 * Features asteroid observations including the named asteroid (99862) Kenlevin.
 */
export default function AsteroidsPage() {
  const images = getImagesByCategory('asteroids');

  return (
    <Container className="py-8">
      <PageHeader
        title={category.pluralTitle}
        description={category.description}
        breadcrumbs={[{ label: category.pluralTitle }]}
      />

      {/* Special callout for named asteroid */}
      <section className="py-6">
        <div className="p-6 rounded-xl bg-star-warm/10 border border-star-warm/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-star-warm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-star-warm mb-2">
                Asteroid (99862) Kenlevin
              </h2>
              <p className="text-space-300 mb-3">
                This asteroid was named for Ken Levin in recognition of his contributions to astronomy. 
                The official citation reads:
              </p>
              <blockquote className="pl-4 border-l-2 border-star-warm/50 text-space-200 italic">
                &quot;Ken Levin (b. 1953) is a physicist who works in the field of infrared optics and sensors 
                for application in medicine, aerospace and astronomy. Levin is an avid amateur astronomer 
                and operates two private observatories.&quot;
              </blockquote>
              <p className="mt-3 font-mono text-sm text-star-warm">
                (99862) &quot;Kenlevin&quot; = 2002 OD2
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <ImageGrid images={images} columns={3} />
      </section>
    </Container>
  );
}

