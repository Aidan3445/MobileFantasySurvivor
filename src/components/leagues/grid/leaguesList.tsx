import { Text, View } from 'react-native';
import { useMemo } from 'react';
import { useLeagues } from '~/hooks/user/useLeagues';
import LeagueCard from '~/components/leagues/grid/leagueCard';

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
      <Text className='mb-4 text-2xl font-semibold text-foreground'>My Leagues</Text>
      <View className='flex-col'>
        {currentLeagues.map(({ league, member, castaway }) => (
          <LeagueCard
            key={league.hash}
            league={league}
            member={member}
            currentSelection={castaway}
          />
        ))}
      </View>
      {inactiveLeagues.map(({ league, member, castaway }, index) => {
        // Check if this is the first league of this season
        const isFirstOfSeason =
          inactiveLeagues.findIndex(({ league: l }) => l.seasonId === league.seasonId) === index;
        return (
          <View key={league.hash}>
            {isFirstOfSeason && (
              <Text className='mb-2 mt-4 text-xl font-semibold text-primary'>
                {league.season}
              </Text>
            )}
            <View className='mb-2'>
              <Text className='text-lg text-foreground'>{league.name}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
