import { useCallback, useRef, useState } from 'react';
import { type ScrollView, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

interface UseTabsCarouselOptions<T extends string> {
  tabs: readonly [T, ...T[]];
  defaultTab?: T;
  width: number;
}

export function useTabsCarousel<T extends string>({
  tabs,
  defaultTab,
  width,
}: UseTabsCarouselOptions<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<T>(defaultTab ?? tabs[0]);
  const isScrollingRef = useRef(false);

  // Sync carousel to tab changes
  const handleTabChange = useCallback(
    (tab: T) => {
      const index = tabs.indexOf(tab);
      if (index !== -1 && scrollRef.current) {
        isScrollingRef.current = true;
        setActiveTab(tab);
        scrollRef.current.scrollTo({ x: index * width, animated: true });
        // Reset flag after animation
        // eslint-disable-next-line no-undef
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 350);
      }
    },
    [tabs, width]
  );

  // Sync tab to carousel scroll
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingRef.current) return;

      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      const tab = tabs[index];

      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
    },
    [tabs, width, activeTab]
  );

  return {
    scrollRef,
    activeTab,
    setActiveTab: handleTabChange,
    handleScroll,
  };
}
