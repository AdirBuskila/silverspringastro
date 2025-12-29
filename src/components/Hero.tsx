'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteInfo } from '@/data/site';

/**
 * Hero Component
 * 
 * Homepage hero section featuring Ken prominently at top,
 * followed by animated galaxy intro
 */
export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Ken Levin Hero - Prominent at the very top */}
      <section className="relative w-full bg-space-950">
        {/* Ken's Photo - Full width, no text overlay */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
          {/* Desktop image */}
          <Image
            src="/images/hero/ken-telescope.jpg"
            alt="Ken Levin with his telescope"
            fill
            className="object-cover object-[75%_center] hidden sm:block"
            priority
            quality={90}
          />
          {/* Mobile image */}
          <Image
            src="/images/hero/ken-telescope-mobile.jpg"
            alt="Ken Levin with his telescope"
            fill
            className="object-cover object-center sm:hidden"
            priority
            quality={90}
          />
          
          {/* Subtle vignette effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent" />
        </div>

        {/* Name badge floating at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-space-900/80 backdrop-blur-md rounded-full border border-space-700/50">
            <span className="text-2xl">🌟</span>
            <span className="text-space-100 font-medium">Ken Levin</span>
            <span className="text-space-500">•</span>
            <span className="text-star-warm text-sm">Asteroid (99862)</span>
          </div>
        </div>
      </section>

      {/* Main Title Section with Galaxy Animation */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Animated Galaxy Background */}
        <div className="absolute inset-0 bg-space-950">
          {/* Deep space gradient base */}
          <div className="absolute inset-0 bg-gradient-to-b from-space-950 via-[#0a0a2e] to-space-900" />
          
          {/* Galaxy spiral effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-20"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(96, 165, 250, 0.3) 60deg, transparent 120deg, rgba(192, 132, 252, 0.2) 180deg, transparent 240deg, rgba(34, 211, 238, 0.2) 300deg, transparent 360deg)',
                animation: 'spin 120s linear infinite',
              }}
            />
          </div>
          
          {/* Nebula clouds */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nebula-blue/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-nebula-purple/15 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '10s' }} />
          </div>
          
          {/* Stars layer */}
          <div className="absolute inset-0">
            {[...Array(60)].map((_, i) => (
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6">
            <span className="text-space-50 drop-shadow-lg">Silver Spring</span>
            <br />
            <span className="text-gradient drop-shadow-lg">Observatory</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-space-100 mb-6 font-light tracking-wide">
            {siteInfo.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg sm:text-xl text-space-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Deep sky astrophotography capturing the wonders of the universe — 
            galaxies, nebulae, star clusters, and more.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-nebula-blue">100+</div>
              <div className="text-sm text-space-400">Images</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-nebula-purple">40+</div>
              <div className="text-sm text-space-400">Asteroids</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-star-warm">4</div>
              <div className="text-sm text-space-400">Observatories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-nebula-cyan">25+</div>
              <div className="text-sm text-space-400">Years</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/galaxies"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-nebula-blue text-space-900 font-semibold rounded-lg hover:bg-nebula-cyan transition-all hover:scale-105"
            >
              Explore Gallery
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-space-800/80 text-space-100 font-semibold rounded-lg border border-space-600 hover:bg-space-700 hover:border-space-500 transition-all backdrop-blur-sm"
            >
              About Ken
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
