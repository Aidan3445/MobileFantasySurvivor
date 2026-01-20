import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Circle } from 'lucide-react-native';
import Popover from 'react-native-popover-view';
import { type Tribe } from '~/types/tribes';
import { colors } from '~/lib/colors';

interface TribeHistoryCirclesProps {
  tribeTimeline: Array<{ episode: number; tribe: Tribe | null }>;
}

export default function TribeHistoryCircles({ tribeTimeline }: TribeHistoryCirclesProps) {
  const [visiblePopover, setVisiblePopover] = useState<string | null>(null);

  if (tribeTimeline.length <= 1) return null;

  return (
    <View className='ml-auto flex-row gap-0.5'>
      {tribeTimeline.map(({ episode, tribe }) =>
        tribe ? (
          <Popover
            key={`${tribe.tribeName}-${episode}`}
            isVisible={visiblePopover === `${tribe.tribeName}-${episode}`}
            onRequestClose={() => setVisiblePopover(null)}
            popoverStyle={{
              backgroundColor: colors.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: `${colors.primary}4D`,
            }}
            backgroundStyle={{ backgroundColor: 'transparent' }}
            arrowSize={{ width: 0, height: 0 }}
            from={
              <Pressable
                onPress={() =>
                  setVisiblePopover(
                    visiblePopover === `${tribe.tribeName}-${episode}`
                      ? null
                      : `${tribe.tribeName}-${episode}`
                  )
                }
                className='p-0.5 opacity-80 active:opacity-60'>
                <Circle size={16} fill={tribe.tribeColor} color={tribe.tribeColor} />
              </Pressable>
            }>
            <View className='flex-row items-center p-2'>
              <Text className='font-bold text-xs text-foreground'>{tribe.tribeName}</Text>
              <Text className='text-xs text-muted-foreground'> • Ep {episode}</Text>
            </View>
          </Popover>
        ) : null
      )}
    </View>
  );
}
