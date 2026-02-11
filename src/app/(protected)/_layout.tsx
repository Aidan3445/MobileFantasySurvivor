import { Stack } from 'expo-router';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { useNotifications } from '~/hooks/user/useNotifications';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

/** Runs inside QueryClientContextProvider so hooks can use React Query */
function NotificationManager() {
  const { isSignedIn } = useAuth();
  const { permissionStatus, requestPermissions } = useNotifications();

  useEffect(() => {
    if (isSignedIn && permissionStatus === 'granted') {
      void requestPermissions();
    }
  }, [isSignedIn, permissionStatus, requestPermissions]);

  return null;
}

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView className='flex-1 bg-background'>
      <StatusBar barStyle='dark-content' />
      <QueryClientContextProvider>
        <NotificationManager />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen
            name='(modals)'
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} />
        </Stack>
      </QueryClientContextProvider>
    </GestureHandlerRootView>
  );
}
