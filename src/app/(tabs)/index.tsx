import React from 'react';
import { Image, RefreshControl, ScrollView, View } from 'react-native';
import ActiveLeagues from '~/components/home/activeleagues/view';
import Header from '~/components/home/header/view';
import QuickActions from '~/components/home/quickActions/view';
import { CastawayScoreboard } from '~/components/home/scoreboard/view';
import { useHomeRefresh } from '~/hooks/home/useHomeRefresh';
const LogoImage = require('~/assets/Logo.png');

export default function Page() {
  const { refreshing, onRefresh } = useHomeRefresh();

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <ScrollView
        className='pt-0 w-full'
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
        <View className='page gap-y-4 pt-10 justify-start'>
          {refreshing ? (
            <View className='items-center animate-spin mb-4'>
              <Image
                source={LogoImage}
                className='w-40 h-40'
                resizeMode='contain' />
            </View>
          ) : (
            <Header className='mb-4' />
          )}
          <ActiveLeagues />
          <CastawayScoreboard />
          <QuickActions />
        </View>
      </ScrollView>
    </View>
  );
}
