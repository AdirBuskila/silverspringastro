'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteInfo } from '@/data/site';

/**
 * Hero Component
 * 
 * Homepage hero section featuring Ken Levin with his telescope
 */
export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Ken with Telescope - Responsive Hero Images */}
      <div className="absolute inset-0">
        {/* Desktop image - positioned to show Ken on the right */}
        <Image
          src="/images/hero/ken-telescope.jpg"
          alt="Ken Levin with his telescope at Silver Spring Observatory"
          fill
          className="hidden md:block object-cover object-[75%_center]"
          priority
          quality={90}
        />
        {/* Mobile image - narrower crop for portrait screens */}
        <Image
          src="/images/hero/ken-telescope-mobile.jpg"
          alt="Ken Levin with his telescope at Silver Spring Observatory"
          fill
          className="block md:hidden object-cover object-center"
          priority
          quality={90}
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-space-900 via-space-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-space-900/50" />
      </div>

      {/* Animated star particles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#fff', '#60a5fa', '#c084fc'][Math.floor(Math.random() * 3)],
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content - Left aligned */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl">
          {/* Main title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-space-50">Silver Spring</span>
            <br />
            <span className="text-gradient">Observatory</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-space-200 mb-6 font-light">
            {siteInfo.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg text-space-300 mb-8 leading-relaxed">
            Deep sky astrophotography by {siteInfo.owner.name}. Galaxies, nebulae, star clusters, 
            and more captured from personal and remote observatories since 1999.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-nebula-blue">100+</div>
              <div className="text-sm text-space-400">Images</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-nebula-purple">40+</div>
              <div className="text-sm text-space-400">Asteroids Found</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-star-warm">3</div>
              <div className="text-sm text-space-400">Observatories</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-nebula-cyan">25+</div>
              <div className="text-sm text-space-400">Years</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/galaxies"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-nebula-blue text-space-900 font-semibold rounded-lg hover:bg-nebula-cyan transition-all hover:scale-105"
            >
              Explore Gallery
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-space-800/80 text-space-100 font-semibold rounded-lg border border-space-600 hover:bg-space-700 hover:border-space-500 transition-all backdrop-blur-sm"
            >
              About Ken Levin
            </Link>
          </div>

          {/* Location info */}
          <div className="flex flex-wrap gap-4 text-sm text-space-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {siteInfo.locations.current}
            </span>
            <span className="hidden sm:inline text-space-600">•</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              Sierra Remote Observatories
            </span>
          </div>

          {/* Asteroid badge */}
          <div className="mt-8 pt-6 border-t border-space-700/30">
            <Link href="/asteroids" className="inline-flex items-center gap-3 group">
              <span className="text-xl">🌟</span>
              <span className="text-star-warm group-hover:text-yellow-300 transition-colors">
                <span className="font-semibold">Asteroid (99862) &quot;Kenlevin&quot;</span>
                <span className="text-space-400 text-sm ml-2">— Named in honor of Ken Levin</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-space-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
