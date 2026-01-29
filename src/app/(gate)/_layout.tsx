import { Slot, useRouter } from 'expo-router';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef } from 'react';
import { isExternallyLinkable } from '~/routing/linkPolicy';
import { useRouteSegments } from '~/routing/useRouteSegments';

export default function GateLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useRouteSegments();
  const router = useRouter();

  const handledInitial = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    const [, group] = segments;
    const isInitial = !handledInitial.current;

    if (isInitial) {
      handledInitial.current = true;

      if (!isExternallyLinkable(segments)) {
        router.replace(isSignedIn ? '/(tabs)' : '/(auth)/sign-in');
        return;
      }
    }

    if (!isSignedIn && group !== '(auth)') {
      console.log('GateLayout render', { segments, isSignedIn });
      router.replace('/(auth)/sign-in');
      return;
    }

    if (isSignedIn && group === '(auth)') {
      router.replace('/(tabs)');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, isLoaded, isSignedIn]);


  return (
    <GestureHandlerRootView className='flex-1 bg-background'>
      <StatusBar barStyle='dark-content' />
      <QueryClientContextProvider>
        <KeyboardProvider>
          <Slot />
        </KeyboardProvider>
      </QueryClientContextProvider>
    </GestureHandlerRootView>
  );
}
