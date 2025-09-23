import { View } from 'react-native';
import KeyboardContainer from '~/components/common/keyboardContainer';
import JoinLeagueForm from '~/components/leagues/actions/join/view';

export default function SearchLeagueScreen() {
  return (
    <KeyboardContainer>
      <View className='flex-1 justify-center bg-background px-6 py-24'>
        <JoinLeagueForm />
      </View>
    </KeyboardContainer>
  );
}
