import { View, Text, Pressable } from 'react-native';
import { ListPlus, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function QuickActions() {
  const router = useRouter();

  return (
    <View className='flex-row gap-4 px-4 mt-auto mb-2'>
      <Pressable
        className='flex-1 bg-primary rounded-lg p-4 flex-row items-center justify-center active:bg-primary/80'
        onPress={() => router.push('/leagues/create')}>
        <ListPlus size={20} color='white' />
        <Text className='text-white font-semibold ml-2'>Create League</Text>
      </Pressable>

      <Pressable
        className='flex-1 bg-secondary rounded-lg p-4 flex-row items-center justify-center active:bg-secondary/80'
        onPress={() => router.push('/leagues/join')}>
        <Users size={20} color='black' />
        <Text className='text-black font-semibold ml-2'>Join League</Text>
      </Pressable>
    </View>
  );
}
