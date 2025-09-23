import { Link } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Button from '~/components/common/button';
import Scoreboard from '~/components/leagues/hub/scoreboard/view';
import { DraftCountdown } from '~/components/leagues/predraft/countdown/view';
import { MAX_LEAGUE_MEMBERS_HOME_DISPLAY } from '~/lib/leagues';
import { type League } from '~/types/leagues';

interface ActiveLeagueProps {
  league: League;
}

export default function ActiveLeague({ league }: ActiveLeagueProps) {
  return (
    <View>
      <Link
        key={league.hash}
        href={{ pathname: 'leagues/[hash]', params: { hash: league.hash } }}
        asChild>
        <Button className='flex-row items-center justify-between border-b-2 border-primary bg-white px-2 py-1'>
          <Text className='flex-1 font-semibold'>{league.name}</Text>
          <View className='mr-2 rounded-lg bg-secondary p-1'>
            <Text className='text-xs font-semibold'>{league.season}</Text>
          </View>
          <Eye />
        </Button>
      </Link>
      {league.status === 'Active' ? (
        <Scoreboard
          overrideHash={league.hash}
          maxRows={MAX_LEAGUE_MEMBERS_HOME_DISPLAY}
        />
      ) : (
        <DraftCountdown overrideHash={league.hash} />
      )}
    </View>
  );
}
