'use client';

import { Text, View } from 'react-native';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';

export default function LeaguesHeader() {
  const height = useHeaderHeight();
  return (
    <View
      className='absolute top-0 z-10 w-full items-center justify-end bg-secondary'
      style={{ height }}>
      <Text className='text-2xl font-bold text-white'>My Leagues</Text>
    </View>
  );
}
