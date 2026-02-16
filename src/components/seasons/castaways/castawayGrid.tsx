import { View, Text } from 'react-native';
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

  return (
    <View className='relative w-full overflow-hidden rounded-xl bg-card border-2 border-primary/20 px-4 pt-4 pb-3'>
      {/* Header */}
      <View className='mb-4 flex-row items-center gap-2'>
        <View className='h-5 w-0.5 rounded-full bg-primary' />
        <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
          All Castaways
        </Text>
      </View>

      {/* Grid */}
      <View className='flex-col gap-1'>
        {castaways.map((castaway) => (
          <View key={castaway.castawayId}>
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
