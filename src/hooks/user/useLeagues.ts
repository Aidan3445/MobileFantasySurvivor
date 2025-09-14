import { useQuery } from '@tanstack/react-query';
import { type CurrentSelection, type LeagueMember } from '~/types/leagueMembers';
import { type League } from '~/types/leagues';
import { useFetch } from '~/hooks/helpers/useFetch';

/**
  * Fetches the leagues for the current user.
  */
export function useLeagues() {
  const fetchData = useFetch();
  return useQuery<{ league: League, member: LeagueMember, castaway: CurrentSelection }[]>({
    queryKey: ['leagues'],
    queryFn: async () => {
      const response = await fetchData('/api/leagues');
      if (!response.ok) {
        return [];
      }
      const { leagues } = await response.json() as {
        leagues: {
          league: League,
          member: LeagueMember,
          castaway: CurrentSelection
        }[]
      };
      return leagues;
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: true
  });
}

