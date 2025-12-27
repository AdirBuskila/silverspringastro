import Link from 'next/link';
import { siteInfo } from '@/data/site';
import { observatories } from '@/data/observatories';
import { mainNavigation, secondaryNavigation } from '@/data/navigation';

/**
 * Footer Component
 * 
 * Site footer with:
 * - Observatory information and codes
 * - Navigation links
 * - Contact information
 * - Credits and copyright
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-space-700/50 bg-space-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-space-50 mb-4">
              {siteInfo.title}
            </h3>
            <p className="text-sm text-space-300 leading-relaxed mb-4">
              {siteInfo.subtitle}. Deep sky astrophotography from personal and remote observatories.
            </p>
            <p className="text-sm text-space-400">
              Currently at {siteInfo.locations.current}
            </p>
          </div>

          {/* Observatory Codes */}
          <div>
            <h4 className="text-sm font-semibold text-space-100 uppercase tracking-wider mb-4">
              Observatory Codes
            </h4>
            <ul className="space-y-2">
              {observatories.map((obs) => (
                <li key={obs.code} className="flex items-start gap-2">
                  <span className={`
                    inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded
                    ${obs.code === 'H85' ? 'badge-h85' : ''}
                    ${obs.code === 'BBO' ? 'badge-bbo' : ''}
                    ${obs.code === 'SRO' ? 'badge-sro' : ''}
                    ${obs.code === 'G53' ? 'badge-g53' : ''}
                    text-white
                  `}>
                    {obs.code}
                  </span>
                  <span className="text-sm text-space-300">
                    {obs.name} ({obs.location.split(',')[0]})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-space-100 uppercase tracking-wider mb-4">
              Gallery
            </h4>
            <ul className="space-y-2">
              {mainNavigation.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-space-300 hover:text-nebula-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links + Contact */}
          <div>
            <h4 className="text-sm font-semibold text-space-100 uppercase tracking-wider mb-4">
              More
            </h4>
            <ul className="space-y-2 mb-6">
              {secondaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-space-300 hover:text-nebula-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-sm font-semibold text-space-100 uppercase tracking-wider mb-2">
              Contact
            </h4>
            <a
              href={`mailto:${siteInfo.owner.email}`}
              className="text-sm text-nebula-blue hover:text-nebula-cyan transition-colors"
            >
              {siteInfo.owner.email}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-space-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-space-400">
              © {currentYear} {siteInfo.owner.name}. All images are original work.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.sierra-remote.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-space-400 hover:text-space-300 transition-colors"
              >
                Sierra Remote Observatories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

