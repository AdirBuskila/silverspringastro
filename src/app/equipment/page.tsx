import { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import { observatories } from '@/data/observatories';

export const metadata: Metadata = {
  title: 'Equipment',
  description: 'Telescopes, cameras, and equipment used at Silver Spring Observatory for CCD astro-imaging.',
};

// Equipment images from public/images/equipment
const equipmentImages = [
  {
    src: '/images/equipment/NMscope.jpg',
    title: 'New Mexico Telescope Setup',
    description: 'Primary imaging telescope at the Blackbird Observatory in New Mexico.',
  },
  {
    src: '/images/equipment/new_mount2.jpg',
    title: '17" Ritchey–Chrétien Cassegrain Telescope',
    description: 'Computer controlled all steel and aluminum fork mount with precision gears for accurate tracking during long-exposure imaging.',
  },
  {
    src: '/images/equipment/17DobScope.jpg',
    title: '17" Dobsonian Telescope',
    description: 'Large aperture Dobsonian telescope for visual observation and wide-field imaging.',
  },
];

/**
 * Equipment Page
 * 
 * Details about the telescopes, cameras, and other equipment
 * used for astronomical imaging.
 */
export default function EquipmentPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Equipment"
        description="Telescopes, cameras, mounts, and other equipment used for CCD astro-imaging at Silver Spring Observatory and remote locations."
        breadcrumbs={[{ label: 'Equipment' }]}
      />

      <div className="py-8 space-y-12">
        {/* Equipment Gallery */}
        <section>
          <h2 className="text-2xl font-bold text-space-50 mb-6">Equipment Gallery</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {equipmentImages.map((img, index) => (
              <div 
                key={index}
                className="group relative rounded-xl overflow-hidden bg-space-800/50 border border-space-700/50"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-space-50 mb-1">{img.title}</h3>
                  <p className="text-sm text-space-400">{img.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Setup */}
        <section>
          <h2 className="text-2xl font-bold text-space-50 mb-6">Current Setup</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Telescope */}
            <div className="p-6 rounded-xl bg-space-800/50 border border-space-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-nebula-blue/20">
                  <svg className="w-6 h-6 text-nebula-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-space-50">Telescope</h3>
              </div>
              <p className="text-space-300 mb-4">
                Primary imaging telescope for deep sky observations. Optimized for CCD imaging 
                with high-quality optics and precise tracking.
              </p>
            </div>

            {/* Mount */}
            <div className="p-6 rounded-xl bg-space-800/50 border border-space-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-nebula-purple/20">
                  <svg className="w-6 h-6 text-nebula-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-space-50">Mount</h3>
              </div>
              <p className="text-space-300 mb-4">
                German equatorial mount with precise tracking for long-exposure imaging.
                Computer-controlled for automated targeting and guiding.
              </p>
            </div>

            {/* Camera */}
            <div className="p-6 rounded-xl bg-space-800/50 border border-space-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-nebula-cyan/20">
                  <svg className="w-6 h-6 text-nebula-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-space-50">CCD Camera</h3>
              </div>
              <p className="text-space-300 mb-4">
                Cooled CCD camera for deep sky imaging. Low noise and high sensitivity 
                for capturing faint astronomical objects.
              </p>
            </div>

            {/* Filters */}
            <div className="p-6 rounded-xl bg-space-800/50 border border-space-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-nebula-pink/20">
                  <svg className="w-6 h-6 text-nebula-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-space-50">Filters</h3>
              </div>
              <p className="text-space-300 mb-4">
                Filter set for LRGB imaging and narrowband photography including 
                Hydrogen-alpha (Ha), Oxygen III (OIII), and Sulfur II (SII).
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2 py-1 text-xs bg-red-900/30 text-red-400 rounded">L</span>
                <span className="px-2 py-1 text-xs bg-red-900/30 text-red-400 rounded">R</span>
                <span className="px-2 py-1 text-xs bg-green-900/30 text-green-400 rounded">G</span>
                <span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-400 rounded">B</span>
                <span className="px-2 py-1 text-xs bg-pink-900/30 text-pink-400 rounded">Ha</span>
                <span className="px-2 py-1 text-xs bg-cyan-900/30 text-cyan-400 rounded">OIII</span>
                <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-400 rounded">SII</span>
              </div>
            </div>
          </div>
        </section>

        {/* Observatories */}
        <section>
          <h2 className="text-2xl font-bold text-space-50 mb-6">Observatory Locations</h2>
          <div className="space-y-4">
            {observatories.map((obs) => (
              <div 
                key={obs.code}
                className="p-6 rounded-xl bg-space-800/50 border border-space-700/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <span className={`
                    inline-flex items-center justify-center w-14 h-14 text-lg font-bold rounded-xl
                    ${obs.code === 'H85' ? 'badge-h85' : ''}
                    ${obs.code === 'BBO' ? 'badge-bbo' : ''}
                    ${obs.code === 'SRO' ? 'badge-sro' : ''}
                    ${obs.code === 'G53' ? 'badge-g53' : ''}
                    ${obs.code === 'TAS' ? 'badge-tas' : ''}
                    text-white flex-shrink-0
                  `}>
                    {obs.code}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-space-50">
                        {obs.fullName}
                      </h3>
                      <span className={`
                        inline-flex text-xs px-2 py-0.5 rounded-full w-fit
                        ${obs.active 
                          ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                          : 'bg-space-700/50 text-space-400 border border-space-600/50'
                        }
                      `}>
                        {obs.active ? 'Active' : 'Historical'}
                      </span>
                    </div>
                    <p className="text-sm text-space-400 mb-3">
                      📍 {obs.location}
                    </p>
                    <p className="text-space-300">
                      {obs.description}
                    </p>
                    {obs.url && (
                      <a 
                        href={obs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-nebula-blue hover:text-nebula-cyan mt-3 transition-colors"
                      >
                        Visit website
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    
                    {/* Texas Observatory Photos */}
                    {obs.code === 'TAS' && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-space-200 mb-3">Observatory Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { src: '/images/observatories/20240818_193542.jpg', alt: 'Texas Dark Site - Sunset View' },
                            { src: '/images/observatories/20250803_124230.jpg', alt: 'Texas Dark Site - Observatory Setup' },
                            { src: '/images/observatories/20251102_164430.jpg', alt: 'Texas Dark Site - Telescope Setup' },
                            { src: '/images/observatories/Ken.jpg', alt: 'Ken at Texas Dark Site' },
                          ].map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-space-700">
                              <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Image Labels Explanation */}
        <section>
          <h2 className="text-2xl font-bold text-space-50 mb-6">Understanding Image Labels</h2>
          <div className="p-6 rounded-xl bg-space-800/50 border border-space-700/50">
            <p className="text-space-300 mb-4">
              Each image in the gallery is labeled with the observatory code where it was captured, 
              and the filters used in the imaging process.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold text-space-100 mb-2">Observatory Codes</h4>
                <ul className="space-y-1 text-sm text-space-300">
                  <li><span className="badge-h85 px-1.5 py-0.5 text-xs font-bold text-white rounded mr-2">H85</span>Silver Spring Observatory, Maryland</li>
                  <li><span className="badge-bbo px-1.5 py-0.5 text-xs font-bold text-white rounded mr-2">BBO</span>Blackbird Observatory, New Mexico</li>
                  <li><span className="badge-sro px-1.5 py-0.5 text-xs font-bold text-white rounded mr-2">SRO</span>Sierra Remote Observatories</li>
                  <li><span className="badge-g53 px-1.5 py-0.5 text-xs font-bold text-white rounded mr-2">G53</span>Alder Springs Observatory</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-space-100 mb-2">Filter Codes</h4>
                <ul className="space-y-1 text-sm text-space-300">
                  <li><strong>LRGB</strong> - Luminance + Red, Green, Blue</li>
                  <li><strong>Ha</strong> - Hydrogen-alpha narrowband</li>
                  <li><strong>OIII</strong> - Oxygen III narrowband</li>
                  <li><strong>SII</strong> - Sulfur II narrowband</li>
                  <li><strong>LRGB+Ha</strong> - Color enhanced with Ha</li>
                  <li><strong>SII/Ha/OIII</strong> - Hubble Palette</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}

