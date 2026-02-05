import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useAnimatedVisibility } from '~/hooks/ui/useAnimatedVisibility';

export default function useLeaguesHeader() {
  const height = useHeaderHeight();
  const router = useRouter();
  const pathname = usePathname();

  // Parse route info
  const hashFromPath = useMemo(() => {
    const match = pathname.match(/leagues\/([a-zA-Z0-9_-]+)/);
    return match?.[1];
  }, [pathname]);

  const { data: league } = useLeague(hashFromPath);

  // Page state flags
  const pageState = useMemo(() => {
    const isIndex = pathname === '/leagues';
    const isPredraft = pathname.includes('/predraft');
    const isDraft = pathname.includes('/draft');
    const isSettings = pathname.includes('/settings');
    const isModal = !pathname.includes('leagues');
    const isCastawaysModal = pathname.includes('castaways');

    // Hub is now any [hash] route that isn't predraft/draft/settings
    const isLeagueHub = !!hashFromPath && !isPredraft && !isDraft && !isSettings;

    return {
      isModal,
      isCastawaysModal,
      isIndex,
      isPredraft,
      isDraft,
      isSettings,
      isLeagueHub,
    };
  }, [pathname, hashFromPath]);

  const { isModal, isCastawaysModal, isIndex, isPredraft, isDraft, isSettings, isLeagueHub } = pageState;

  // Button visibility
  const showBack = !isModal && (isPredraft || isDraft || isLeagueHub || isSettings);
  const showSettings = !isModal && (isPredraft || isLeagueHub);
  const showUsers = isDraft || isCastawaysModal;

  // Animated opacities
  const backOpacity = useAnimatedVisibility(showBack);
  const settingsOpacity = useAnimatedVisibility(showSettings);
  const usersOpacity = useAnimatedVisibility(showUsers);

  // Title logic
  const lastNonModalTitle = useRef('My Leagues');

  const title = useMemo(() => {
    if (isModal) return lastNonModalTitle.current;

    let newTitle = 'My Leagues';
    if (isSettings) newTitle = 'League Settings';
    else if (!isIndex) newTitle = league?.name ?? 'Loading...';

    lastNonModalTitle.current = newTitle;
    return newTitle;
  }, [isModal, isIndex, isSettings, league?.name]);

  // Typewriter animation
  const [displayedText, setDisplayedText] = useState(title);
  const animationRef = useRef({ cancelled: false });

  useEffect(() => {
    const { current: state } = animationRef;
    state.cancelled = true;

    const newState = { cancelled: false };
    animationRef.current = newState;

    let currentText = displayedText;

    const animate = async () => {
      // Crush
      while (currentText.length > 0 && !newState.cancelled) {
        if (currentText.length > 30) {
          currentText = currentText.slice(0, 30);
        } else {
          currentText = currentText.slice(0, -1);
        }
        setDisplayedText(currentText);
        // eslint-disable-next-line no-undef
        await new Promise(r => setTimeout(r, 0));
      }
      // Reveal
      for (let i = 0; i < title.length && !newState.cancelled; i++) {
        currentText = title.slice(0, i + 1);
        setDisplayedText(currentText);
        // eslint-disable-next-line no-undef
        await new Promise(r => setTimeout(r, 0));

        // We only display a max of ~30 characters before marquee kicks in
        // so if we exceed that, jump to the full title
        if (currentText.length >= 30) {
          setDisplayedText(title);
          break;
        }
      }
    };

    animate();

    return () => { newState.cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // Navigation handlers
  const handleBackPress = useCallback(() => {
    router.canGoBack() ? router.back() : router.replace('/leagues');
  }, [router]);

  const handleSettingsPress = useCallback(() => {
    if (hashFromPath) router.push(`/leagues/${hashFromPath}/settings`);
  }, [router, hashFromPath]);

  const handleUsersPress = useCallback(() => {
    if (hashFromPath) router.push(`/castaways?hash=${hashFromPath}`);
  }, [router, hashFromPath]);

  return {
    height,
    displayedText,
    buttons: {
      back: { opacity: backOpacity, enabled: showBack, onPress: handleBackPress },
      settings: { opacity: settingsOpacity, enabled: showSettings, onPress: handleSettingsPress },
      users: { opacity: usersOpacity, enabled: showUsers, onPress: handleUsersPress },
    },
  };
}
