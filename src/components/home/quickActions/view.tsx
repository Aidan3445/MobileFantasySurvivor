import { View, Text } from 'react-native';
import { ListPlus, Users, ChevronRight, Recycle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Button from '~/components/common/button';
import PendingLeagues from '~/components/home/quickActions/pendingLeagues';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import { type PublicLeague } from '~/types/leagues';

interface QuickActionsProps {
  showClone?: boolean;
  pendingLeagues?: PublicLeague[];
  className?: string;
}

export default function QuickActions({ showClone, pendingLeagues, className }: QuickActionsProps) {
  const router = useRouter();

  return (
    <View className={cn('w-full gap-2', className)}>
      <View className='flex-row gap-2'>
        <Button
          className='flex-1 flex-row items-center rounded-lg border-2 border-primary/30 bg-accent p-2 active:bg-primary/20'
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
        <Button
          className='flex-1 flex-row items-center rounded-lg border-2 border-primary/30 bg-accent p-2 active:bg-primary/20'
          onPress={() => router.push('/join')}>
          <View className='mr-1 h-10 w-10 items-center justify-center rounded-full bg-primary/20'>
            <Users size={20} color={colors.primary} />
          </View>
          <View className='flex-1'>
            <Text className='font-bold text-foreground'>Join League</Text>
            <Text className='text-xs text-muted-foreground'>Enter an invite code</Text>
          </View>
          <ChevronRight size={20} color={colors.primary} />
        </Button>
      </View>
      <View className='flex-row gap-2'>
        {showClone && (
          <Button
            className='flex-1 flex-row items-center rounded-lg border-2 border-primary/30 bg-accent p-2 active:bg-primary/20'
            onPress={() => router.push('/recreate')}>
            <View className='mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary/20'>
              <Recycle size={20} color={colors.primary} />
            </View>
            <View className='flex-1'>
              <Text className='font-bold text-foreground'>Clone League</Text>
              <Text className='text-xs text-muted-foreground'>Run it back</Text>
            </View>
            <ChevronRight size={20} color={colors.primary} />
          </Button>
        )}
        {pendingLeagues && pendingLeagues.length > 0 && (
          <PendingLeagues pendingLeagues={pendingLeagues} />
        )}
      </View>
    </View>
  );
}
