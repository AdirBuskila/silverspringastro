'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteInfo } from '@/data/site';
import { getFeaturedImages } from '@/data/images';

/**
 * Hero Component
 * 
 * Homepage hero section featuring:
 * - Ken Levin with telescope photo
 * - Animated starfield background
 * - Live "image of the day" cycling
 * - Parallax effects
 */
export default function Hero() {
  const featuredImages = getFeaturedImages();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Cycle through featured images every 8 seconds
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % featuredImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredImages.length]);

  const currentImage = featuredImages[currentImageIndex];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Ken with Telescope background image - subtle */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/ken-telescope.jpg"
          alt="Ken Levin with telescope at Silver Spring Observatory"
          fill
          className="object-cover object-center opacity-20"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-space-900/70 via-space-900/90 to-space-900" />
      </div>
      
      {/* Nebula glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-nebula-blue/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-nebula-purple/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nebula-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Animated star particles */}
      <div className="absolute inset-0 opacity-60">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#fff', '#60a5fa', '#c084fc', '#fbbf24'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
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
            <p className="text-lg text-space-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Deep sky astrophotography by {siteInfo.owner.name}. Galaxies, nebulae, star clusters, 
              and more captured from personal and remote observatories.
            </p>

            {/* Stats bar - NEW FEATURE */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-nebula-blue">55+</div>
                <div className="text-sm text-space-400">Images</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nebula-purple">7</div>
                <div className="text-sm text-space-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-star-warm">3</div>
                <div className="text-sm text-space-400">Observatories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nebula-cyan">20+</div>
                <div className="text-sm text-space-400">Years</div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
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
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-space-400 mt-6">
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
                Remote at Sierra Remote Observatories
              </span>
            </div>
          </div>

          {/* Right: Featured image showcase - NEW FEATURE */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Glowing border */}
              <div className="absolute -inset-2 bg-gradient-to-r from-nebula-blue via-nebula-purple to-nebula-cyan rounded-2xl blur-lg opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />
              
              {/* Image container */}
              <div className="relative rounded-xl overflow-hidden border border-space-600/50 bg-space-800">
                {currentImage && (
                  <>
                    <Image
                      src={currentImage.imagePath}
                      alt={`${currentImage.designation} - ${currentImage.name || ''}`}
                      fill
                      className="object-cover transition-opacity duration-1000"
                      sizes="400px"
                    />
                    {/* Overlay with info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-space-50">{currentImage.designation}</h3>
                          <p className="text-sm text-space-300">{currentImage.name}</p>
                        </div>
                        <span className="text-xs text-space-400 bg-space-800/80 px-2 py-1 rounded backdrop-blur-sm">
                          Featured
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Image carousel indicators */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredImages.slice(0, 6).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentImageIndex ? 'bg-nebula-blue w-6' : 'bg-space-600 hover:bg-space-500'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* "Image of the Day" label */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-star-warm text-space-900 text-xs font-bold px-3 py-1 rounded-full">
              Image of the Day
            </div>
          </div>
        </div>

        {/* Asteroid mention */}
        <div className="mt-16 pt-8 border-t border-space-700/30 text-center">
          <Link href="/asteroids" className="inline-flex items-center gap-3 group">
            <span className="text-2xl">🌟</span>
            <span className="text-star-warm group-hover:text-star-bright transition-colors">
              <span className="font-semibold">Asteroid (99862) &quot;Kenlevin&quot;</span>
              <span className="text-space-400"> — Named in honor of Ken Levin</span>
            </span>
            <svg className="w-4 h-4 text-star-warm opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-space-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
