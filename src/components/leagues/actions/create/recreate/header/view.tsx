import { View, Text } from 'react-native';

export default function RecreateLeagueHeader() {
  return (
    <View className='items-center gap-2 px-4 py-4'>
      <View className='flex-row items-center gap-2'>
        <View className='h-6 w-1 rounded-full bg-primary' />
        <Text className='text-2xl font-black uppercase tracking-tight text-foreground'>
          Clone League
        </Text>
        <View className='h-6 w-1 rounded-full bg-primary' />
      </View>
    </View>
  );
}
