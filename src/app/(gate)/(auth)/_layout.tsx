import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={'/(tabs)'} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <Stack.Screen name='sign-in' options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name='sign-up' options={{ animation: 'default' }} />
    </Stack>
  );
}
