import { Controller } from 'react-hook-form';
import { View, Text, TextInput, Switch } from 'react-native';
import { LEAGUE_NAME_MAX_LENGTH } from '~/lib/leagues';
import Button from '~/components/common/button';
import { useLeagueDetails } from '~/hooks/leagues/mutation/useLeagueSettings';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';

export default function LeagueDetails() {
  const {
    reactForm,
    handleSubmit,
    resetForm,
    editable,
    isDirty
  } = useLeagueDetails();

  if (!editable) return null;

  const isProtected = reactForm.watch('isProtected');

  return (
    <View className='w-full rounded-xl bg-card p-2 border-2 border-primary/20 gap-2'>
      {/* Header */}
      <View className='flex-row items-center gap-1 h-8'>
        <View className='h-6 w-1 bg-primary rounded-full' />
        <Text className='text-xl font-black uppercase tracking-tight'>
          Edit League Details
        </Text>
      </View>

      {/* League Name */}
      <View>
        <Text className='text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1'>
          League Name
        </Text>
        <Controller
          control={reactForm.control}
          name='name'
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View>
              <TextInput
                className='rounded-lg border-2 border-primary/20 bg-card px-2 py-2 text-base'
                placeholder='League Name'
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize='words'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={LEAGUE_NAME_MAX_LENGTH}
              />
              <Text className='mt-1 text-right text-sm text-muted-foreground'>
                {value?.length || 0}/{LEAGUE_NAME_MAX_LENGTH}
              </Text>
              {error && (
                <Text className='text-sm text-destructive'>{error.message}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Is Protected Toggle */}
      <View className='rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-1'>
            <Text className='font-bold text-foreground'>Protected League</Text>
            <Text className='text-sm text-muted-foreground'>
              {isProtected
                ? 'New members require approval to join'
                : 'Anyone with the link can join'}
            </Text>
          </View>
          <Controller
            control={reactForm.control}
            name='isProtected'
            render={({ field }) => (
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                trackColor={{ false: colors.muted, true: colors.positive }}
                thumbColor='white'
              />
            )}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View className='flex-row gap-2'>
        <Button
          className='flex-1 rounded-lg bg-destructive p-3 active:opacity-80'
          onPress={resetForm}>
          <Text className='text-center font-semibold text-white'>Cancel</Text>
        </Button>
        <Button
          className={cn(
            'flex-1 rounded-lg bg-primary p-3 active:opacity-80',
            !isDirty && 'opacity-50'
          )}
          disabled={!isDirty}
          onPress={() => handleSubmit()}>
          <Text className='text-center font-semibold text-white'>Save</Text>
        </Button>
      </View>
    </View>
  );
}
