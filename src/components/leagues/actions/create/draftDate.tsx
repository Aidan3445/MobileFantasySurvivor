import { type Control, Controller } from 'react-hook-form';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from 'react-native-gesture-handler';
import { colors } from '~/lib/colors';
import Button from '~/components/common/button';

interface DraftDateProps {
  control: Control<any>;
  editing?: boolean;
  submit?: () => void;
}

export default function DraftDate({ control, editing, submit }: DraftDateProps) {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-center text-xl text-muted-foreground'>
        When do you want to hold your draft?
      </Text>
      <Text className='mb-4 text-center text-sm text-muted-foreground'>
        {!editing
          ? 'You can always change this later, or skip it and start the draft manually.'
          : ''}
      </Text>
      <Controller
        control={control}
        name='draftDate'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full items-center justify-center gap-4'>
            {editing && (
              <Button
                className='rounded-lg bg-secondary px-4 py-2'
                disabled={!value}
                onPress={() => {
                  onChange(null);
                  onBlur();
                  submit?.();
                }}>
                <Text className='text-white'>Manually Start Draft</Text>
              </Button>
            )}
            <View className='w-full flex-row items-center justify-center'>
              <DateTimePicker
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 15778476000)} // 6 months from now
                value={value ?? new Date()}
                onChange={(_, date) => {
                  onChange(date);
                  onBlur();
                }}
                accentColor={colors.secondary}
                mode='date'
              />
              <DateTimePicker
                minimumDate={new Date()}
                value={value ?? new Date()}
                onChange={(_, date) => {
                  onChange((prev: Date) => {
                    // Merge date and time
                    if (!date) return prev;
                    const newDate = new Date(prev ?? Date.now());
                    newDate.setHours(date.getHours());
                    newDate.setMinutes(date.getMinutes());
                    newDate.setSeconds(0);
                    newDate.setMilliseconds(0);
                    return newDate;
                  });
                  onBlur();
                }}
                accentColor={colors.secondary}
                mode='time'
              />
            </View>
          </View>
        )}
      />
      <Text className='text-center text-xs italic text-muted-foreground'>
        Tip: Try drafting after the premiere to meet the castaways first!
      </Text>
    </View>
  );
}
