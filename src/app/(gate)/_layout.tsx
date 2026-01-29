import { Stack, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import QueryClientContextProvider from '~/context/reactQueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef, useState } from 'react';
import { canResumeAfterAuth, isExternallyLinkable, openModalOverTabs } from '~/routing/linkPolicy';
import { useRouteSegments } from '~/routing/useRouteSegments';
import LoadingScreen from '~/components/auth/loadingScreen';
import { useLinkingURL, parse } from 'expo-linking';

export default function GateLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useRouteSegments();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const handledInitial = useRef(false);
  const modalPushed = useRef(false);
  const [ready, setReady] = useState(false);

  const url = useLinkingURL();

  useEffect(() => {
    if (!isLoaded || handledInitial.current) return;

    const params: { redirectTo?: string, hash?: string } = url
      ? parse(url).queryParams ?? {}
      : searchParams;
    console.log('GateLayout URL params:', params);

    const [group] = segments;
    const isInitial = !handledInitial.current;

    if (isInitial) {
      handledInitial.current = true;

      if (!isExternallyLinkable(segments)) {
        router.replace(isSignedIn ? '/(tabs)' : '/(auth)/sign-in');
        return;
      }
    }

    if (!isSignedIn && group !== '(auth)') {
      const resumable = canResumeAfterAuth(segments);

      router.replace({
        pathname: '/(auth)/sign-in',
        params: resumable ? { redirectTo: pathname } : undefined,
      });
      return;
    }

    if (isSignedIn && group === '(auth)') {
      router.replace(params.redirectTo ?? '/(tabs)');
      return;
    }

    if (isSignedIn && group === '(modals)' && !modalPushed.current) {
      modalPushed.current = true;
      openModalOverTabs(router, pathname, params);
      return;
    }

    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, isLoaded, isSignedIn]);

  if (!ready) return <LoadingScreen noBounce />;

  return (
    <GestureHandlerRootView className='flex-1 bg-background'>
      <StatusBar barStyle='dark-content' />
      <QueryClientContextProvider>
        <KeyboardProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='(modals)'
              options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen
              name='(auth)'
              options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          </Stack>
        </KeyboardProvider>
      </QueryClientContextProvider>
    </GestureHandlerRootView>
  );
}
