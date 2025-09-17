import { Text, View } from 'react-native';
import PredraftHeader from '~/components/leagues/predraft/header/view';

export default function PredraftSettingsScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <PredraftHeader inSettings />
      <Text className='text-primary text-2xl font-bold text-center'>
        Predraft Screen / Settings
      </Text>
    </View>
  );
}
