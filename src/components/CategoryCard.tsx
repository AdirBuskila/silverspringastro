import Link from 'next/link';
import { CategoryInfo } from '@/lib/types';

/**
 * CategoryCard Component
 * 
 * Card for displaying a category link with visual appeal.
 * Used on homepage for browsing different astronomical categories.
 */
interface CategoryCardProps {
  category: CategoryInfo;
  imageCount: number;
}

// Color gradients for each category
const categoryGradients: Record<string, string> = {
  'galaxies': 'from-blue-600/30 via-purple-600/20 to-pink-600/10',
  'galaxy-clusters': 'from-purple-600/30 via-indigo-600/20 to-blue-600/10',
  'star-clusters': 'from-yellow-600/30 via-orange-600/20 to-red-600/10',
  'nebulae': 'from-pink-600/30 via-red-600/20 to-orange-600/10',
  'supernovae': 'from-red-600/30 via-orange-600/20 to-yellow-600/10',
  'asteroids': 'from-cyan-600/30 via-teal-600/20 to-green-600/10',
  'exoplanets': 'from-teal-600/30 via-cyan-600/20 to-blue-600/10',
};

export default function CategoryCard({ category, imageCount }: CategoryCardProps) {
  const gradient = categoryGradients[category.slug] || 'from-space-700 to-space-800';

  return (
    <Link
      href={`/${category.slug}`}
      className="group relative overflow-hidden rounded-xl bg-space-800 border border-space-700/50 p-6 card-hover"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-space-50 mb-2 group-hover:text-nebula-blue transition-colors">
          {category.pluralTitle}
        </h3>
        <p className="text-sm text-space-300 line-clamp-2 mb-4">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-space-400">
            {imageCount} {imageCount === 1 ? 'image' : 'images'}
          </span>
          <svg 
            className="w-5 h-5 text-space-400 group-hover:text-nebula-blue group-hover:translate-x-1 transition-all" 
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

