import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useSysAdmin } from '~/hooks/user/useSysAdmin';

export default function SysAdminScreen() {
  const { data: userId, isFetching, isError } = useSysAdmin();
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const router = useRouter();

  if (isFetching) {
    return (
      <View className='page py-16 justify-center items-center'>
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
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 justify-center items-center px-4'>
          <Text className='text-lg text-center'>Sys Admin Access Granted! {hash}</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
