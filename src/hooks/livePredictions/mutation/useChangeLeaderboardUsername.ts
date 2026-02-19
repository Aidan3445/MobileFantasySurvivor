import { useMutation } from '@tanstack/react-query';
import { useFetch } from '~/hooks/helpers/useFetch';

export function useChangeLeaderboardUsername() {
  const postData = useFetch('POST');

  return useMutation({
    mutationFn: async (newUsername: string) => {
      const res = await postData('/api/live/leaderboard?newUsername', {
        body: { newUsername }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to change username');
      }
    },
  });
}
