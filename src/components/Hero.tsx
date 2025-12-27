'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteInfo } from '@/data/site';

/**
 * Hero Component
 * 
 * Homepage hero section with animated galaxy background
 */
export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Hero Section with Galaxy Animation */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Animated Galaxy Background */}
        <div className="absolute inset-0 bg-space-950">
          {/* Deep space gradient base */}
          <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-[#0a0a2e] to-space-950" />
          
          {/* Galaxy spiral effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-30"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(96, 165, 250, 0.3) 60deg, transparent 120deg, rgba(192, 132, 252, 0.2) 180deg, transparent 240deg, rgba(34, 211, 238, 0.2) 300deg, transparent 360deg)',
                animation: 'spin 120s linear infinite',
              }}
            />
          </div>
          
          {/* Nebula clouds */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nebula-blue/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-nebula-purple/20 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-nebula-cyan/15 rounded-full blur-[60px] animate-pulse" style={{ animationDuration: '12s' }} />
          </div>
          
          {/* Stars layer */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-twinkle"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#fff', '#60a5fa', '#c084fc', '#fbbf24', '#22d3ee'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  boxShadow: Math.random() > 0.7 ? '0 0 6px currentColor' : 'none',
                }}
              />
            ))}
          </div>

        </div>

        {/* Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-8">
            <span className="text-space-50 drop-shadow-lg">Silver Spring</span>
            <br />
            <span className="text-gradient drop-shadow-lg">Observatory</span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl sm:text-3xl lg:text-4xl text-space-100 mb-8 font-light tracking-wide">
            {siteInfo.subtitle}
          </p>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-space-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Deep sky astrophotography capturing the wonders of the universe — 
            galaxies, nebulae, star clusters, and more.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-10">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-nebula-blue">100+</div>
              <div className="text-sm sm:text-base text-space-400">Images</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-nebula-purple">40+</div>
              <div className="text-sm sm:text-base text-space-400">Asteroids Found</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-star-warm">3</div>
              <div className="text-sm sm:text-base text-space-400">Observatories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-nebula-cyan">25+</div>
              <div className="text-sm sm:text-base text-space-400">Years</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/galaxies"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-nebula-blue text-space-900 text-lg font-semibold rounded-lg hover:bg-nebula-cyan transition-all hover:scale-105"
            >
              Explore Gallery
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-space-800/80 text-space-100 text-lg font-semibold rounded-lg border border-space-600 hover:bg-space-700 hover:border-space-500 transition-all backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-space-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Ken Levin Section - Honoring the astronomer */}
      <section className="relative py-16 bg-gradient-to-b from-space-950 to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Ken's Photo */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-nebula-blue/10">
                {/* Glowing border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-nebula-blue via-nebula-purple to-nebula-cyan rounded-2xl blur opacity-30" />
                <div className="relative h-full rounded-2xl overflow-hidden border border-space-700">
                  <Image
                    src="/images/hero/ken-telescope.jpg"
                    alt="Ken Levin with his telescope at Silver Spring Observatory"
                    fill
                    className="object-cover object-center"
                    quality={90}
                  />
                </div>
              </div>
            </div>

            {/* About Ken */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-star-warm/10 rounded-full border border-star-warm/30 mb-6">
                <span className="text-xl">🌟</span>
                <span className="text-star-warm font-medium">Asteroid (99862) Kenlevin</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-space-50 mb-6">
                Ken Levin
              </h2>
              
              <p className="text-xl text-space-300 leading-relaxed mb-6">
                A physicist working in infrared optics and sensors, and an avid amateur astronomer 
                who has been capturing the cosmos for over 25 years from his personal observatories.
              </p>
              
              <p className="text-lg text-space-400 leading-relaxed mb-8">
                His contributions to asteroid observations earned him the honor of having 
                asteroid (99862) named &quot;Kenlevin&quot; — a testament to his dedication to the field.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-space-400 mb-8">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-nebula-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {siteInfo.locations.current}
                </span>
                <span className="text-space-600">•</span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-nebula-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Cornell PhD, Applied Physics
                </span>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-nebula-cyan hover:text-nebula-blue transition-colors text-lg font-medium"
              >
                Read Full Biography
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
