import { Stack } from 'expo-router';

export default function LeaguesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='create' />
      <Stack.Screen name='join/index' />
      <Stack.Screen name='join/[hash]' />
      <Stack.Screen name='[hash]/index' />
      <Stack.Screen name='[hash]/predraft' />
      <Stack.Screen name='[hash]/draft' />
    </Stack>
  );
}
