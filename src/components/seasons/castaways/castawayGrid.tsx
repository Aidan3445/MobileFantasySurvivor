import { View, Text, useWindowDimensions } from 'react-native';
import { type EnrichedCastaway } from '~/types/castaways';
import { type Tribe, type TribesTimeline } from '~/types/tribes';
import CastawayCard from '~/components/seasons/castaways/castawayCard';
import { type SelectionTimelines } from '~/types/leagues';
import { type LeagueMember } from '~/types/leagueMembers';

interface CastawayGridProps {
  castaways: EnrichedCastaway[];
  tribesTimeline: TribesTimeline;
  tribes: Tribe[];
  leagueData?: {
    selectionTimeline?: SelectionTimelines;
    leagueMembers?: {
      members: LeagueMember[];
    };
  };
}

export default function CastawayGrid({
  castaways,
  tribesTimeline,
  tribes,
  leagueData,
}: CastawayGridProps) {
  const { selectionTimeline, leagueMembers } = leagueData ?? {};
  const { width } = useWindowDimensions();

  // Determine number of columns based on screen width
  // Similar to md:grid-cols-2 lg:grid-cols-3
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const gap = 12; // gap-3 = 12px
  const cardWidth = (width - 32 - gap * (numColumns - 1)) / numColumns; // 32 = p-4 padding

  return (
    <View className='w-full rounded-lg bg-card p-4 shadow-lg shadow-primary/10 border-2 border-primary/20'>
      {/* Header */}
      <View className='mb-4 flex-row items-center gap-2'>
        <View className='h-5 w-0.5 rounded-full bg-primary' />
        <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
          All Castaways
        </Text>
      </View>

      {/* Grid */}
      <View className='flex-col' style={{ gap }}>
        {castaways.map((castaway) => (
          <View key={castaway.castawayId} style={{ width: cardWidth }}>
            <CastawayCard
              castaway={castaway}
              tribesTimeline={tribesTimeline}
              tribes={tribes}
              member={leagueMembers?.members.find(
                (m) =>
                  selectionTimeline?.castawayMembers[castaway.castawayId]?.slice()?.pop() ===
                  m.memberId
              )} />
          </View>
        ))}
      </View>
    </View>
  );
}
