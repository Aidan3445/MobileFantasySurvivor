import { View } from 'react-native';
import Header from '~/components/auth/header';

export default function LoadingScreen() {
  return (
    <View className='flex-1 bg-background justify-around p-6'>
      <Header className='animate-bounce' />
    </View>
  );
}
