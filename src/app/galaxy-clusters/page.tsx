import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import { getImagesByCategory } from '@/lib/data';
import { getCategoryBySlug } from '@/data/categories';

const category = getCategoryBySlug('galaxy-clusters')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

export const revalidate = 60;

/**
 * Galaxy Clusters Gallery Page
 */
export default async function GalaxyClustersPage() {
  const images = await getImagesByCategory('galaxy-clusters');

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
