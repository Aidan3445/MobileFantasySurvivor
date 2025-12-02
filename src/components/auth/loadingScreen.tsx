import { type ReactElement } from 'react';
import { View } from 'react-native';
import Header from '~/components/auth/header';
import { cn } from '~/lib/utils';

interface LoadingScreenProps {
  noBounce?: boolean;
  className?: string;
  children?: ReactElement | ReactElement[];
}

export default function LoadingScreen({ noBounce, className, children }: LoadingScreenProps) {
  return (
    <View className='flex-1 justify-around bg-background p-6'>
      <Header className={cn(!noBounce && 'animate-bounce', className)} />
      {children}
    </View>
  );
}
