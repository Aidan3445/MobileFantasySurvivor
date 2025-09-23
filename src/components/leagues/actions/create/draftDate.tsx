import { type Control, Controller } from 'react-hook-form';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from 'react-native-gesture-handler';
import { colors } from '~/lib/colors';

interface DraftDateProps {
  control: Control<any>;
}

export default function DraftDate({ control }: DraftDateProps) {
  return (
    <View className='flex-1 items-center justify-center p-6'>
      <Text className='text-center text-xl text-muted-foreground'>
        When do you want to hold your draft?
      </Text>
      <Text className='mb-8 text-center text-sm text-muted-foreground'>
        You can always change this later, or skip it and start the draft
        manually.
      </Text>
      <Controller
        control={control}
        name='draftDate'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full flex-row justify-center'>
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
        )}
      />
      <Text className='text-center text-xs italic text-muted-foreground'>
        Tip: Try drafting after the premiere to meet the castaways first!
      </Text>
    </View>
  );
}
