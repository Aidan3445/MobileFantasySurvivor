import { ScrollView, Text, View } from 'react-native';
import BaseEventRules from '~/components/leagues/customization/events/base/view';
import CustomEventRules from '~/components/leagues/customization/events/custom/view';
import ShauhinMode from '~/components/leagues/customization/events/shauhin/view';
import SurvivalStreaks from '~/components/leagues/customization/settings/survivalStreak/view';
import { DraftCountdown } from '~/components/leagues/predraft/countdown/view';
import PredraftHeader from '~/components/leagues/predraft/header/view';
import InviteLink from '~/components/leagues/predraft/inviteLink/view';
import DraftOrder from '~/components/leagues/predraft/order/view';

export default function PredraftScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <PredraftHeader />
      <ScrollView className='pt-28 w-full' showsVerticalScrollIndicator={false} refreshControl={undefined}>
        <View className='px-2 gap-y-4 pb-4'>
          <InviteLink />
          <DraftCountdown />
          <DraftOrder />
          <View className='rounded-lg bg-primary justify-center items-center p-4'>
            <Text className='text-white text-2xl font-bold text-center'>League Scoring</Text>
          </View>
          <SurvivalStreaks />
          <BaseEventRules />
          <ShauhinMode />
          <CustomEventRules />
        </View>
      </ScrollView >
    </View>
  );
}
