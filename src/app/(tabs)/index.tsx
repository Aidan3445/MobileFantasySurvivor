import React from 'react';
import { View } from 'react-native';
import ActiveLeagues from '~/components/home/activeleagues/view';
import Header from '~/components/home/header/view';
import QuickActions from '~/components/home/quickActions/view';
import { CastawayScoreboard } from '~/components/home/scoreboard/view';

export default function Page() {
  return (
    <View className='page gap-y-4 pt-10 justify-start'>
      <Header className='-mb-4' />
      <ActiveLeagues />
      <CastawayScoreboard />
      <QuickActions />
    </View>
  );
}
