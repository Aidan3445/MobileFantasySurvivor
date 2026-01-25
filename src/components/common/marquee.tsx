import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  type LayoutChangeEvent,
  type TextLayoutEvent,
  Easing,
} from 'react-native';
import { cn } from '~/lib/utils';

interface MarqueeTextProps {
  text: string;
  /** Tailwind classes for the text */
  className?: string;
  /** Center the text when no marquee is needed */
  center?: boolean;
  /** Allow font scaling */
  allowFontScaling?: boolean;
  /** Tailwind classes for the container */
  containerClassName?: string;
  /** No Marquee container class */
  noMarqueeContainerClassName?: string;
  /** Duration in ms to pause at the start before scrolling (default: 2000) */
  pauseDuration?: number;
  /** Speed of scroll in pixels per second (default: 30) */
  scrollSpeed?: number;
  /** Gap between the end of text and restart in pixels (default: 50) */
  trailingGap?: number;
}

export default function MarqueeText({
  text,
  className,
  containerClassName,
  noMarqueeContainerClassName,
  center = false,
  allowFontScaling = true,
  pauseDuration = 2000,
  scrollSpeed = 30,
  trailingGap = 12,
}: MarqueeTextProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [needsMarquee, setNeedsMarquee] = useState(false);

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  /* -------------------- Layout measurement -------------------- */

  const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const onTextLayout = useCallback((event: TextLayoutEvent) => {
    const width = event.nativeEvent.lines[0]?.width ?? 0;
    setTextWidth(width);
  }, []);

  /* -------------------- Decide if marquee is needed -------------------- */

  useEffect(() => {
    if (containerWidth > 0 && textWidth > 0) {
      setNeedsMarquee(textWidth > containerWidth);
    }
  }, [containerWidth, textWidth]);

  /* -------------------- Marquee animation -------------------- */

  useEffect(() => {
    if (!needsMarquee || textWidth <= 0) {
      scrollAnim.setValue(0);
      return;
    }

    const scrollDistance = textWidth + trailingGap;
    const scrollDuration = (scrollDistance / scrollSpeed) * 1000;

    const run = () => {
      scrollAnim.setValue(0);

      animationRef.current = Animated.sequence([
        Animated.delay(pauseDuration),
        Animated.timing(scrollAnim, {
          toValue: -scrollDistance,
          duration: scrollDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]);

      animationRef.current.start(({ finished }) => {
        if (finished) {
          run();
        }
      });
    };

    run();

    return () => {
      animationRef.current?.stop();
    };
  }, [
    needsMarquee,
    textWidth,
    scrollSpeed,
    pauseDuration,
    scrollAnim,
    trailingGap,
  ]);

  /* -------------------- Render -------------------- */

  return (
    <View
      className={cn(
        'w-full overflow-hidden',
        containerClassName,
        !needsMarquee && noMarqueeContainerClassName
      )}
      onLayout={onContainerLayout}>
      {needsMarquee ? (
        <Animated.View
          key={`marquee-${textWidth}-${containerWidth}-${trailingGap}`}
          className='flex-row items-center'
          style={{
            transform: [{ translateX: scrollAnim }],
            width: textWidth * 2 + trailingGap,
          }}>
          <Text
            className={cn('text-left align-middle', className)}
            allowFontScaling={allowFontScaling}
            numberOfLines={1}
            style={{
              flexShrink: 0,
            }}>
            {text}
          </Text>

          <View style={{ width: trailingGap }} />

          <Text
            className={cn('text-left', className)}
            allowFontScaling={allowFontScaling}
            numberOfLines={1}
            style={{ flexShrink: 0 }}>
            {text}
          </Text>
        </Animated.View>
      ) : (
        <Text
          className={cn(center ? 'text-center' : 'text-left', className)}
          allowFontScaling={allowFontScaling}
          numberOfLines={1}
          style={{ flexShrink: 0 }}>
          {text}
        </Text>
      )}

      {/* Hidden text used only for width measurement */}
      <Text
        className={cn('absolute opacity-0', className)}
        allowFontScaling={allowFontScaling}
        style={{ flexShrink: 0 }}
        onTextLayout={onTextLayout}>
        {text}
      </Text>
    </View>
  );
}
