import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import Hero from '@/components/Hero';
import FeaturedGallery from '@/components/FeaturedGallery';
import CategoryCard from '@/components/CategoryCard';
import { getFeaturedImages, getCategoryImageCount } from '@/lib/data';
import { categories } from '@/data/categories';
import { observatories } from '@/data/observatories';
import { siteInfo } from '@/data/site';

// Texas Observatory images
const texasObservatoryImages = [
  { src: '/images/observatories/20240818_193542.jpg', alt: 'Texas Dark Site - Sunset View' },
  { src: '/images/observatories/20250803_124230.jpg', alt: 'Texas Dark Site - Observatory Setup' },
  { src: '/images/observatories/20251102_164430.jpg', alt: 'Texas Dark Site - Telescope Setup' },
  { src: '/images/observatories/Ken.jpg', alt: 'Ken at Texas Dark Site' },
];

export const revalidate = 60;

/**
 * Homepage
 * 
 * Landing page featuring:
 * - Ken's photo prominently at top
 * - Category links (moved up!)
 * - A few featured images
 * - Observatory information including Texas
 */
export default async function HomePage() {
  const featuredImages = (await getFeaturedImages()).slice(0, 4); // Only 4 images before links
  
  // Get image counts for each category (in parallel)
  const categoryCounts = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      count: await getCategoryImageCount(cat.slug),
    }))
  );

  return (
    <>
      {/* Hero Section - Ken's photo at top */}
      <Hero />

      {/* Category Browse - MOVED UP! */}
      <section className="py-14 sm:py-16 bg-space-900/50">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-space-50 mb-3">
              Browse by Category
            </h2>
            <p className="text-space-300 max-w-2xl mx-auto">
              Explore deep sky objects organized by type
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
            {categoryCounts.map(({ category, count }) => (
              <CategoryCard
                key={category.slug}
                category={category}
                imageCount={count}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Images - Just a few */}
      <section className="py-14 sm:py-16">
        <Container>
          <FeaturedGallery
            images={featuredImages}
            title="Featured Images"
            viewAllHref="/galaxies"
            viewAllLabel="View all images"
          />
        </Container>
      </section>

      {/* Texas Observatory - Featured Section */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-amber-950/20 via-space-900 to-space-900">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="badge-tas px-4 py-2 text-lg font-bold text-white rounded-xl">
                  TAS
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-space-50">
                      Texas Astronomical Society Dark Site
                    </h2>
                    <span className="bg-green-900/30 text-green-400 border border-green-700/50 text-xs px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-space-400 mt-1">📍 Oklahoma</p>
                </div>
              </div>
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600/30 transition-colors text-sm font-medium"
              >
                View Equipment
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Description */}
            <p className="text-space-300 text-lg mb-8 max-w-3xl">
              Our newest observatory location at the Texas Astronomical Society dark site in Oklahoma. 
              Features the same telescope setup, providing access to pristine dark skies for exceptional deep sky imaging.
            </p>

            {/* Photo Gallery */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {texasObservatoryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-space-800 border border-space-700/50 hover:border-amber-500/50 transition-colors"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium">
                      {img.alt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Link to Texas Astro */}
            <div className="mt-8 flex justify-center">
              <a
                href="https://www.texasastro.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                Visit Texas Astronomical Society
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Other Observatories */}
      <section className="py-14 sm:py-16 bg-space-900/30">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-space-50 mb-3">
              All Observatory Locations
            </h2>
            <p className="text-space-300 max-w-2xl mx-auto">
              Images captured from multiple observatory locations over 25+ years of astrophotography
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {observatories.filter(obs => obs.code !== 'TAS').map((obs) => (
              <div 
                key={obs.code}
                className="p-5 rounded-xl bg-space-800/50 border border-space-700/50 hover:border-space-600/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className={`
                    inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold rounded
                    ${obs.code === 'H85' ? 'badge-h85' : ''}
                    ${obs.code === 'BBO' ? 'badge-bbo' : ''}
                    ${obs.code === 'SRO' ? 'badge-sro' : ''}
                    ${obs.code === 'G53' ? 'badge-g53' : ''}
                    text-white
                  `}>
                    {obs.code}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-space-50 mb-1">
                      {obs.fullName}
                    </h3>
                    <p className="text-sm text-space-400 mb-2">
                      {obs.location}
                    </p>
                    <p className="text-sm text-space-300">
                      {obs.description}
                    </p>
                    {obs.url && (
                      <a 
                        href={obs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-nebula-blue hover:text-nebula-cyan mt-2 transition-colors"
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                </div>
                {/* Status badge */}
                <div className="mt-3 flex justify-end">
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${obs.active 
                      ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                      : 'bg-space-700/50 text-space-400 border border-space-600/50'
                    }
                  `}>
                    {obs.active ? 'Active' : 'Historical'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* About Ken / Asteroid Section */}
      <section className="py-14 sm:py-16 bg-gradient-to-b from-space-800/30 to-space-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-star-warm/20 mb-5">
              <svg className="w-7 h-7 text-star-warm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-space-50 mb-4">
              Asteroid (99862) Kenlevin
            </h2>
            <p className="text-space-300 mb-5 leading-relaxed">
              {siteInfo.owner.bio}
            </p>
            <div className="inline-block p-4 rounded-lg bg-space-800/50 border border-star-warm/30">
              <p className="text-sm text-space-400 mb-1">Citation:</p>
              <p className="font-mono text-star-warm">
                (99862) &quot;Kenlevin&quot; = 2002 OD2
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
