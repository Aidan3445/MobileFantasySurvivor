import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { cn } from '~/lib/utils';

interface PointsCellProps {
  points: number | null;
  neutral?: boolean;
}

export default function PointsCell({ points, neutral }: PointsCellProps) {
  return (
    <View className='w-16 items-center justify-center'>
      <ColoredPoints points={points} neutral={neutral} />
    </View>
  );
}

export function ColoredPoints({ points, neutral }: PointsCellProps) {
  if (!points) return null;

  const color = neutral ? '#6b7280' : points > 0 ? '#15803d' : '#dc2626';

  return (
    <View className='flex-row items-center justify-center'>
      <Text
        className={cn(
          'text-center text-sm font-semibold',
          neutral
            ? 'text-muted-foreground'
            : points > 0
              ? 'text-green-700'
              : 'text-destructive'
        )}>
        {points < 0 || neutral ? points : `+${points}`}
      </Text>
      <View style={{ marginTop: -2 }}>
        <Flame size={16} color={color} />
      </View>
    </View>
  );
}
