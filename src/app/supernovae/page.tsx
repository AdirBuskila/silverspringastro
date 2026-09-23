import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import ImageComparison from '@/components/ImageComparison';
import { getImagesByCategory } from '@/lib/data';
import { getCategoryBySlug } from '@/data/categories';

const category = getCategoryBySlug('supernovae')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

export const revalidate = 60;

/**
 * Supernovae Gallery Page
 */
export default async function SupernovaePage() {
  const images = await getImagesByCategory('supernovae');

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

      <section className="py-8 max-w-3xl">
        <h2 className="text-xl font-bold text-space-100 mb-4">Spot the Supernova</h2>
        <ImageComparison
          designation="SN 2008ax"
          name="Type IIb supernova in NGC 4490"
          beforeImage="/images/supernovae/SN2008ax_20080402_RGB.jpg"
          beforeLabel="RGB, April 2, 2008"
          afterImage="/images/supernovae/SN2008ax_LRGB_H85.jpg"
          afterLabel="LRGB, supernova marked"
          aspectRatio={784 / 553}
          caption="A supernova can look like just another foreground star. Slide across to reveal the tick marks: the bright point in the galaxy's disk is a single exploding star, tens of millions of light-years away."
        />
      </section>
    </Container>
  );
}
