import { Stack } from 'expo-router';

export default function LeaguesLayout() {
  return (
    <Stack
      initialRouteName='index'
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name='index'
        options={{
          animation: 'slide_from_left',
        }} />
      <Stack.Screen
        name='join/index'
        options={{
          presentation: 'modal',
        }} />
      <Stack.Screen
        name='join/[hash]'
        options={{
          presentation: 'modal',
        }} />
      <Stack.Screen name='[hash]/index' />
      <Stack.Screen name='[hash]/predraft' />
      <Stack.Screen name='[hash]/draft' />
    </Stack>
  );
}
