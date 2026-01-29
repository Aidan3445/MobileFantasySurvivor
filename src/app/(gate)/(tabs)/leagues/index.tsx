'use client';

import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import LeaguesList from '~/components/leagues/grid/leaguesList';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';

export default function LeaguesScreen() {
  const { refreshing, onRefresh, scrollY, handleScroll } = useRefresh([[]]);

  return (
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
          'page justify-start gap-y-4 px-1.5 pt-8 pb-1.5',
          refreshing && 'pt-12'
        )}>
          <LeaguesList />
        </View>
      </ScrollView>
    </View>
  );
}
