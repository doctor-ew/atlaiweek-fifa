import type { DelayState } from '@/types';
import { getMatches } from '@/lib/matches';
import MapViewClient from '@/components/MapViewClient';
import Sidebar from '@/components/Sidebar';
import DelayBanner from '@/components/DelayBanner';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const injectDelay = params['inject_delay'];
  const delayState: DelayState =
    injectDelay === 'blue_line' ? 'blue_line_delay' : 'normal';

  const matches = getMatches();

  return (
    <main className="relative h-full w-full">
      {delayState === 'blue_line_delay' && <DelayBanner />}
      <MapViewClient />
      <Sidebar matches={matches} delayState={delayState} />

      {/* Floating brand badge — fixed above the fold, left of sidebar */}
      <a
        href="https://cto2go.co"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 z-10 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-medium text-[#e5aa48] backdrop-blur-sm hover:text-[#ee8c4a] transition-colors"
      >
        CTO2Go.co
      </a>
    </main>
  );
}
