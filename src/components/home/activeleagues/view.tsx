'use client';

import { Text, View } from 'react-native';
import { useLeagues } from '~/hooks/user/useLeagues';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { Link } from 'expo-router';
import ActiveLeague from '~/components/home/activeleagues/activeLeague';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useEffect, useMemo } from 'react';
import { MAX_LEAGUE_MEMBERS_HOME_DISPLAY } from '~/lib/leagues';


export default function ActiveLeagues() {
  const { data: leagues } = useLeagues();
  const { props, progressProps, setCarouselData } = useCarousel(leagues);

  useEffect(() => {
    setCarouselData(leagues ?? []);
  }, [leagues, setCarouselData]);

  const carouselHeight = useMemo(() => {
    const maxLeagueMembers = leagues?.reduce((max, league) => Math.max(max, league.memberCount), 0) ?? 0;
    if (maxLeagueMembers < MAX_LEAGUE_MEMBERS_HOME_DISPLAY) {
      return Math.max(140, 24.5 * maxLeagueMembers + 55);
    }
    return 24.5 * MAX_LEAGUE_MEMBERS_HOME_DISPLAY + 55;
  }, [leagues]);

  return (
    <View className='bg-card rounded-lg pb-1 overflow-hidden'>
      <Carousel
        height={carouselHeight}
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
