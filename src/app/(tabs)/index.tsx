'use client';

import { useIsFetching } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, RefreshControl, ScrollView, View } from 'react-native';
import ActiveLeagues from '~/components/home/activeleagues/view';
import Header from '~/components/home/header/view';
import QuickActions from '~/components/home/quickActions/view';
import { CastawayScoreboard } from '~/components/home/scoreboard/view';
import LoadingScreen from '~/components/auth/loadingScreen';
import { useHomeRefresh } from '~/hooks/helpers/refresh/useHomeRefresh';

export default function Page() {
  const { refreshing, onRefresh } = useHomeRefresh();
  const isFetching = useIsFetching();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // eslint-disable-next-line no-undef
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      // eslint-disable-next-line no-undef
      clearTimeout(timeoutRef.current);
    }

    // Once fetching is done, wait 50ms to make sure it stays at 0
    if (!refreshing && isFetching === 0 && !hasLoadedOnce) {
      // eslint-disable-next-line no-undef
      timeoutRef.current = setTimeout(() => {
        setHasLoadedOnce(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 50);
    }

    return () => {
      if (timeoutRef.current) {
        // eslint-disable-next-line no-undef
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isFetching, refreshing, hasLoadedOnce, fadeAnim]);

  const showLoadingScreen = !hasLoadedOnce;

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      {/* Render content with fade-in */}
      <Animated.View style={{ opacity: fadeAnim }} className='flex-1 w-full'>
        <ScrollView
          className='w-full pt-0'
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          <View className='page justify-start gap-y-4 pt-10'>
            <Header refreshing={refreshing} />
            <ActiveLeagues />
            <CastawayScoreboard />
            <QuickActions />
          </View>
        </ScrollView>
      </Animated.View>

      {/* Loading screen overlay - stays until animation starts */}
      {showLoadingScreen && (
        <View className='absolute inset-0'>
          <LoadingScreen />
        </View>
      )}
    </View>
  );
}
