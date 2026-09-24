import { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import OrbitExplorer from '@/components/kenlevin/OrbitExplorer';
import { KENLEVIN_ELEMENTS as el, KENLEVIN_INFO as info } from '@/data/kenlevin';
import { JUPITER_PERIOD_DAYS } from '@/lib/kepler';

export const metadata: Metadata = {
  title: '(99862) Kenlevin Orbit',
  description:
    'Explore the orbit of asteroid (99862) Kenlevin, named after Ken Levin, in 3D, and watch the triangle it traces as seen from Jupiter.',
};

const DAYS_PER_YEAR = 365.25;
const periodYears = el.period / DAYS_PER_YEAR;
const jupiterYears = JUPITER_PERIOD_DAYS / DAYS_PER_YEAR;
// Mean orbital speed sqrt(GM/a), from the Sun's GM (km^3/s^2) and the semi-major axis.
const meanSpeedKmS = Math.sqrt(1.32712440018e11 / (el.a * 149597870.7));

const stats = [
  { label: 'Orbital period', value: `${periodYears.toFixed(2)} years`, note: `${Math.round(el.period).toLocaleString('en-US')} days` },
  { label: 'Distance from the Sun', value: `${el.q.toFixed(2)}–${el.Q.toFixed(2)} AU`, note: `average ${el.a.toFixed(2)} AU` },
  { label: 'Orbit tilt', value: `${el.i.toFixed(1)}°`, note: 'to the plane of Earth’s orbit' },
  { label: 'Mean orbital speed', value: `${meanSpeedKmS.toFixed(1)} km/s`, note: 'derived from its orbit size' },
  { label: 'Diameter', value: `≈ ${info.diameterKm.toFixed(1)} km`, note: 'NEOWISE infrared survey' },
  { label: 'Rotation', value: `≈ ${Math.round(info.rotationPeriodHours)} hours`, note: 'uncertain by up to ~30%' },
  { label: 'Closest to Earth’s orbit', value: `${info.earthMoidAu.toFixed(2)} AU`, note: 'not near-Earth, not hazardous' },
  { label: 'Observations', value: info.observationsUsed.toLocaleString('en-US'), note: `${info.firstObs.slice(0, 4)}–${info.lastObs.slice(0, 4)}` },
];

/**
 * (99862) Kenlevin orbit page.
 * Data is hardcoded from JPL (src/data/kenlevin.ts); nothing is fetched at runtime.
 */
export default function KenlevinPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="(99862) Kenlevin"
        description="An asteroid named after Ken Levin. Follow it around the Sun in 3D, or switch to Jupiter's view to see the triangle it traces."
        breadcrumbs={[{ label: 'Asteroids', href: '/asteroids' }, { label: 'Kenlevin' }]}
      />

      <div className="py-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label="Orbit viewer" className="min-w-0">
          <OrbitExplorer />
          <p className="mt-3 text-xs text-space-400 leading-relaxed">
            <span className="text-star-warm">Amber</span>: Kenlevin ·{' '}
            <span className="text-nebula-purple">purple</span>: Jupiter ·{' '}
            <span className="text-nebula-blue">blue</span>: Earth. Positions are computed from JPL orbital
            elements and are approximate far from today&apos;s date.
          </p>
        </section>

        <aside className="min-w-0 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-space-100 mb-3">About Kenlevin</h2>
            <p className="text-space-300 leading-relaxed mb-3">
              Kenlevin is a small asteroid, about {Math.round(info.diameterKm)} km across, that circles the Sun
              between Mars and Jupiter. It was discovered on July 23, 2002 by {info.discovery.who} on plates
              taken at {info.discovery.location}, catalogued as {info.designation}, and later named after Ken Levin.
            </p>
            <blockquote className="pl-4 border-l-2 border-star-warm/50 text-sm text-space-200 italic">
              &ldquo;{info.citation}&rdquo;
            </blockquote>
          </section>

          <section>
            <h2 className="sr-only">Key numbers</h2>
            <dl className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-space-800/50 border border-space-700">
                  <dt className="text-xs text-space-400">{s.label}</dt>
                  <dd className="text-lg font-semibold text-space-50 tabular-nums">{s.value}</dd>
                  <dd className="text-[11px] text-space-400 leading-snug">{s.note}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-bold text-space-100 mb-3">A Hilda asteroid</h2>
            <p className="text-space-300 leading-relaxed mb-3">
              Hilda asteroids move in step with Jupiter: on average they go around the Sun three times for
              every two trips Jupiter makes, a 3:2 resonance. That rhythm keeps them from ever meeting Jupiter,
              and seen from Jupiter&apos;s point of view their paths trace a rounded triangle, with corners near
              the gravitational balance points known as L3, L4 and L5.
            </p>
            <p className="text-space-300 leading-relaxed">
              Kenlevin takes {periodYears.toFixed(2)} years per orbit, almost exactly two-thirds of
              Jupiter&apos;s {jupiterYears.toFixed(2)} years. JPL files it under the broad class
              &ldquo;{info.orbitClass},&rdquo; and its size comes from the NEOWISE study of the Hilda population.
            </p>
          </section>

          <section className="text-xs text-space-400 leading-relaxed">
            <h2 className="text-sm font-semibold text-space-200 mb-1">Sources</h2>
            <p>
              Orbit, discovery and physical data:{' '}
              <a href={info.sbdbUrl} target="_blank" rel="noopener noreferrer" className="text-nebula-blue hover:text-nebula-cyan">
                NASA/JPL Small-Body Database
              </a>{' '}
              (orbit solution {info.orbitSolution}, retrieved {info.retrieved}). Jupiter&apos;s orbit: JPL approximate
              planetary elements. See also{' '}
              <a href={info.spaceReferenceUrl} target="_blank" rel="noopener noreferrer" className="text-nebula-blue hover:text-nebula-cyan">
                SpaceReference.org
              </a>
              ; the 3D view uses its open-source Spacekit engine.
            </p>
          </section>
        </aside>
      </div>

      <section className="py-4">
        <Link href="/asteroids" className="text-nebula-blue hover:text-nebula-cyan transition-colors">
          ← Back to Asteroids
        </Link>
      </section>
    </Container>
  );
}
