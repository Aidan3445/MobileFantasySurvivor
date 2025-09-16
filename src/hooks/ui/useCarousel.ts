import { useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { type ICarouselInstance } from 'react-native-reanimated-carousel';
import { colors } from '~/lib/colors';

const PAGE_WIDTH = Dimensions.get('window').width;
const PAGE_HEIGHT = Dimensions.get('window').height;

export function useCarousel<T>(data: T[] = []) {
  const [carouselData, setCarouselData] = useState<T[]>(data);
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  const props = { ref, data: carouselData, progress, onProgressChange: progress, width: PAGE_WIDTH - 12 };
  return {
    setCarouselData,
    ref,
    progress,
    onPressPagination,
    PAGE_WIDTH,
    PAGE_HEIGHT,
    props,
    progressProps: {
      dotStyle: { backgroundColor: colors.secondary, borderRadius: 50 },
      activeDotStyle: { backgroundColor: colors.primary, borderRadius: 50 },
      containerStyle: { gap: 5 },
      onPressPagination,
      ...props
    }
  };
}
