import { RefreshControl, Text, View } from 'react-native';
import BaseEventRules from '~/components/leagues/customization/events/base/view';
import CustomEventRules from '~/components/leagues/customization/events/custom/view';
import ShauhinMode from '~/components/leagues/customization/events/shauhin/view';
import SurvivalStreaks from '~/components/leagues/customization/settings/survivalStreak/view';
import { useLeagueRefresh } from '~/hooks/helpers/refresh/useLeagueRefresh';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useLeagueMembers } from '~/hooks/leagues/query/useLeagueMembers';
import LeagueSettings from '~/components/leagues/customization/settings/league/view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import SecondaryPickSettings from '~/components/leagues/customization/settings/secondary/view';

export default function LeagueSettingsScreen() {
  const { refreshing, onRefresh, scrollY, handleScroll } = useLeagueRefresh();
  const { data: league } = useLeague();
  const { data: leagueMembers } = useLeagueMembers();

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
        <View
          className={cn(
            'page justify-start gap-4 px-1.5 pt-8 pb-1.5',
            refreshing && 'pt-12'
          )}>
          <LeagueSettings
            isAdmin={leagueMembers?.loggedIn?.role === 'Admin'}
            isOwner={leagueMembers?.loggedIn?.role === 'Owner'} />

          {league?.status !== 'Predraft' && (
            <>
              <View className='w-full flex-row items-center justify-center gap-2 p-2 bg-card rounded-xl border-2 border-primary/20'>
                <View className='h-5 w-0.5 bg-primary rounded-full' />
                <Text className='text-2xl font-black tracking-tight text-center uppercase'>
                  League Scoring
                </Text>
                <View className='h-5 w-0.5 bg-primary rounded-full' />
              </View>
              <SurvivalStreaks />
              <SecondaryPickSettings />
              <BaseEventRules />
              <ShauhinMode />
              <CustomEventRules />
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
