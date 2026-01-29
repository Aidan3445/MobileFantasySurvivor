import '~/global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import LoadingScreen from '~/components/auth/loadingScreen';

try {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
} catch {
  console.warn('Screen Orientation lock failed');
}

// Suppress specific warning from react-native-reanimated-carousel
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('`value` during component render')) {
    return;
  }
  originalWarn(...args);
};

function InitialLayout() {
  // Now you CAN use Clerk hooks here
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';

    if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isSignedIn && !inProtectedGroup) {
      router.replace('/(tabs)');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isLoaded, segments]);

  if (!isLoaded) {
    return <LoadingScreen noBounce />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} telemetry={false}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
