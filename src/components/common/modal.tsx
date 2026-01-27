import { useEffect, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal as RNModal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  animationType?: 'slide' | 'fade' | 'none';
  className?: string;
  children: ReactNode;
  swipeToDismiss?: boolean; // NEW
}

const DISMISS_THRESHOLD = 120;

export default function Modal({
  isVisible,
  onClose,
  animationType = 'slide',
  className,
  children,
  swipeToDismiss = true,
}: ModalProps) {
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(swipeToDismiss)
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > DISMISS_THRESHOLD) {
        onClose();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (!isVisible) {
      translateY.value = 0;
    }
  }, [isVisible, translateY]);

  return (
    <RNModal
      visible={isVisible ?? false}
      transparent
      animationType={animationType}
      onRequestClose={onClose}>
      <SafeAreaView
        edges={{ top: 'maximum', bottom: 'maximum' }}
        className='flex-1 px-2 py-32 items-center justify-center'>
        <Pressable
          onPress={onClose}
          className={cn(
            'absolute bottom-0 left-0 right-0 h-[200%] bg-black/50 transition-opacity',
            'animate-fade-in',
            !isVisible && '!opacity-0'
          )} />

        <KeyboardAvoidingView
          className='w-full transition-all duration-100'
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={animatedStyle}>
              <Pressable
                className={cn(
                  'w-full rounded-xl border-2 border-primary/20 bg-card p-4 transition-all',
                  className
                )}
                onPress={(e) => e.stopPropagation()}>
                {children}
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </RNModal>
  );
}
