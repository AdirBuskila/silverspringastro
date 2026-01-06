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

          {/* Additional Links: Equipment & Family */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 max-w-2xl mx-auto">
            {/* Equipment & Observatory - warm bronze/stone tones */}
            <Link
              href="/equipment"
              className="group relative overflow-hidden rounded-xl bg-space-800/80 border border-stone-500/25 p-5 hover:border-stone-400/50 hover:bg-space-800 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stone-500/20 via-stone-600/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity">
                <svg className="w-12 h-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-stone-200 mb-1 group-hover:text-white transition-colors">
                  Equipment & Observatory
                </h3>
                <p className="text-sm text-space-400 mb-3">
                  Telescopes, mounts, and observatory locations
                </p>
                <div className="flex items-center justify-end">
                  <svg className="w-5 h-5 text-stone-400 group-hover:text-stone-300 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Family & Travel - soft violet/mauve tones */}
            <Link
              href="/travel"
              className="group relative overflow-hidden rounded-xl bg-space-800/80 border border-fuchsia-500/20 p-5 hover:border-fuchsia-400/40 hover:bg-space-800 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/15 via-violet-600/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity">
                <svg className="w-12 h-12 text-fuchsia-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-fuchsia-200/90 mb-1 group-hover:text-white transition-colors">
                  Family & Travel
                </h3>
                <p className="text-sm text-space-400 mb-3">
                  Personal photos and travel memories
                </p>
                <div className="flex items-center justify-end">
                  <svg className="w-5 h-5 text-fuchsia-400/80 group-hover:text-fuchsia-300 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
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
              Our newest observatory is located at the Texas Astronomical Society&apos;s dark site in Caddo, Oklahoma. 
              It is remotely operated and will be used by the TAS Teen Group for their research projects. 
              Check back later for their exciting results!
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
