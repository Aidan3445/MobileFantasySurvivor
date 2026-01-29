import * as Linking from 'expo-linking';
import { useRouter, usePathname, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import {
  setPendingDeepLink,
  getPendingDeepLink,
  clearPendingDeepLink,
} from '~/lib/routing';

export function useDeepLinkHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments() as string[];
  const navigationState = useRootNavigationState();
  const { isSignedIn, isLoaded } = useAuth();

  const handledInitialUrl = useRef(false);

  const isNavigationReady = !!navigationState?.key;
  const inProtectedGroup = segments[0] === '(protected)';
  const inTabsGroup = segments[1] === '(tabs)';

  // Cold start: capture and handle initial URL
  useEffect(() => {
    if (!isLoaded || !isNavigationReady) return;
    if (handledInitialUrl.current) return;

    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (!url) return;

      const parsed = Linking.parse(url);
      const { path, queryParams } = parsed;

      if (path === 'join' && queryParams?.hash) {
        const hash = queryParams.hash as string;
        handledInitialUrl.current = true;

        if (!isSignedIn) {
          // Not signed in: store pending, let root layout redirect to auth
          setPendingDeepLink({ path: 'join', params: { hash } });
          return;
        }

        // Signed in cold start: force tabs first, then push modal
        router.replace('/(protected)/(tabs)');
        // eslint-disable-next-line no-undef
        setTimeout(() => {
          router.push(`/(protected)/(modals)/join?hash=${hash}`);
        }, 150);
      }
    };

    handleInitialURL();
  }, [isLoaded, isSignedIn, isNavigationReady, router]);

  // Handle pending deep link after auth (signed-out cold start flow)
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !isNavigationReady) return;
    if (!inProtectedGroup || !inTabsGroup) return;

    const pending = getPendingDeepLink();
    if (!pending) return;

    clearPendingDeepLink();

    if (pending.path === 'join' && pending.params.hash) {
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        router.push(`/(protected)/(modals)/join?hash=${pending.params.hash}`);
      }, 150);
    }
  }, [isLoaded, isSignedIn, isNavigationReady, inProtectedGroup, inTabsGroup, router]);

  // Warm start: handle URLs while app is open
  useEffect(() => {
    if (!isLoaded || !isNavigationReady) return;

    const subscription = Linking.addEventListener('url', ({ url }) => {
      const parsed = Linking.parse(url);
      const { path, queryParams } = parsed;

      if (path === 'join' && queryParams?.hash) {
        const hash = queryParams.hash as string;

        if (!isSignedIn) {
          setPendingDeepLink({ path: 'join', params: { hash } });
          router.replace('/(auth)/sign-in');
          return;
        }

        if (pathname.includes('/join')) {
          router.setParams({ hash });
        }
        // Otherwise Expo Router handles navigation automatically
      }
    });

    return () => subscription.remove();
  }, [isLoaded, isSignedIn, isNavigationReady, pathname, router]);
}
