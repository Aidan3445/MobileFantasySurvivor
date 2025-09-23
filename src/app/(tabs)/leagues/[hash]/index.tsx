'use client';

import { Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useLeague } from '~/hooks/leagues/query/useLeague';

export default function LeagueDetailScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: league } = useLeague(hash);

  if (!league) return <Redirect href='/leagues' />;
  if (league.status === 'Predraft') return <Redirect href={`/leagues/${hash}/predraft`} />;
  if (league.status === 'Draft') return <Redirect href={`/leagues/${hash}/draft`} />;

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <Text className='text-center text-2xl font-bold text-primary'>League Hash: {hash}</Text>
    </View>
  );
}
