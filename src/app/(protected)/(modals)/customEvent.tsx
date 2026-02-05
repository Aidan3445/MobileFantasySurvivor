import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Button from '~/components/common/button';
import CreateCustomEvents from '~/components/leagues/actions/events/custom/create';
import CustomEventHeader from '~/components/leagues/actions/events/header/view';
import { useLeagueRules } from '~/hooks/leagues/query/useLeagueRules';


export default function CustomEventScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: leagueRules, isLoading, isError } = useLeagueRules(hash);
  const router = useRouter();

  if (isLoading) {
    return (
      <View className='page py-16 justify-center items-center'>
        <CustomEventHeader />
        <Text className='text-lg text-center'>Loading League Rules...</Text>
      </View>
    );
  }

  if (isError || !leagueRules) {
    return (
      <View className='page py-16 justify-center items-center'>
        <Text className='text-lg text-center'>Something went wrong.</Text>
        <Button className='mt-4' onPress={() => router.dismiss()}>
          <Text className='text-white'>
            Go Back to League
          </Text>
        </Button>
      </View>
    );
  }


  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <CustomEventHeader />
      <ScrollView className='w-full pt-20' showsVerticalScrollIndicator={false}>
        <View className='gap-y-4 px-1.5 pb-16'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <CreateCustomEvents />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
}
