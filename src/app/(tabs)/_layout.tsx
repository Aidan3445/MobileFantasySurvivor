import { Tabs, usePathname } from 'expo-router';
import { Flame, Trophy, UserCircle2 } from 'lucide-react-native';
import { Image } from 'react-native';
import { colors } from '~/lib/colors';
const HomeImage = require('~/assets/Icon.png');

export default function TabLayout() {
  const pathname = usePathname();

  const isLeaguesPath = pathname.startsWith('/leagues');

  return (
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
              className='max-w-8 max-h-8'
              source={HomeImage}
              style={{ tintColor: color }} />
          )
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
        name='leagues/index'
        options={{
          title: 'Leagues',
          tabBarIcon: ({ color }) => (
            <Trophy color={isLeaguesPath ? colors!.primary : color} size={32} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            color: isLeaguesPath ? colors!.primary : colors!.secondary
          },
          href: { pathname: '/leagues' }
        }} />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <UserCircle2 color={color} size={32} />
          )
        }} />
      {/* Hidden screens */}
      <Tabs.Screen
        name='leagues/create'
        options={{ href: null }} />
      <Tabs.Screen
        name='leagues/join/index'
        options={{ href: null }} />
      <Tabs.Screen
        name='leagues/join/[hash]'
        options={{ href: null }} />
      <Tabs.Screen
        name='leagues/[hash]'
        options={{ href: null }} />
    </Tabs>
  );
}

