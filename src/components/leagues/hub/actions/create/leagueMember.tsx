import { type Control, Controller } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { DISPLAY_NAME_MAX_LENGTH } from '~/lib/leagues';
import { twentyColors } from '~/lib/colors';
import { Check } from 'lucide-react-native';
import { getContrastingColor } from '@uiw/color-convert';

interface LeagueMemberProps {
  control: Control<any>;
}

export default function LeagueMember({ control }: LeagueMemberProps) {
  return (
    <View className='flex-1 justify-end items-center p-6 mb-14'>
      <Text className='text-center text-xl text-muted-foreground'>
        Choose your display name and color!
      </Text>
      <Text className='text-center text-sm text-muted-foreground'>
        This is how you'll appear at the top of the leaderboard.
      </Text>
      <Controller
        control={control}
        name='newMember.displayName'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full'>
            <TextInput
              className='border border-primary rounded-lg p-4 text-lg leading-5 placeholder:text-muted-foreground'
              placeholder='League Name'
              autoCapitalize='words'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={DISPLAY_NAME_MAX_LENGTH}
            />
            <Text className='text-sm text-muted-foreground mt-2 text-right'>
              {value.length}/{DISPLAY_NAME_MAX_LENGTH}
            </Text>
          </View>
        )}
      />
      <Controller
        control={control}
        name='newMember.color'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-72 flex-row flex-wrap justify-center gap-1'>
            {twentyColors.map((color) => (
              <View
                className='h-8 w-12 border border-primary items-center justify-center rounded'
                style={{ backgroundColor: color }}
                onTouchEnd={() => {
                  onChange(color);
                  onBlur();
                }}
                key={color}>
                {value === color && (
                  <Check
                    className='self-center mt-2'
                    color={getContrastingColor(color)} size={24} />
                )}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}
