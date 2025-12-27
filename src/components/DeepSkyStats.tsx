'use client';

import { useEffect, useState } from 'react';
import { images, getImagesByCategory } from '@/data/images';

/**
 * DeepSkyStats Component
 * 
 * NEW FEATURE: Animated statistics display showing:
 * - Total light-years captured
 * - Galaxies photographed
 * - Total exposure time (estimated)
 * - Objects catalogued
 */

// Fun astronomy facts with real data
const ASTRONOMY_FACTS = [
  { category: 'galaxies', avgDistance: 25000000 }, // 25 million light years avg
  { category: 'nebulae', avgDistance: 3000 }, // 3000 light years avg
  { category: 'star-clusters', avgDistance: 10000 },
  { category: 'supernovae', avgDistance: 30000000 },
];

export default function DeepSkyStats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    lightYears: 0,
    galaxies: 0,
    hours: 0,
    objects: 0,
  });

  const galaxyCount = getImagesByCategory('galaxies').length;
  const nebulaCount = getImagesByCategory('nebulae').length;
  const totalObjects = images.length;
  
  // Calculate approximate total light years of all objects
  const totalLightYears = ASTRONOMY_FACTS.reduce((acc, fact) => {
    const count = getImagesByCategory(fact.category).length;
    return acc + (count * fact.avgDistance);
  }, 0);
  
  // Estimated exposure hours (rough average of 8 hours per deep sky image)
  const estimatedHours = totalObjects * 8;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('deep-sky-stats');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedValues({
        lightYears: Math.round(totalLightYears * eased),
        galaxies: Math.round(galaxyCount * eased),
        hours: Math.round(estimatedHours * eased),
        objects: Math.round(totalObjects * eased),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [isVisible, totalLightYears, galaxyCount, estimatedHours, totalObjects]);

  const formatLightYears = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <section id="deep-sky-stats" className="py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-space-50 mb-4">
          Deep Sky Statistics
        </h2>
        <p className="text-space-300 max-w-2xl mx-auto">
          Numbers that put our cosmic journey into perspective
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Light Years */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-nebula-blue to-nebula-purple rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative p-6 bg-space-800 rounded-xl border border-space-700/50">
            <div className="text-4xl mb-2">🌌</div>
            <div className="text-3xl sm:text-4xl font-bold text-nebula-blue mb-1">
              {formatLightYears(animatedValues.lightYears)}
            </div>
            <div className="text-sm text-space-400">Light Years</div>
            <div className="text-xs text-space-500 mt-2">Distance to captured objects</div>
          </div>
        </div>

        {/* Galaxies */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-nebula-purple to-nebula-pink rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative p-6 bg-space-800 rounded-xl border border-space-700/50">
            <div className="text-4xl mb-2">🔭</div>
            <div className="text-3xl sm:text-4xl font-bold text-nebula-purple mb-1">
              {animatedValues.galaxies}
            </div>
            <div className="text-sm text-space-400">Galaxies</div>
            <div className="text-xs text-space-500 mt-2">Island universes captured</div>
          </div>
        </div>

        {/* Exposure Hours */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-star-warm to-star-orange rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative p-6 bg-space-800 rounded-xl border border-space-700/50">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl sm:text-4xl font-bold text-star-warm mb-1">
              {animatedValues.hours}+
            </div>
            <div className="text-sm text-space-400">Hours</div>
            <div className="text-xs text-space-500 mt-2">Estimated exposure time</div>
          </div>
        </div>

        {/* Total Objects */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-nebula-cyan to-nebula-blue rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative p-6 bg-space-800 rounded-xl border border-space-700/50">
            <div className="text-4xl mb-2">✨</div>
            <div className="text-3xl sm:text-4xl font-bold text-nebula-cyan mb-1">
              {animatedValues.objects}
            </div>
            <div className="text-sm text-space-400">Objects</div>
            <div className="text-xs text-space-500 mt-2">Deep sky targets imaged</div>
          </div>
        </div>
      </div>

      {/* Fun fact ticker */}
      <div className="mt-8 p-4 bg-space-800/50 rounded-lg border border-space-700/30 text-center">
        <p className="text-sm text-space-300">
          <span className="text-star-warm font-semibold">Did you know?</span> The farthest galaxy in this collection 
          emitted its light when the universe was just a fraction of its current age. By the time we see it, 
          those photons have traveled for millions of years!
        </p>
      </div>
    </section>
  );
}

