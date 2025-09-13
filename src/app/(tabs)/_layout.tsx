import { Tabs } from 'expo-router';
import { Flame, Trophy, UserCircle2 } from 'lucide-react-native';
import tailwindConfig from '../../../tailwind.config.js'; // adjust path as needed
import { Image } from 'react-native';

const HomeImage = require('~/assets/Icon.png');

const colors = tailwindConfig.theme!.extend!.colors! as Record<string, string>;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors!.primary,
        tabBarInactiveTintColor: colors!.secondary,
        tabBarStyle: { backgroundColor: colors!.navigation, height: 64 },
        tabBarLabelStyle: { fontSize: 12 },
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={HomeImage}
              style={{ width: 32, height: 32, tintColor: color }} />
          )
        }} />
      <Tabs.Screen
        name='playground'
        options={{
          title: 'Playground',
          tabBarIcon: ({ color }) => (
            <Flame color={color} size={32} />
          )
        }} />
      <Tabs.Screen
        name='leagues'
        options={{
          title: 'Leagues',
          tabBarIcon: ({ color }) => (
            <Trophy color={color} size={32} />
          )
        }} />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <UserCircle2 color={color} size={32} />
          )
        }} />
    </Tabs>
  );
}

