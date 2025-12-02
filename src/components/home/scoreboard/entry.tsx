import { View, Text, Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import { divideY } from '~/lib/ui';
import { getContrastingColor } from '@uiw/color-convert';
import { FlameKindling, Circle } from 'lucide-react-native';
import { type EnrichedCastaway } from '~/types/castaways';
import { type Tribe } from '~/types/tribes';
import * as Popover from 'react-native-popover-view';

interface CastawayEntryProps {
  castawayId: number;
  castaway?: EnrichedCastaway;
  points: number;
  color: string;
  place: number;
  index: number;
  allZero: boolean;
  tribeTimeline?: { episode: number; tribe: Tribe }[];
}

export default function CastawayEntry({
  castawayId,
  castaway,
  points,
  color,
  place,
  index,
  allZero,
  tribeTimeline
}: CastawayEntryProps) {
  const colorOverride = castaway?.eliminatedEpisode ? '#AAAAAA' : color;

  return (
    <View key={castawayId} className={cn('h-7 flex-row gap-x-1 p-1', divideY(index))}>
      {!allZero && (
        <>
          <View
            className='w-11 items-center justify-center rounded px-1'
            style={{ backgroundColor: color }}>
            <Text className='text-center font-medium' style={{ color: getContrastingColor(color) }}>
              {place}
            </Text>
          </View>
          <View
            className='w-10 items-center justify-center rounded px-1'
            style={{ backgroundColor: color }}>
            <Text className='text-center font-medium' style={{ color: getContrastingColor(color) }}>
              {points}
            </Text>
          </View>
        </>
      )}
      <View
        className='flex-row flex-1 items-center justify-center rounded px-2'
        style={{ backgroundColor: colorOverride }}>
        <Text
          className='text-center font-medium mr-1'
          numberOfLines={1}
          style={{ color: getContrastingColor(colorOverride) }}>
          {castaway?.fullName ?? 'Unknown'}
        </Text>
        {castaway?.eliminatedEpisode && (
          <Popover.default
            from={
              <Pressable className='flex-row items-center'>
                <FlameKindling size={14} color={getContrastingColor(colorOverride)} />
                <Text className='text-muted-foreground'>({castaway.eliminatedEpisode})</Text>
              </Pressable>
            }>
            <View className='bg-popover p-2 rounded'>
              <Text className='text-popover-foreground text-xs'>
                Eliminated Episode {castaway.eliminatedEpisode}
              </Text>
            </View>
          </Popover.default>
        )}
        {tribeTimeline && (tribeTimeline.length > 1 || castaway?.eliminatedEpisode) && (
          <View className='ml-auto flex-row gap-0.5'>
            {tribeTimeline.map(({ episode, tribe }) => (
              <Popover.default
                key={`${tribe.tribeName}-${episode}`}
                from={
                  <Pressable>
                    <Circle
                      size={16}
                      fill={tribe.tribeColor}
                      stroke='black'
                      strokeWidth={1}
                      color={tribe.tribeColor} />
                  </Pressable>
                }>
                <View className='bg-popover p-2 rounded'>
                  <Text className='text-popover-foreground text-xs'>
                    {tribe.tribeName} - Episode {episode}
                  </Text>
                </View>
              </Popover.default>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
