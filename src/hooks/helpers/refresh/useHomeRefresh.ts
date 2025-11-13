import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigationState } from '@react-navigation/native';

export function useHomeRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const navigationState = useNavigationState(state => state);

  const onRefresh = useCallback(async () => {
    if (!navigationState) return;

    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['leagues'] }),
        queryClient.invalidateQueries({ queryKey: ['seasons'] })
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, navigationState]);

  return { refreshing, onRefresh };
}
