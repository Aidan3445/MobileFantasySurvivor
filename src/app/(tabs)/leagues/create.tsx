import { View } from 'react-native';
import CreateLeagueForm from '~/components/leagues/hub/actions/create/view';

export default function CreateLeagueScreen() {
  return (
    <View className='flex-1 bg-background justify-center px-6 py-24'>
      <CreateLeagueForm />
    </View>
  );
}
