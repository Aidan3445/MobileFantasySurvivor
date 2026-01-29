import { Text, View } from 'react-native';
import SignOutButton from '~/components/auth/SignOutButton';

export default function ProfileScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <Text className='text-2xl text-white'>Profile Screen</Text>
      <SignOutButton />
    </View>
  );
}
