'use client';

import { Redirect, Slot, useLocalSearchParams, useSegments } from 'expo-router';
import { View } from 'react-native';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import LoadingScreen from '~/components/auth/loadingScreen';

export default function LeagueLayout() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const segments = useSegments();
  const { data: league, isLoading } = useLeague(hash);

  // e.g. ['leagues', '[hash]', 'draft']
  const currentLeaf = segments[segments.length - 1];

  if (isLoading) {
    return (
      <View className='flex-1 bg-background'>
        <LoadingScreen />
      </View>
    );
  }

  if (!league) {
    return <Redirect href='/leagues' />;
  }

  // Guarded redirects
  if (league.status === 'Predraft' && currentLeaf !== 'predraft') {
    return <Redirect href={`/leagues/${hash}/predraft`} />;
  }

  if (league.status === 'Draft' && currentLeaf !== 'draft') {
    return <Redirect href={`/leagues/${hash}/draft`} />;
  }

  // Active leagues should *not* live on draft/predraft routes
  if (
    league.status === 'Active' &&
    (currentLeaf === 'draft' || currentLeaf === 'predraft')
  ) {
    return <Redirect href={`/leagues/${hash}`} />;
  }

  return <Slot />;
}
