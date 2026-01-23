import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import LeaguesList from '~/components/leagues/grid/leaguesList';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import LeaguesHeader from '~/components/leagues/grid/header/view';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';

export default function LeaguesScreen() {
  const { refreshing, onRefresh, scrollY, handleScroll } = useRefresh([[]]);

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-background relative'>
      <LeaguesHeader />
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} />
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View className={cn(
          'page justify-start gap-y-4 transition-all px-1 pt-8',
          refreshing && 'pt-12'
        )}>
          <LeaguesList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
