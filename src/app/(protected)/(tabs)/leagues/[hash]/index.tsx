'use client';

import { RefreshControl, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useLocalSearchParams } from 'expo-router';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useLeagueRefresh } from '~/hooks/helpers/refresh/useLeagueRefresh';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { useSysAdmin } from '~/hooks/user/useSysAdmin';
import EventFAB from '~/components/leagues/actions/events/fab';
import { useLeagueMembers } from '~/hooks/leagues/query/useLeagueMembers';
import Scores from '~/components/leagues/hub/shared/scores';
import ChangeCastaway from '~/components/leagues/hub/picks/changeCastaway';
import PredictionHistory from '~/components/leagues/hub/activity/predictionHistory/view';
import MakePredictions from '~/components/leagues/actions/events/predictions/view';
import LeagueTimeline from '~/components/leagues/hub/activity/timeline/view';

export default function LeagueHubScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: league } = useLeague(hash);
  const { data: leagueMembers } = useLeagueMembers(hash);
  const { refreshing, onRefresh, scrollY, handleScroll } = useLeagueRefresh();
  const { data: userId } = useSysAdmin();

  return (
    <View className='flex-1 bg-background relative'>
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} extraHeight={-45} />
      <KeyboardAwareScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 16 }}
        bottomOffset={80}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View className={cn(
          'page justify-start gap-y-4 px-1.5 pt-8 pb-1.5',
          refreshing && 'pt-12'
        )}>
          <Scores isActive={league?.status === 'Active'} />
          <MakePredictions />
          <ChangeCastaway />
          <PredictionHistory />
          <LeagueTimeline />
        </View>
      </KeyboardAwareScrollView>
      <EventFAB
        hash={hash}
        isLeagueAdmin={leagueMembers?.loggedIn?.role !== 'Member'}
        isSysAdmin={!!userId}
        isActive={league?.status === 'Active'} />
    </View>
  );
}
