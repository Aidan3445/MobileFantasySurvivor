'use client';
import { useIsFetching } from '@tanstack/react-query';
import { Tabs, usePathname } from 'expo-router';
import { Flame, Trophy, UserCircle2 } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import { Animated, Image } from 'react-native';
import LoadingScreen from '~/components/auth/loadingScreen';
import { colors } from '~/lib/colors';

const HomeImage = require('~/assets/Icon.png');

export default function TabLayout() {
  const pathname = usePathname();
  const isFetching = useIsFetching();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let timeoutRef: ReturnType<typeof setTimeout> | null = null;

    if (isFetching === 0 && !hasLoadedOnce) {
      // eslint-disable-next-line no-undef
      timeoutRef = setTimeout(() => {
        setHasLoadedOnce(true);
        // Fade out animation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          // Hide the loading screen after animation completes
          setShowLoadingScreen(false);
        });
      }, 50);
    }

    return () => {
      if (timeoutRef) {
        // eslint-disable-next-line no-undef
        clearTimeout(timeoutRef);
      }
    };
  }, [isFetching, hasLoadedOnce, fadeAnim]);

  const isLeaguesPath = pathname.startsWith('/leagues');

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarStyle: { backgroundColor: colors.navigation, height: 80 },
          tabBarLabelStyle: { fontSize: 12 },
        }}>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Image
                className='max-h-8 max-w-8'
                source={HomeImage}
                style={{ tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='playground'
          options={{
            title: 'Playground',
            tabBarIcon: ({ color }) => (
              <Flame
                color={color}
                size={32}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='leagues/index'
          options={{
            title: 'Leagues',
            tabBarIcon: ({ color }) => (
              <Trophy
                color={isLeaguesPath ? colors!.primary : color}
                size={32}
              />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              color: isLeaguesPath ? colors!.primary : colors!.secondary,
            },
            href: { pathname: '/leagues' },
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <UserCircle2
                color={color}
                size={32}
              />
            ),
          }}
        />
        {/* Hidden screens */}
        <Tabs.Screen
          name='leagues/create'
          options={{ href: null }}
        />
        <Tabs.Screen
          name='leagues/join/index'
          options={{ href: null }}
        />
        <Tabs.Screen
          name='leagues/join/[hash]'
          options={{ href: null }}
        />
        <Tabs.Screen
          name='leagues/[hash]/index'
          options={{ href: null }}
        />
        <Tabs.Screen
          name='leagues/[hash]/predraft'
          options={{ href: null }}
        />
        <Tabs.Screen
          name='leagues/[hash]/draft'
          options={{ href: null }}
        />
      </Tabs>

      {showLoadingScreen && (
        <Animated.View
          style={{ opacity: fadeAnim }}
          className='absolute inset-0 z-50 bg-background'
          pointerEvents='auto'>
          <LoadingScreen />
        </Animated.View>
      )}
    </>
  );
}
