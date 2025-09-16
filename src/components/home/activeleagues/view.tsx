'use client';

import { Pressable, Text, View } from 'react-native';
import { useLeagues } from '~/hooks/user/useLeagues';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import ActiveLeague from '~/components/home/activeleagues/activeLeague';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useEffect, useMemo } from 'react';
import { MAX_LEAGUE_MEMBERS_HOME_DISPLAY } from '~/lib/leagues';


export default function ActiveLeagues() {
  const router = useRouter();
  const { data: leagues } = useLeagues();
  const { props, progressProps, setCarouselData } = useCarousel(leagues);

  useEffect(() => {
    setCarouselData(leagues ?? []);
  }, [leagues, setCarouselData]);

  const carouselHeight = useMemo(() => {
    const maxLeagueMembers = leagues?.reduce((max, league) => Math.max(max, league.memberCount), 0) ?? 0;
    if (maxLeagueMembers < MAX_LEAGUE_MEMBERS_HOME_DISPLAY) {
      return Math.max(150, 28 * maxLeagueMembers + 55);
    }
    return 28 * MAX_LEAGUE_MEMBERS_HOME_DISPLAY + 55;
  }, [leagues]);

  return (
    <View className='bg-card rounded-lg pb-1 overflow-hidden'>
      <Carousel
        height={carouselHeight}
        renderItem={({ item }) => (<ActiveLeague league={item.league} />)}
        {...props} />
      <View className='relative items-center'>
        <Pagination.Basic {...progressProps} containerStyle={{ ...progressProps.containerStyle, marginBottom: 3 }} />
        <Pressable
          className='absolute rounded-md bg-white px-2 bottom-0 right-1'
          onPress={() => router.push('/leagues')}>
          <Text className='text-primary font-semibold text-sm'>
            View All
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
