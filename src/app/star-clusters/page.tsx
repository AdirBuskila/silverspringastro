import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import { getImagesByCategory } from '@/data/images';
import { getCategoryBySlug } from '@/data/categories';

const category = getCategoryBySlug('star-clusters')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

/**
 * Star Clusters Gallery Page
 */
export default function StarClustersPage() {
  const images = getImagesByCategory('star-clusters');

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

