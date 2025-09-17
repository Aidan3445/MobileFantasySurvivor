import { type Control, Controller } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { LEAGUE_NAME_MAX_LENGTH } from '~/lib/leagues';
import { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';

const placeholderOptions = [
  'Jeff Probst Fan Club',
  'Torch Snuffers',
  'Jury\'s Out'
];

interface LeagueNameProps {
  control: Control<any>;
}

export default function LeagueName({ control }: LeagueNameProps) {
  const [placeholder, setPlaceholder] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      setPlaceholder((prev) => (prev + 1) % placeholderOptions.length);
    }, 2000);

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval);
  }, [setPlaceholder]);

  return (
    <View className='flex-1 justify-center items-center p-6'>
      <Text className='text-center text-xl text-muted-foreground'>
        Choose a name for your league
      </Text>
      <Text className='text-center text-sm text-muted-foreground mb-8'>
        You can always change this later.
      </Text>
      <Controller
        control={control}
        name='leagueName'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full'>
            <TextInput
              className={cn('border border-primary rounded-lg p-4 text-lg leading-5 placeholder:text-muted-foreground',
                value.length === 0 && 'italic')}
              placeholder={placeholderOptions[placeholder]}
              autoCapitalize='words'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={LEAGUE_NAME_MAX_LENGTH}
            />
            <Text className='text-sm text-muted-foreground mt-2 text-right'>
              {value.length}/{LEAGUE_NAME_MAX_LENGTH}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
