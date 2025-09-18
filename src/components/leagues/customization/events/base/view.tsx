'use client';
import { Lock, LockOpen } from 'lucide-react-native';
import { Text, View, Pressable } from 'react-native';
import { useBaseEventRules } from '~/hooks/leagues/mutation/useBaseEventRules';
import { colors } from '~/lib/colors';
import ChallengeScoreSettings from '~/components/leagues/customization/events/base/challenges';
import AdvantageScoreSettings from '~/components/leagues/customization/events/base/advantages';
import OtherScoreSettings from '~/components/leagues/customization/events/base/other';

export default function BaseEventRules() {
  const {
    reactForm,
    locked,
    setLocked,
    rulesChanged,
    handleSubmit,
    resetSettings,
    disabled
  } = useBaseEventRules();

  return (
    <View className='p-2 bg-card rounded-xl w-full'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-lg font-bold text-card-foreground'>
          Official Events
        </Text>
        {!disabled && (
          <Pressable
            onPress={() => {
              if (locked) {
                setLocked(false);
              } else {
                resetSettings();
              }
            }}>
            {locked ? (
              <Lock size={24} color={colors.primary} />
            ) : (
              <LockOpen size={24} color={colors.secondary} />
            )}
          </Pressable>
        )}
      </View>
      <Text className='text-sm text-muted-foreground mb-2'>
        These Official Events are automatically scored for your league based on
        what drafted castaways do in the show. Set the point values for each event.
      </Text>
      <View className='gap-2'>
        {!locked && (
          <View className='flex-row gap-2'>
            <Pressable
              className='flex-1 bg-red-500 rounded-lg p-3'
              onPress={resetSettings}>
              <Text className='text-white font-semibold text-center'>Cancel</Text>
            </Pressable>
            <Pressable
              className={'flex-1 bg-primary rounded-lg p-3 disabled:opacity-50'}
              disabled={!rulesChanged}
              onPress={() => handleSubmit()}>
              <Text className='text-white font-semibold text-center'>Save</Text>
            </Pressable>
          </View>
        )}
        <View className='gap-2'>
          <ChallengeScoreSettings reactForm={reactForm} disabled={locked || disabled} />
          <AdvantageScoreSettings reactForm={reactForm} disabled={locked || disabled} />
          <OtherScoreSettings reactForm={reactForm} disabled={locked || disabled} />
        </View>
      </View>
    </View>
  );
}
