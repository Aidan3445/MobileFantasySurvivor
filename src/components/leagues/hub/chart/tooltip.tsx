import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors } from '~/lib/colors';

interface ChartTooltipProps {
  data: {
    episode: number;
    scores: { name: string; color: string; value: number; delta?: number }[];
  };
}

export default function ChartTooltip({ data }: ChartTooltipProps) {
  const { episode, scores } = data;

  // Split into two columns if more than 9 entries
  const needsTwoColumns = scores.length > 9;
  const firstSet = needsTwoColumns ? scores.slice(0, Math.ceil(scores.length / 2)) : scores;
  const secondSet = needsTwoColumns ? scores.slice(Math.ceil(scores.length / 2)) : [];

  const renderRow = (item: (typeof scores)[number]) => (
    <View key={item.name} className='flex-row items-center gap-2 py-0.5'>
      <View className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
      <Text className='flex-1 text-sm text-foreground' numberOfLines={1}>
        {item.name}
      </Text>
      <Text className='text-sm font-semibold text-foreground w-10 text-right'>
        {item.value}
      </Text>
      {item.delta !== undefined && (
        <Text
          className={`text-sm w-12 text-right ${item.delta > 0
            ? 'text-positive'
            : item.delta < 0
              ? 'text-destructive'
              : 'text-muted-foreground'
            }`}>
          {item.delta > 0 ? '+' : ''}
          {item.delta}
        </Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <View className='flex-row items-center gap-2 pb-1 mb-1 border-b border-primary/20'>
      <View className='w-3 h-3' />
      <Text className='flex-1 text-sm font-bold text-muted-foreground'>Name</Text>
      <Text className='text-sm font-bold text-muted-foreground w-10 text-right'>Total</Text>
      <Text className='text-sm font-bold text-muted-foreground w-12 text-right'>Ep</Text>
    </View>
  );

  return (
    <View className='mx-2 mb-2 rounded-lg border-2 border-primary/30 bg-card p-2'>
      {/* Header */}
      <View className='flex-row items-center justify-center gap-1 mb-2'>
        <Text className='font-bold uppercase tracking-wider text-foreground'>
          Episode {episode}
        </Text>
        <Flame size={16} color={colors.primary} />
      </View>

      {/* Content */}
      <View className='flex-row gap-4'>
        <View className='flex-1'>
          {renderHeader()}
          {firstSet.map(renderRow)}
        </View>
        {secondSet.length > 0 && (
          <View className='flex-1'>
            {renderHeader()}
            {secondSet.map(renderRow)}
          </View>
        )}
      </View>
    </View>
  );
}
