import { ChevronDown, Lock, Globe } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Button from '~/components/common/button';
import { useState } from 'react';
import Collapsible from 'react-native-collapsible';
import { Link } from 'expo-router';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';

interface ProtectionInfoProps {
  isProtected?: boolean;
}

export default function ProtectionInfo({ isProtected }: ProtectionInfoProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const expandProgress = useSharedValue(0);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
    expandProgress.value = withTiming(isCollapsed ? 1 : 0, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(expandProgress.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <View className='mt-3'>
      <Button
        className={cn(
          'flex-row items-center justify-between rounded-lg bg-muted/50 p-2 transition-all',
          !isCollapsed ? 'rounded-b-none duration-75' : 'delay-300 rounded-b-lg'
        )}
        onPress={toggleCollapsed}>
        <View className='flex-row items-center gap-2'>
          {isProtected ? (
            <Lock size={14} color={colors.mutedForeground} />
          ) : (
            <Globe size={14} color={colors.mutedForeground} />
          )}
          <Text className='text-sm font-medium text-muted-foreground'>
            {isProtected ? 'This league is protected' : 'This league is public'}
          </Text>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={16} color={colors.mutedForeground} />
        </Animated.View>
      </Button>

      <Collapsible collapsed={isCollapsed}>
        <View className='rounded-b-lg bg-muted/50 px-3'>
          <Text className='text-sm text-muted-foreground'>
            {isProtected
              ? 'A league admin/owner will need to approve new members. You can make your league public to allow anyone with the link to join.'
              : 'Anyone with the link can join without approval. You can require approval by making your league protected.'}
          </Text>
          <Link href={'./settings'}>
            <Text className='text-sm font-semibold text-primary'>
              Go to Settings →
            </Text>
          </Link>
        </View>
      </Collapsible>
    </View>
  );
}
