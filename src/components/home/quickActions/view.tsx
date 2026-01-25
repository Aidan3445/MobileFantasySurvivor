import { View, Text } from 'react-native';
import { ListPlus, Users, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Button from '~/components/common/button';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
  const router = useRouter();

  return (
    <View className={cn('gap-3 flex-row', className)}>
      {/* Create League */}
      <Button
        className='flex-1 flex-row items-center rounded-lg border-2 border-primary/30 bg-card/30 p-2 active:bg-primary/20'
        onPress={() => router.push('/create')}>
        <View className='mr-1 h-10 w-10 items-center justify-center rounded-full bg-primary/20'>
          <ListPlus size={20} color={colors.primary} />
        </View>
        <View className='flex-1'>
          <Text className='font-bold text-foreground'>Create League</Text>
          <Text className='text-xs text-muted-foreground'>Start a new league</Text>
        </View>
        <ChevronRight size={20} color={colors.primary} />
      </Button>

      {/* Join League */}
      <Button
        className='flex-1 flex-row items-center rounded-lg border-2 border-secondary/70 bg-card/30 p-2 active:bg-secondary/20'
        onPress={() => router.push('/join')}>
        <View className='mr-1 h-10 w-10 items-center justify-center rounded-full bg-secondary/20'>
          <Users size={20} color={colors.secondary} />
        </View>
        <View className='flex-1'>
          <Text className='font-bold text-foreground'>Join League</Text>
          <Text className='text-xs text-muted-foreground'>Enter an invite code</Text>
        </View>
        <ChevronRight size={20} color={`${colors.primary}AA`} />
      </Button>
    </View>
  );
}
