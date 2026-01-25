import { View } from 'react-native';
import MarqueeText from '~/components/common/marquee';
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
        <View className='relative flex-row items-center justify-center w-full max-w-72'>
          <View className='h-6 w-1 bg-primary rounded-full' />
          <MarqueeText
            text={leagueName ? `Join ${leagueName}` : 'Join League'}
            center
            allowFontScaling={false}
            className='text-2xl font-black uppercase tracking-tight text-foreground'
            containerClassName='flex-row'
            noMarqueeContainerClassName='w-min px-0.5' />
          <View className='h-6 w-1 bg-primary rounded-full' />
        </View>
      </View>
    </View>
  );
}
