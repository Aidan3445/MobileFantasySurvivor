import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';
import { type EnrichedCastaway } from '~/types/castaways';
import { type Tribe } from '~/types/tribes';
import TribeHistoryCircles from '~/components/shared/castaways/tribeHistoryCircles';
import { divideY } from '~/lib/ui';
import CastawayModal from '~/components/shared/castaways/castawayModal';

interface CastawayRowProps {
  place: number;
  castaway?: EnrichedCastaway;
  points?: number;
  tribeTimeline?: { episode: number; tribe: Tribe }[];
  allZero?: boolean;
  splitIndex?: number;
  bottomBorder?: boolean;
}

export default function CastawayRow({
  place,
  castaway,
  points,
  tribeTimeline,
  allZero,
  splitIndex = 0,
  bottomBorder = false,
}: CastawayRowProps) {
  const rankBadgeColor =
    place === 1
      ? 'bg-yellow-500/20 border-yellow-500/40'
      : place === 2
        ? 'bg-gray-400/20 border-gray-400/40'
        : place === 3
          ? 'bg-amber-700/20 border-amber-700/40'
          : 'bg-primary/10 border-primary/30';
  const rankTextColor =
    place === 1
      ? 'text-yellow-600'
      : place === 2
        ? 'text-gray-600'
        : place === 3
          ? 'text-amber-700'
          : 'text-primary';

  return (
    <View
      className={cn(
        'h-10 flex-row gap-0.5 px-0.5 py-1',
        divideY(place - splitIndex - 1),
        bottomBorder && 'border-b !h-[36px]'
      )}>
      {!allZero && (
        <>
          <View className='w-11 items-center justify-center'>
            <View
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border-2',
                rankBadgeColor
              )}>
              <Text className={cn('font-black', rankTextColor)}>{place}</Text>
            </View>
          </View>
          <View className='-ml-2 w-10 items-center justify-center'>
            <Text className='text-center font-black'>{points}</Text>
          </View>
        </>
      )}
      <View className='flex-1 flex-row items-center gap-2 pr-2'>
        <CastawayModal castaway={castaway}>
          <Text
            className={cn(
              'text-base font-bold',
              allZero && 'w-full text-center',
              castaway?.eliminatedEpisode && 'line-through opacity-40'
            )}
            numberOfLines={1}>
            {castaway?.fullName}
          </Text>
        </CastawayModal>
        <View className='ml-auto flex-row items-center gap-0.5'>
          <TribeHistoryCircles tribeTimeline={tribeTimeline ?? []} />
        </View>
      </View>
    </View>
  );
}
