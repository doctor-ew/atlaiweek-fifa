'use client';

import { useState, useEffect } from 'react';
import type { Vehicle } from '@/types';
import { useMartaData } from '@/hooks/useMartaData';

interface LineConfig {
  name: string;
  color: string;
  key: 'gold' | 'blue' | 'bus';
}

const LINE_CONFIG: LineConfig[] = [
  { name: 'Gold Line',     color: 'text-amber-400',  key: 'gold' },
  { name: 'Blue Line',     color: 'text-blue-400',   key: 'blue' },
  { name: 'College Park',  color: 'text-orange-400', key: 'bus'  },
];

interface LineCounts {
  gold: number;
  blue: number;
  bus: number;
}

function deriveStatuses(vehicles: Vehicle[]): LineCounts {
  let gold = 0, blue = 0, bus = 0;
  for (const v of vehicles) {
    if (v.type === 'train') {
      if (v.route === 'Gold Line') gold++;
      else if (v.route === 'Blue Line') blue++;
    } else if (v.type === 'bus') {
      bus++;
    }
  }
  return { gold, blue, bus };
}

type StatusLevel = 'on-schedule' | 'minor-delays' | 'major-delays';

function toStatusLevel(count: number): StatusLevel {
  if (count >= 2) return 'on-schedule';
  if (count === 1) return 'minor-delays';
  return 'major-delays';
}

const STATUS_DOT: Record<StatusLevel, string> = {
  'on-schedule':   'text-green-500',
  'minor-delays':  'text-yellow-500',
  'major-delays':  'text-red-500',
};

const STATUS_LABEL: Record<StatusLevel, string> = {
  'on-schedule':  'On Schedule',
  'minor-delays': 'Minor Delays',
  'major-delays': 'Major Delays',
};

interface LineRowProps {
  name: string;
  color: string;
  status: StatusLevel;
}

function LineRow({ name, color, status }: LineRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`text-xs ${STATUS_DOT[status]}`}>●</span>
        <span className={`text-sm font-medium ${color}`}>{name}</span>
      </div>
      <span className="text-xs text-gray-400">{STATUS_LABEL[status]}</span>
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

  const counts = deriveStatuses(vehicles);

  return (
    <div className="rounded-lg bg-gray-800 px-3 py-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-white">MARTA Service</span>
        {updatedAt && (
          <span className="text-xs text-gray-400">
            Updated {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-gray-700" />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <p className="text-center text-xs text-gray-400">Status unavailable</p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-1.5">
          {LINE_CONFIG.map((line) => (
            <LineRow
              key={line.key}
              name={line.name}
              color={line.color}
              status={toStatusLevel(counts[line.key])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
