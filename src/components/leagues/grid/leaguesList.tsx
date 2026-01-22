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
    <View className='w-full flex flex-col items-center'>
      <View className='flex-col'>
        {currentLeagues.map(({ league, member, currentSelection }) => (
          <LeagueCard
            key={league.hash}
            league={league}
            member={member}
            currentSelection={currentSelection}
          />
        ))}
        {currentLeagues.length === 0 && (
          <View className='rounded-lg bg-card p-4 mb-4 w-96'>
            <Text className='text-center text-muted-foreground'>
              You don't have any active leagues.
            </Text>
            <Text className='text-center text-muted-foreground'>
              Create or join one to get started!
            </Text>
          </View>
        )}
      </View>
      <QuickActions />
      <View className='rounded-full bg-secondary mb-3' />
      {inactiveLeagues.map(({ league, member, currentSelection }, index) => {
        // Check if this is the first league of this season
        const isFirstOfSeason =
          inactiveLeagues.findIndex(({ league: l }) => l.seasonId === league.seasonId) === index;
        return (
          <View key={league.hash} className='w-full flex flex-col items-center'>
            {isFirstOfSeason && (
              <View className='rounded-full bg-primary mb-3 w-full'>
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
