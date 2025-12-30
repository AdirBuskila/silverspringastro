import Link from 'next/link';
import Image from 'next/image';
import { CategoryInfo } from '@/lib/types';

/**
 * CategoryCard Component
 * 
 * Card for displaying a category link with visual appeal.
 * Uses actual astronomy images as backgrounds for each category.
 */
interface CategoryCardProps {
  category: CategoryInfo;
  imageCount: number;
}

// Background images for each category - iconic images from the collection
const categoryImages: Record<string, string> = {
  'galaxies': '/images/galaxies/M51_LRGB_H85.jpg',
  'galaxy-clusters': '/images/galaxy-clusters/Arp319_LRGB_BBO.jpg',
  'star-clusters': '/images/star-clusters/M13_LRGB_H85.jpg',
  'nebulae': '/images/nebulae/M27_LRGB_H85.jpg',
  'supernovae': '/images/supernovae/SN2008ax_LRGB_H85.jpg',
  'asteroids': '/images/asteroids/20051124_Fixed1a.jpg',
  'exoplanets': '/images/exoplanets/HD189733.jpg',
};

// Sophisticated space-themed color palette
// Muted, elegant colors that evoke the cosmos without being childish
// Mobile: always colored | Desktop: white, colored on hover
const categoryAccents: Record<string, { border: string; text: string; arrow: string }> = {
  'galaxies': { 
    // Indigo - deep space, spiral arms
    border: 'border-indigo-400/40 sm:border-space-700/50 group-hover:border-indigo-400/60', 
    text: 'text-indigo-300 sm:text-white sm:group-hover:text-indigo-300',
    arrow: 'text-indigo-400 sm:text-space-300 sm:group-hover:text-indigo-300'
  },
  'galaxy-clusters': { 
    // Violet - cosmic mystery, vast distances
    border: 'border-violet-400/40 sm:border-space-700/50 group-hover:border-violet-400/60', 
    text: 'text-violet-300 sm:text-white sm:group-hover:text-violet-300',
    arrow: 'text-violet-400 sm:text-space-300 sm:group-hover:text-violet-300'
  },
  'star-clusters': { 
    // Amber - warm starlight, golden glow
    border: 'border-amber-400/40 sm:border-space-700/50 group-hover:border-amber-400/60', 
    text: 'text-amber-200 sm:text-white sm:group-hover:text-amber-200',
    arrow: 'text-amber-400 sm:text-space-300 sm:group-hover:text-amber-300'
  },
  'nebulae': { 
    // Rose - emission nebulae glow
    border: 'border-rose-400/40 sm:border-space-700/50 group-hover:border-rose-400/60', 
    text: 'text-rose-300 sm:text-white sm:group-hover:text-rose-300',
    arrow: 'text-rose-400 sm:text-space-300 sm:group-hover:text-rose-300'
  },
  'supernovae': { 
    // Orange/coral - stellar explosions, energy
    border: 'border-orange-400/40 sm:border-space-700/50 group-hover:border-orange-400/60', 
    text: 'text-orange-200 sm:text-white sm:group-hover:text-orange-200',
    arrow: 'text-orange-400 sm:text-space-300 sm:group-hover:text-orange-300'
  },
  'asteroids': { 
    // Slate - rocky bodies, cool and neutral
    border: 'border-slate-400/40 sm:border-space-700/50 group-hover:border-slate-400/60', 
    text: 'text-slate-300 sm:text-white sm:group-hover:text-slate-300',
    arrow: 'text-slate-400 sm:text-space-300 sm:group-hover:text-slate-300'
  },
  'exoplanets': { 
    // Sky blue - other worlds, discovery
    border: 'border-sky-400/40 sm:border-space-700/50 group-hover:border-sky-400/60', 
    text: 'text-sky-300 sm:text-white sm:group-hover:text-sky-300',
    arrow: 'text-sky-400 sm:text-space-300 sm:group-hover:text-sky-300'
  },
};

export default function CategoryCard({ category, imageCount }: CategoryCardProps) {
  const backgroundImage = categoryImages[category.slug];
  const accent = categoryAccents[category.slug] || { 
    border: 'group-hover:border-space-500', 
    text: 'text-white', 
    arrow: 'text-space-300' 
  };

  return (
    <Link
      href={`/${category.slug}`}
      className={`group relative overflow-hidden rounded-xl bg-space-900 border border-space-700/50 ${accent.border} transition-all duration-300 card-hover`}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={category.pluralTitle}
            fill
            className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
          />
        </div>
      )}
      
      {/* Dark overlay for text readability - lighter to show more image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/20 transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col justify-end min-h-[160px]">
        <h3 className={`text-lg sm:text-xl font-bold mb-1.5 ${accent.text} transition-colors drop-shadow-lg`}>
          {category.pluralTitle}
        </h3>
        <p className="text-xs sm:text-sm text-space-200 line-clamp-2 mb-3 drop-shadow">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-space-300 bg-space-900/60 px-2 py-0.5 rounded-full">
            {imageCount} {imageCount === 1 ? 'image' : 'images'}
          </span>
          <svg 
            className={`w-5 h-5 ${accent.arrow} group-hover:translate-x-1 transition-all`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

