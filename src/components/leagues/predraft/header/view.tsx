'use client';

import { useRouter } from 'expo-router';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useLeague } from '~/hooks/leagues/useLeague';

interface PredraftHeaderProps {
  inSettings?: boolean;
}

export default function PredraftHeader({ inSettings }: PredraftHeaderProps) {
  const { data: league } = useLeague();
  const router = useRouter();
  return (
    <View className='absolute top-0 w-full h-24 bg-secondary justify-end items-center pb-4'>
      <Text className='text-white text-2xl font-bold'>
        {league?.name ?? 'League'}
      </Text>
      {inSettings ? (
        <Pressable
          className='absolute left-4 bottom-0 p-4'
          onPress={() => router.back()}>
          <Text className='text-white text-lg'>
            <ArrowLeft color='white' size={24} />
          </Text>
        </Pressable>
      ) : (
        <Pressable
          className='absolute right-4 bottom-0 p-4'
          onPress={() => router.push(`/leagues/${league?.hash}/predraft/settings`)}>
          <Settings color='white' size={24} />
        </Pressable>
      )}
    </View>
  );
}
