import { ReactNode } from 'react';

/**
 * Container Component
 * 
 * Consistent max-width container with responsive padding.
 */
interface ContainerProps {
  children: ReactNode;
  className?: string;
  // For full-width sections that need the container for inner content
  as?: 'div' | 'section' | 'article' | 'main';
}

export default function Container({ 
  children, 
  className = '',
  as: Component = 'div'
}: ContainerProps) {
  return (
    <Component className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Component>
  );
}

/**
 * Narrow container for text-heavy pages
 */
export function NarrowContainer({ 
  children, 
  className = '',
  as: Component = 'div'
}: ContainerProps) {
  return (
    <Component className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Component>
  );
}

