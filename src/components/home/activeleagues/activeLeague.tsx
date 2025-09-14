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
        <Pressable className='px-2 pt-1 active:bg-accent/50 flex-row items-center justify-between'>
          <Text className='font-semibold flex-1'>{league.name}</Text>
          <View className='rounded-lg bg-secondary p-1 mr-2'>
            <Text className='text-xs font-semibold'>{league.season}</Text>
          </View>
          <Eye />
        </Pressable>
      </Link>
      <View className='w-[100%] h-0 border border-primary my-1' />
      {league.status === 'Active'
        ? (
          <View className='mx-1'>
            <Scoreboard overrideHash={league.hash} maxRows={5} />
          </View>
        ) : (
          <View>
            <DraftCountdown overrideHash={league.hash} />
          </View>
        )}
    </View>
  );
}
