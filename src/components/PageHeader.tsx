import Link from 'next/link';

/**
 * PageHeader Component
 * 
 * Consistent header for gallery and content pages.
 * Includes breadcrumb navigation and optional description.
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="pt-8 pb-8 sm:pt-12 sm:pb-10 border-b border-space-700/30">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="text-space-400 hover:text-space-200 transition-colors"
              >
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2">
                <svg 
                  className="w-4 h-4 text-space-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
                {crumb.href ? (
                  <Link 
                    href={crumb.href}
                    className="text-space-400 hover:text-space-200 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-space-200">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-space-50 tracking-tight">
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p className="mt-4 text-lg text-space-300 max-w-3xl leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}

