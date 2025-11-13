import { Text, View } from 'react-native';
import { useMemo } from 'react';
import { useLeagues } from '~/hooks/user/useLeagues';
import LeagueCard from '~/components/leagues/grid/leagueCard';
import QuickActions from '~/components/home/quickActions/view';

export default function LeaguesList() {
  const { data: leagues } = useLeagues();

  const { currentLeagues, inactiveLeagues } = useMemo(() => {
    if (!leagues) {
      return {
        currentLeagues: [],
        inactiveLeagues: []
      };
    }

    const current: typeof leagues = [];
    const inactive: typeof leagues = [];

    leagues.forEach(league => {
      if (league.league.status === 'Inactive') {
        inactive.push(league);
      } else {
        current.push(league);
      }
    });

    // Sort inactive leagues by season (descending)
    const sortedInactive = inactive.sort(({ league: a }, { league: b }) =>
      b.season.localeCompare(a.season)
    );

    return {
      currentLeagues: current,
      inactiveLeagues: sortedInactive
    };
  }, [leagues]);

  return (
    <View className='px-4 py-6'>
      <View className='rounded-full bg-primary mb-3 mt-2'>
        <Text className='text-2xl font-semibold text-white text-center'>My Leagues</Text>
      </View>
      <View className='flex-col'>
        {currentLeagues.map(({ league, member, currentSelection }) => (
          <LeagueCard
            key={league.hash}
            league={league}
            member={member}
            currentSelection={currentSelection}
          />
        ))}
      </View>
      <QuickActions />
      <View className='rounded-full bg-secondary mt-6 mb-3' />
      {inactiveLeagues.map(({ league, member, currentSelection }, index) => {
        // Check if this is the first league of this season
        const isFirstOfSeason =
          inactiveLeagues.findIndex(({ league: l }) => l.seasonId === league.seasonId) === index;
        return (
          <View key={league.hash}>
            {isFirstOfSeason && (
              <View className='rounded-full bg-primary mb-3'>
                <Text className='text-xl font-semibold text-white text-center'>
                  {league.season}
                </Text>
              </View>
            )}
            <LeagueCard
              league={league}
              member={member}
              currentSelection={currentSelection}
            />
          </View>
        );
      })}
    </View>
  );
}
