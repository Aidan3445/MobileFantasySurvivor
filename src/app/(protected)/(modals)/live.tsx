import { View, Text, Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import SysAdminHeader from '~/components/auth/sys/header';

export default function LivePredictionsScreen() {
  return (
    <SafeAreaView className='flex-1 bg-background py-16'>
      <SysAdminHeader />
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 justify-center items-center px-8 gap-8'>
          <Text className='text-white text-xl'>LIVE EVENTS</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
