import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
const LogoImage = require('~/assets/Logo.png');

interface RefreshIndicatorProps {
  refreshing: boolean;
  scrollY: Animated.Value;
  logoSize?: number;
  topBuffer?: number;
}

export default function RefreshIndicator({
  refreshing,
  scrollY,
  logoSize = 80,
  topBuffer = 60
}: RefreshIndicatorProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-logoSize - 20)).current;
  const isRefreshingRef = useRef(refreshing);
  const isAnimatingRef = useRef(false);

  // Update the ref when refreshing changes
  useEffect(() => {
    isRefreshingRef.current = refreshing;
  }, [refreshing]);

  // Handle refresh state changes
  useEffect(() => {
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
          // If not refreshing, just stop spinning and let scroll handle position
        }
      });
    };

    if (refreshing && !isAnimatingRef.current) {
      // Fade in logo and lock position
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();

      spinOnce();
    }
  }, [refreshing, logoRotation, logoOpacity, logoTranslateY, logoSize]);

  const spin = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Handle scroll to show/hide logo on pull
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      // Show logo when pulling down (but not when already refreshing)
      if (value < 0 && !refreshing) {
        const pullDistance = Math.abs(value);
        const pullOpacity = Math.min(pullDistance / 100, 1);
        logoOpacity.setValue(pullOpacity);

        // Slide logo down as user pulls (capped at 0 translateY)
        const translateY = Math.min(pullDistance - logoSize - 20, 0);
        logoTranslateY.setValue(translateY);
      } else if (!refreshing) {
        logoOpacity.setValue(0);
        logoTranslateY.setValue(-logoSize - 20);
      }
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY, logoOpacity, logoTranslateY, refreshing, logoSize]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: topBuffer,
        zIndex: 10,
        opacity: logoOpacity,
        transform: [{ translateY: logoTranslateY }]
      }}
      className='items-center'>
      <Animated.Image
        source={LogoImage}
        style={{
          width: logoSize,
          height: logoSize,
          transform: [{ rotate: spin }]
        }}
        resizeMode='contain'
      />
    </Animated.View>
  );
}
