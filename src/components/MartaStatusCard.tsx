'use client';

import { useState, useEffect } from 'react';
import { useMartaData } from '@/hooks/useMartaData';
import type { Vehicle } from '@/types';

type LineStatus = 'on-schedule' | 'minor-delays' | 'major-delays';

interface LineConfig {
  label: string;
  colorClass: string;
  filter: (v: Vehicle) => boolean;
}

const LINES: LineConfig[] = [
  {
    label: 'Gold Line',
    colorClass: 'text-amber-400',
    filter: (v) => v.type === 'train' && v.route === 'Gold Line',
  },
  {
    label: 'Blue Line',
    colorClass: 'text-blue-400',
    filter: (v) => v.type === 'train' && v.route === 'Blue Line',
  },
  {
    label: 'College Park',
    colorClass: 'text-orange-400',
    filter: (v) => v.type === 'bus',
  },
];

// Trains: use minimum wait time from real API data.
// Buses: use vehicle count (GTFS-RT has no wait-time data).
function deriveTrainStatus(minWaitSeconds: number | null): LineStatus {
  if (minWaitSeconds === null) return 'major-delays';
  if (minWaitSeconds <= 600) return 'on-schedule';   // ≤10 min
  if (minWaitSeconds <= 900) return 'minor-delays';  // ≤15 min
  return 'major-delays';
}

function deriveBusStatus(count: number): LineStatus {
  if (count >= 2) return 'on-schedule';
  if (count === 1) return 'minor-delays';
  return 'major-delays';
}

const STATUS_CONFIG: Record<LineStatus, { dot: string; label: string }> = {
  'on-schedule': { dot: 'bg-green-500', label: 'On Schedule' },
  'minor-delays': { dot: 'bg-yellow-500', label: 'Minor Delays' },
  'major-delays': { dot: 'bg-red-500', label: 'Major Delays' },
};

interface LineRowProps {
  config: LineConfig;
  vehicles: Vehicle[];
}

function LineRow({ config, vehicles }: LineRowProps) {
  const matching = vehicles.filter(config.filter);
  let status: LineStatus;
  if (config.filter === LINES[2].filter) {
    status = deriveBusStatus(matching.length);
  } else {
    const waits = matching.map((v) => v.waitSeconds ?? Infinity).filter(isFinite);
    status = deriveTrainStatus(waits.length > 0 ? Math.min(...waits) : null);
  }
  const { dot, label } = STATUS_CONFIG[status];

  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm font-medium ${config.colorClass}`}>{config.label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
    </div>
  );
}

export default function MartaStatusCard() {
  const { vehicles, isLoading, isError } = useMartaData();
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!isError && !isLoading) {
      setUpdatedAt(new Date());
    }
  }, [vehicles, isError, isLoading]);

  return (
    <div className="rounded-lg bg-gray-800 px-3 py-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          MARTA Service
        </span>
        {updatedAt && (
          <span className="text-[10px] text-gray-500">
            Updated {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2 py-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3 animate-pulse rounded bg-gray-700" />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <p className="py-1 text-center text-xs text-gray-500">Status unavailable</p>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col">
          {LINES.map((line) => (
            <LineRow key={line.label} config={line} vehicles={vehicles} />
          ))}
        </div>
      )}
    </div>
  );
}
