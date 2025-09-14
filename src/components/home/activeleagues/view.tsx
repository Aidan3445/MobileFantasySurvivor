/* eslint-disable react-native/no-inline-styles */
'use client';

import { useRef } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { useLeagues } from '~/hooks/user/useLeagues';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { type ICarouselInstance, Pagination, } from 'react-native-reanimated-carousel';
import tailwindConfig from '@/tailwind.config.cjs';
import { Link } from 'expo-router';
import ActiveLeague from '~/components/home/activeleagues/activeLeague';


const colors = tailwindConfig.theme!.extend!.colors! as Record<string, string>;
const PAGE_WIDTH = Dimensions.get('window').width;

export default function ActiveLeagues() {
  const { data: leagues } = useLeagues();

  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className='bg-card rounded-lg w-90p overflow-hidden py-1'>
      <View className='w-full items-end pr-1 pb-1'>
        <Link href='/leagues' className='rounded-lg bg-white px-2'>
          <Text className='text-primary font-semibold text-lg m-4'>
            View All
          </Text>
        </Link>
      </View>
      <Carousel
        ref={ref}
        width={PAGE_WIDTH}
        height={PAGE_WIDTH / 2}
        data={leagues ?? []}
        onProgressChange={progress}
        renderItem={({ item }) => (<ActiveLeague league={item.league} />)} />
      <Pagination.Basic
        progress={progress}
        data={leagues ?? []}
        dotStyle={{ backgroundColor: colors.secondary, borderRadius: 50 }}
        activeDotStyle={{ backgroundColor: colors.primary, borderRadius: 50 }}
        containerStyle={{ gap: 5 }}
        onPress={onPressPagination}
      />
    </View>
  );
}
