import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import { getImagesByCategory } from '@/lib/data';
import { getCategoryBySlug } from '@/data/categories';
import { asteroidDiscoveries } from '@/data/asteroidDiscoveries';
import { recoveryNights } from '@/data/recoveryLog';
import Link from 'next/link';

const category = getCategoryBySlug('asteroids')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

export const revalidate = 60;

const asteroidStats = {
  discoveries: '40+',
  photometry: '5+',
  recovery: '2100+',
  nearEarth: '52+',
};

/**
 * Asteroids Gallery Page
 * 
 * Features asteroid observations including the named asteroid (99862) Kenlevin.
 */
export default async function AsteroidsPage() {
  const images = await getImagesByCategory('asteroids');

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
                (99862) &quot;Kenlevin&quot; = 2002 OD25
              </p>
              <Link
                href="/asteroids/kenlevin"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-star-warm/15 border border-star-warm/40 text-star-warm text-sm font-medium hover:bg-star-warm/25 transition-colors"
              >
                Explore its orbit in 3D <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="py-6">
        <h2 className="text-xl font-bold text-space-100 mb-4">Observation Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-space-800/50 border border-space-700 text-center">
            <div className="text-3xl font-bold text-nebula-blue">{asteroidStats.discoveries}</div>
            <div className="text-sm text-space-400">Discoveries</div>
            <div className="text-xs text-space-500">as of Jan 2011</div>
          </div>
          <div className="p-4 rounded-lg bg-space-800/50 border border-space-700 text-center">
            <div className="text-3xl font-bold text-nebula-purple">{asteroidStats.photometry}</div>
            <div className="text-sm text-space-400">Light Curves</div>
            <div className="text-xs text-space-500">photometry studies</div>
          </div>
          <div className="p-4 rounded-lg bg-space-800/50 border border-space-700 text-center">
            <div className="text-3xl font-bold text-nebula-cyan">{asteroidStats.recovery}</div>
            <div className="text-sm text-space-400">Recovery/Astrometry</div>
            <div className="text-xs text-space-500">as of Feb 2011</div>
          </div>
          <div className="p-4 rounded-lg bg-space-800/50 border border-space-700 text-center">
            <div className="text-3xl font-bold text-star-warm">{asteroidStats.nearEarth}</div>
            <div className="text-sm text-space-400">Near-Earth Obs.</div>
            <div className="text-xs text-space-500">as of March 2008</div>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-4">Asteroid Images</h2>
        <ImageGrid images={images} columns={3} />
      </section>

      {/* Link to the minor planet survey */}
      <section className="py-4">
        <Link
          href="/minor-planets"
          className="group flex items-center justify-between gap-4 p-5 rounded-xl bg-space-800/50 border border-stone-400/30 hover:border-stone-300/60 transition-colors"
        >
          <div>
            <h2 className="font-semibold text-space-50 group-hover:text-stone-200">Minor Planet Recovery Survey, 2005–2006</h2>
            <p className="text-sm text-space-400">
              {recoveryNights.reduce((sum, n) => sum + n.frames.length, 0)} target frames from {recoveryNights.length} nights, with the orbit checks behind them
            </p>
          </div>
          <span className="text-stone-300 group-hover:translate-x-1 transition-transform" aria-hidden>→</span>
        </Link>
      </section>

      {/* Observatories */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-4">Observatories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-space-800/50 border border-space-700">
            <div className="font-mono text-sm text-nebula-blue mb-1">H85</div>
            <div className="font-semibold text-space-100">Silver Spring Observatory</div>
            <div className="text-sm text-space-400">Maryland</div>
          </div>
          <div className="p-4 rounded-lg bg-space-800/50 border border-space-700">
            <div className="font-mono text-sm text-nebula-purple mb-1">H08 (BBO)</div>
            <div className="font-semibold text-space-100">Blackbird Observatory</div>
            <div className="text-sm text-space-400">Cloudcroft, New Mexico</div>
          </div>
          <div className="p-4 rounded-lg bg-space-800/50 border border-space-700">
            <div className="font-mono text-sm text-nebula-cyan mb-1">G53</div>
            <div className="font-semibold text-space-100">Alder Springs Observatory</div>
            <div className="text-sm text-space-400">Sierra Remote, California</div>
          </div>
        </div>
      </section>

      {/* Discovery Table */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-1">Asteroid Discoveries</h2>
        <p className="text-sm text-space-400 mb-4">
          {asteroidDiscoveries.length} discoveries and confirmations. Arc/Obs is the observed arc and number of
          observations (e.g. 4-opp = four oppositions, 1V = one night).
        </p>
        <div className="overflow-x-auto rounded-lg border border-space-700/50">
          <table className="w-full text-sm">
            <thead className="bg-space-800/80">
              <tr className="border-b border-space-700">
                <th className="px-3 py-2 text-left text-space-300 font-medium">Date</th>
                <th className="px-3 py-2 text-left text-space-300 font-medium">Obs</th>
                <th className="px-3 py-2 text-left text-space-300 font-medium">Object</th>
                <th className="px-3 py-2 text-left text-space-300 font-medium hidden sm:table-cell">Observer</th>
                <th className="px-3 py-2 text-left text-space-300 font-medium hidden sm:table-cell">Measurer</th>
                <th className="px-3 py-2 text-left text-space-300 font-medium hidden md:table-cell">Arc/Obs</th>
                <th className="px-3 py-2 text-right text-space-300 font-medium">Mag</th>
              </tr>
            </thead>
            <tbody>
              {asteroidDiscoveries.map((d) => (
                <tr key={d.object} className="border-b border-space-800 last:border-0 hover:bg-space-800/50 transition-colors">
                  <td className="px-3 py-2 text-space-200 font-mono text-xs whitespace-nowrap">{d.date}</td>
                  <td className="px-3 py-2">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      d.obs === 'H85' ? 'bg-nebula-blue/20 text-nebula-blue' :
                      d.obs === 'H08' ? 'bg-nebula-purple/20 text-nebula-purple' :
                      'bg-nebula-cyan/20 text-nebula-cyan'
                    }`}>
                      {d.obs}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-space-100 font-medium whitespace-nowrap">
                    {d.url ? (
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-nebula-blue hover:text-nebula-cyan">
                        {d.object}
                      </a>
                    ) : d.object}
                  </td>
                  <td className="px-3 py-2 text-space-300 hidden sm:table-cell whitespace-nowrap">{d.observer}</td>
                  <td className="px-3 py-2 text-space-300 hidden sm:table-cell whitespace-nowrap">{d.measurer}</td>
                  <td className="px-3 py-2 text-space-400 font-mono text-xs hidden md:table-cell">{d.arc}</td>
                  <td className="px-3 py-2 text-right text-space-400 tabular-nums">{d.mag.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Container>
  );
}
