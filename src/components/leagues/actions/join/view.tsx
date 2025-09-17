'use client';

import { Pressable, TextInput, View } from 'react-native';
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
    <View className='h-90p pt-12 bg-card rounded-lg items-center justify-start overflow-hidden'>
      <Header className='flex-1' />
      <View className='w-90p justify-center h-full'>
        <Text className='text-center text-2xl font-bold'>
          Join League
        </Text>
        <Text className='text-center text-muted-foreground mb-8'>
          Enter the league code or invite link you received.
        </Text>
        <TextInput
          className={cn('border border-primary rounded-lg p-4 text-lg leading-5 placeholder:text-muted-foreground',
            joinCode.length === 0 && 'italic')}
          placeholder={'Enter league code...'}
          autoCapitalize='words'
          onChangeText={setJoinCode}
          value={joinCode}
        />
      </View>
      <Pressable
        onPress={handleJoinLeague}
        disabled={!joinCode.trim()}
        className='bg-primary rounded-md px-4 py-2 absolute bottom-4 w-1/2 disabled:opacity-50'>
        <Text className='text-white text-center font-semibold'>
          Join League
        </Text>
      </Pressable>
    </View >
  );
}


