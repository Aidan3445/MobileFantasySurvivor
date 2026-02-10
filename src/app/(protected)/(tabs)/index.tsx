'use client';

import React from 'react';
import { View } from 'react-native';
import SafeAreaRefreshView from '~/components/common/refresh/safeAreaRefreshView';
import ActiveLeagues from '~/components/home/activeleagues/view';
import Header from '~/components/home/header/view';
import QuickActions from '~/components/home/quickActions/view';
import { CastawayScoreboard } from '~/components/home/scoreboard/view';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';

export default function Page() {
  const { refreshing, onRefresh } = useRefresh([[]]);

  return (
    <SafeAreaRefreshView refreshing={refreshing} onRefresh={onRefresh} extraHeight={0}>
      <View className='page justify-start gap-y-4 px-1.5 pb-1.5'>
        <Header refreshing={refreshing} />
        <ActiveLeagues />
        <QuickActions className='rounded-xl border-2 border-primary/20 bg-card opacity-80 p-2' />
        <CastawayScoreboard />
      </View>
    </SafeAreaRefreshView>
  );
}
