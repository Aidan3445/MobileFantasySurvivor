import { View, Animated, Platform } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { cn } from '~/lib/utils';
const LogoImage = require('~/assets/Logo.png');

interface HeaderProps {
  className?: string;
  refreshing?: boolean;
}

export default function Logo({ className, refreshing = false }: HeaderProps) {
  const logoRotation = useRef(new Animated.Value(0)).current;
  const isRefreshingRef = useRef(refreshing);
  const isAnimatingRef = useRef(false);

  // Update the ref when refreshing changes
  useEffect(() => {
    isRefreshingRef.current = refreshing;
  }, [refreshing]);

  useEffect(() => {
    if (Platform.OS === 'android') return;
    const spinOnce = () => {
      isAnimatingRef.current = true;
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start(({ finished }) => {
        if (finished) {
          logoRotation.setValue(0);
          isAnimatingRef.current = false;

          // Check if we should continue spinning
          if (isRefreshingRef.current) {
            spinOnce();
          }
        }
      });
    };

    if (refreshing && !isAnimatingRef.current) {
      spinOnce();
    }
  }, [refreshing, logoRotation]);

  const spin = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View className={cn('items-center', className)}>
      <Animated.Image
        source={LogoImage}
        className={cn('h-40 w-40')}
        style={{
          transform: [{ rotate: spin }]
        }}
        resizeMode='contain' />
    </View>
  );
}

