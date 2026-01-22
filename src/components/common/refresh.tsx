import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';
const LogoImage = require('~/assets/Logo.png');

interface RefreshIndicatorProps {
  refreshing: boolean;
  scrollY: Animated.Value;
  logoSize?: number;
}

export default function RefreshIndicator({
  refreshing,
  scrollY,
  logoSize = 80,
}: RefreshIndicatorProps) {
  const height = useHeaderHeight();
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
      if (value > 0) {
        // Hide logo when scrolling down content (even if refreshing)
        logoOpacity.setValue(0);
        logoTranslateY.setValue(-logoSize - 20);
      } else if (refreshing && value <= 0) {
        // Show logo when refreshing and at/above top
        logoOpacity.setValue(1);
        logoTranslateY.setValue(0);
      } else if (value < 0) {
        // Show logo proportionally when pulling down (not refreshing)
        const pullDistance = Math.abs(value);
        const pullOpacity = Math.min(pullDistance / 100, 1);
        logoOpacity.setValue(pullOpacity);

        // Slide logo down as user pulls (capped at 0 translateY)
        const translateY = Math.min(pullDistance - logoSize - 20, 0);
        logoTranslateY.setValue(translateY);
      } else {
        // Hide logo when at top and not refreshing
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
        left: 0,
        right: 0,
        top: height,
        zIndex: 9,
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
