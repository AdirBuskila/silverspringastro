import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import { getImagesByCategory } from '@/data/images';
import { getCategoryBySlug } from '@/data/categories';

const category = getCategoryBySlug('exoplanets')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

/**
 * Exoplanets Gallery Page
 * 
 * Features exoplanet transit photometry observations
 */
export default function ExoplanetsPage() {
  const images = getImagesByCategory('exoplanets');

  return (
    <Container className="py-8">
      <PageHeader
        title="Exoplanet Transit Studies"
        description={category.description}
        breadcrumbs={[{ label: category.pluralTitle }]}
      />

      {/* Introduction */}
      <section className="py-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-space-200 leading-relaxed">
            Extra-solar planetary transits (where the planet passes across the star in our line of sight) 
            involve taking photometry data for several hours during the transit to detect the slight reduction 
            in brightness of the star (increase in magnitude).
          </p>
        </div>
      </section>

      {/* Transit Light Curves */}
      <section className="py-6">
        <h2 className="text-xl font-bold text-space-100 mb-4">Transit Light Curves</h2>
        <ImageGrid images={images} columns={2} />
      </section>

      {/* HAT-P-1 Details */}
      <section className="py-8">
        <div className="p-6 rounded-xl bg-nebula-blue/5 border border-nebula-blue/20">
          <h3 className="text-lg font-semibold text-nebula-blue mb-3">HAT-P-1b</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-space-300 mb-4">
                Data from 12/12/2006, Blackbird Observatory, New Mexico. Analysis and software by 
                Jean-Claude Pelle, Southern Stars Observatories, Tahiti.
              </p>
              <p className="text-sm text-space-400">
                The red curve shows published ingress and egress times and depth of transit.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-space-400">Observatory:</span>
                <span className="text-space-200">Blackbird Observatory (BBO)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-space-400">Date:</span>
                <span className="text-space-200">December 12, 2006</span>
              </div>
              <div className="flex justify-between">
                <span className="text-space-400">Telescope:</span>
                <span className="text-space-200">20&quot; RC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WASP-1 Details */}
      <section className="py-8">
        <div className="p-6 rounded-xl bg-nebula-purple/5 border border-nebula-purple/20">
          <h3 className="text-lg font-semibold text-nebula-purple mb-3">WASP-1b</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-space-300 mb-4">
                Data from 11/23/2006, Blackbird Observatory 20&quot; RC, New Mexico. 
                Data processed at Tel Aviv University.
              </p>
              <p className="text-sm text-space-400">
                This exoplanet was notably in the news as having a detectable atmosphere.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-space-400">Observatory:</span>
                <span className="text-space-200">Blackbird Observatory (BBO)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-space-400">Date:</span>
                <span className="text-space-200">November 23, 2006</span>
              </div>
              <div className="flex justify-between">
                <span className="text-space-400">Telescope:</span>
                <span className="text-space-200">20&quot; RC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-4">Resources</h2>
        <div className="p-4 rounded-lg bg-space-800/50 border border-space-700">
          <p className="text-space-300 mb-2">
            Amateur exoplanet data is collected and plotted at:
          </p>
          <a 
            href="http://brucegary.net/AXA/x.htm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-nebula-cyan hover:text-nebula-blue transition-colors"
          >
            brucegary.net/AXA/x.htm →
          </a>
        </div>
      </section>
    </Container>
  );
}
