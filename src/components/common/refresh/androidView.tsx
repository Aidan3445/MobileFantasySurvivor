import { Fragment, type ReactNode } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, RefreshControl, ScrollView } from 'react-native';
import { colors } from '~/lib/colors';

interface AndroidRefreshViewProps {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleScroll?: (_event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  header?: ReactNode;
  children: ReactNode;
}

export function AndroidRefreshView({
  refreshing,
  onRefresh,
  handleScroll,
  header,
  children,
}: AndroidRefreshViewProps) {
  return (
    <Fragment>
      {header}
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary!]}
            progressBackgroundColor={colors.background} />
        }>
        {children}
      </ScrollView>
    </Fragment>
  );
}
