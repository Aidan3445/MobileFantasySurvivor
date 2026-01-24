import { View, Text } from 'react-native';
import { ListPlus, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Button from '~/components/common/button';
import { cn } from '~/lib/utils';

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
  const router = useRouter();

  return (
    <View className={cn('mb-2 flex-row gap-4', className)}>
      <Button
        className='flex-1 flex-row items-center justify-center rounded-lg bg-primary p-4'
        onPress={() => router.replace('/leagues/create')}>
        <ListPlus size={20} color='white' />
        <Text className='ml-2 font-semibold text-white'>Create League</Text>
      </Button>
      <Button
        className='flex-1 flex-row items-center justify-center rounded-lg bg-secondary p-4'
        onPress={() => {
          router.replace('/leagues/join');
        }}>
        <Users size={20} color='white' />
        <Text className='ml-2 font-semibold text-white'>Join League</Text>
      </Button>
    </View>
  );
}
