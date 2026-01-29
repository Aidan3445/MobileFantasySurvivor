import { Stack } from 'expo-router';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useDeepLinkHandler } from '~/hooks/routing/useDeepLinkHandler';

export default function ProtectedLayout() {
  useDeepLinkHandler();

  return (
    <GestureHandlerRootView className='flex-1 bg-background'>
      <StatusBar barStyle='dark-content' />
      <QueryClientContextProvider>
        <KeyboardProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='(modals)'
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom'
              }} />
            <Stack.Screen name='(auth)' options={{ headerShown: false, animation: 'none' }} />
          </Stack>
        </KeyboardProvider>
      </QueryClientContextProvider>
    </GestureHandlerRootView>
  );
}
