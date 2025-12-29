import { ObservatoryCode } from '@/lib/types';
import { getObservatory } from '@/data/observatories';

/**
 * ObservatoryBadge Component
 * 
 * Displays an observatory code with color-coded badge.
 * Matches the original site's labeling convention (H85, BBO, etc.)
 */
interface ObservatoryBadgeProps {
  code: ObservatoryCode;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function ObservatoryBadge({ 
  code, 
  showLabel = false,
  size = 'sm' 
}: ObservatoryBadgeProps) {
  const observatory = getObservatory(code);
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
  };

  const badgeClasses: Record<ObservatoryCode, string> = {
    H85: 'badge-h85',
    BBO: 'badge-bbo',
    SRO: 'badge-sro',
    G53: 'badge-g53',
    TAS: 'badge-tas',
    None: 'bg-space-600',
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`
          inline-flex items-center justify-center font-bold rounded text-white
          ${sizeClasses[size]}
          ${badgeClasses[code] || 'bg-space-600'}
        `}
        title={observatory?.fullName}
      >
        {code}
      </span>
      {showLabel && observatory && (
        <span className="text-space-300 text-sm">
          {observatory.name}
        </span>
      )}
    </span>
  );
}

