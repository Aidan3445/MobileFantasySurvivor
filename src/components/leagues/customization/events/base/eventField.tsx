import { Flame } from 'lucide-react-native';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Text, View, TextInput } from 'react-native';
import { colors } from '~/lib/colors';
import { BaseEventDescriptions, BaseEventFullName } from '~/lib/events';
import { cn } from '~/lib/utils';
import { BasePredictions } from '~/components/leagues/customization/events/base/predictions';
import { type ScoringBaseEventName } from '~/types/events';

interface EventFieldProps {
  reactForm: UseFormReturn<any>;
  eventName: ScoringBaseEventName;
  fieldPath: string;
  disabled?: boolean;
  hidePrediction?: boolean;
}

export default function EventField({
  reactForm,
  eventName,
  fieldPath,
  disabled,
  hidePrediction,
}: EventFieldProps) {
  const currentValue = reactForm.watch(fieldPath);
  const hasItalicDescription =
    BaseEventDescriptions.italics?.[eventName as keyof typeof BaseEventDescriptions.italics];

  const getPointsColor = () => {
    if (currentValue === 0) return colors.neutral;
    return currentValue > 0 ? colors.positive : colors.destructive;
  };

  return (
    <View className='gap-1.5 rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2'>
      {/* Header Row */}
      <View className='flex-row items-center justify-between'>
        <Text className='flex-1 text-sm font-semibold text-foreground'>
          {BaseEventFullName[eventName as keyof typeof BaseEventFullName]}
        </Text>

        {disabled ? (
          <View className='flex-row items-center gap-1'>
            <Text
              className={cn(
                'text-base font-bold',
                currentValue === 0
                  ? 'text-muted-foreground'
                  : currentValue > 0
                    ? 'text-green-700'
                    : 'text-destructive'
              )}>
              {currentValue > 0 ? `+${currentValue}` : currentValue}
            </Text>
            <Flame size={14} color={getPointsColor()} />
          </View>
        ) : (
          <Controller
            control={reactForm.control}
            name={fieldPath}
            render={({ field }) => (
              <View className='flex-row items-center gap-1'>
                <TextInput
                  className='w-16 rounded-lg border-2 border-primary/20 bg-card px-2 py-1 text-center text-base font-bold leading-5'
                  value={field.value?.toString()}
                  onChangeText={(text) => {
                    // Handle negative numbers and empty input
                    if (text === '-' || text === '') {
                      field.onChange(text === '-' ? text : 0);
                      return;
                    }
                    const value = parseInt(text) || 0;
                    field.onChange(value);
                  }}
                  keyboardType='numbers-and-punctuation'
                  placeholder='0'
                  placeholderTextColor={colors['muted-foreground']}
                />
                <Flame size={14} color={getPointsColor()} />
              </View>
            )}
          />
        )}
      </View>

      {/* Description */}
      <Text className='text-xs leading-tight text-muted-foreground'>
        {BaseEventDescriptions.main[eventName as keyof typeof BaseEventDescriptions.main]}
        {hasItalicDescription && (
          <Text className='italic text-muted-foreground'> {hasItalicDescription}</Text>
        )}
      </Text>

      {/* Predictions (if enabled) */}
      {!hidePrediction && (
        <BasePredictions eventName={eventName} reactForm={reactForm} disabled={disabled} />
      )}
    </View>
  );
}
