'use client';

import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useLeagueRefresh } from '~/hooks/helpers/refresh/useLeagueRefresh';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { useLocalSearchParams } from 'expo-router';

export default function PredraftScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { refreshing, onRefresh, scrollY, handleScroll } = useLeagueRefresh();

  return (
    <View className='flex-1 bg-background relative'>
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} />
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View className={cn(
          'page justify-start gap-y-4 transition-all px-1.5 pt-8',
          refreshing && 'pt-12'
        )}>
          <View className='flex-1'>
            <Text className='text-center text-2xl font-bold text-primary'>League Hash: {hash}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
