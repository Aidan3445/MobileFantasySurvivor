import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Flame, Skull, ShieldCheck } from 'lucide-react-native';
import Popover from 'react-native-popover-view';
import { colors } from '~/lib/colors';

interface SurvivalStreaksProps {
  survivalCap: number;
  currentStreak?: number;
  eliminatedEpisode?: number | null;
  shotInTheDarkStatus?: { episodeNumber: number; status: 'pending' | 'saved' | 'wasted' } | null;
}

export default function SurvivalStreaks({
  currentStreak,
  eliminatedEpisode,
  shotInTheDarkStatus,
  survivalCap,
}: SurvivalStreaksProps) {
  const [isVisible, setIsVisible] = useState(false);

  const renderTriggerContent = () => {
    if (eliminatedEpisode) {
      if (
        shotInTheDarkStatus?.status === 'saved' &&
        shotInTheDarkStatus.episodeNumber === eliminatedEpisode
      ) {
        return <ShieldCheck size={20} color='#16a34a' />;
      }
      return <Skull size={18} color={colors.mutedForeground} />;
    }
    return (
      <Text className='text-sm font-bold text-muted-foreground'>
        {Math.min(currentStreak ?? Infinity, survivalCap)}
      </Text>
    );
  };

  return (
    <Popover
      isVisible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      popoverStyle={{
        backgroundColor: colors.card,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: `${colors.primary}4D`,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      }}
      backgroundStyle={{ backgroundColor: 'transparent' }}
      arrowSize={{ width: 0, height: 0 }}
      from={
        <Pressable
          onPress={() => setIsVisible(true)}
          className='ml-1 w-5 h-5 items-center justify-center'
        >
          {renderTriggerContent()}
        </Pressable>
      }
    >
      <View className='p-3'>
        <Text className='text-sm font-bold uppercase tracking-wider mb-2 text-foreground'>
          Survival Streak
        </Text>

        <View className='h-px bg-primary/20 mb-2' />

        <View className='gap-1'>
          <Text className='text-sm font-medium text-foreground'>
            Current streak: {currentStreak ?? 0}
          </Text>
          <View className='flex-row items-center'>
            <Text className='text-sm font-medium text-foreground tabular-nums'>
              Point cap: {survivalCap}
            </Text>
            <Flame size={16} color={colors.mutedForeground} className='ml-1' />
          </View>
        </View>

        {shotInTheDarkStatus?.status === 'saved' && (
          <>
            <View className='h-px bg-primary/20 my-2' />
            <View className='flex-row items-center gap-1'>
              <ShieldCheck size={12} color='#16a34a' />
              <Text className='text-xs text-green-600 font-semibold'>
                Shot in the Dark saved their streak in episode {shotInTheDarkStatus.episodeNumber}
              </Text>
            </View>
          </>
        )}
      </View>
    </Popover>
  );
}
