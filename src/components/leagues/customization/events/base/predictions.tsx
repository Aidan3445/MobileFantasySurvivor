import { Flame } from 'lucide-react-native';
import { Text, View, TextInput, Switch } from 'react-native';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { colors } from '~/lib/colors';
import { cn } from '~/lib/utils';
import { type PredictionTiming } from '~/types/events';
import { PredictionTimings } from '~/lib/events';
import { type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import SearchableMultiSelect from '~/components/common/searchableMultiSelect';

interface BasePredictionFormFieldProps {
  eventName: string;
  reactForm: UseFormReturn<any>;
  disabled?: boolean;
}

export function BasePredictions({ eventName, reactForm, disabled }: BasePredictionFormFieldProps) {
  const predictionEnabled = reactForm.watch(`basePredictionRules.${eventName}.enabled`) as boolean;
  const predictionPoints = reactForm.watch(`basePredictionRules.${eventName}.points`) as number;
  const predictionTiming = reactForm.watch(
    `basePredictionRules.${eventName}.timing`
  ) as PredictionTiming[];

  const timingOptions: SearchableOption<PredictionTiming>[] = PredictionTimings.map(timing => ({
    value: timing,
    label: timing
  }));

  return (
    <View>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <Text className='text-sm font-medium'>Prediction:</Text>
          {disabled ? (
            <Text
              className={`font-semibold ${predictionEnabled ? 'text-positive' : 'text-destructive'}`}>
              {predictionEnabled ? 'On' : 'Off'}
            </Text>
          ) : (
            <Controller
              control={reactForm.control}
              name={`basePredictionRules.${eventName}.enabled`}
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
        {predictionEnabled && (
          <View className='flex-row items-center gap-2'>
            <Text className='text-sm'>Points:</Text>
            {disabled ? (
              <View className='flex-row items-center'>
                <Text
                  className={cn(
                    'mr-1 text-lg font-bold',
                    predictionPoints <= 0 ? 'text-destructive' : 'text-positive',
                    predictionPoints === 0 && 'text-neutral'
                  )}>
                  {predictionPoints}
                </Text>
                <Flame
                  size={16}
                  color={colors.positive}
                />
              </View>
            ) : (
              <Controller
                control={reactForm.control}
                name={`basePredictionRules.${eventName}.points`}
                render={({ field }) => (
                  <TextInput
                    className={cn(
                      'w-24 rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
                    )}
                    value={field.value?.toString() ?? '0'}
                    onChangeText={text => {
                      const value = parseInt(text) || 0;
                      field.onChange(value);
                    }}
                    keyboardType='numeric'
                  />
                )}
              />
            )}
          </View>
        )}
      </View>

      {predictionEnabled && (
        <View className='mt-2'>
          {disabled ? (
            <Text className='text-xs italic text-muted-foreground'>
              {predictionTiming?.join(', ') || 'No timing set'}
            </Text>
          ) : (
            <View>
              <Controller
                control={reactForm.control}
                name={`basePredictionRules.${eventName}.timing`}
                render={({ field }) => (
                  <SearchableMultiSelect
                    options={timingOptions}
                    selectedValues={field.value}
                    onToggleSelect={field.onChange}
                    placeholder='Search timing options...'
                    emptyMessage='No timing options found.'>
                    <Text className='text-sm'>
                      {predictionTiming?.length > 0
                        ? predictionTiming.join(', ')
                        : 'Select prediction timing'}
                    </Text>
                  </SearchableMultiSelect>
                )}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
