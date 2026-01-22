import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigationState } from '@react-navigation/native';
import { Animated } from 'react-native';

export function useRefresh(keysToInvalidate: (string | undefined)[][] = []) {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const queryClient = useQueryClient();
  const navigationState = useNavigationState(state => state);

  const onRefresh = useCallback(async () => {
    if (!navigationState) return;

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
  }, [queryClient, navigationState, keysToInvalidate]);


  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false
  });

  return { refreshing, onRefresh, scrollY, handleScroll };
}
