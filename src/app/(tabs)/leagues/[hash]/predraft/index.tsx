import { View } from 'react-native';
import { DraftCountdown } from '~/components/leagues/predraft/countdown/view';
import PredraftHeader from '~/components/leagues/predraft/header/view';
import InviteLink from '~/components/leagues/predraft/inviteLink/view';
import DraftOrder from '~/components/leagues/predraft/order/view';

export default function PredraftScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <PredraftHeader />
      <View className='w-full px-2 gap-y-4'>
        <InviteLink />
        <DraftCountdown />
        <DraftOrder />
      </View>
    </View>
  );
}
