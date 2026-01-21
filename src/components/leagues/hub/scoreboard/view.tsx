import { View, Text } from 'react-native';
import { Flame, TrendingUp } from 'lucide-react-native';
import { cn } from '~/lib/utils';
import { useLeagueData } from '~/hooks/leagues/enrich/useLeagueData';
import MemberRow from '~/components/leagues/hub/scoreboard/row';
import { type EnrichedCastaway } from '~/types/castaways';

interface ScoreboardProps {
  overrideHash?: string;
  maxRows?: number;
  className?: string;
}

export default function Scoreboard({ overrideHash, maxRows, className }: ScoreboardProps = {}) {
  const {
    sortedMemberScores,
    loggedInIndex,
    leagueSettings,
    leagueRules,
    selectionTimeline,
    castaways,
    keyEpisodes,
    currentStreaks,
    shotInTheDarkStatus
  } = useLeagueData(overrideHash);

  const episodeNum = keyEpisodes?.nextEpisode?.episodeNumber ?? Infinity;

  return (
    <View className={cn('', className)}>
      <View className='flex-row bg-white gap-0.5 px-0.5 rounded-t-md'>
        <View className='w-11 justify-center'>
          <Text className='text-base text-center font-medium'>Place</Text>
        </View>
        <View className='w-10 items-center justify-center'>
          <Flame size={14} className='text-muted-foreground' />
        </View>
        <View className='w-28 justify-center pl-1'>
          <Text className='text-base text-left font-medium'>Member</Text>
        </View>
        <View className='w-24 justify-center'>
          <Text className='text-left font-medium'>Survivor</Text>
        </View>
        {leagueSettings?.secondaryPickEnabled && (
          <View className='w-24 justify-center'>
            <Text className='text-left font-medium'>Secondary</Text>
          </View>
        )}
        <View className='w-6 items-center justify-center'>
          {/* ScoreboardHelp component would go here */}
          <TrendingUp size={14} className='text-muted-foreground' />
        </View>
      </View>
      <View>
        {sortedMemberScores.map(({ member, scores }, index) => {
          if (
            maxRows
            && index !== loggedInIndex
            && (loggedInIndex >= maxRows ? index >= maxRows - 1 : index >= maxRows)
          )
            return null;


          const castawayId = selectionTimeline?.memberCastaways?.[member.memberId]?.
            slice(0, episodeNum + 1).pop();
          const castaway = castawayId !== undefined ?
            (castaways?.find((c) => c.castawayId === castawayId)) : undefined;
          const selectionList = selectionTimeline?.memberCastaways?.[member.memberId]?.map(
            (id) => castaways?.find((c) => c.castawayId === id) ?? null) ?? [];
          let secondaryPick: EnrichedCastaway | null | undefined = undefined;
          const findSecondaryPick = castaways?.find((c) =>
            c.castawayId === selectionTimeline?.secondaryPicks?.[member.memberId]?.[episodeNum]);
          if (findSecondaryPick) {
            secondaryPick = findSecondaryPick;
          } else if (!leagueRules?.secondaryPick?.publicPicks && loggedInIndex !== index) {
            secondaryPick = null;
          }

          // place is index + 1 - number of members above them with same score
          const numberSameScore = sortedMemberScores.slice(0, index)
            .filter(({ scores: s }) => (s.slice().pop() ?? 0) === (scores.slice().pop() ?? 0))
            .length;
          const place = index + 1 - numberSameScore;

          return (
            <MemberRow
              key={index}
              place={place}
              member={member}
              currentStreak={currentStreaks?.[member.memberId] ?? 0}
              castaway={castaway}
              selectionList={selectionList}
              secondaryPick={secondaryPick}
              secondaryPickList={selectionTimeline?.secondaryPicks?.[member.memberId]?.map(
                (id) => castaways?.find((c) => c.castawayId === id) ?? null) ?? []}
              points={scores.slice().pop() ?? 0}
              color={member.color}
              doubleBelow={!!maxRows && maxRows <= loggedInIndex && maxRows - 2 === index}
              overrideHash={overrideHash}
              shotInTheDarkStatus={shotInTheDarkStatus?.[member.memberId]} />
          );
        })}
      </View>
    </View >
  );
}
