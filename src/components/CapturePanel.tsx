import { CaptureDetails } from '@/lib/types';
import { filterColors, filterNames, formatCaptureDate, formatDuration, totalMinutes } from '@/lib/capture';

/**
 * CapturePanel Component
 *
 * Acquisition details for an image: coordinates, instrument, date and a
 * per-filter exposure breakdown with total integration time.
 */
interface CapturePanelProps {
  capture: CaptureDetails;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-space-400 mb-2">
      {children}
    </h3>
  );
}

export default function CapturePanel({ capture }: CapturePanelProps) {
  const total = totalMinutes(capture);

  return (
    <div className="space-y-5">
      {capture.exposures && total > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <Label>Exposure</Label>
            <span className="text-sm font-semibold text-space-50 tabular-nums">
              {formatDuration(total)} total
            </span>
          </div>
          {/* Stacked bar: each filter's share of the integration time */}
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 bg-space-700" role="img"
            aria-label={capture.exposures.map(e => `${filterNames[e.filter] ?? e.filter} ${e.minutes} minutes`).join(', ')}
          >
            {capture.exposures.map((e) => (
              <div
                key={e.filter}
                style={{ width: `${(e.minutes / total) * 100}%`, backgroundColor: filterColors[e.filter] ?? '#8b949e' }}
              />
            ))}
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {capture.exposures.map((e) => (
              <div key={e.filter} className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-space-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: filterColors[e.filter] ?? '#8b949e' }} />
                  {filterNames[e.filter] ?? e.filter}
                </dt>
                <dd className="text-space-100 tabular-nums">{e.minutes} min</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {capture.date && (
        <div>
          <Label>Date Captured</Label>
          <p className="text-space-200">{formatCaptureDate(capture.date)}</p>
        </div>
      )}

      {(capture.telescope || capture.camera) && (
        <div>
          <Label>Instrument</Label>
          {capture.telescope && <p className="text-space-200">{capture.telescope}</p>}
          {capture.camera && <p className="text-sm text-space-400">{capture.camera}</p>}
        </div>
      )}

      {(capture.ra || capture.context) && (
        <div>
          <Label>Target</Label>
          {capture.ra && capture.dec && (
            <p className="font-mono text-sm text-space-200">
              RA {capture.ra} &nbsp;Dec {capture.dec} <span className="text-space-500">(J2000)</span>
            </p>
          )}
          {capture.context && <p className="text-sm text-space-400 mt-0.5">in {capture.context}</p>}
        </div>
      )}

      {capture.notes && capture.notes.length > 0 && (
        <div>
          <Label>Notes</Label>
          {capture.notes.map((note) => (
            <p key={note} className="text-sm text-space-300 first-letter:uppercase">{note}</p>
          ))}
        </div>
      )}

      {capture.links && capture.links.length > 0 && (
        <div>
          <Label>Further Data</Label>
          <div className="flex flex-wrap gap-2">
            {capture.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 rounded-full bg-space-700 text-nebula-blue hover:bg-space-600 transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
