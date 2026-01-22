'use client';

import { useRouter } from 'expo-router';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Button from '~/components/common/button';
import MarqueeText from '~/components/common/marquee';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';
import { colors } from '~/lib/colors';

interface PredraftHeaderProps {
  inSettings?: boolean;
}

export default function PredraftHeader({ inSettings }: PredraftHeaderProps) {
  const height = useHeaderHeight();
  const { data: league } = useLeague();
  const router = useRouter();
  return (
    <View
      className='absolute top-0 z-10 w-full items-center justify-end bg-card shadow-lg'
      style={{ height }}>
      <View className='flex-row justify-center px-20 pb-1'>
        <View className='h-6 w-1 bg-primary rounded-full' />
        <MarqueeText
          text={league?.name ?? 'League'}
          center
          allowFontScaling={false}
          className='text-2xl font-black uppercase leading-none tracking-tight text-foreground !translate-y-0.5'
          containerClassName='flex-row'
          noMarqueeContainerClassName='w-min px-0.5' />
        <View className='h-6 w-1 bg-primary rounded-full' />
      </View>
      {inSettings ? (
        <Button
          className='absolute bottom-0 left-4 py-0.5 px-4'
          onPress={() => router.back()}>
          <Text className='text-lg'>
            <ArrowLeft color={colors.primary} size={24} />
          </Text>
        </Button>
      ) : (
        <Button
          className='absolute bottom-0 right-4 py-0.5 px-4'
          onPress={() => router.push(`/leagues/${league?.hash}/predraft/settings`)}>
          <Settings color={colors.primary} size={24} />
        </Button>
      )}
    </View>
  );
}
