import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';
import { rankBadgeColor, rankTextColor } from '~/lib/colors';
import { divideY } from '~/lib/ui';
import { PlaceIcon } from '~/components/icons/generated';
import { type LeaderboardEntry } from '~/hooks/livePredictions/query/useLiveLeaderboard';

export default function LeaderboardRow({
  entry,
  place,
  index,
  isYou,
}: {
  entry: LeaderboardEntry;
  place: number;
  index: number;
  isYou: boolean;
}) {
  return (
    <View
      className={cn(
        'h-10 flex-row gap-0.5 px-0.5 py-1',
        divideY(index),
        isYou && 'bg-primary/10',
      )}>
      <View className='w-11 inline-flex items-center justify-center'>
        <PlaceIcon size={28} color={rankBadgeColor(place)} />
        <Text className={cn('absolute font-black tracking-tighter', rankTextColor(place))}>
          {place}
        </Text>
      </View>
      <View className='flex-1 flex-row items-center gap-2 pl-1'>
        <Text
          className={cn(
            'text-base',
            isYou ? 'font-bold text-primary' : 'font-semibold text-foreground'
          )}
          numberOfLines={1}>
          {isYou ? 'You' : entry.userId.slice(0, 8)}
        </Text>
        <Text className='text-sm text-muted-foreground ml-auto pr-1'>
          {entry.totalCorrect}/{entry.totalAnswered}
        </Text>
      </View>
      <View className='w-16 items-center justify-center'>
        <Text className={cn(
          'text-base font-black tracking-tighter',
          isYou ? 'text-primary' : 'text-foreground'
        )}>
          {Math.round(entry.accuracy * 100)}%
        </Text>
      </View>
    </View>
  );
}
