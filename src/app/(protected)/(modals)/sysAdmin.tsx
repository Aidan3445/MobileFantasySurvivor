import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import SysAdminHeader from '~/components/auth/sys/header';
import Button from '~/components/common/button';
import { useSysAdmin } from '~/hooks/user/useSysAdmin';

export default function SysAdminScreen() {
  const { data: userId, isLoading, isError } = useSysAdmin();
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const router = useRouter();

  if (isLoading) {
    return (
      <View className='page py-16 justify-center items-center'>
        <SysAdminHeader />
        <Text className='text-lg text-center'>Checking Sys Admin Status...</Text>
      </View>
    );
  }

  if (isError || !userId) {
    router.dismiss();
    return null;
  }

  return (
    <View className='page py-16'>
      <SysAdminHeader />
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 justify-center items-center px-8 gap-8'>
          <Button
            className='w-full bg-primary p-4 rounded-lg items-center justify-center'
            onPress={() => router.push(`/customEvent?hash=${hash}`)}>
            <Text className='text-white text-xl'>Create Custom Event</Text>
          </Button>
          <Button
            className='w-full bg-primary p-4 rounded-lg items-center justify-center'
            onPress={() => router.push('/baseEvent')}>
            <Text className='text-white text-xl'>Create Base Event</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
