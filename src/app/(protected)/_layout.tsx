import { Stack } from 'expo-router';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { useNotifications } from '~/hooks/user/useNotifications';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  const { permissionStatus, requestPermissions } = useNotifications();

  useEffect(() => {
    if (permissionStatus === 'granted') {
      console.log('Notification permissions already granted');
      void requestPermissions();
    }
  }, [permissionStatus, requestPermissions]);

  return (
    <GestureHandlerRootView className='flex-1 bg-background'>
      <StatusBar barStyle='dark-content' />
      <QueryClientContextProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen
            name='(modals)'
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }} />
        </Stack>
      </QueryClientContextProvider>
    </GestureHandlerRootView>
  );
}
