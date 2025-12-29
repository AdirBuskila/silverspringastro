import { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import { getImagesByCategory } from '@/lib/data';
import { getCategoryBySlug } from '@/data/categories';

const category = getCategoryBySlug('asteroids')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

export const revalidate = 60;

// Asteroid discovery data from original site
const asteroidDiscoveries = [
  { date: '2005/10/03', obs: 'H85', object: '2005TT15 (242693)', magnitude: '19.6' },
  { date: '2005/11/06', obs: 'H85', object: '2005 VL2', magnitude: '19.1' },
  { date: '2006/01/30', obs: 'H08', object: '2006 BN212', magnitude: '20.4' },
  { date: '2006/03/20', obs: 'H85', object: '2006 FD', magnitude: '19.6' },
  { date: '2007/11/08', obs: 'H08', object: '2007 VW125', magnitude: '21.6' },
  { date: '2008/12/07', obs: 'H08', object: '2008 XW6', magnitude: '20.0' },
  { date: '2009/01/15', obs: 'H08', object: '2009 AT16', magnitude: '21.2' },
  { date: '2009/01/19', obs: 'H08', object: '2009 BT9', magnitude: '21.4' },
  { date: '2009/01/19', obs: 'H08', object: '2009 BU9', magnitude: '21.8' },
  { date: '2009/01/19', obs: 'H08', object: '2009 BV9', magnitude: '21.9' },
  { date: '2009/10/25', obs: 'H08', object: '2009 UY91', magnitude: '20.3' },
  { date: '2009/10/25', obs: 'H08', object: '2009 UP19', magnitude: '19.7' },
  { date: '2009/10/25', obs: 'H08', object: '2009 UD20', magnitude: '20.0' },
  { date: '2009/11/16', obs: 'H08', object: '2009 WU', magnitude: '20.0' },
  { date: '2010/11/30', obs: 'G53', object: '2010 W73V', magnitude: '21.3' },
];

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
                (99862) &quot;Kenlevin&quot; = 2002 OD2
              </p>
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

      {/* Recovery of Faint Asteroids */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-4">Recovery of Faint Asteroids</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-space-300 leading-relaxed mb-4">
            Asteroids that are only observed for a short time can have calculated orbits which have large 
            uncertainties and may be in danger of being lost. Therefore, it is important to recover and 
            observe these asteroids in order to refine their orbital parameters. While some asteroids have 
            not been seen for years, others, although measured (even many times by the surveys), were never identified.
          </p>
          <p className="text-space-300 leading-relaxed mb-4">
            Adding these to the database of unidentified objects increases the amount of computer time needed 
            for identification exponentially. Securing the orbit of these objects allows the assignment of 
            still unidentified measurements, and assures that the asteroid will never be lost, and it probably 
            will be numbered at the next opposition.
          </p>
          <p className="text-space-300 leading-relaxed">
            We perform targeted searches of faint objects (magnitude between 19 and 20 and beyond) with large 
            uncertainties and in danger of being lost, using dedicated software by J.C. Pelle allowing a high 
            confidence in the identification of the recovered object.
          </p>
        </div>
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
        <h2 className="text-xl font-bold text-space-100 mb-4">Asteroid Discoveries (Sample)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-space-700">
                <th className="px-4 py-2 text-left text-space-300 font-medium">Date</th>
                <th className="px-4 py-2 text-left text-space-300 font-medium">Observatory</th>
                <th className="px-4 py-2 text-left text-space-300 font-medium">Object</th>
                <th className="px-4 py-2 text-right text-space-300 font-medium">Magnitude</th>
              </tr>
            </thead>
            <tbody>
              {asteroidDiscoveries.map((discovery, index) => (
                <tr 
                  key={index} 
                  className="border-b border-space-800 hover:bg-space-800/50 transition-colors"
                >
                  <td className="px-4 py-2 text-space-200 font-mono text-xs">{discovery.date}</td>
                  <td className="px-4 py-2">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      discovery.obs === 'H85' ? 'bg-nebula-blue/20 text-nebula-blue' :
                      discovery.obs === 'H08' ? 'bg-nebula-purple/20 text-nebula-purple' :
                      'bg-nebula-cyan/20 text-nebula-cyan'
                    }`}>
                      {discovery.obs}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-space-100 font-medium">{discovery.object}</td>
                  <td className="px-4 py-2 text-right text-space-400">{discovery.magnitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-space-500 text-center">
          Observer: K. Levin • Measurer: N. Teamo / J.C. Pelle
        </p>
      </section>
    </Container>
  );
}
