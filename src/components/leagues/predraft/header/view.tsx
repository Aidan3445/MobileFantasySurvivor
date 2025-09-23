'use client';

import { useRouter } from 'expo-router';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useLeague } from '~/hooks/leagues/query/useLeague';

interface PredraftHeaderProps {
  inSettings?: boolean;
}

export default function PredraftHeader({ inSettings }: PredraftHeaderProps) {
  const { data: league } = useLeague();
  const router = useRouter();
  return (
    <View className='absolute top-0 z-10 h-24 w-full items-center justify-end bg-secondary pb-4'>
      <Text className='text-2xl font-bold text-white'>
        {league?.name ?? 'League'}
      </Text>
      {inSettings ? (
        <Pressable
          className='absolute bottom-0 left-4 p-4'
          onPress={() => router.back()}>
          <Text className='text-lg text-white'>
            <ArrowLeft
              color='white'
              size={24}
            />
          </Text>
        </Pressable>
      ) : (
        <Pressable
          className='absolute bottom-0 right-4 p-4'
          onPress={() =>
            router.push(`/leagues/${league?.hash}/predraft/settings`)
          }>
          <Settings
            color='white'
            size={24}
          />
        </Pressable>
      )}
    </View>
  );
}
