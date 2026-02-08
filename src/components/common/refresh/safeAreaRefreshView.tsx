import { type ReactNode } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, Platform, type Animated } from 'react-native';
import { type Edges, SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '~/lib/utils';
import { AndroidRefreshView } from '~/components/common/refresh/androidView';
import IOSRefreshView from '~/components/common/refresh/iosView';

export interface SafeAreaRefreshViewProps {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleScroll?: (_event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollY?: Animated.Value;
  header?: ReactNode;
  extraHeight?: number;
  alreadySafe?: boolean;
  children: ReactNode;
  className?: string;
}

export default function SafeAreaRefreshView({
  refreshing,
  onRefresh,
  handleScroll,
  scrollY,
  header,
  extraHeight,
  alreadySafe,
  children,
  className
}: SafeAreaRefreshViewProps) {
  const edges: Edges = alreadySafe ? [] : ['top'];
  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-background', className)}>
      {Platform.OS === 'ios' ? (
        <IOSRefreshView
          refreshing={refreshing}
          onRefresh={onRefresh}
          handleScroll={handleScroll}
          scrollY={scrollY}
          header={header}
          extraHeight={extraHeight}>
          {children}
        </IOSRefreshView>
      ) : (
        <AndroidRefreshView
          refreshing={refreshing}
          onRefresh={onRefresh}
          handleScroll={handleScroll}
          header={header}>
          {children}
        </AndroidRefreshView>
      )}
    </SafeAreaView>
  );
}
