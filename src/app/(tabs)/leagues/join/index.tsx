import { Keyboard, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/common/button';
import { cn } from '~/lib/utils';

export default function JoinLeagueEntryScreen() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');

  const parseCode = (input: string) => {
    // Extract code from URL if pasted: http://localhost:1234/i/-rfJ3Ju9uNAsPBOy --> -rfJ3Ju9uNAsPBOy
    const match = input.match(/\/i\/([a-zA-Z0-9-_]+)/);
    return match?.[1] ?? input;
  };

  const handleJoinLeague = () => {
    const code = parseCode(joinCode).trim();
    if (code) {
      setJoinCode('');
      router.push(`/leagues/join/${code}`);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className='page'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 px-1.5 pt-8'>
          <Text className='text-center text-2xl font-black tracking-wide'>Join League</Text>
          <Text className='mb-8 text-center text-base text-muted-foreground'>
            Enter the league code or invite link you received.
          </Text>
          <TextInput
            className={cn(
              'text-xl rounded-lg border-2 border-primary/20 bg-card leading-tight p-4 placeholder:text-muted-foreground',
              joinCode.length === 0 && 'italic border-primary/40'
            )}
            placeholder='Enter league code...'
            textAlignVertical='center'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={setJoinCode}
            value={joinCode}
            onSubmitEditing={handleJoinLeague}
            returnKeyType='go' />
        </View>
        <View className='flex-row items-center justify-center gap-4 px-6 pb-4'>
          <Button
            onPress={() => {
              Keyboard.dismiss();
              handleJoinLeague();
            }}
            disabled={!joinCode.trim()}
            className={cn(
              'flex-1 rounded-lg bg-primary py-3 active:opacity-80',
              !joinCode.trim() && 'opacity-50'
            )}>
            <Text className='text-center text-base font-bold text-white'>
              Join League
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
