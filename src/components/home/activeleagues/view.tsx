'use client';

import { Text, View } from 'react-native';
import { useLeagues } from '~/hooks/user/useLeagues';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { Link } from 'expo-router';
import ActiveLeague from '~/components/home/activeleagues/activeLeague';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useEffect } from 'react';


export default function ActiveLeagues() {
  const { data: leagues } = useLeagues();
  const { PAGE_WIDTH, props, progressProps, setCarouselData } = useCarousel(leagues);

  useEffect(() => {
    setCarouselData(leagues ?? []);
  }, [leagues, setCarouselData]);

  return (
    <View className='bg-card rounded-lg pb-1 overflow-hidden'>
      <Carousel
        height={PAGE_WIDTH / 2}
        renderItem={({ item }) => (<ActiveLeague league={item.league} />)}
        {...props} />
      <View className='relative items-center'>
        <Pagination.Basic {...progressProps} />
        <Link href='/leagues' className='absolute rounded-md bg-white px-2 bottom-0 right-1'>
          <Text className='text-primary font-semibold text-sm m-4'>
            View All
          </Text>
        </Link>
      </View>
    </View>
  );
}
