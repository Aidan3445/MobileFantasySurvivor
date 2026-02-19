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
import MarqueeText from '~/components/common/marquee';

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
          <Text className='text-sm text-muted-foreground'>
            {BaseEventFullName[event.eventName as BaseEventName]}
          </Text>
        )}
        <Text className='text-base text-foreground'>{label}</Text>
      </View>

      {/* Points */}
      <PointsCell points={prediction.points} />

      {/* Tribes */}
      {!noTribes && (
        <View className='w-24 justify-center gap-0.5'>
          {event.referenceMap.map(({ tribe }, index) =>
            tribe ? (
              <ColorRow key={index} className='leading-tight' color={tribe.tribeColor}>
                <Text className='text-base text-foreground font-medium'>
                  {tribe.tribeName}
                </Text>
              </ColorRow>
            ) : null
          )}
        </View>
      )}

      {/* Castaways */}
      <View className='w-32 items-end justify-center gap-0.5'>
        {event.referenceMap.map(({ pairs }) =>
          pairs.map(({ castaway }) => (
            <CastawayModal key={castaway.castawayId} castaway={castaway}>
              <ColorRow
                className='leading-tight'
                color={castaway.tribe?.color ?? '#AAAAAA'}>
                <MarqueeText
                  marqueeThreshold={0}
                  text={castaway.shortName}
                  className='text-base text-foreground font-medium' />
              </ColorRow>
            </CastawayModal>
          ))
        )}
      </View>

      {/* Members (Hits & Misses) */}
      {!noMembers && (
        <View className='w-36 justify-center gap-0.5'>
          {/* Hits */}
          {prediction.hits.length > 0 &&
            prediction.hits.map((hit, index) => (
              <View key={index} className='flex-row items-center gap-1'>
                <ColorRow className='leading-tight w-min' color={hit.member.color}>
                  <MarqueeText
                    marqueeThreshold={0}
                    text={hit.member.displayName}
                    className={cn(
                      'text-base transition-all text-black font-medium',
                      hit.member.loggedIn && 'text-primary'
                    )}>
                    {(hit.bet ?? 0) > 0 && <ColoredPoints points={hit.bet} />}
                  </MarqueeText>
                </ColorRow>
                {event.references.length > 1 && hit.reference && (
                  <>
                    <MoveRight size={12} color='#000000' />
                    <ColorRow className='leading-tight font-medium w-20' color={hit.reference.color}>
                      <MarqueeText
                        marqueeThreshold={0}
                        text={hit.reference.shortName}
                        className='text-xs text-foreground font-medium' />
                    </ColorRow>
                  </>
                )}
              </View>
            ))}

          {/* Misses Accordion */}
          {prediction.misses.length > 0 && (
            <View>
              <Pressable onPress={toggleMisses} className='flex-row items-center py-1'>
                <Text className='text-sm text-muted-foreground'>Missed Predictions</Text>
                <Animated.View style={chevronStyle} className='ml-1'>
                  <ChevronDown size={12} color='#888888' />
                </Animated.View>
              </Pressable>
              <Animated.View style={contentStyle}>
                <View className='gap-0.5'>
                  {prediction.misses.map((miss, index) => (
                    <View key={index} className='flex-row items-center gap-1 opacity-60'>
                      <ColorRow className='leading-tight w-min' color={miss.member.color}>
                        <MarqueeText
                          marqueeThreshold={0}
                          text={miss.member.displayName}
                          className={cn(
                            'text-base transition-all text-black font-medium',
                            miss.member.loggedIn && 'text-primary'
                          )}>
                          {(miss.bet ?? 0) > 0 && <ColoredPoints points={-miss.bet!} />}
                        </MarqueeText>
                      </ColorRow>
                      {miss.reference && (
                        <>
                          <MoveRight size={12} color='#000000' />
                          <ColorRow className='leading-tight font-medium w-20' color={miss.reference.color}>
                            <MarqueeText
                              marqueeThreshold={0}
                              text={miss.reference.shortName}
                              className='text-xs text-foreground font-medium' />
                          </ColorRow>
                        </>
                      )}
                    </View>
                  ))}
                </View>
              </Animated.View>
            </View>
          )
          }
        </View >
      )}
    </View >
  );
}
