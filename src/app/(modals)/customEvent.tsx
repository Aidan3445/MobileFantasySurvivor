import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '~/components/common/button';
import CreateLeagueHeader from '~/components/leagues/actions/create/header/view';
import { useLeagueRules } from '~/hooks/leagues/query/useRules';


export default function CreateCustomEventScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: leagueRules, isFetching, isError } = useLeagueRules(hash);
  const router = useRouter();

  if (isFetching) {
    return (
      <View className='page py-16 justify-center items-center'>
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
    <View className='page py-16'>
      <CreateLeagueHeader />

      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 justify-center items-center px-4'>
          <Text className='text-lg text-center'>Custom Event Creation Coming Soon! {hash}</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
