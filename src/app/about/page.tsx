import { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import { siteInfo } from '@/data/site';
import { observatories } from '@/data/observatories';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${siteInfo.owner.name} and Silver Spring Observatory. Amateur astronomer and physicist specializing in CCD astro-imaging.`,
};

/**
 * About Page
 * 
 * Information about Ken Levin and Silver Spring Observatory.
 */
export default function AboutPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="About"
        breadcrumbs={[{ label: 'About' }]}
      />

      <div className="py-8 max-w-4xl">
        {/* Ken Levin */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-space-50 mb-6">
            {siteInfo.owner.name}
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-space-200 leading-relaxed mb-6">
              {siteInfo.owner.bio}
            </p>
            <p className="text-space-300 leading-relaxed mb-6">
              All images on this website are original work, captured using personal telescopes and 
              CCD cameras from home observatories and remote imaging facilities. The journey of 
              astronomical imaging began in Silver Spring, Maryland, and has expanded to include 
              remote observatories with darker skies.
            </p>
            <div className="flex items-center gap-4 not-prose">
              <a
                href={`mailto:${siteInfo.owner.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-space-800 text-space-100 rounded-lg border border-space-700 hover:bg-space-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </a>
            </div>
          </div>
        </section>

        {/* Asteroid Honor */}
        <section className="mb-12">
          <div className="p-6 rounded-xl bg-gradient-to-br from-star-warm/10 to-star-orange/5 border border-star-warm/30">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-full bg-star-warm/20">
                <svg className="w-8 h-8 text-star-warm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-star-warm mb-3">
                  Asteroid (99862) Kenlevin
                </h3>
                <p className="text-space-300 mb-4">
                  In recognition of contributions to astronomy, asteroid 2002 OD2 was officially 
                  named &quot;Kenlevin&quot; by the International Astronomical Union.
                </p>
                <blockquote className="pl-4 border-l-2 border-star-warm/50 text-space-200 italic mb-4">
                  &quot;Ken Levin (b. 1953) is a physicist who works in the field of infrared optics and sensors 
                  for application in medicine, aerospace and astronomy. Levin is an avid amateur astronomer 
                  and operates two private observatories.&quot;
                </blockquote>
                <p className="font-mono text-star-warm">
                  (99862) &quot;Kenlevin&quot; = 2002 OD2
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Observatory History */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-space-50 mb-6">
            Observatory History
          </h2>
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-space-700">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-nebula-blue" />
              <div className="pb-8">
                <h3 className="font-semibold text-space-50 mb-1">Silver Spring Observatory (H85)</h3>
                <p className="text-sm text-space-400 mb-2">Silver Spring, Maryland</p>
                <p className="text-space-300">
                  The original home observatory where the astronomical imaging journey began. 
                  Located in the backyard of a suburban home, despite light pollution challenges, 
                  many deep sky images were captured here.
                </p>
              </div>
            </div>
            
            <div className="relative pl-8 border-l-2 border-space-700">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-nebula-purple" />
              <div className="pb-8">
                <h3 className="font-semibold text-space-50 mb-1">Blackbird Observatory (BBO)</h3>
                <p className="text-sm text-space-400 mb-2">Cloudcroft, New Mexico</p>
                <p className="text-space-300">
                  A remote observatory established near Cloudcroft, New Mexico, taking advantage 
                  of the darker skies and better seeing conditions of the American Southwest. 
                  This facility significantly expanded imaging capabilities.
                </p>
              </div>
            </div>
            
            <div className="relative pl-8 border-l-2 border-space-700">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-nebula-cyan" />
              <div className="pb-8">
                <h3 className="font-semibold text-space-50 mb-1">Concordia University</h3>
                <p className="text-sm text-space-400 mb-2">Irvine, California</p>
                <p className="text-space-300">
                  Current location. Continuing astronomical work and imaging from Southern California.
                </p>
              </div>
            </div>
            
            <div className="relative pl-8 border-l-2 border-space-700">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
              <div className="pb-8">
                <h3 className="font-semibold text-space-50 mb-1">Sierra Remote Observatories (SRO)</h3>
                <p className="text-sm text-space-400 mb-2">Sierra Nevada, California</p>
                <p className="text-space-300 mb-3">
                  Current remote imaging facility. Sierra Remote Observatories provides 
                  professional-grade infrastructure with excellent dark skies for amateur 
                  astronomers to conduct high-quality imaging.
                </p>
                <a 
                  href="https://www.sierra-remote.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-nebula-blue hover:text-nebula-cyan transition-colors"
                >
                  Visit Sierra Remote Observatories
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-space-50">Texas Astronomical Society Dark Site (TAS)</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Upgrading
                  </span>
                </div>
                <p className="text-sm text-space-400 mb-2">Caddo, Oklahoma</p>
                <p className="text-space-300 mb-3">
                  Our newest observatory is located at the Texas Astronomical Society&apos;s dark site in Caddo, Oklahoma. 
                  It is remotely operated and will be used by the TAS Teen Group for their research projects. 
                  Check back later for their exciting results!
                </p>
                <a 
                  href="https://www.texasastro.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-nebula-blue hover:text-nebula-cyan transition-colors"
                >
                  Visit Texas Astronomical Society
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Publications & Mentions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-space-50 mb-6">
            Publications & Media
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-space-800/50 border border-space-700/50">
              <h3 className="font-semibold text-space-100 mb-1">
                Washington Post Newspaper Article
              </h3>
              <p className="text-sm text-space-400 mb-2">
                Featured article about amateur astronomy work
              </p>
              <p className="text-space-300 text-sm mb-3">
                Ken Levin was featured in the Washington Post for his work in amateur astronomy 
                and astrophotography from his home observatory.
              </p>
              <a
                href="/images/travel/articleKen.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-nebula-blue hover:text-nebula-cyan transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                View newspaper article
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-2xl font-bold text-space-50 mb-6">
            Explore the Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              href="/galaxies"
              className="p-4 rounded-lg bg-space-800/50 border border-space-700/50 hover:border-nebula-blue/50 hover:bg-space-700/50 transition-colors group"
            >
              <h3 className="font-semibold text-space-100 group-hover:text-nebula-blue transition-colors">
                Galaxies →
              </h3>
              <p className="text-sm text-space-400">
                Spiral, elliptical, and interacting galaxies
              </p>
            </Link>
            <Link 
              href="/nebulae"
              className="p-4 rounded-lg bg-space-800/50 border border-space-700/50 hover:border-nebula-blue/50 hover:bg-space-700/50 transition-colors group"
            >
              <h3 className="font-semibold text-space-100 group-hover:text-nebula-blue transition-colors">
                Nebulae →
              </h3>
              <p className="text-sm text-space-400">
                Emission, planetary, and reflection nebulae
              </p>
            </Link>
            <Link 
              href="/asteroids"
              className="p-4 rounded-lg bg-space-800/50 border border-space-700/50 hover:border-nebula-blue/50 hover:bg-space-700/50 transition-colors group"
            >
              <h3 className="font-semibold text-space-100 group-hover:text-nebula-blue transition-colors">
                Asteroids →
              </h3>
              <p className="text-sm text-space-400">
                Including asteroid (99862) Kenlevin
              </p>
            </Link>
          </div>
        </section>
      </div>
    </Container>
  );
}

