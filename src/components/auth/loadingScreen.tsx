import { type ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/auth/header';
import { cn } from '~/lib/utils';

interface LoadingScreenProps {
  noBounce?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function LoadingScreen({ noBounce, className, children }: LoadingScreenProps) {
  return (
    <SafeAreaView className='flex-1 justify-around bg-background p-6'>
      <Header className={cn(!noBounce && 'animate-bounce', className)} />
      {children}
    </SafeAreaView>
  );
}
