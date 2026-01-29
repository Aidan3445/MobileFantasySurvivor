import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import '~/global.css';
import * as ScreenOrientation from 'expo-screen-orientation';

// Suppress specific warning from react-native-reanimated-carousel
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('`value` during component render')) {
    return;
  }
  originalWarn(...args);
};

export default function RootLayout() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

  return (
    <ClerkProvider tokenCache={tokenCache} telemetry={false}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
