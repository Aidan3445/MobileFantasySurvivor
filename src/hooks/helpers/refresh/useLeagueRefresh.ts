import { useMemo } from 'react';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';

export function useLeagueRefresh(overrideHash?: string) {
  const { data: league } = useLeague(overrideHash);

  const keysToInvalidate = useMemo(() => [
    ['league', league?.hash],
    ['leagueMembers', league?.hash],
    ['settings', league?.hash],
    ['rules', league?.hash],
    ['customEvents', league?.hash],
    ['basePredictions', league?.hash],
    ['predictionTiming', league?.hash],
    ['selectionTimeline', league?.hash],
    ['episodes', league?.seasonId],
    ['seasons', league?.seasonId],
  ], [league?.hash, league?.seasonId]);

  return useRefresh(keysToInvalidate);
}
