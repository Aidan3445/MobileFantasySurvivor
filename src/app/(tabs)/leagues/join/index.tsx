import { View } from 'react-native';
import KeyboardContainer from '~/components/common/keyboardContainer';
import JoinLeagueForm from '~/components/leagues/actions/join/view';

export default function SearchLeagueScreen() {
  return (
    <KeyboardContainer>
      <View className='flex-1 bg-background justify-center px-6 py-24'>
        <JoinLeagueForm />
      </View>
    </KeyboardContainer>
  );
}
