import { useRef, useState, useCallback, useMemo } from 'react';
import { Dimensions } from 'react-native';
import { type PanGestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { type ICarouselInstance } from 'react-native-reanimated-carousel';
import { colors } from '~/lib/colors';

const PAGE_WIDTH = Dimensions.get('window').width;
const PAGE_HEIGHT = Dimensions.get('window').height;

export function useCarousel<T>(initialData: T[] = []) {
  const [carouselData, setCarouselDataState] = useState<T[]>(initialData);
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [progressState, setProgressState] = useState(0);

  useAnimatedReaction(() => progress.value,
    (value) => {
      // Update the progress state on the JS thread
      scheduleOnRN(setProgressState, value);
    });

  const setCarouselData = useCallback((newData: T[]) => {
    setCarouselDataState(newData);
  }, [setCarouselDataState]);

  const onPressPagination = useCallback((index: number) => {
    const currentIndex = Math.round(progressState);

    ref.current?.scrollTo({
      count: index - currentIndex,
      animated: true,
    });
  },
    [progressState]
  );

  const props = useMemo(() => ({
    data: carouselData,
    progress,
    onProgressChange: progress,
    width: PAGE_WIDTH - 12,
    loop: carouselData.length > 2,
    enabled: carouselData.length > 1,
    onConfigurePanGesture: (gesture: PanGestureType) => gesture.activeOffsetX([-10, 10]),
  }), [carouselData, progress]);

  const progressProps = useMemo(() => ({
    dotStyle: { backgroundColor: colors.secondary, borderRadius: 50, margin: 3 },
    activeDotStyle: { backgroundColor: colors.primary, borderRadius: 50 },
    onPress: onPressPagination,
    ...props
  }), [onPressPagination, props]);

  return {
    setCarouselData,
    ref,
    progress: progressState,
    onPressPagination,
    PAGE_WIDTH,
    PAGE_HEIGHT,
    props,
    progressProps
  };
}
