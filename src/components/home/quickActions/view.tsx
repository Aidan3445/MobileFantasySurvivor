import { View, Text } from 'react-native';
import { ListPlus, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Button from '~/components/common/button';

export default function QuickActions() {
  const router = useRouter();

  return (
    <View className='mb-2 mt-auto flex-row gap-4 px-4'>
      <Button
        className='flex-1 flex-row items-center justify-center rounded-lg bg-primary p-4'
        onPress={() => router.push('/leagues/create')}
      >
        <ListPlus size={20} color='white' />
        <Text className='ml-2 font-semibold text-white'>Create League</Text>
      </Button>
      <Button
        className='flex-1 flex-row items-center justify-center rounded-lg bg-secondary p-4'
        onPress={() => router.push('/leagues/join')}
      >
        <Users size={20} color='white' />
        <Text className='ml-2 font-semibold text-white'>Join League</Text>
      </Button>
    </View>
  );
}
