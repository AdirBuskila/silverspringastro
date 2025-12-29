import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import { getImagesByCategory } from '@/lib/data';
import { getCategoryBySlug } from '@/data/categories';

const category = getCategoryBySlug('galaxies')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

// Revalidate every 60 seconds to pick up new uploads
export const revalidate = 60;

/**
 * Galaxies Gallery Page
 * 
 * Displays all galaxy images with filtering and modal view.
 * Combines static images with dynamically uploaded images from Supabase.
 */
export default async function GalaxiesPage() {
  const images = await getImagesByCategory('galaxies');

  return (
    <Container className="py-8">
      <PageHeader
        title={category.pluralTitle}
        description={category.description}
        breadcrumbs={[{ label: category.pluralTitle }]}
      />

      <section className="py-8">
        <ImageGrid images={images} columns={3} />
      </section>
    </Container>
  );
}
