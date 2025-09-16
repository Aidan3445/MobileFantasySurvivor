import { type Control, Controller } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { LEAGUE_NAME_MAX_LENGTH } from '~/lib/leagues';

interface LeagueNameProps {
  control: Control<any>;
}

export default function LeagueName({ control }: LeagueNameProps) {
  return (
    <View className='flex-1 justify-center items-center p-6'>
      <Text className='text-center text-xl text-muted-foreground mb-8'>
        Choose a name for your league
      </Text>
      <Controller
        control={control}
        name='leagueName'
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='w-full'>
            <TextInput
              className='border border-primary rounded-lg p-4 text-lg leading-5 placeholder:text-muted-foreground'
              placeholder='League Name'
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
