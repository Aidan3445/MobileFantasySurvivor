'use client';

import { useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { useLeagues } from '~/hooks/user/useLeagues';

export default function ActiveLeagues() {
  const { data: leagues } = useLeagues();
  const user = useUser();

  return (
    <View className='flex-1 items-center justify-center bg-background px-6'>
      <View className='bg-white rounded-3xl p-8 shadow-lg max-w-md w-full'>
        <View className='items-center mb-8'>
          <View className='bg-primary/10 rounded-full p-6 mb-4'>
            <Text className='text-4xl'>🏆</Text>
          </View>
          <Text className='text-4xl font-bold text-primary text-center mb-4'>
            Fantasy Survivor
          </Text>
          <Text className='text-secondary text-lg text-center'>
            Compete, predict, and win in the ultimate fantasy survival game!
          </Text>
        </View>

        <View className='gap-y-4'>
          <View className='bg-accent/20 rounded-2xl p-4 border border-accent/50'>
            <Text className='text-primary font-semibold text-lg mb-2'>
              {JSON.stringify(leagues, null, 2)}
            </Text>
            <Text className='text-secondary'>
              User ID: {user?.user?.id}
            </Text>
          </View>

          <Link
            suppressHighlighting
            className='bg-primary rounded-2xl py-4 mt-6 shadow-sm flex text-center justify-center'
            href='/playground'>
            <Text className='text-white text-lg font-semibold'>Start Playing</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
