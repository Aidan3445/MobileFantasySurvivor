'use client';

import { Text, View } from 'react-native';
import Button from '~/components/common/button';
import { useLeagues } from '~/hooks/user/useLeagues';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import ActiveLeague from '~/components/home/activeleagues/activeLeague';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useEffect, useMemo, useState } from 'react';
import { MAX_LEAGUE_MEMBERS_HOME_DISPLAY } from '~/lib/leagues';
import { type LeagueDetails } from '~/types/leagues';

export default function ActiveLeagues() {
  const router = useRouter();
  const { data: leagues } = useLeagues();
  const { props, progressProps, setCarouselData } = useCarousel(leagues);
  const [inactive, setInactive] = useState<LeagueDetails[]>([]);

  useEffect(() => {
    const currentLeagues: LeagueDetails[] = [];
    leagues?.forEach((leagueDetails) =>
      leagueDetails.league.status !== 'Inactive'
        ? currentLeagues.push(leagueDetails)
        : setInactive((prev) => [...prev, leagueDetails])
    );

    currentLeagues.sort((a, b) => {
      // sort order: Drafting, Active, Predraft. (inactive for typing but those are filtered out)
      // break ties by member count descending
      const statusOrder = { Draft: 0, Active: 1, Predraft: 2, Inactive: 3 };
      if (statusOrder[a.league.status] !== statusOrder[b.league.status]) {
        return statusOrder[a.league.status] - statusOrder[b.league.status];
      }
      return b.memberCount - a.memberCount;
    });
    setCarouselData(currentLeagues ?? []);
  }, [leagues, setCarouselData]);

  const carouselHeight = useMemo(() => {
    const maxLeagueMembers =
      leagues?.reduce((max, league) => Math.max(max, league.memberCount), 0) ?? 0;
    if (maxLeagueMembers < MAX_LEAGUE_MEMBERS_HOME_DISPLAY) {
      return Math.max(150, 28 * maxLeagueMembers + 55);
    }
    return 28 * MAX_LEAGUE_MEMBERS_HOME_DISPLAY + 55;
  }, [leagues]);

  if ((!props.data || props.data.length === 0) && inactive.length === 0) {
    return (
      <View className='overflow-hidden rounded-lg bg-card pb-1 mx-2'>
        <View className='relative items-center'>
          <Text className='m-4 text-center text-sm font-medium text-muted-foreground'>
            You are not a member of any active leagues. Join or create a league to get started!
          </Text>
          <Button
            className='absolute bottom-0 right-1 rounded-md bg-white px-2'
            onPress={() => router.push('/leagues')}>
            <Text className='text-sm font-semibold text-primary' allowFontScaling={false}>
              View All
            </Text>
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
          <Text className='text-sm font-semibold text-primary' allowFontScaling={false}>
            View All
          </Text>
        </Button>
      </View>
    </View>
  );
}
