import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { colors } from '~/lib/colors';

const FAB_SIZE = 56;
const MARGINS = {
  x: 8,
  top: -35,
  bottom: 110
};

interface EventFABProps {
  hash: string;
  isLeagueAdmin: boolean;
  isSysAdmin: boolean;
  isActive: boolean;
}

export default function EventFAB({ hash, isLeagueAdmin, isSysAdmin, isActive }: EventFABProps) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const minX = MARGINS.x;
  const maxX = width - FAB_SIZE - MARGINS.x;
  const minY = insets.top + MARGINS.top;
  const maxY = height - FAB_SIZE - insets.bottom - MARGINS.bottom;

  const translateX = useSharedValue(maxX);
  const translateY = useSharedValue(maxY);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const isPressed = useSharedValue(false);

  const snapToCorner = () => {
    'worklet';
    const midX = width / 2;
    const midY = height / 2;

    translateX.value = withSpring(translateX.value < midX ? minX : maxX, { damping: 100 });
    translateY.value = withSpring(translateY.value < midY ? minY : maxY, { damping: 100 });
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
      isPressed.value = true;
    })
    .onUpdate((event) => {
      translateX.value = Math.max(minX, Math.min(maxX, contextX.value + event.translationX));
      translateY.value = Math.max(minY, Math.min(maxY, contextY.value + event.translationY));
    })
    .onEnd(() => {
      isPressed.value = false;
      snapToCorner();
    });

  const navigate = useCallback(() => {
    if (!isSysAdmin) {
      router.push(`/(modals)/sysAdmin?hash=${hash}`);
    } else if (isLeagueAdmin) {
      router.push(`/(modals)/customEvent?hash=${hash}`);
    }
  }, [router, hash, isSysAdmin, isLeagueAdmin]);

  const tap = Gesture
    .Tap()
    .runOnJS(true)
    .onEnd(navigate);

  const composed = Gesture.Exclusive(gesture, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withSpring(isPressed.value ? 1.1 : 1) },
    ],
  }));

  if (!isActive || (!isLeagueAdmin && !isSysAdmin)) return null;


  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        className='absolute h-14 w-14 items-center justify-center rounded-full bg-primary'
        style={[{ top: 0, left: 0 }, animatedStyle]}>
        <Plus size={28} color={colors.card} />
      </Animated.View>
    </GestureDetector>
  );
}
