'use client';

import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import BaseEventRules from '~/components/leagues/customization/events/base/view';
import CustomEventRules from '~/components/leagues/customization/events/custom/view';
import ShauhinMode from '~/components/leagues/customization/events/shauhin/view';
import SurvivalStreaks from '~/components/leagues/customization/settings/survivalStreak/view';
import { DraftCountdown } from '~/components/leagues/predraft/countdown/view';
import PredraftHeader from '~/components/leagues/predraft/header/view';
import InviteLink from '~/components/leagues/predraft/inviteLink/view';
import DraftOrder from '~/components/leagues/customization/order/view';
import { usePredraftRefresh } from '~/hooks/helpers/refresh/usePredraftRefresh';
const LogoImage = require('~/assets/Logo.png');

export default function PredraftScreen() {
  const { refreshing, onRefresh } = usePredraftRefresh();

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <PredraftHeader />
      <ScrollView
        className='w-full pt-28'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View className='gap-y-4 px-2 pb-4'>
          {refreshing && (
            <View className='-mt-20 animate-spin items-center'>
              <Image
                source={LogoImage}
                className='h-14 w-14'
                resizeMode='contain'
              />
            </View>
          )}
          <InviteLink />
          <DraftCountdown />
          <DraftOrder />
          <View className='items-center justify-center rounded-lg bg-primary p-4'>
            <Text className='text-center text-2xl font-bold text-white'>
              League Scoring
            </Text>
          </View>
          <SurvivalStreaks />
          <BaseEventRules />
          <ShauhinMode />
          <CustomEventRules />
        </View>
      </ScrollView>
    </View>
  );
}
