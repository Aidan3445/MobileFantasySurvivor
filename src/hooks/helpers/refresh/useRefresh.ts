import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Animated } from 'react-native';

export function useRefresh(keysToInvalidate: (string | undefined)[][] = []) {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(
        keysToInvalidate.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey })
        )
      );
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, keysToInvalidate]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return { refreshing, onRefresh, scrollY, handleScroll };
}
