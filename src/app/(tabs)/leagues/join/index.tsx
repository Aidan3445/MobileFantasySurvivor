'use client';

import { Keyboard, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import Button from '~/components/common/button';
import { cn } from '~/lib/utils';
import { Text } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JoinLeagueScreen() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    // if the join code is in the URL, cut out everything but the code
    // http://localhost:1234/i/-rfJ3Ju9uNAsPBOy --> -rfJ3Ju9uNAsPBOy
    const urlMaybe = joinCode;
    const match = urlMaybe.match(/\/i\/([a-zA-Z0-9-_]+)/);
    if (match) {
      setJoinCode(match[1] ?? joinCode);
    }
  }, [joinCode]);

  const handleJoinLeague = () => {
    if (joinCode.trim()) {
      setJoinCode('');
      router.push(`/leagues/join/${joinCode.trim()}`);
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
              'text-xl rounded-lg border-2 border-primary/20 bg-card leading-tight p-4',
              joinCode.length === 0 && 'italic border-primary/40'
            )}
            placeholder={'Enter league code...'}
            textAlignVertical='center'
            autoCapitalize='words'
            onChangeText={setJoinCode}
            value={joinCode} />
        </View>

        <View className='flex-row items-center justify-center gap-4 px-6 pb-4'>
          {/* Main Action Button */}
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
