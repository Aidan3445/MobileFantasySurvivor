import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLeague } from '~/hooks/leagues/query/useLeague';

export function usePredraftRefresh(overrideHash?: string) {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { data: league } = useLeague(overrideHash);

  const onRefresh = useCallback(async () => {
    if (!league) return;

    setRefreshing(true);

    try {
      await Promise.all([
        // Core league data
        queryClient.invalidateQueries({ queryKey: ['league', league.hash] }),
        queryClient.invalidateQueries({
          queryKey: ['leagueMembers', league.hash],
        }),
        queryClient.invalidateQueries({ queryKey: ['settings', league.hash] }),

        // Rules and customization
        queryClient.invalidateQueries({ queryKey: ['rules', league.hash] }),
        queryClient.invalidateQueries({
          queryKey: ['customEvents', league.hash],
        }),
        queryClient.invalidateQueries({
          queryKey: ['basePredictions', league.hash],
        }),

        // Additional predraft-related queries
        queryClient.invalidateQueries({
          queryKey: ['predictionTiming', league.hash],
        }),
        queryClient.invalidateQueries({
          queryKey: ['selectionTimeline', league.hash],
        }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [league, queryClient]);

  return { refreshing, onRefresh };
}
