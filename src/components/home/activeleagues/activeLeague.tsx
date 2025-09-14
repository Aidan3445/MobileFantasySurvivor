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
    <View>
      <Link
        key={league.hash}
        href={`/leagues/${league.hash}`}
        asChild>
        <Pressable className='px-2 pt-1 active:bg-accent/50 flex-row items-center justify-between w-90p'>
          <Text className='font-semibold flex-1'>{league.name}</Text>
          <View className='rounded-lg bg-secondary p-1 mr-2'>
            <Text className='text-xs font-semibold'>{league.season}</Text>
          </View>
          <Eye />
        </Pressable>
      </Link>
      <View className='w-[700px] h-0 border border-primary my-1' />
      {league.status === 'Active'
        ? (
          <View className='mx-0.5'>
            <Scoreboard overrideHash={league.hash} maxRows={5} className='w-90p' />
          </View>
        ) : (
          <View>
            <Text className='text-white text-center italic'>No active matches</Text>
          </View>
        )}
    </View>
  );
}
