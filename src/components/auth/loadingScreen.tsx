import { View } from 'react-native';
import Header from '~/components/auth/header';

export default function LoadingScreen() {
  return (
    <View className='flex-1 justify-around bg-background p-6'>
      <Header className='animate-bounce' />
    </View>
  );
}
