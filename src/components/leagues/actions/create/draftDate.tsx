import { type Control, Controller } from 'react-hook-form';
import { View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '~/lib/colors';
import Button from '~/components/common/button';
import { Calendar, Clock, Zap } from 'lucide-react-native';

interface DraftDateProps {
  control: Control<any>;
  editing?: boolean;
  submit?: () => void;
}

export default function DraftDate({ control, editing, submit }: DraftDateProps) {
  return (
    <View className='items-center justify-center'>
      {/* Title Section */}
      <View className='mb-6 items-center'>
        <View className='mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20'>
          <Calendar size={24} color={colors.primary} />
        </View>
        <Text className='text-center text-xl font-black tracking-wide text-foreground'>
          Schedule Your Draft
        </Text>
        <Text className='mt-1 text-center text-base text-muted-foreground'>
          {!editing ? 'Optional - you can start manually anytime' : 'Set a date or start now'}
        </Text>
      </View>

      <Controller
        control={control}
        name='draftDate'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full items-center gap-4'>
            {/* Manual Start Button (editing mode only) */}
            {editing && (
              <Button
                className='w-full flex-row items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-transparent py-3 active:bg-primary/10'
                disabled={!value}
                onPress={() => {
                  onChange(null);
                  onBlur();
                  submit?.();
                }}>
                <Zap size={18} color={colors.primary} />
                <Text className='font-semibold text-primary'>Start Draft Now</Text>
              </Button>
            )}

            {/* Date/Time Picker Cards */}
            <View className='w-full gap-3'>
              {/* Date Picker */}
              <View className='flex-row items-center rounded-lg border-2 border-primary/20 bg-card px-4 py-3'>
                <View className='mr-3 h-10 w-10 items-center justify-center rounded-lg bg-primary/20'>
                  <Calendar size={20} color={colors.primary} />
                </View>
                <Text className='flex-1 font-medium text-foreground'>Date</Text>
                <DateTimePicker
                  minimumDate={new Date()}
                  maximumDate={new Date(Date.now() + 15778476000)}
                  value={value ?? new Date(Date.now() + 604800000)}
                  onChange={(_, date) => {
                    if (!date) return;
                    const prev = value ?? new Date();
                    const newDate = new Date(date);
                    newDate.setHours(prev.getHours());
                    newDate.setMinutes(prev.getMinutes());
                    newDate.setSeconds(0);
                    newDate.setMilliseconds(0);
                    onChange(newDate);
                    onBlur();
                  }}
                  accentColor={colors.card}
                  mode='date' />
              </View>

              {/* Time Picker */}
              <View className='flex-row items-center rounded-lg border-2 border-primary/20 bg-card px-4 py-3'>
                <View className='mr-3 h-10 w-10 items-center justify-center rounded-lg bg-primary/20'>
                  <Clock size={20} color={colors.primary} />
                </View>
                <Text className='flex-1 font-medium text-foreground'>Time</Text>
                <DateTimePicker
                  minimumDate={new Date()}
                  value={value ?? new Date()}
                  onChange={(_, date) => {
                    if (!date) return;
                    const prev = value ?? new Date();
                    const newDate = new Date(prev);
                    newDate.setHours(date.getHours());
                    newDate.setMinutes(date.getMinutes());
                    newDate.setSeconds(0);
                    newDate.setMilliseconds(0);
                    onChange(newDate);
                    onBlur();
                  }}
                  accentColor={colors.card}
                  mode='time' />
              </View>
            </View>

            {/* Tip */}
            <View className='mt-2 rounded-lg bg-card px-4 py-3 w-full border-2 border-primary/20'>
              <Text className='text-center text-base text-muted-foreground'>
                Draft after the premiere to meet
                the castaways first!
              </Text>
            </View>
          </View>
        )} />
    </View>
  );
}
