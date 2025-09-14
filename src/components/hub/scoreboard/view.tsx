import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { cn } from '~/lib/util';
import { useLeagueData } from '~/hooks/leagues/enrich/useLeagueData';
import { alternateTableRowColors, divideY } from '~/lib/ui';

interface ScoreboardProps {
  overrideHash?: string;
  maxRows?: number;
  className?: string;
}

export default function Scoreboard({
  overrideHash,
  maxRows,
  className
}: ScoreboardProps = {}) {
  const {
    sortedMemberScores,
    loggedInIndex,
    //leagueSettings,
    selectionTimeline,
    castaways,
    // currentStreaks
  } = useLeagueData(overrideHash);

  return (
    <View className={cn('bg-accent rounded-lg overflow-hidden', className)}>
      <View className='min-w-full'>
        <View className='flex-row px-2 bg-white'>
          <View className='w-11 items-center justify-center'>
            <Text className='text-center font-medium'>Place</Text>
          </View>
          <View className='w-8 items-center justify-center'>
            <Flame size={16} className='text-muted-foreground' />
          </View>
          <View className='flex-1 items-center justify-center'>
            <Text className='text-center font-medium'>Member</Text>
          </View>
          <View className='w-24 items-center justify-center relative'>
            <Text className='text-center font-medium'>Survivor</Text>
            {/* ScoreboardHelp component would go here */}
          </View>
        </View>
        <View>
          {sortedMemberScores.map(({ member, scores }, index) => {
            if (maxRows && index !== loggedInIndex && (
              loggedInIndex >= maxRows ? index >= maxRows - 1 : index >= maxRows
            )) return null;

            const castawayId = selectionTimeline?.memberCastaways?.[member.memberId]?.slice()
              .pop();
            const castaway = castawayId !== undefined ?
              (castaways?.find((c) => c.castawayId === castawayId)) : undefined;
            return (
              <View
                key={index}
                className={cn('flex-row px-2 py-1 border-primary',
                  alternateTableRowColors(index),
                  divideY(index))}>
                <View className='w-11 items-center justify-center'>
                  <Text className='text-center'>{index + 1}</Text>
                </View>
                <View className='w-8 items-center justify-center'>
                  <Text className='text-center'>{scores.slice().pop() ?? 0}</Text>
                </View>
                <View className='flex-1 items-center justify-center'>
                  <Text className='text-center font-medium'>{member.displayName}</Text>
                </View>
                <View className='w-24 items-center justify-center'>
                  <Text className='text-center text-sm'>
                    {castaway?.shortName ?? 'None'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View >
  );
}
