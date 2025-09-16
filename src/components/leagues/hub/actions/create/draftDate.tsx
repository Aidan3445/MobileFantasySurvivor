import { type Control, Controller } from 'react-hook-form';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from 'react-native-gesture-handler';

interface DraftDateProps {
  control: Control<any>;
}

export default function DraftDate({ control }: DraftDateProps) {
  return (
    <View className='flex-1 justify-center items-center p-6'>
      <Text className='text-center text-xl text-muted-foreground'>
        When do you want to hold your draft?
      </Text>
      <Text className='text-center text-sm text-muted-foreground mb-8'>
        You can always change this later, or skip it and start the draft manually.
      </Text>
      <Controller
        control={control}
        name='draftDate'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full flex-row justify-center'>
            <DateTimePicker
              minimumDate={new Date()}
              value={value ?? new Date()}
              onChange={(_, date) => {
                onChange(date);
                onBlur();
              }}
              mode='date' />
            <DateTimePicker
              minimumDate={new Date()}
              value={value ?? new Date()}
              mode='time' />
          </View>
        )}
      />
    </View>
  );
}
