import React from 'react';
import { Image, RefreshControl, ScrollView, View } from 'react-native';
import LeaguesList from '~/components/leagues/grid/leaguesList';
import { useHomeRefresh } from '~/hooks/helpers/refresh/useHomeRefresh';
import { cn } from '~/lib/utils';
const LogoImage = require('~/assets/Logo.png');

export default function LeaguesScreen() {
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
          <View className={cn(
            'mb-4 animate-spin items-center absolute transition-all',
          )}>
            <Image
              source={LogoImage}
              className='h-20 w-20'
              resizeMode='contain'
            />
          </View>
          <LeaguesList />
        </View>
      </ScrollView>
    </View>
  );
}
