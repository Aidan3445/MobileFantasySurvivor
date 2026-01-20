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
      const statusOrder = { Draft: 0, Predraft: 1, Active: 2, Inactive: 3 };
      if (statusOrder[a.league.status] !== statusOrder[b.league.status]) {
        return statusOrder[a.league.status] - statusOrder[b.league.status];
      }
      return b.league.season.localeCompare(a.league.season);
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
      <View className='relative overflow-hidden rounded-xl bg-card border-2 border-primary/20 px-4 pt-5 pb-3'>
        <Text className='text-center text-sm font-medium text-muted-foreground leading-relaxed'>
          You are not a member of any active leagues.
          {'\n'}
          Join or create a league to get started!
        </Text>
        <Button
          className='mt-4 rounded-lg bg-primary/10 border border-primary/30 px-4 py-3'
          onPress={() => router.push('/leagues')}>
          <Text className='text-sm text-center font-bold text-primary uppercase tracking-wider' allowFontScaling={false}>
            View All Leagues
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <View className='relative overflow-hidden rounded-xl bg-card border-2 border-primary/20'>
      {/* Header */}
      <View className='px-4 pt-5 pb-3'>
        <View className='flex-row items-end justify-between mb-3'>
          <View className='flex-row items-center gap-3'>
            <View className='h-8 w-1 bg-primary rounded-full' />
            <Text className='text-2xl font-black tracking-tight uppercase text-foreground'>
              Your Leagues
            </Text>
          </View>
          <Button
            className='rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 active:bg-primary/10'
            onPress={() => router.push('/leagues')}>
            <Text className='text-xs font-bold text-primary uppercase tracking-wider' allowFontScaling={false}>
              View All
            </Text>
          </Button>
        </View>

        {/* Separator */}
        <View className='h-[2px] bg-primary/20 rounded-full' />
      </View>

      {/* Carousel */}
      <View>
        <Carousel
          height={carouselHeight}
          renderItem={({ item }) => <ActiveLeague league={item.league} />}
          {...props}
        />
      </View>

      {/* Pagination Footer */}
      <View className='items-center pb-3'>
        <Pagination.Basic
          {...progressProps}
          containerStyle={{ ...progressProps.containerStyle, marginBottom: 8 }}
        />
      </View>
    </View>
  );
}
