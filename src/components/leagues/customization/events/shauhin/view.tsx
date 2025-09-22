'use client';
import { Lock, LockOpen } from 'lucide-react-native';
import { Text, View, Pressable, Switch, TextInput, Linking } from 'react-native';
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
import { type ScoringBaseEventName } from '~/types/events';
import { useSearchableSelect } from '~/hooks/ui/useSearchableSelect';
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
  const timingModal = useSearchableSelect();
  const betsModal = useSearchableSelect();

  const shauhinEnabled = reactForm.watch('enabled');
  const startWeek = reactForm.watch('startWeek');
  const customStartWeek = reactForm.watch('customStartWeek');
  const maxBet = reactForm.watch('maxBet');
  const maxBetsPerWeek = reactForm.watch('maxBetsPerWeek');
  const enabledBets = reactForm.watch('enabledBets');

  const timingOptions = ShauhinModeTimings.map(timing => ({
    value: timing,
    label: timing
  }));

  const betsOptions = Object.entries(rules?.basePrediction ?? {})
    .filter(([_, setting]) => setting.enabled)
    .map(([eventName]) => ({
      value: eventName as ScoringBaseEventName,
      label: BaseEventFullName[eventName as ScoringBaseEventName],
    }));

  const openTikTokLink = () => {
    Linking.openURL('https://www.tiktok.com/t/ZT62XJL2V/');
  };

  return (
    <View className='p-2 bg-card rounded-xl w-full'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-lg font-bold text-card-foreground'>
          Shauhin Mode
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
        Inspired by a{' '}
        <View className='border-b border-b-primary translate-y-[0.05rem]'>
          <Text className='text-primary text-sm -mb-1 leading-none' onPress={openTikTokLink}>
            video
          </Text>
        </View>
        {' '}that{' '}
        <View className='px-1 rounded bg-[#d05dbd] translate-y-[0.5rem]'>
          <Text className='text-white font-medium'>Shauhin Davari</Text>
        </View>
        , from Survivor 48, posted, this twist allows you to bet points you've earned
        throughout the season on predictions. If you win, you gain those points in addition to
        the base points for the event. If you miss the prediction, you get nothing.
      </Text>
      <View className='gap-2'>
        {!locked && (
          <View className='flex-row gap-2'>
            <Pressable
              className={'flex-1 bg-destructive rounded-lg p-3'}
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
        <View className='p-2 rounded-lg bg-accent'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center flex-1'>
              <Text className='text-black font-bold mr-4'>Shauhin Mode</Text>
              <Text className={cn('font-semibold text-lg', shauhinEnabled ? 'text-positive' : 'text-destructive')}>
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
                    thumbColor={colors.muted} />
                )} />
            )}
          </View>
        </View>
        {shauhinEnabled && (
          <View className='p-2 rounded-lg bg-accent'>
            <Text className='text-black font-bold mb-2'>Start Timing</Text>
            {locked ? (
              <Text className='text-black text-sm'>
                {startWeek === 'Custom'
                  ? `Custom (after ${customStartWeek} episodes)`
                  : startWeek}
              </Text>
            ) : (
              <View>
                <Pressable
                  className={cn('border border-primary rounded-lg p-1 bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
                  onPress={timingModal.openModal}>
                  <Text className='text-gray-700'>
                    {startWeek || 'Select Betting Start Week'}
                  </Text>
                </Pressable>
                {startWeek === 'Custom' && (
                  <Controller
                    control={reactForm.control}
                    name='customStartWeek'
                    render={({ field }) => (
                      <View>
                        <TextInput
                          className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
                          placeholder='Enable after episode...'
                          value={Math.max(2, field.value || 2).toString()}
                          onChangeText={(text) => field.onChange(parseInt(text) || 2)}
                          keyboardType='numeric'
                        />
                        {field?.value && field.value > 14 && (
                          <Text className='text-xs text-red-500 mt-1'>
                            Warning: Most seasons do not have this many weeks!
                          </Text>
                        )}
                        <SearchableSelect
                          isVisible={timingModal.isVisible}
                          onClose={timingModal.closeModal}
                          options={timingModal.filterOptions(timingOptions)}
                          selectedValue={field.value ?? ''}
                          onSelect={field.onChange}
                          searchText={timingModal.searchText}
                          onSearchChange={timingModal.setSearchText}
                          placeholder='Search timing options...'
                        />
                      </View>
                    )}
                  />
                )}
              </View>
            )}
            <Text className='text-black text-sm mt-1'>
              Choose when Shauhin Mode activates. You can choose from predefined timings or
              set a custom week for betting to start.
            </Text>
          </View>
        )}
        {shauhinEnabled && (
          <View className='p-2 rounded-lg bg-accent'>
            <View className='flex-row gap-4 mb-2'>
              <View className='flex-1'>
                <Text className='text-black font-bold mb-2'>Max Points Per Bet</Text>
                {locked ? (
                  <Text className='text-black text-sm'>{maxBet}</Text>
                ) : (
                  <Controller
                    control={reactForm.control}
                    name='maxBet'
                    render={({ field }) => (
                      <TextInput
                        className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
                        placeholder='Max Bet (0 for Unlimited)'
                        value={field.value?.toString() ?? '0'}
                        onChangeText={(text) => {
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
                <Text className='text-black font-bold mb-2'>Max Bets Per Week</Text>
                {locked ? (
                  <Text className='text-black text-sm'>
                    {maxBetsPerWeek === 0 ? 'Unlimited' : maxBetsPerWeek}
                  </Text>
                ) : (
                  <Controller
                    control={reactForm.control}
                    name='maxBetsPerWeek'
                    render={({ field }) => (
                      <TextInput
                        className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
                        placeholder='Max Bets (0 for Unlimited)'
                        value={field.value?.toString() ?? '0'}
                        onChangeText={(text) => {
                          const value = Math.min(parseInt(text) || 0, SHAUHIN_MODE_MAX_MAX_BETS_PER_WEEK);
                          field.onChange(value);
                        }}
                        keyboardType='numeric'
                      />
                    )}
                  />
                )}
              </View>
            </View>
            <Text className='text-black text-sm'>
              <Text className='font-semibold'>Max Points Per Bet</Text>: max points you can bet on a prediction{'\n'}
              <Text className='font-semibold'>Max Bets Per Week</Text>: max number of bets you can place in a single week
            </Text>
          </View>
        )}
        {shauhinEnabled && (
          <View className='p-2 rounded-lg bg-accent'>
            <Text className='text-black font-bold mb-2'>Enabled Bets</Text>
            {locked ? (
              <Text className='text-black text-sm'>
                {enabledBets && enabledBets.length > 0
                  ? enabledBets.map((name: ScoringBaseEventName) => BaseEventFullName[name]).join(', ')
                  : 'None'
                }
              </Text>
            ) : (
              <Controller
                control={reactForm.control}
                name='enabledBets'
                render={({ field }) => (
                  <View>
                    <Pressable
                      className={cn('border border-primary rounded-lg p-1 bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
                      onPress={betsModal.openModal}>
                      <Text className='text-gray-700'>
                        {enabledBets && enabledBets.length > 0
                          ? enabledBets.map((name: ScoringBaseEventName) => BaseEventFullName[name]).join(', ')
                          : 'Select enabled bets'}
                      </Text>
                    </Pressable>
                    <SearchableMultiSelect
                      isVisible={betsModal.isVisible}
                      onClose={betsModal.closeModal}
                      options={betsModal.filterOptions(betsOptions)}
                      selectedValues={field.value || []}
                      onToggleSelect={field.onChange}
                      searchText={betsModal.searchText}
                      onSearchChange={betsModal.setSearchText}
                      placeholder='Search bet options...'
                    />
                  </View>
                )} />
            )}
            <Text className='text-black text-sm mt-1'>
              Select what you can bet on from your enabled official and custom prediction events.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
