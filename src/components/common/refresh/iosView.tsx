import { RefreshControl } from 'react-native';
import { type SafeAreaRefreshViewProps } from '~/components/common/refresh/safeAreaRefreshView';
import IOSRefreshIndicator from '~/components/common/refresh/iosIndicator';
import { Fragment } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

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
      <KeyboardAwareScrollView
        className='w-full'
        showsVerticalScrollIndicator={false}
        bottomOffset={80}
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
      </KeyboardAwareScrollView>
    </Fragment>
  );
}
