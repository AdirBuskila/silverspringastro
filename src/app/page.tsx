import Container from '@/components/Container';
import Hero from '@/components/Hero';
import FeaturedGallery from '@/components/FeaturedGallery';
import CategoryCard from '@/components/CategoryCard';
import { getFeaturedImages, getImagesByCategory } from '@/data/images';
import { categories } from '@/data/categories';
import { observatories } from '@/data/observatories';
import { siteInfo } from '@/data/site';
import Image from 'next/image';

/**
 * Homepage
 * 
 * Landing page featuring:
 * - Ken's photo prominently at top
 * - Category links (moved up!)
 * - A few featured images
 * - Observatory information including Texas
 */
export default function HomePage() {
  const featuredImages = getFeaturedImages().slice(0, 4); // Only 4 images before links
  
  // Get image counts for each category
  const categoryCounts = categories.map(cat => ({
    category: cat,
    count: getImagesByCategory(cat.slug).length,
  }));

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

      {/* Observatory Information */}
      <section className="py-14 sm:py-16 bg-space-900/30">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-space-50 mb-3">
              Observatories
            </h2>
            <p className="text-space-300 max-w-2xl mx-auto">
              Images captured from multiple observatory locations over 25+ years
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {observatories.map((obs) => (
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
                    ${obs.code === 'TAS' ? 'badge-tas' : ''}
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

      {/* NEW: Texas Observatory Project Section */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-nebula-blue/10 rounded-full border border-nebula-blue/30 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-nebula-cyan text-sm font-medium">New Project - 2025</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-space-50 mb-3">
                Texas Astronomical Society Dark Site
              </h2>
              <p className="text-space-300 max-w-2xl mx-auto">
                Building a new observatory with the same telescope at the TAS dark site in Oklahoma — 
                continuing the legacy of deep sky imaging under pristine dark skies.
              </p>
            </div>

            {/* Observatory construction photos */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ken with telescope photo */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <Image
                  src="/images/observatories/texas-telescope.jpg"
                  alt="Ken Levin with the telescope at Texas site"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-space-100 font-medium">Setting up the telescope</p>
                  <p className="text-space-400 text-sm">Texas Astronomical Society Dark Site</p>
                </div>
              </div>

              {/* Observatory building photo */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <Image
                  src="/images/observatories/texas-building.jpg"
                  alt="Observatory building at Texas dark site"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-space-100 font-medium">Observatory building</p>
                  <p className="text-space-400 text-sm">Under construction - Oklahoma</p>
                </div>
              </div>
            </div>
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
