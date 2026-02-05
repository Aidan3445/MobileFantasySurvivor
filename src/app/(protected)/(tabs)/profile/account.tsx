import { ScrollView, View } from 'react-native';
import DeleteAccountButton from '~/components/profile/management/delete';
import AccountSettings from '~/components/profile/management/view';

export default function AccountScreen() {
  return (
    <View className='flex-1 bg-background relative'>
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 10 }}>
        <View className='page justify-start gap-y-4 px-1.5 pt-8 pb-1.5'>
          <AccountSettings locked={false} />
          <DeleteAccountButton />
        </View>
      </ScrollView>
    </View>
  );
}
