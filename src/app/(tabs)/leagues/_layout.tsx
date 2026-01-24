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
      <Stack.Screen name='create' />
      <Stack.Screen name='join/index' />
      <Stack.Screen name='join/[hash]' />
      <Stack.Screen name='[hash]/index' />
      <Stack.Screen name='[hash]/predraft' />
      <Stack.Screen name='[hash]/draft' />
    </Stack>
  );
}
