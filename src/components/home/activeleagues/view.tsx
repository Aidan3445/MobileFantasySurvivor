'use client';

import { Text, View } from 'react-native';
import Button from '~/components/common/button';
import { useLeagues } from '~/hooks/user/useLeagues';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import ActiveLeague from '~/components/home/activeleagues/activeLeague';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useEffect, useMemo } from 'react';
import { MAX_LEAGUE_MEMBERS_HOME_DISPLAY } from '~/lib/leagues';
import { useSeasons } from '~/hooks/seasons/useSeasons';

export default function ActiveLeagues() {
  const router = useRouter();
  const { data: currentSeasons } = useSeasons(false);
  const { data: leagues } = useLeagues();
  const { props, progressProps, setCarouselData } = useCarousel(leagues);

  useEffect(() => {
    const currentLeagues = leagues?.filter(({ league }) =>
      currentSeasons?.some(season => season.seasonId === league.seasonId)
    ).sort((a, b) => b.memberCount - a.memberCount);
    setCarouselData(currentLeagues ?? []);
  }, [leagues, currentSeasons, setCarouselData]);

  const carouselHeight = useMemo(() => {
    const maxLeagueMembers =
      leagues?.reduce((max, league) => Math.max(max, league.memberCount), 0) ?? 0;
    if (maxLeagueMembers < MAX_LEAGUE_MEMBERS_HOME_DISPLAY) {
      return Math.max(150, 28 * maxLeagueMembers + 55);
    }
    return 28 * MAX_LEAGUE_MEMBERS_HOME_DISPLAY + 55;
  }, [leagues]);

  if (!props.data || props.data.length === 0) {
    return (
      <View className='overflow-hidden rounded-lg bg-card pb-1 mx-2'>
        <View className='relative items-center'>
          <Text className='m-4 text-center text-sm font-medium text-muted-foreground'>
            You are not a member of any active leagues. Join or create a league to get started!
          </Text>
          <Button
            className='absolute bottom-0 right-1 rounded-md bg-white px-2'
            onPress={() => router.push('/leagues')}>
            <Text className='text-sm font-semibold text-primary'>View All</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className='overflow-hidden rounded-lg bg-card pb-1'>
      <Carousel
        height={carouselHeight}
        renderItem={({ item }) => <ActiveLeague league={item.league} />}
        {...props}
      />
      <View className='relative items-center'>
        <Pagination.Basic
          {...progressProps}
          containerStyle={{ ...progressProps.containerStyle, marginBottom: 3 }}
        />
        <Button
          className='absolute bottom-0 right-1 rounded-md bg-white px-2'
          onPress={() => router.push('/leagues')}>
          <Text className='text-sm font-semibold text-primary'>View All</Text>
        </Button>
      </View>
    </View>
  );
}
