import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import MarqueeText from '~/components/common/marquee';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';

interface RecreateLeagueHeaderProps {
  leagueName?: string;
}

export default function RecreateLeagueHeader({ leagueName }: RecreateLeagueHeaderProps) {
  const height = useHeaderHeight(0);
  const [displayedName, setDisplayedName] = useState(leagueName ?? 'League');
  const currentRef = useRef(displayedName);

  useEffect(() => {
    if (!leagueName) return;
    let cancelled = false;

    // eslint-disable-next-line no-undef
    const iterate = () => new Promise(resolve => setTimeout(resolve, 0));

    const animate = async () => {
      // DELETE
      while (currentRef.current.length > 0 && !cancelled) {
        currentRef.current = currentRef.current.slice(0, -1);
        setDisplayedName(currentRef.current);
        await iterate();
      }

      // TYPE
      for (let i = 0; i < leagueName.length && !cancelled; i++) {
        currentRef.current += leagueName[i];
        setDisplayedName(currentRef.current);
        await iterate();
      }
    };

    animate();

    return () => {
      cancelled = true;
    };
  }, [leagueName]);

  return (
    <View
      className='absolute top-0 z-10 w-full items-center justify-center bg-card shadow-lg'
      style={{ height }}>
      <View className='items-center justify-center w-full px-6'>
        <Text className='text-2xl font-black uppercase tracking-tight text-foreground -mb-2'>
          Clone
        </Text>
        <View className='relative flex-row items-center justify-center w-full'>
          <View className='h-6 w-1 bg-primary rounded-full' />
          <MarqueeText
            text={displayedName}
            center
            allowFontScaling={false}
            className='text-2xl font-black uppercase tracking-tight text-foreground transition-all'
            containerClassName='flex-row'
            noMarqueeContainerClassName='w-min px-0.5' />
          <View className='h-6 w-1 bg-primary rounded-full' />
        </View>
      </View>
    </View>
  );
}
