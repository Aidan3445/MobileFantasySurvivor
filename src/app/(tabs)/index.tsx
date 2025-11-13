import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import ActiveLeagues from '~/components/home/activeleagues/view';
import Header from '~/components/home/header/view';
import QuickActions from '~/components/home/quickActions/view';
import { CastawayScoreboard } from '~/components/home/scoreboard/view';
import { useHomeRefresh } from '~/hooks/helpers/refresh/useHomeRefresh';

export default function Page() {
  const { refreshing, onRefresh } = useHomeRefresh();

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <ScrollView
        className='w-full pt-0'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View className='page justify-start gap-y-4 pt-10'>
          <Header refreshing={refreshing} />
          <ActiveLeagues />
          <CastawayScoreboard />
          <QuickActions />
        </View>
      </ScrollView>
    </View>
  );
}
