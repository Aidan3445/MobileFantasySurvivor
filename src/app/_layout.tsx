import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import '~/global.css';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function RootLayout() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

  return (
    <GestureHandlerRootView className='flex-1 bg-background'>
      <ClerkProvider
        tokenCache={tokenCache}
        telemetry={false}>
        <QueryClientContextProvider>
          <Slot />
        </QueryClientContextProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
