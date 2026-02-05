import { View, Text, TextInput } from 'react-native';
import { Controller, type Control } from 'react-hook-form';

import { colors } from '~/lib/colors';
import { type UserSettings } from '~/hooks/user/useUserManagement';

interface UsernameFieldProps {
  control: Control<UserSettings>;
  locked: boolean;
}

export default function UsernameField({ control, locked }: UsernameFieldProps) {
  return (
    <View className='rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2 gap-1'>
      <Text className='text-sm text-muted-foreground'>Username</Text>
      {locked ? (
        <Controller
          control={control}
          name='username'
          render={({ field }) => (
            <Text className='text-base font-medium text-foreground'>
              {field.value || 'Not set'}
            </Text>
          )}
        />
      ) : (
        <Controller
          control={control}
          name='username'
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View className='gap-1'>
              <TextInput
                className='w-full flex-row items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 px-3 py-2 not-disabled:active:bg-primary/10'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Enter username'
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize='none'
                autoCorrect={false}
              />
              {error && (
                <Text className='text-sm text-destructive'>{error.message}</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
