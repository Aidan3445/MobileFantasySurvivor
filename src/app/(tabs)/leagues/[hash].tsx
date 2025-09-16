import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function LeagueDetailScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <Text className='text-primary text-2xl font-bold'>
        League Hash: {hash}
      </Text>
    </View>
  );
}