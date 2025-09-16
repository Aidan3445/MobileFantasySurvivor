import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { cn } from '~/lib/util';
import { useLeagueData } from '~/hooks/leagues/enrich/useLeagueData';
import MemberRow from '~/components/leagues/hub/scoreboard/row';

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
    <View className={cn('', className)}>
      <View className='flex-row px-1 bg-white gap-x-1'>
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
            <MemberRow
              key={member.memberId}
              member={member}
              points={scores.slice().pop() ?? 0}
              place={index + 1}
              castaway={castaway}
              color={member.color}
              doubleBelow={!!maxRows && index >= maxRows}
            />
          );
        })}
      </View>
    </View>
  );
}
