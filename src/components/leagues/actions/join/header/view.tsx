import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';
import { colors } from '~/lib/colors';

interface JoinLeagueHeaderProps {
  leagueName?: string;
}

export default function JoinLeagueHeader({ leagueName }: JoinLeagueHeaderProps) {
  return (
    <View className='items-center gap-2 px-4 py-4'>
      {/* Icon */}
      <View className='h-16 w-16 items-center justify-center rounded-full bg-primary/20'>
        <Users size={32} color={colors.primary} />
      </View>

      {/* Title */}
      <View className='flex-row items-center gap-2'>
        <View className='h-6 w-1 rounded-full bg-primary' />
        <Text className='text-2xl font-black uppercase tracking-tight text-foreground'>
          Join League
        </Text>
        <View className='h-6 w-1 rounded-full bg-primary' />
      </View>

      {/* League Name */}
      {leagueName && (
        <Text className='text-lg font-semibold text-muted-foreground'>{leagueName}</Text>
      )}
    </View>
  );
}
