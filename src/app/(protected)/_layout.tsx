import { Stack } from 'expo-router';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { useEffect, useRef } from 'react';
import { registerPushToken } from '~/lib/notifications';
import { useFetch } from '~/hooks/helpers/useFetch';

function NotificationManager() {
  const postData = useFetch('POST');
  const postRef = useRef(postData);
  postRef.current = postData;

  useEffect(() => {
    registerPushToken(postRef.current).catch((err) =>
      console.error('Failed to register push token:', err),
    );
  }, []);

  return null;
}

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView>
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
