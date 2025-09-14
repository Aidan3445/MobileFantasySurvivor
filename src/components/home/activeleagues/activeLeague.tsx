import { Link } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Scoreboard from '~/components/hub/scoreboard/view';
import { type League } from '~/types/leagues';

interface ActiveLeagueProps {
  league: League;
}

export default function ActiveLeague({ league }: ActiveLeagueProps) {
  return (
    <View className='px-2'>
      <Link
        key={league.hash}
        href={`/leagues/${league.hash}`}
        asChild>
        <Pressable className='px-2 py-1 rounded-lg border active:bg-accent/50 flex-row items-center justify-between mb-2 w-90p'>
          <Text className='font-semibold flex-1'>{league.name}</Text>
          <View className='rounded-lg bg-secondary p-1 mr-2'>
            <Text className='text-xs font-semibold'>{league.season}</Text>
          </View>
          <Eye />
        </Pressable>
      </Link>
      {league.status === 'Active'
        ? (
          <Scoreboard overrideHash={league.hash} maxRows={3} className='w-90p' />
        ) : (
          <View>
            <Text className='text-white text-center italic'>No active matches</Text>
          </View>
        )}
    </View>
  );
}
