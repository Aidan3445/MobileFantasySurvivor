import { Stack } from 'expo-router';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function ProtectedLayout() {

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
          </Stack>
        </KeyboardProvider>
      </QueryClientContextProvider>
    </GestureHandlerRootView>
  );
}
