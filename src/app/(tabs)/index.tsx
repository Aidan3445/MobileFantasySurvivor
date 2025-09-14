import React from 'react';
import { View } from 'react-native';
import ActiveLeagues from '~/components/home/activeleagues/view';

export default function Page() {
  return (
    <View className='flex flex-1'>
      <ActiveLeagues />
    </View>
  );
}
