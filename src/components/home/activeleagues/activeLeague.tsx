import { Link } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Scoreboard from '~/components/hub/scoreboard/view';
import { DraftCountdown } from '~/components/predraft/countdown/view';
import { type League } from '~/types/leagues';

interface ActiveLeagueProps {
  league: League;
}

export default function ActiveLeague({ league }: ActiveLeagueProps) {
  return (
    <View>
      <Link
        key={league.hash}
        href={`/leagues/${league.hash}`}
        asChild>
        <Pressable className='px-2 py-1 bg-white active:bg-muted flex-row items-center justify-between'>
          <Text className='font-semibold flex-1'>{league.name}</Text>
          <View className='rounded-lg bg-secondary p-1 mr-2'>
            <Text className='text-xs font-semibold'>{league.season}</Text>
          </View>
          <Eye />
        </Pressable>
      </Link>
      <View className='w-[100%] h-0 border border-primary' />
      {league.status === 'Active'
        ? (
          <Scoreboard overrideHash={league.hash} maxRows={5} />
        ) : (
          <DraftCountdown overrideHash={league.hash} />
        )}
    </View>
  );
}
