import { useEffect, useRef } from 'react';
import { useRouter, usePathname, useSegments, useRootNavigationState } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import * as Notifications from 'expo-notifications';
import {
  setPendingDeepLink,
  getPendingDeepLink,
  clearPendingDeepLink,
} from '~/lib/routing';
import { useLeagues } from '~/hooks/user/useLeagues';

interface NotificationData {
  type: string;
  leagueHash?: string;
  seasonId?: number;
  leagueId?: number;
  episodeId?: number;
}

/**
 * Handles notification tap routing
 * Place in the protected layout alongside useDeepLinkHandler
 */
export function useNotificationRouting() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: leagues } = useLeagues();
  const segments = useSegments() as string[];
  const navigationState = useRootNavigationState();
  const { isSignedIn, isLoaded } = useAuth();

  const pathnameRef = useRef(pathname);
  const handledInitial = useRef(false);

  const isNavigationReady = !!navigationState?.key;
  const inProtectedGroup = segments[0] === '(protected)';
  const inTabsGroup = segments[1] === '(tabs)';

  // Keep pathname ref in sync
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Cold start: handle notification that launched the app
  useEffect(() => {
    if (!isLoaded || !isNavigationReady) return;
    if (handledInitial.current) return;

    const handleInitial = async () => {
      const response = Notifications.getLastNotificationResponse();
      if (!response) return;

      const data = response.notification.request.content.data as unknown as NotificationData;
      if (!data?.type) return;

      handledInitial.current = true;

      if (!isSignedIn) {
        setPendingDeepLink({
          path: 'notification',
          params: { data: JSON.stringify(data) },
        });
        return;
      }

      // Force tabs first, then route
      router.replace('/(protected)/(tabs)');
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        void routeNotification(data);
      }, 150);
    };

    void handleInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, isNavigationReady, router]);

  // Handle pending notification after auth
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !isNavigationReady) return;
    if (!inProtectedGroup || !inTabsGroup) return;

    const pending = getPendingDeepLink();
    if (!pending || pending.path !== 'notification') return;

    clearPendingDeepLink();

    try {
      if (!pending.params.data) return;
      const data = JSON.parse(pending.params.data) as NotificationData;
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        void routeNotification(data);
      }, 150);
    } catch {
      console.error('Failed to parse pending notification data');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, isNavigationReady, inProtectedGroup, inTabsGroup, router]);

  // Warm start: handle taps while app is open/backgrounded
  useEffect(() => {
    if (!isLoaded || !isNavigationReady) return;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as unknown as NotificationData;
      if (!isSignedIn || !data?.type) return;
      void routeNotification(data);
    });

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, isNavigationReady]);

  async function routeNotification(data: NotificationData) {
    if (!data?.type) return;

    switch (data.type) {
      case 'league_admission':
      case 'member_joined':
      case 'member_pending':
      case 'draft_date_changed':
      case 'draft_reminder_1hr':
      case 'draft_start':
      case 'league_recreated':
      case 'selection_changed':
        if (data.leagueHash) {
          router.push(`/(protected)/(tabs)/leagues/${data.leagueHash}`);
        }
        break;

      case 'reminder':
      case 'episode_finished':
        router.push('/(protected)/(tabs)/leagues');
        break;

      case 'live_scoring':
      case 'live_scoring_optin':
        await handleLiveScoringTap(data);
        break;

      default:
        console.log('Unhandled notification type:', data.type);
    }
  }

  async function handleLiveScoringTap(data: NotificationData) {
    const currentPath = pathnameRef.current;

    // If already on a league page, stay there
    if (currentPath.includes('/leagues/') && !currentPath.endsWith('/leagues')) {
      return;
    }

    // League-specific notification (custom events), go directly
    if (data.leagueHash) {
      router.push(`/(protected)/(tabs)/leagues/${data.leagueHash}`);
      return;
    }

    // Global live scoring — check how many active leagues
    if (!data.seasonId) {
      router.push('/(protected)/(tabs)/leagues');
      return;
    }

    try {
      const activeSeasonLeagues = leagues?.filter(league =>
        league.league.seasonId === data.seasonId &&
        league.league.status === 'Active' &&
        league.memberCount > 0
      );
      if (activeSeasonLeagues?.length === 1) {
        router.push(`/(protected)/(tabs)/leagues/${activeSeasonLeagues[0]!.league.hash}`);
      } else {
        router.push('/(protected)/(tabs)/leagues');
      }
    } catch (error) {
      console.error('Failed to fetch active leagues for notification routing:', error);
      router.push('/(protected)/(tabs)/leagues');
    }
  }
}
