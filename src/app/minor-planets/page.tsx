import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ImageGrid from '@/components/ImageGrid';
import RecoveryLog from '@/components/RecoveryLog';
import { getImagesByCategory } from '@/lib/data';
import { getCategoryBySlug } from '@/data/categories';
import { recoveryNights } from '@/data/recoveryLog';

const category = getCategoryBySlug('minor-planets')!;

export const metadata: Metadata = {
  title: category.pluralTitle,
  description: category.description,
};

export const revalidate = 60;

const frameCount = recoveryNights.reduce((sum, night) => sum + night.frames.length, 0);

/**
 * Minor Planets Page
 *
 * The 2005-2006 faint-asteroid recovery survey at Silver Spring Observatory (H85).
 */
export default async function MinorPlanetsPage() {
  const images = await getImagesByCategory('minor-planets');

  return (
    <Container className="py-8">
      <PageHeader
        title={category.pluralTitle}
        description={category.description}
        breadcrumbs={[{ label: category.pluralTitle }]}
      />

      {/* Survey at a glance */}
      <section className="py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: frameCount, label: 'Target frames' },
            { value: recoveryNights.length, label: 'Observing nights' },
            { value: '19–20+', label: 'Target magnitude' },
            { value: 'H85', label: 'Silver Spring Observatory' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-lg bg-space-800/50 border border-space-700 text-center">
              <div className="text-3xl font-bold text-stone-200 tabular-nums">{stat.value}</div>
              <div className="text-sm text-space-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why recover faint asteroids */}
      <section className="py-8 max-w-3xl">
        <h2 className="text-xl font-bold text-space-100 mb-4">Recovery of Faint Asteroids</h2>
        <p className="text-space-300 leading-relaxed mb-4">
          Asteroids that are only observed for a short time can have calculated orbits with large
          uncertainties, and may be in danger of being lost. Recovering and re-observing them refines
          their orbits. Some have not been seen for years; others were measured, even many times by the
          surveys, but never identified.
        </p>
        <p className="text-space-300 leading-relaxed mb-4">
          Every unidentified object adds to the computer time needed to match new measurements. Securing
          an orbit lets those stray measurements be assigned, makes sure the asteroid is never lost, and
          usually means it can be numbered at the next opposition.
        </p>
        <p className="text-space-300 leading-relaxed">
          This survey started at Silver Spring Observatory in September 2005: targeted searches for faint
          objects (magnitude 19 to 20 and beyond) with large uncertainties, using dedicated software by
          J.&nbsp;C. Pelle that gives high confidence in identifying the recovered object. It also turned up new
          objects in the same fields as the targets, including the discoveries 2005&nbsp;TT15 and 2005&nbsp;VL2.
        </p>
      </section>

      {/* How to read a frame */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-4">Reading the Frames</h2>
        <ImageGrid images={images} columns={2} />
      </section>

      {/* Night-by-night log */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-4">Survey Log, September 2005 – February 2006</h2>
        <RecoveryLog nights={recoveryNights} />
      </section>

      {/* Orbit checks */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-space-100 mb-1">Checking the Measurements</h2>
        <p className="text-sm text-space-400 mb-4 max-w-3xl">
          Before reporting, each set of positions was checked against the predicted orbit. The lines show how far
          the measurements fall from the orbit over the night; staying inside the shaded band means a good fit.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {['MPCCheck', 'MPCCheck0', 'MPCCheck1', 'MPCChecka'].map((name) => (
            <div key={name} className="relative rounded-md overflow-hidden bg-white border border-space-700/50" style={{ aspectRatio: 661 / 261 }}>
              <Image src={`/images/asteroids/${name}.jpg`} alt="Orbit-fit residual plot" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <Link href="/asteroids" className="text-nebula-blue hover:text-nebula-cyan transition-colors">
          ← Asteroid discoveries and (99862) Kenlevin
        </Link>
      </section>
    </Container>
  );
}
