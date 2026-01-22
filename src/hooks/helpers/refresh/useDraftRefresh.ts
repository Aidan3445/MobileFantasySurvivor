import { useMemo } from 'react';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';

export function useDraftRefresh(overrideHash?: string) {
  const { data: league } = useLeague(overrideHash);

  const keysToInvalidate = useMemo(() => [
    // Core league data
    ['league', league?.hash],
    ['leagueMembers', league?.hash],
    ['settings', league?.hash],

    // Rules and customization
    ['rules', league?.hash],
    ['customEvents', league?.hash],
    ['basePredictions', league?.hash],

    // Draft-specific queries
    ['predictionTiming', league?.hash],
    ['selectionTimeline', league?.hash],
  ], [league?.hash]);

  return useRefresh(keysToInvalidate);
}
