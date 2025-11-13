'use client';

import { useRouter } from 'expo-router';
import { ArrowLeft, Users } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useLeague } from '~/hooks/leagues/query/useLeague';

interface DraftHeaderProps {
  inCastawaysView?: boolean;
}

export default function DraftHeader({ inCastawaysView }: DraftHeaderProps) {
  const { data: league } = useLeague();
  const router = useRouter();

  return (
    <View className='absolute top-0 z-10 h-24 w-full items-center justify-end bg-secondary pb-4'>
      <Text className='text-2xl font-bold text-white'>{league?.name ?? 'League'} - Draft</Text>
      {inCastawaysView ? (
        <Pressable
          className='absolute bottom-0 left-4 p-4'
          onPress={() => router.back()}>
          <ArrowLeft
            color='white'
            size={24}
          />
        </Pressable>
      ) : (
        <Pressable
          className='absolute bottom-0 right-4 p-4'
          onPress={() => router.push(`/leagues/${league?.hash}/draft/castaways`)}>
          <Users
            color='white'
            size={24}
          />
        </Pressable>
      )}
    </View>
  );
}
