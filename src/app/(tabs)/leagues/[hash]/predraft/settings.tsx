import { View } from 'react-native';
import PredraftHeader from '~/components/leagues/predraft/header/view';
import EditMember from '~/components/leagues/predraft/settings/editMember';

export default function PredraftSettingsScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <PredraftHeader inSettings />
      <View className='gap-y-4 px-2 pb-4'>
        <EditMember />
      </View>
    </View>
  );
}
