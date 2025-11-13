import React, { useRef } from 'react';
import { Animated, RefreshControl, ScrollView, View } from 'react-native';
import LeaguesList from '~/components/leagues/grid/leaguesList';
import RefreshIndicator from '~/components/common/refresh';
import { useHomeRefresh } from '~/hooks/helpers/refresh/useHomeRefresh';
import { cn } from '~/lib/utils';

export default function LeaguesScreen() {
  const { refreshing, onRefresh } = useHomeRefresh();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false
  });

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <RefreshIndicator
        refreshing={refreshing}
        scrollY={scrollY}
      />
      <ScrollView
        className='w-full pt-0'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            style={{ backgroundColor: 'transparent' }}
          />
        }>
        <View className={cn('page justify-start gap-y-4 transition-all',
          refreshing ? 'pt-16' : 'pt-10')}>
          <LeaguesList />
        </View>
      </ScrollView>
    </View>
  );
}
