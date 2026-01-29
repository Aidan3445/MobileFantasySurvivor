import * as Linking from 'expo-linking';
import { useRouter, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-expo';

export function useDeepLinkHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const lastHandledUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const handleURL = (url: string | null) => {
      if (!url) return;

      // Skip if we just handled this exact URL
      if (url === lastHandledUrl.current) return;

      const parsed = Linking.parse(url);
      const { path, queryParams } = parsed;

      if (path === 'join' && queryParams?.hash) {
        const hash = queryParams.hash as string;

        if (!isSignedIn) return;

        if (pathname.includes('/join')) {
          console.log('Already on join page, set hash param:', hash);
          router.setParams({ hash });
        } else {
          console.log('Navigating to join page with hash:', hash);
          lastHandledUrl.current = url;
          router.replace(`/join?hash=${hash}`);
        }
      }
    };

    Linking.getInitialURL().then((url) => handleURL(url));

    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Reset for new incoming URLs while app is open
      lastHandledUrl.current = null;
      handleURL(url);
    });

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, pathname]);
}
