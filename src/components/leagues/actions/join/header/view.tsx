import { View, Text } from 'react-native';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';

interface JoinLeagueHeaderProps {
  leagueName?: string;
}

export default function JoinLeagueHeader({ leagueName }: JoinLeagueHeaderProps) {
  const height = useHeaderHeight(0);
  return (
    <View
      className='absolute top-0 z-10 w-full items-center justify-center bg-card shadow-lg'
      style={{ height }}>
      <View className='items-center justify-center w-full'>
        <View className='relative flex-row items-center justify-center gap-0.5 w-full'>
          <View className='h-6 w-1 bg-primary rounded-full' />
          <Text
            allowFontScaling={false}
            className='text-2xl font-black uppercase tracking-tight text-foreground'>
            {leagueName ? `Join ${leagueName}` : 'Join League'}
          </Text>
          <View className='h-6 w-1 bg-primary rounded-full' />
        </View>
      </View>
    </View>
  );
}
