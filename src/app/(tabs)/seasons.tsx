import React from 'react';
import { Animated, RefreshControl, ScrollView, View, Text } from 'react-native';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';

export default function SeasonsScreen() {
  const { refreshing, onRefresh, scrollY } = useRefresh([['seasons']]);

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false
  });

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-background relative'>
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} />
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View className={cn(
          'page justify-start gap-y-4 transition-all',
          refreshing && 'pt-8'
        )}>
          <Text className='text-base text-center font-medium bg-red-400'
          >Seasons Screen Content Goes Here</Text>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}
