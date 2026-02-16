'use client';
import { useIsFetching } from '@tanstack/react-query';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Animated, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingScreen from '~/components/auth/loadingScreen';
import { LeaguesIcon, PlaygroundIcon, SeasonsIcon, UserIcon } from '~/components/icons/generated';
import { useNotificationRouting } from '~/hooks/routing/useNotificationRouting';
import useFadeLoading from '~/hooks/ui/useFadeLoading';
import { colors } from '~/lib/colors';

const HomeImage = require('~/assets/LogoTorch.png');

export default function TabLayout() {
  useNotificationRouting();
  const pathname = usePathname();
  const router = useRouter();
  const isFetching = useIsFetching();
  const { showLoading, fadeAnim } = useFadeLoading({ isLoading: isFetching > 0 });

  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === 'android';


  const isLeaguesPath = pathname.startsWith('/leagues');
  const isOnLeaguesIndex = pathname === '/leagues';


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
              <Image
                className='h-9 w-9'
                resizeMode='contain'
                source={HomeImage}
                style={{ tintColor: color }} />
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
              <LeaguesIcon color={isLeaguesPath ? colors!.primary : color} size={32} allowFontScaling={false} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              color: isLeaguesPath ? colors!.primary : colors!.secondary,
            }
          }} />
        <Tabs.Screen
          name='seasons'
          options={{
            title: 'Seasons',
            tabBarIcon: ({ color }) => (
              <SeasonsIcon color={color} size={32} allowFontScaling={false} />
            ),
          }} />
        <Tabs.Screen
          name='playground'
          options={{
            title: 'Playground',
            tabBarIcon: ({ color }) => (
              <PlaygroundIcon color={color} size={32} allowFontScaling={false} />
            ),
          }} />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <UserIcon color={color} size={32} strokeWidth={0.5} allowFontScaling={false} />
            ),
          }} />
      </Tabs>

      {showLoading && (
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
