import { Flame, Lock, LockOpen } from 'lucide-react-native';
import { Text, View, Pressable, Switch } from 'react-native';
import Button from '~/components/common/button';
import Slider from '@react-native-community/slider';
import { useSurvivalStreak } from '~/hooks/leagues/mutation/useSurvivalStreak';
import { MAX_SURVIVAL_CAP } from '~/lib/leagues';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import { Controller } from 'react-hook-form';

export default function SurvivalStreaks() {
  const {
    reactForm,
    locked,
    setLocked,
    settingsChanged,
    handleSubmit,
    resetSettings,
    leagueMembers,
  } = useSurvivalStreak();

  const displaySurvivalCap = (value: number) => {
    if (value === 0) return 'Off';
    if (value === MAX_SURVIVAL_CAP) return 'Unlimited';
    return value.toString();
  };

  const survivalCapValue = reactForm.watch('survivalCap');
  const preserveStreakValue = reactForm.watch('preserveStreak');

  return (
    <View className='w-full rounded-xl bg-card p-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-card-foreground text-lg font-bold'>
          Survival Streaks
        </Text>
        {leagueMembers?.loggedIn?.role === 'Owner' && (
          <Pressable
            onPress={() => {
              if (locked) {
                setLocked(false);
              } else {
                resetSettings();
              }
            }}
          >
            {locked ? (
              <Lock size={24} color={colors.primary} />
            ) : (
              <LockOpen size={24} color={colors.secondary} />
            )}
          </Pressable>
        )}
      </View>
      <Text className='mb-2 text-sm text-muted-foreground'>
        The Survival Streak rewards players for picking a castaway that survives
        each episode.
      </Text>
      <View className='gap-2'>
        <View>
          <Text className='text-card-foreground font-bold leading-none'>
            How it works
          </Text>
          <Text className='text-card-foreground text-sm'>
            Each episode your pick survives, their streak grows:
          </Text>
          <Text className='text-card-foreground ml-4 text-sm'>
            •<Text className='font-semibold'> Episode 1: </Text>
            Earn 1 point
          </Text>
          <Text className='text-card-foreground ml-4 text-sm'>
            •<Text className='font-semibold'> Episode 2: </Text>
            Earn 2 points
          </Text>
          <Text className='text-card-foreground ml-4 text-sm'>
            •<Text className='font-semibold'> Episode 3: </Text>
            Earn 3 points, and so on...
          </Text>
          <Text className='text-card-foreground text-sm'>
            If your pick is eliminated, you must choose a new unclaimed
            castaway, and your streak resets.
          </Text>
        </View>
        {!locked && (
          <View className='flex-row gap-2'>
            <Button
              className={'flex-1 rounded-lg bg-destructive p-3'}
              onPress={resetSettings}
            >
              <Text className='text-center font-semibold text-white'>
                Cancel
              </Text>
            </Button>
            <Button
              className={'flex-1 rounded-lg bg-primary p-3'}
              disabled={!settingsChanged}
              onPress={() => handleSubmit()}
            >
              <Text className='text-center font-semibold text-white'>Save</Text>
            </Button>
          </View>
        )}
        <View className='rounded-lg bg-accent p-2'>
          <View className='flex-row items-center'>
            <Text className='mr-4 font-bold text-black'>Streak Cap</Text>
            <Text
              className={cn(
                'text-lg font-semibold',
                survivalCapValue > 0 ? 'text-positive' : 'text-destructive'
              )}
            >
              {displaySurvivalCap(survivalCapValue)}
            </Text>
            {survivalCapValue > 0 && survivalCapValue < MAX_SURVIVAL_CAP && (
              <Flame
                size={16}
                color={survivalCapValue > 0 ? colors.positive : colors.neutral}
                className='ml-1'
              />
            )}
          </View>
          {!locked && (
            <Controller
              control={reactForm.control}
              name='survivalCap'
              render={({ field }) => (
                <Slider
                  minimumValue={0}
                  maximumValue={MAX_SURVIVAL_CAP}
                  step={1}
                  value={field.value}
                  onValueChange={field.onChange}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.secondary}
                  thumbTintColor={colors.muted}
                />
              )}
            />
          )}
          <Text className='text-sm text-black'>
            Set a cap on the maximum points a player can earn from their streak.
          </Text>
          <Text className='text-sm text-black'>
            <Text className='font-semibold'> Note: </Text>A cap of 0 will
            disable survival points entirely, while an unlimited cap will
            heavily favor the player who drafts the winner.
          </Text>
        </View>
        <View className='rounded-lg bg-accent p-2'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 flex-row items-center'>
              <Text className='mr-4 font-bold text-black'>Preserve Streak</Text>
              <Text
                className={cn(
                  'text-lg font-semibold',
                  preserveStreakValue ? 'text-positive' : 'text-destructive'
                )}
              >
                {preserveStreakValue ? 'On' : 'Off'}
              </Text>
            </View>
            {!locked && (
              <Controller
                control={reactForm.control}
                name='preserveStreak'
                render={({ field }) => (
                  <Switch
                    value={field.value}
                    onValueChange={field.onChange}
                    trackColor={{
                      false: colors.destructive,
                      true: colors.positive,
                    }}
                    ios_backgroundColor={colors.destructive}
                    thumbColor={colors.muted}
                  />
                )}
              />
            )}
          </View>
          <Text className='mt-1 text-sm text-black'>
            Should streaks be preserved if a player switches their pick
            voluntarily, or reset to zero?
          </Text>
        </View>
      </View>
    </View>
  );
}
