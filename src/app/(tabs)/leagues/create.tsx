import { View } from 'react-native';
import KeyboardContainer from '~/components/common/keyboardContainer';
import CreateLeagueForm from '~/components/leagues/actions/create/view';

export default function CreateLeagueScreen() {
  return (
    <KeyboardContainer>
      <View className='flex-1 justify-center bg-background px-6 py-24'>
        <CreateLeagueForm />
      </View>
    </KeyboardContainer>
  );
}
