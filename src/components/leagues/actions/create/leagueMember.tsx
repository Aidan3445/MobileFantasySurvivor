import { type Control, Controller } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { DISPLAY_NAME_MAX_LENGTH } from '~/lib/leagues';
import { twentyColors } from '~/lib/colors';
import { Check, UserX2 } from 'lucide-react-native';
import { getContrastingColor, hexToRgba, rgbaToHex } from '@uiw/color-convert';
import { cn } from '~/lib/utils';

interface LeagueMemberProps {
  control: Control<any>;
  usedColors?: string[];
  currentColor?: string;
  formPrefix?: string;
  className?: string;
}

export default function LeagueMember({
  control,
  usedColors,
  currentColor,
  formPrefix,
  className,
}: LeagueMemberProps) {
  if (control == null) {
    console.error(
      'LeagueMember component requires a control prop from react-hook-form'
    );
    return null;
  }

  return (
    <View className={cn('flex-1 items-center justify-end p-6', className)}>
      <Text className='text-center text-xl text-muted-foreground'>
        Choose your display name and color!
      </Text>
      <Text className='text-center text-sm text-muted-foreground'>
        This is how you'll appear at the top of the leaderboard.
      </Text>
      <Controller
        control={control}
        name={formPrefix ? `${formPrefix}.displayName` : 'displayName'}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full'>
            <TextInput
              className='rounded-lg border border-primary p-4 text-lg leading-5 placeholder:text-muted-foreground'
              placeholder='League Name'
              autoCapitalize='words'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={DISPLAY_NAME_MAX_LENGTH}
            />
            <Text className='mt-2 text-right text-sm text-muted-foreground'>
              {value.length}/{DISPLAY_NAME_MAX_LENGTH}
            </Text>
          </View>
        )}
      />
      <Controller
        control={control}
        name={formPrefix ? `${formPrefix}.color` : 'color'}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-72 flex-row flex-wrap justify-center gap-1'>
            {twentyColors.map(color => {
              let usedColor = false;
              if (usedColors?.includes(color) && color !== currentColor) {
                const rgb = hexToRgba(color);
                const avg = Math.round((rgb.r + rgb.g + rgb.b) / 3);
                color = rgbaToHex({ r: avg, g: avg, b: avg, a: 1 });
                usedColor = true;
              }

              return (
                <View
                  className='h-8 w-12 items-center justify-center rounded border border-primary'
                  style={{ backgroundColor: color }}
                  onTouchEnd={() => {
                    if (usedColor) return;
                    onChange(color);
                    onBlur();
                  }}
                  key={color}
                >
                  {value === color && (
                    <Check
                      className='mt-2 self-center'
                      color={getContrastingColor(color)}
                      size={24}
                    />
                  )}
                  {usedColor && (
                    <UserX2
                      className='mt-2 self-center'
                      color={getContrastingColor(color)}
                      size={24}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}
