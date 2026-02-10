import { RefreshControl, ScrollView } from 'react-native';
import { type SafeAreaRefreshViewProps } from '~/components/common/refresh/safeAreaRefreshView';
import IOSRefreshIndicator from '~/components/common/refresh/iosIndicator';
import { Fragment } from 'react';

export default function IOSRefreshView({
  refreshing,
  onRefresh,
  handleScroll,
  scrollY,
  header,
  extraHeight,
  children,
}: SafeAreaRefreshViewProps) {
  return (
    <Fragment>
      {header}
      {scrollY && (
        <IOSRefreshIndicator
          refreshing={refreshing}
          scrollY={scrollY}
          extraHeight={extraHeight} />
      )}
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent'
            progressViewOffset={-1000} />
        }>
        {children}
      </ScrollView>
    </Fragment>
  );
}
