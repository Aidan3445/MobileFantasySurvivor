'use client';

import { Animated, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import LoadingScreen from '~/components/auth/loadingScreen';
import useFadeLoading from '~/hooks/ui/useFadeLoading';
import { useLeagueRefresh } from '~/hooks/helpers/refresh/useLeagueRefresh';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';

export default function LeagueDetailScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: league, isFetching } = useLeague(hash);
  const { refreshing, onRefresh, scrollY, handleScroll } = useLeagueRefresh();
  const { showLoading, fadeAnim } = useFadeLoading({ isLoading: isFetching && !league });

  // Redirect to other screens based on status
  if (league?.status === 'Predraft') {
    return <Redirect href={`/leagues/${hash}/predraft`} />;
  }
  if (league?.status === 'Draft') {
    return <Redirect href={`/leagues/${hash}/draft`} />;
  }

  // No league found after loading
  if (!isFetching && !league) {
    return <Redirect href='/leagues' />;
  }

  return (
    <>
      {/* Hub content renders underneath (or null while loading) */}
      {league &&
        <View className='flex-1 bg-background relative'>
          <RefreshIndicator refreshing={refreshing} scrollY={scrollY} extraHeight={-45} />
          <ScrollView
            className='w-full'
            showsVerticalScrollIndicator={true}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            scrollIndicatorInsets={{ top: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor='transparent'
                colors={['transparent']}
                progressBackgroundColor='transparent' />
            }>
            <View className={cn(
              'page justify-start gap-y-4 transition-all px-1.5 pt-8 pb-1.5',
              refreshing && 'pt-12'
            )}>
              <View className='flex-1'>
                <Text className='text-center text-2xl font-bold text-primary'>League Hash: {hash}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      }

      {/* Loading overlay fades out */}
      {showLoading && (
        <Animated.View
          style={{ opacity: fadeAnim }}
          className='absolute inset-0 z-50 bg-background'
          pointerEvents='none'>
          <LoadingScreen />
        </Animated.View>
      )}
    </>
  );
}
