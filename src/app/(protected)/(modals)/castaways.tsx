'use client';

import { RefreshControl, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useLeagueRefresh } from '~/hooks/helpers/refresh/useLeagueRefresh';
import CastawaysView from '~/components/seasons/castaways/view';
import { useSelectionTimeline } from '~/hooks/leagues/query/useSelectionTimeline';
import { useLeagueMembers } from '~/hooks/leagues/query/useLeagueMembers';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import RefreshIndicator from '~/components/common/refresh';
import DraftCastawaysHeader from '~/components/leagues/draft/header/castawaysHeader';

export default function DraftCastawaysScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: league } = useLeague(hash);
  const { data: selectionTimeline } = useSelectionTimeline(hash);
  const { data: leagueMembers } = useLeagueMembers(hash);
  const { data: seasonData } = useSeasonsData(false, league?.seasonId);
  const { refreshing, onRefresh, scrollY, handleScroll } = useLeagueRefresh();
  const router = useRouter();

  if (!league) return router.dismiss();

  const leagueData = {
    selectionTimeline,
    leagueMembers
  };

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <DraftCastawaysHeader />
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} extraHeight={-5} />
      <ScrollView
        className='w-full pt-20'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 70 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View className='gap-y-4 px-1.5 pb-4'>
          {seasonData?.[0] && (
            <CastawaysView seasonData={seasonData[0]} leagueData={leagueData} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
