'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { mainNavigation, secondaryNavigation } from '@/data/navigation';

/**
 * Navbar Component
 * 
 * Sticky navigation bar with:
 * - Site branding
 * - Main navigation (astronomical categories)
 * - Secondary navigation (equipment, about)
 * - Mobile responsive hamburger menu
 */
export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-space-700/50 bg-space-900/80 backdrop-blur-heavy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Site Title */}
          <Link 
            href="/" 
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            {/* Star icon */}
            <div className="relative h-8 w-8">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-nebula-blue"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 blur-md opacity-50 bg-nebula-blue rounded-full" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold tracking-tight text-space-50">
                Silver Spring Observatory
              </h1>
              <p className="text-xs text-space-300 -mt-0.5">CCD Astro-Imaging</p>
            </div>
            <span className="sm:hidden text-lg font-semibold text-space-50">SSO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive(item.href)
                    ? 'text-nebula-blue bg-space-800'
                    : 'text-space-200 hover:text-space-50 hover:bg-space-800/50'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Divider */}
            <div className="mx-2 h-6 w-px bg-space-600" />
            
            {secondaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive(item.href)
                    ? 'text-nebula-blue bg-space-800'
                    : 'text-space-300 hover:text-space-50 hover:bg-space-800/50'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-space-200 hover:text-space-50 hover:bg-space-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-space-700/50 bg-space-900/95 backdrop-blur-heavy">
          <div className="px-4 py-3 space-y-1">
            {/* Main Navigation */}
            <div className="mb-2">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-space-400">
                Gallery
              </p>
            </div>
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${isActive(item.href)
                    ? 'text-nebula-blue bg-space-800'
                    : 'text-space-200 hover:text-space-50 hover:bg-space-800/50'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Secondary Navigation */}
            <div className="pt-4 mt-4 border-t border-space-700/50">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-space-400">
                More
              </p>
            </div>
            {secondaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${isActive(item.href)
                    ? 'text-nebula-blue bg-space-800'
                    : 'text-space-300 hover:text-space-50 hover:bg-space-800/50'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

