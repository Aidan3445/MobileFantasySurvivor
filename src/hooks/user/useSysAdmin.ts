import { useQuery } from '@tanstack/react-query';
import { useFetch } from '~/hooks/helpers/useFetch';

export function useSysAdmin() {
  const fetchData = useFetch('GET');

  return useQuery<number | null>({
    queryKey: ['sysAdmin'],
    queryFn: async () => {
      const response = await fetchData('/api/sys/redirects');
      if (!response.ok) return null;

      const { userId } = await response.json() as {
        userId: number | null;
      };

      return userId;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}
