import { useQuery } from '@tanstack/react-query';
import { type Tribe } from '~/types/tribes';
import { useFetch } from '~/hooks/helpers/useFetch';

/**
 * Fetches tribes data from the API.
 * @param {number} seasonId The season ID to get tribes for.
 * @returnObj `Tribe[]`
 */
export function useTribes(seasonId: number | null) {
  const fetchData = useFetch();
  return useQuery<Tribe[]>({
    queryKey: ['tribes', seasonId],
    queryFn: async () => {
      if (!seasonId) return [];

      const res = await fetchData(`/api/seasons/tribes?seasonId=${seasonId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tribes data');
      }
      const { tribes } = (await res.json()) as { tribes: Tribe[] };
      return tribes;
    },
    staleTime: Infinity,
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!seasonId
  });
}
