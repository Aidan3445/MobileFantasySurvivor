'use client';
import { useIsFetching } from '@tanstack/react-query';
import { Tabs, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { BookUser, Flame, Trophy, UserCircle2 } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import { Animated, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingScreen from '~/components/auth/loadingScreen';
import { colors } from '~/lib/colors';


const HomeImage = require('~/assets/Icon.png');

export default function TabLayout() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const isFetching = useIsFetching();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === 'android';

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
  const isOnLeaguesIndex = pathname === '/leagues';

  // If returnTo param exists, navigate to that path
  useEffect(() => {
    if (returnTo) {
      router.push(returnTo);
    }
  }, [returnTo, router]);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarStyle: {
            backgroundColor: colors.navigation,
            height: isAndroid ? 60 : 80,
            paddingBottom: 0,
            paddingTop: isAndroid ? 4 : 0,
            marginBottom: isAndroid ? insets.bottom : 0,
            shadowColor: 'transparent',
          },
          tabBarLabelStyle: { fontSize: 12, },
          tabBarAllowFontScaling: false,
        }}>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Image className='max-h-8 max-w-8' source={HomeImage} style={{ tintColor: color }} />
            ),
          }} />
        <Tabs.Screen
          name='seasons'
          options={{
            title: 'Seasons',
            tabBarIcon: ({ color }) => (
              <BookUser color={color} size={32} />
            ),
          }} />
        <Tabs.Screen
          name='playground'
          options={{
            title: 'Playground',
            tabBarIcon: ({ color }) => (
              <Flame color={color} size={32} />
            ),
          }} />
        <Tabs.Screen
          name='leagues'
          listeners={{
            tabPress: (e) => {
              // If we're already on a leagues sub-page (not index), prevent default and navigate to index
              if (isLeaguesPath && !isOnLeaguesIndex) {
                e.preventDefault();
                router.dismissTo('/leagues');
              }
              // Otherwise, let default behavior handle it (preserve stack)
            },
          }}
          options={{
            title: 'Leagues',
            tabBarIcon: ({ color }) => (
              <Trophy color={isLeaguesPath ? colors!.primary : color} size={32} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              color: isLeaguesPath ? colors!.primary : colors!.secondary,
            }
          }} />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <UserCircle2 color={color} size={32} />
            ),
          }} />
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
