import React from 'react';
import { View } from 'react-native';
import ActiveLeagues from '~/components/home/activeleagues/view';
import { CastawayScoreboard } from '~/components/home/scoreboard/view';

export default function Page() {
  return (
    <View className='page gap-y-4'>
      <ActiveLeagues />
      <CastawayScoreboard />
    </View>
  );
}
