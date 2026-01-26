import { useQuery } from '@tanstack/react-query';
import { useFetch } from '~/hooks/helpers/useFetch';
import { APP_LAUNCH_ID } from '~/lib/utils';

export function useSysAdmin() {
  const fetchData = useFetch('GET');

  return useQuery<number | null>({
    queryKey: ['sysAdmin', APP_LAUNCH_ID],
    queryFn: async () => {
      console.log('Fetching sys admin user ID', APP_LAUNCH_ID);
      const response = await fetchData('/api/sys/redirects');
      if (!response.ok) return null;

      const { userId } = (await response.json()) as {
        userId: number | null;
      };

      return userId;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
