import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import '~/global.css';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

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
    <GestureHandlerRootView className='flex-1 bg-background'>
      <StatusBar barStyle='dark-content' />

      <ClerkProvider tokenCache={tokenCache} telemetry={false}>
        <QueryClientContextProvider>
          <KeyboardProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name='(tabs)'
                options={{ headerShown: false }} />
              <Stack.Screen
                name='(modals)'
                options={{ presentation: 'modal', headerShown: false }} />
            </Stack>
          </KeyboardProvider>
        </QueryClientContextProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
