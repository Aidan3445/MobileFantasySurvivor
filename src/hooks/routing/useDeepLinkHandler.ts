import * as Linking from 'expo-linking';
import { useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

export function useDeepLinkHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const handleURL = (url: string | null) => {
      if (!url) return;

      const parsed = Linking.parse(url);
      const { path, queryParams } = parsed;

      if (path === 'join' && queryParams?.hash) {
        const hash = queryParams.hash as string;

        if (!isSignedIn) return;

        // eslint-disable-next-line no-undef
        setTimeout(() => {
          if (pathname.includes('/join')) {
            router.setParams({ hash });
          } else {
            router.push(`/(protected)/(modals)/join?hash=${hash}`);
          }
        }, 100);
      }
    };

    Linking.getInitialURL().then(handleURL);

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleURL(url);
    });

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, pathname]);
}
