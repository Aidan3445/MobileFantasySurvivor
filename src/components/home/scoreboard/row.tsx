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
  bottomBorder = false
}: CastawayRowProps) {
  const isTopThree = place <= 3 && !allZero;
  const rankBadgeColor = place === 1
    ? 'bg-yellow-500/20 border-yellow-500/40'
    : place === 2
      ? 'bg-gray-400/20 border-gray-400/40'
      : place === 3
        ? 'bg-amber-700/20 border-amber-700/40'
        : 'bg-primary/10 border-primary/30';
  const rankTextColor = place === 1
    ? 'text-yellow-600'
    : place === 2
      ? 'text-gray-600'
      : place === 3
        ? 'text-amber-700'
        : 'text-primary';

  return (
    <View
      className={cn(
        'h-10 flex-row py-1 px-0.5 gap-0.5',
        divideY(place - splitIndex - 1),
        bottomBorder && 'border-b !h-[36px]'
      )}>
      {!allZero && (
        <>
          {/* Place */}
          <View className='w-11 inline-flex items-center justify-center'>
            <View className={cn(
              'w-8 h-8 rounded-md font-black text-sm border-2 transition-all flex items-center justify-center',
              rankBadgeColor,
              isTopThree && 'shadow-md'
            )}>
              <Text className={cn('font-black', rankTextColor)}>
                {place}
              </Text>
            </View>
          </View>

          {/* Points */}
          <View className='w-10 -ml-2 items-center justify-center'>
            <Text className='text-center font-black'>
              {points}
            </Text>
          </View>
        </>
      )}

      {/* Castaway */}
      <View className='flex-1 flex-row items-center gap-2'>
        <CastawayModal castaway={castaway}>
          <Text
            className={cn(
              'text-base font-bold',
              allZero && 'text-center w-full',
              castaway?.eliminatedEpisode && 'line-through opacity-40'
            )}
            numberOfLines={1}>
            {castaway?.fullName}
          </Text>
        </CastawayModal>
        <View className='ml-auto flex-row gap-0.5 items-center'>
          <TribeHistoryCircles tribeTimeline={tribeTimeline ?? []} />
        </View>
      </View>
    </View>
  );
}
