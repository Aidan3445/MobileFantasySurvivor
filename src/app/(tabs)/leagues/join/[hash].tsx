import { Text, View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle } from 'lucide-react-native';
import Button from '~/components/common/button';
import LeagueMember from '~/components/leagues/actions/create/leagueMember';
import JoinLeagueHeader from '~/components/leagues/actions/join/header/view';
import { useJoinLeague } from '~/hooks/leagues/mutation/useJoinLeague';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';

export default function JoinLeagueScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { isSignedIn, isLoaded } = useAuth();
  const { reactForm, handleSubmit, getPublicLeague, isSubmitting } = useJoinLeague();

  // Redirect to sign-in if not authenticated
  if (isLoaded && !isSignedIn) {
    return <Redirect href={`/sign-in?returnTo=/leagues/join/${hash}`} />;
  }

  // Handle invalid/expired invite
  if (getPublicLeague.isError) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className='page'>
        <View className='flex-1 items-center justify-center px-6'>
          <View className='w-full rounded-xl border-2 border-destructive/30 bg-destructive/10 p-6'>
            <View className='mb-4 items-center'>
              <View className='mb-3 h-16 w-16 items-center justify-center rounded-full bg-destructive/20'>
                <AlertCircle size={32} color={colors.destructive} />
              </View>
              <Text className='text-xl font-bold text-destructive'>Invalid Invite</Text>
            </View>
            <Text className='text-center text-muted-foreground'>
              This invite link is invalid or has expired. Please ask the league owner for a new
              invite.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const onSubmit = () => {
    Keyboard.dismiss();
    handleSubmit();
  };

  const isValid = reactForm.formState.isValid;
  const buttonDisabled = !isValid || isSubmitting;

  return (
    <SafeAreaView edges={['top', 'bottom']} className='page'>
      <JoinLeagueHeader leagueName={getPublicLeague?.data?.name} />

      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 px-1.5 pt-8 gap-4'>
          {/* Content */}
          <LeagueMember
            control={reactForm.control}
            usedColors={getPublicLeague?.data?.usedColors}
            noHeader />

          {/* Navigation */}
          <View className='flex-row items-center justify-center gap-4 px-6 pb-4'>
            <Button
              onPress={onSubmit}
              disabled={buttonDisabled}
              className={cn(
                'flex-1 rounded-lg bg-primary py-3 active:opacity-80',
                buttonDisabled && 'opacity-50'
              )}>
              <Text className='text-center text-base font-bold text-white'>
                {isSubmitting ? 'Joining...' : 'Join League'}
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
