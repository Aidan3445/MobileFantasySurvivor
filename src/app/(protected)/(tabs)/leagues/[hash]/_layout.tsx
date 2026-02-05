'use client';

import { Redirect, Slot, useLocalSearchParams, useSegments } from 'expo-router';
import { View } from 'react-native';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import LoadingScreen from '~/components/auth/loadingScreen';

export default function LeagueLayout() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const segments = useSegments();
  const { data: league, isLoading } = useLeague(hash);

  const isModalRoute = segments.includes('(modals)');
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

  if (!isModalRoute) {
    if (league.status === 'Predraft' && currentLeaf !== 'predraft') {
      return <Redirect href={`/leagues/${hash}/predraft`} />;
    }

    if (league.status === 'Draft' && currentLeaf !== 'draft') {
      return <Redirect href={`/leagues/${hash}/draft`} />;
    }

    if (
      league.status === 'Active' &&
      (currentLeaf === 'draft' || currentLeaf === 'predraft')
    ) {
      return <Redirect href={`/leagues/${hash}`} />;
    }
  }

  return <Slot />;
}
