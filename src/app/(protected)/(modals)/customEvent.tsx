import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Platform, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/common/button';
import CreateCustomEvents from '~/components/leagues/actions/events/custom/create';
import CustomEventHeader from '~/components/leagues/actions/events/header/view';
import { useLeagueRules } from '~/hooks/leagues/query/useLeagueRules';
import { cn } from '~/lib/utils';


export default function CustomEventScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: leagueRules, isLoading, isError } = useLeagueRules(hash);
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-background py-16 justify-center items-center'>
        <CustomEventHeader />
        <Text className='text-lg text-center'>Loading League Rules...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !leagueRules) {
    return (
      <SafeAreaView className='flex-1 bg-background py-16 justify-center items-center'>
        <Text className='text-lg text-center'>Something went wrong.</Text>
        <Button className='mt-4' onPress={() => router.dismiss()}>
          <Text className='text-white'>
            Go Back to League
          </Text>
        </Button>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className='flex-1 bg-background justify-center items-center'>
      <CustomEventHeader />
      <ScrollView
        className={cn(
          'w-full',
          Platform.OS === 'ios' ? 'pt-20' : 'pt-8'
        )}
        showsVerticalScrollIndicator={false}>
        <View className='gap-y-4 px-1.5 pb-16'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <CreateCustomEvents />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
