import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignOutButton from '~/components/auth/SignOutButton';
import ProfileHeader from '~/components/profile/header/view';

export default function ProfileScreen() {
  return (
    <SafeAreaView edges={['top']} className='relative flex-1 bg-background'>
      <ProfileHeader />
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 10 }}>
        <View className='page justify-start gap-y-4 px-1.5 pt-8 pb-1.5'>
          <SignOutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
