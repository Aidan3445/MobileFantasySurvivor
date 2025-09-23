import { Flame } from 'lucide-react-native';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
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
}

export default function EventField({
  reactForm,
  eventName,
  fieldPath,
  disabled
}: EventFieldProps) {
  const currentValue = reactForm.watch(fieldPath);
  const hasItalicDescription =
    BaseEventDescriptions.italics?.[
      eventName as keyof typeof BaseEventDescriptions.italics
    ];

  return (
    <View className='gap-1 rounded-lg bg-accent px-2 pb-1'>
      <View className='flex-row items-center justify-between pt-1'>
        <Text className='flex-1 text-base font-semibold'>
          {BaseEventFullName[eventName as keyof typeof BaseEventFullName]}
        </Text>
        {disabled ? (
          <View className='flex-row items-center'>
            <Text
              className={cn(
                'mr-1 text-lg font-bold',
                currentValue <= 0 ? 'text-destructive' : 'text-positive',
                currentValue === 0 && 'text-neutral'
              )}>
              {currentValue}
            </Text>
            <Flame
              size={16}
              color={
                currentValue <= 0
                  ? currentValue < 0
                    ? colors.destructive
                    : colors.neutral
                  : colors.positive
              }
            />
          </View>
        ) : (
          <Controller
            control={reactForm.control}
            name={fieldPath}
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
                placeholder='Points'
              />
            )}
          />
        )}
      </View>

      <View>
        <Text className='text-sm leading-none text-muted-foreground'>
          {
            BaseEventDescriptions.main[
              eventName as keyof typeof BaseEventDescriptions.main
            ]
          }
          {hasItalicDescription && (
            <Text className='text-xs italic text-muted-foreground'>
              {' '}
              {hasItalicDescription}
            </Text>
          )}
        </Text>
      </View>
      <BasePredictions
        eventName={eventName}
        reactForm={reactForm}
        disabled={disabled}
      />
    </View>
  );
}
