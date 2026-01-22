'use client';

import { RefreshControl, ScrollView, Text, View } from 'react-native';
import BaseEventRules from '~/components/leagues/customization/events/base/view';
import CustomEventRules from '~/components/leagues/customization/events/custom/view';
import ShauhinMode from '~/components/leagues/customization/events/shauhin/view';
import SurvivalStreaks from '~/components/leagues/customization/settings/survivalStreak/view';
import { DraftCountdown } from '~/components/leagues/predraft/countdown/view';
import PredraftHeader from '~/components/leagues/predraft/header/view';
import InviteLink from '~/components/leagues/predraft/inviteLink/view';
import DraftOrder from '~/components/leagues/customization/order/view';
import { useLeagueRefresh } from '~/hooks/helpers/refresh/useLeagueRefresh';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';

export default function PredraftScreen() {
  const { refreshing, onRefresh, scrollY, handleScroll } = useLeagueRefresh();

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-background relative'>
      <PredraftHeader />
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} />
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View className={cn(
          'page justify-start gap-y-4 transition-all px-1 pt-6',
          refreshing && 'pt-12'
        )}>
          <InviteLink />
          <DraftCountdown />
          <DraftOrder />
          <View className='items-center justify-center rounded-lg bg-primary p-4'>
            <Text className='text-center text-2xl font-bold text-white'>League Scoring</Text>
          </View>
          <SurvivalStreaks />
          <BaseEventRules />
          <ShauhinMode />
          <CustomEventRules />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
