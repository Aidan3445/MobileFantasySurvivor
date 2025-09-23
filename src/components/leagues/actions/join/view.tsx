'use client';

import { TextInput, View } from 'react-native';
import Button from '~/components/common/button';
import Header from '~/components/home/header/view';
import { cn } from '~/lib/utils';
import { Text } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function JoinLeagueForm() {
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
    <View className='h-90p items-center justify-start overflow-hidden rounded-lg bg-card pt-12'>
      <Header className='flex-1' />
      <View className='w-90p h-full justify-center'>
        <Text className='text-center text-2xl font-bold'>Join League</Text>
        <Text className='mb-8 text-center text-muted-foreground'>
          Enter the league code or invite link you received.
        </Text>
        <TextInput
          className={cn(
            'rounded-lg border border-primary p-4 text-lg leading-5 placeholder:text-muted-foreground',
            joinCode.length === 0 && 'italic'
          )}
          placeholder={'Enter league code...'}
          autoCapitalize='words'
          onChangeText={setJoinCode}
          value={joinCode}
        />
      </View>
      <Button
        onPress={handleJoinLeague}
        disabled={!joinCode.trim()}
        className='absolute bottom-4 w-1/2 rounded-md bg-primary px-4 py-2'
      >
        <Text className='text-center font-semibold text-white'>
          Join League
        </Text>
      </Button>
    </View>
  );
}
