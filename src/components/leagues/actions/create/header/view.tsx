'use client';

import { Text, View } from 'react-native';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';

export default function CreateLeagueHeader() {
  const height = useHeaderHeight();
  return (
    <View
      className='absolute top-0 z-10 w-full items-center justify-end bg-card shadow-lg'
      style={{ height }}>
      <View className='items-center justify-center w-full'>
        <View className='relative flex-row items-center justify-center gap-0.5 w-full'>
          <View className='h-6 w-1 bg-primary rounded-full' />
          <Text
            allowFontScaling={false}
            className='text-2xl font-black uppercase tracking-tight text-foreground'>
            Create League
          </Text>
          <View className='h-6 w-1 bg-primary rounded-full' />
        </View>
      </View>
    </View>
  );
}

