'use client';
import { Lock, LockOpen } from 'lucide-react-native';
import { Text, View, Switch, TextInput } from 'react-native';
import Button from '~/components/common/button';
import { Controller } from 'react-hook-form';
import { useShauhinMode } from '~/hooks/leagues/mutation/useShauhinMode';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import {
  ABS_MAX_EVENT_POINTS,
  SHAUHIN_MODE_MAX_MAX_BETS_PER_WEEK,
  ShauhinModeTimings
} from '~/lib/leagues';
import { BaseEventFullName } from '~/lib/events';
import * as WebBrowser from 'expo-web-browser';
import { type ScoringBaseEventName } from '~/types/events';
import SearchableMultiSelect from '~/components/common/searchableMultiSelect';
import SearchableSelect from '~/components/common/searchableSelect';

export default function ShauhinMode() {
  const {
    reactForm,
    locked,
    setLocked,
    rulesChanged,
    handleSubmit,
    resetSettings,
    disabled,
    rules
  } = useShauhinMode();

  const shauhinEnabled = reactForm.watch('enabled');
  const startWeek = reactForm.watch('startWeek');
  const customStartWeek = reactForm.watch('customStartWeek');
  const maxBet = reactForm.watch('maxBet');
  const maxBetsPerWeek = reactForm.watch('maxBetsPerWeek');
  const enabledBets = reactForm.watch('enabledBets');

  const timingOptions = ShauhinModeTimings.map(timing => ({ value: timing, label: timing }));

  const betsOptions = Object.entries(rules?.basePrediction ?? {})
    .filter(([_, setting]) => setting.enabled)
    .map(([eventName]) => ({
      value: eventName as ScoringBaseEventName,
      label: BaseEventFullName[eventName as ScoringBaseEventName]
    }));

  const openTikTokLink = () => {
    WebBrowser.openBrowserAsync('https://www.tiktok.com/t/ZT62XJL2V/');
  };

  return (
    <View className='w-full rounded-xl bg-card p-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-card-foreground text-lg font-bold'>Shauhin Mode</Text>
        {!disabled && (
          <Button
            onPress={() => {
              if (locked) {
                setLocked(false);
              } else {
                resetSettings();
              }
            }}>
            {locked ? (
              <Lock
                size={24}
                color={colors.primary}
              />
            ) : (
              <LockOpen
                size={24}
                color={colors.secondary}
              />
            )}
          </Button>
        )}
      </View>
      <Text className='mb-2 text-sm text-muted-foreground'>
        Inspired by a{' '}
        <View className='translate-y-[0.05rem] border-b border-b-primary'>
          <Text
            className='-mb-1 text-sm leading-none text-primary'
            onPress={openTikTokLink}>
            video
          </Text>
        </View>{' '}
        that{' '}
        <View className='translate-y-[0.5rem] rounded bg-[#d05dbd] px-1'>
          <Text className='font-medium text-white'>Shauhin Davari</Text>
        </View>
        , from Survivor 48, posted, this twist allows you to bet points you've earned throughout the
        season on predictions. If you win, you gain those points in addition to the base points for
        the event. If you miss the prediction, you get nothing.
      </Text>
      <View className='gap-2'>
        {!locked && (
          <View className='flex-row gap-2'>
            <Button
              className={'flex-1 rounded-lg bg-destructive p-3'}
              onPress={resetSettings}>
              <Text className='text-center font-semibold text-white'>Cancel</Text>
            </Button>
            <Button
              className={'flex-1 rounded-lg bg-primary p-3'}
              disabled={!rulesChanged}
              onPress={() => handleSubmit()}>
              <Text className='text-center font-semibold text-white'>Save</Text>
            </Button>
          </View>
        )}
        <View className='rounded-lg bg-accent p-2'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 flex-row items-center'>
              <Text className='mr-4 font-bold text-black'>Shauhin Mode</Text>
              <Text
                className={cn(
                  'text-lg font-semibold',
                  shauhinEnabled ? 'text-positive' : 'text-destructive'
                )}>
                {shauhinEnabled ? 'On' : 'Off'}
              </Text>
            </View>
            {!disabled && !locked && (
              <Controller
                control={reactForm.control}
                name='enabled'
                render={({ field }) => (
                  <Switch
                    value={field.value}
                    onValueChange={field.onChange}
                    trackColor={{ false: colors.destructive, true: colors.positive }}
                    ios_backgroundColor={colors.destructive}
                    thumbColor={colors.muted}
                  />
                )}
              />
            )}
          </View>
        </View>
        {shauhinEnabled && (
          <View className='rounded-lg bg-accent p-2'>
            <Text className='mb-2 font-bold text-black'>Start Timing</Text>
            {locked ? (
              <Text className='text-sm text-black'>
                {startWeek === 'Custom' ? `Custom (after ${customStartWeek} episodes)` : startWeek}
              </Text>
            ) : (
              <View>
                {startWeek === 'Custom' && (
                  <Controller
                    control={reactForm.control}
                    name='customStartWeek'
                    render={({ field }) => (
                      <View>
                        <TextInput
                          className={cn(
                            'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
                          )}
                          placeholder='Enable after episode...'
                          value={Math.max(2, field.value || 2).toString()}
                          onChangeText={text => field.onChange(parseInt(text) || 2)}
                          keyboardType='numeric' />
                        {field?.value && field.value > 14 && (
                          <Text className='mt-1 text-xs text-red-500'>
                            Warning: Most seasons do not have this many weeks!
                          </Text>
                        )}
                        <SearchableSelect
                          options={timingOptions}
                          selectedValue={field.value ?? ''}
                          onSelect={field.onChange}
                          placeholder='Search timing options...'>
                          <Text className='text-gray-700'>{startWeek || 'Select Betting Start Week'}</Text>
                        </SearchableSelect>
                      </View>
                    )} />
                )}
              </View>
            )}
            <Text className='mt-1 text-sm text-black'>
              Choose when Shauhin Mode activates. You can choose from predefined timings or set a
              custom week for betting to start.
            </Text>
          </View>
        )}
        {shauhinEnabled && (
          <View className='rounded-lg bg-accent p-2'>
            <View className='mb-2 flex-row gap-4'>
              <View className='flex-1'>
                <Text className='mb-2 font-bold text-black'>Max Points Per Bet</Text>
                {locked ? (
                  <Text className='text-sm text-black'>{maxBet}</Text>
                ) : (
                  <Controller
                    control={reactForm.control}
                    name='maxBet'
                    render={({ field }) => (
                      <TextInput
                        className={cn(
                          'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
                        )}
                        placeholder='Max Bet (0 for Unlimited)'
                        value={field.value?.toString() ?? '0'}
                        onChangeText={text => {
                          const value = Math.min(parseInt(text) || 0, ABS_MAX_EVENT_POINTS);
                          field.onChange(value);
                        }}
                        keyboardType='numeric'
                      />
                    )}
                  />
                )}
              </View>
              <View className='flex-1'>
                <Text className='mb-2 font-bold text-black'>Max Bets Per Week</Text>
                {locked ? (
                  <Text className='text-sm text-black'>
                    {maxBetsPerWeek === 0 ? 'Unlimited' : maxBetsPerWeek}
                  </Text>
                ) : (
                  <Controller
                    control={reactForm.control}
                    name='maxBetsPerWeek'
                    render={({ field }) => (
                      <TextInput
                        className={cn(
                          'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
                        )}
                        placeholder='Max Bets (0 for Unlimited)'
                        value={field.value?.toString() ?? '0'}
                        onChangeText={text => {
                          const value = Math.min(
                            parseInt(text) || 0,
                            SHAUHIN_MODE_MAX_MAX_BETS_PER_WEEK
                          );
                          field.onChange(value);
                        }}
                        keyboardType='numeric'
                      />
                    )}
                  />
                )}
              </View>
            </View>
            <Text className='text-sm text-black'>
              <Text className='font-semibold'>Max Points Per Bet</Text>: max points you can bet on a
              prediction{'\n'}
              <Text className='font-semibold'>Max Bets Per Week</Text>: max number of bets you can
              place in a single week
            </Text>
          </View>
        )}
        {shauhinEnabled && (
          <View className='rounded-lg bg-accent p-2'>
            <Text className='mb-2 font-bold text-black'>Enabled Bets</Text>
            {locked ? (
              <Text className='text-sm text-black'>
                {enabledBets && enabledBets.length > 0
                  ? enabledBets
                    .map((name: ScoringBaseEventName) => BaseEventFullName[name])
                    .join(', ')
                  : 'None'}
              </Text>
            ) : (
              <Controller
                control={reactForm.control}
                name='enabledBets'
                render={({ field }) => (
                  <View>
                    <SearchableMultiSelect
                      options={betsOptions}
                      selectedValues={field.value || []}
                      onToggleSelect={field.onChange}
                      placeholder='Search bet options...' >
                      <Text>
                        {enabledBets && enabledBets.length > 0
                          ? enabledBets
                            .map((name: ScoringBaseEventName) => BaseEventFullName[name])
                            .join(', ')
                          : 'Select enabled bets'}
                      </Text>
                    </SearchableMultiSelect>
                  </View>
                )} />
            )}
            <Text className='mt-1 text-sm text-black'>
              Select what you can bet on from your enabled official and custom prediction events.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
