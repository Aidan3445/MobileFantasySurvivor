import { View, Text, Pressable } from 'react-native';
import { useMemo, useState } from 'react';
import { MoveRight, ChevronDown } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';
import { useEventLabel } from '~/hooks/helpers/useEventLabel';
import { BaseEventFullName } from '~/lib/events';
import { type BaseEventName, type EnrichedPrediction } from '~/types/events';
import PointsCell, { ColoredPoints } from '~/components/shared/eventTimeline/table/row/pointsCell';
import ColorRow from '~/components/shared/colorRow';
import CastawayModal from '~/components/shared/castaways/castawayModal';

interface PredictionRowProps {
  className?: string;
  prediction: EnrichedPrediction;
  editCol?: boolean;
  defaultOpenMisses?: boolean;
  noMembers?: boolean;
  noTribes?: boolean;
}

export default function PredictionRow({
  className,
  prediction,
  editCol,
  defaultOpenMisses,
  noMembers,
  noTribes,
}: PredictionRowProps) {
  const isBaseEvent = useMemo(
    () => prediction.event.eventSource === 'Base',
    [prediction.event.eventSource]
  );
  const label = useEventLabel(prediction.event.eventName, isBaseEvent, prediction.event.label);

  const event = prediction.event;

  // Accordion state for misses
  const [missesExpanded, setMissesExpanded] = useState(defaultOpenMisses ?? false);
  const expandProgress = useSharedValue(defaultOpenMisses ? 1 : 0);

  const toggleMisses = () => {
    setMissesExpanded((prev) => !prev);
    expandProgress.value = withTiming(missesExpanded ? 0 : 1, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(expandProgress.value, [0, 1], [0, 180])}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: expandProgress.value,
    maxHeight: interpolate(expandProgress.value, [0, 1], [0, 300]),
  }));

  return (
    <View className={cn('flex-row items-center gap-4 border-b border-primary/10 bg-card px-4 py-2', className)}>
      {/* Edit Column (empty spacer) */}
      {editCol && <View className='w-12' />}

      {/* Event Name */}
      <View className='flex-1 max-w-40'>
        {isBaseEvent && (
          <Text className='text-xs text-muted-foreground'>
            {BaseEventFullName[event.eventName as BaseEventName]}
          </Text>
        )}
        <Text className='text-sm text-foreground'>{label}</Text>
      </View>

      {/* Points */}
      <PointsCell points={prediction.points} />

      {/* Tribes */}
      {!noTribes && (
        <View className='w-24 justify-center gap-0.5'>
          {event.referenceMap.map(({ tribe }, index) =>
            tribe ? (
              <ColorRow key={index} className='leading-tight' color={tribe.tribeColor}>
                {tribe.tribeName}
              </ColorRow>
            ) : null
          )}
        </View>
      )}

      {/* Castaways */}
      <View className='w-32 items-end justify-center gap-0.5'>
        {event.referenceMap.map(({ pairs }) =>
          pairs.map(({ castaway }) => (
            <ColorRow
              key={castaway.castawayId}
              className='leading-tight'
              color={castaway.tribe?.color ?? '#AAAAAA'}>
              <CastawayModal castaway={castaway}>
                <Text className='text-sm text-foreground'>{castaway.fullName}</Text>
              </CastawayModal>
            </ColorRow>
          ))
        )}
      </View>

      {/* Members (Hits & Misses) */}
      {!noMembers && (
        <View className='min-w-[144px] flex-1 justify-center gap-0.5'>
          {/* Hits */}
          {prediction.hits.length > 0 &&
            prediction.hits.map((hit, index) => (
              <View key={index} className='flex-row items-center gap-1'>
                <ColorRow className='leading-tight' color={hit.member.color}>
                  <Text className='text-sm'>{hit.member.displayName}</Text>
                  {(hit.bet ?? 0) > 0 && <ColoredPoints points={hit.bet} />}
                </ColorRow>
                {event.references.length > 1 && hit.reference && (
                  <>
                    <MoveRight size={12} color='#000000' />
                    <ColorRow className='leading-tight' color={hit.reference.color}>
                      {hit.reference.name}
                    </ColorRow>
                  </>
                )}
              </View>
            ))}

          {/* Misses Accordion */}
          {prediction.misses.length > 0 && (
            <View>
              <Pressable onPress={toggleMisses} className='flex-row items-center py-1'>
                <Text className='text-xs text-muted-foreground'>Missed Predictions</Text>
                <Animated.View style={chevronStyle} className='ml-1'>
                  <ChevronDown size={12} color='#888888' />
                </Animated.View>
              </Pressable>
              <Animated.View style={contentStyle} className='overflow-hidden'>
                <View className='gap-0.5'>
                  {prediction.misses.map((miss, index) => (
                    <View key={index} className='flex-row items-center gap-1 opacity-60'>
                      <ColorRow className='leading-tight' color={miss.member.color}>
                        <Text className='text-sm'>{miss.member.displayName}</Text>
                        {(miss.bet ?? 0) > 0 && <ColoredPoints points={-miss.bet!} />}
                      </ColorRow>
                      {miss.reference && (
                        <>
                          <MoveRight size={12} color='#000000' />
                          <ColorRow className='leading-tight' color={miss.reference.color}>
                            {miss.reference.name}
                          </ColorRow>
                        </>
                      )}
                    </View>
                  ))}
                </View>
              </Animated.View>
            </View>
          )}
        </View>
      )}

      {/* Empty Notes column spacer for alignment */}
      <View className='w-24' />
    </View>
  );
}
